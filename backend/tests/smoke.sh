#!/usr/bin/env bash
#
# Smoke test for the BookBay API.
#
# Boots the built-in PHP server against public/ with a fresh SQLite
# database in /tmp, then exercises the main endpoints end-to-end.
#
# Usage: bash tests/smoke.sh

set -u

cd "$(dirname "$0")/.."

PORT="${PORT:-8099}"
DB="/tmp/bookbay-smoke.sqlite"
BASE="http://127.0.0.1:${PORT}/api/v1"

rm -f "${DB}"*
export DB_DRIVER=sqlite
export DB_DATABASE="${DB}"

echo "== Migrating and seeding =="
php database/seed.php || { echo "seed failed"; exit 1; }

echo "== Booting server on :${PORT} =="
php -S "127.0.0.1:${PORT}" -t public public/index.php >/tmp/bookbay-smoke-server.log 2>&1 &
SERVER_PID=$!

cleanup() {
    kill "${SERVER_PID}" 2>/dev/null
    rm -f "${DB}"*
}
trap cleanup EXIT

for i in $(seq 1 30); do
    if curl -s -o /dev/null "${BASE}/categories"; then
        break
    fi
    sleep 0.3
done

PASS=0
FAIL=0

check() {
    local name="$1" expected="$2" actual="$3"
    if [[ "${actual}" == *"${expected}"* ]]; then
        PASS=$((PASS + 1))
        echo "  ok   ${name}"
    else
        FAIL=$((FAIL + 1))
        echo "  FAIL ${name}  (expected to contain '${expected}', got: ${actual:0:120})"
    fi
}

echo "== Public endpoints =="
check "GET /categories" '"categories"' "$(curl -s "${BASE}/categories")"
check "GET /books" '"books"' "$(curl -s "${BASE}/books")"
check "GET /books?q=atomic" 'Atomic Habits' "$(curl -s "${BASE}/books?q=atomic")"
check "GET /books/1" '"book"' "$(curl -s "${BASE}/books/1")"
check "GET /books/user/1" '"books"' "$(curl -s "${BASE}/books/user/1")"

echo "== CORS + Auth =="
check "OPTIONS preflight -> 204" '204 No Content' \
    "$(curl -s -i -X OPTIONS "${BASE}/auth/login" -H 'Origin: http://localhost:5173' | head -1)"
check "preflight allows origin" 'Access-Control-Allow-Origin: http://localhost:5173' \
    "$(curl -s -i -X OPTIONS "${BASE}/auth/login" -H 'Origin: http://localhost:5173')"

LOGIN=$(curl -s -X POST "${BASE}/auth/login" -H 'Content-Type: application/json' \
    -d '{"email":"demo@bookbay.test","password":"password"}')
check "POST /auth/login" '"token"' "${LOGIN}"

TOKEN=$(echo "${LOGIN}" | php -r 'echo json_decode(stream_get_contents(STDIN), true)["token"] ?? "";')
USER_ID=$(echo "${LOGIN}" | php -r 'echo json_decode(stream_get_contents(STDIN), true)["user"]["id"] ?? "";')
check "login returns user id" '' "${USER_ID}"

AUTH=(-H "Authorization: Bearer ${TOKEN}" -H 'Content-Type: application/json')

check "GET /auth/me" '"user"' "$(curl -s "${BASE}/auth/me" "${AUTH[@]}")"
curl -s -c /tmp/bookbay-smoke-cookies.txt -X POST "${BASE}/auth/login" -H 'Content-Type: application/json' \
    -d '{"email":"demo@bookbay.test","password":"password"}' >/dev/null
check "cookie-based /auth/me" '"user"' "$(curl -s -b /tmp/bookbay-smoke-cookies.txt "${BASE}/auth/me")"
check "POST /auth/register" '"token"' "$(curl -s -X POST "${BASE}/auth/register" \
    -H 'Content-Type: application/json' \
    -d "{\"name\":\"Smoke\",\"email\":\"smoke$(date +%s)@bookbay.test\",\"password\":\"secret12\"}")"
check "login with wrong password -> 401" 'Invalid' \
    "$(curl -s -X POST "${BASE}/auth/login" -H 'Content-Type: application/json' -d '{"email":"demo@bookbay.test","password":"nope"}')"

echo "== Cart + payment flow (verify creates the order) =="
check "POST /cart/1" '"items"' "$(curl -s -X POST "${BASE}/cart/${USER_ID}" "${AUTH[@]}" -d '{"book_id":2,"quantity":1}')"
check "GET /cart/1" '"items"' "$(curl -s "${BASE}/cart/${USER_ID}" "${AUTH[@]}")"

PAY=$(curl -s -X POST "${BASE}/payments/start/${USER_ID}" "${AUTH[@]}" -d '{"amount":25}')
check "POST /payments/start" '"reference"' "${PAY}"
REF=$(echo "${PAY}" | php -r 'echo json_decode(stream_get_contents(STDIN), true)["reference"] ?? "";')
check "POST /payments/verify" '"paid"' "$(curl -s -X POST "${BASE}/payments/verify/${USER_ID}" "${AUTH[@]}" -d "{\"reference\":\"${REF}\"}")"
check "GET /orders (after verify)" '"orders"' "$(curl -s "${BASE}/orders" "${AUTH[@]}")"

check "POST /orders (direct, after re-adding to cart)" '"order_id"' "$(curl -s -X POST "${BASE}/cart/${USER_ID}" "${AUTH[@]}" -d '{"book_id":1,"quantity":2}' >/dev/null; curl -s -X POST "${BASE}/orders" "${AUTH[@]}")"

echo "== Wallet =="
check "GET /wallet/1" '"wallet"' "$(curl -s "${BASE}/wallet/${USER_ID}" "${AUTH[@]}")"
check "POST topup" '"balance"' "$(curl -s -X POST "${BASE}/wallet/${USER_ID}/topup" "${AUTH[@]}" -d '{"amount":100}')"
check "GET transactions" '"transactions"' "$(curl -s "${BASE}/wallet/${USER_ID}/transactions" "${AUTH[@]}")"
check "POST transfer" '"success"' "$(curl -s -X POST "${BASE}/wallet/${USER_ID}/transfer" "${AUTH[@]}" -d '{"amount":10,"recipient_email":"admin@bookbay.test"}')"

echo "== Borrowing =="
check "POST /borrow" '"borrow_request"' "$(curl -s -X POST "${BASE}/borrow" "${AUTH[@]}" -d '{"book_id":1,"days":7}')"
check "POST /borrow/request (spec alias)" '"borrow_request"' "$(curl -s -X POST "${BASE}/borrow/request" "${AUTH[@]}" -d '{"book_id":3,"days":14}')"
check "GET /borrow" '"borrow_requests"' "$(curl -s "${BASE}/borrow" "${AUTH[@]}")"

echo "== Exchange / chat / notifications / newsletter / reviews / posts =="
check "POST /exchange" '"exchange_request"' "$(curl -s -X POST "${BASE}/exchange" "${AUTH[@]}" -d '{"offered_book_id":3,"wanted_book_id":4}')"
check "GET /exchange" '"exchange_requests"' "$(curl -s "${BASE}/exchange" "${AUTH[@]}")"
check "POST /chat/conversations" '"conversation"' "$(curl -s -X POST "${BASE}/chat/conversations" "${AUTH[@]}" -d '{"user_id":1}')"
check "GET /notifications" '"notifications"' "$(curl -s "${BASE}/notifications" "${AUTH[@]}")"
check "POST /notifications/read-all" '"success"' "$(curl -s -X POST "${BASE}/notifications/read-all" "${AUTH[@]}")"
check "POST /newsletter/subscribe" '"success"' "$(curl -s -X POST "${BASE}/newsletter/subscribe" -H 'Content-Type: application/json' -d '{"email":"sub@bookbay.test"}')"
check "POST /reviews" '"review"' "$(curl -s -X POST "${BASE}/reviews" "${AUTH[@]}" -d '{"book_id":1,"rating":5,"comment":"Great"}')"
check "GET /reviews?book_id=1" '"reviews"' "$(curl -s "${BASE}/reviews?book_id=1")"
check "GET /posts" '"posts"' "$(curl -s "${BASE}/posts")"

WISH=$(curl -s -X POST "${BASE}/wishlist" "${AUTH[@]}" -d '{"book_id":5}')
check "POST /wishlist" '"wishlist"' "${WISH}"
WISH_ID=$(echo "${WISH}" | php -r 'echo json_decode(stream_get_contents(STDIN), true)["wishlist"][0]["wishlist_id"] ?? "";')
check "GET /wishlist" '"wishlist"' "$(curl -s "${BASE}/wishlist" "${AUTH[@]}")"
check "DELETE /wishlist/{id}" '"success"' "$(curl -s -X DELETE "${BASE}/wishlist/${WISH_ID}" "${AUTH[@]}")"

echo "== Admin (admin@bookbay.test) =="
ADMIN_LOGIN=$(curl -s -X POST "${BASE}/auth/login" -H 'Content-Type: application/json' \
    -d '{"email":"admin@bookbay.test","password":"password"}')
ADMIN_TOKEN=$(echo "${ADMIN_LOGIN}" | php -r 'echo json_decode(stream_get_contents(STDIN), true)["token"] ?? "";')
ADMIN_AUTH=(-H "Authorization: Bearer ${ADMIN_TOKEN}" -H 'Content-Type: application/json')

check "GET /admin/dashboard" '"stats"' "$(curl -s "${BASE}/admin/dashboard" "${ADMIN_AUTH[@]}")"
check "GET /admin/users" '"users"' "$(curl -s "${BASE}/admin/users" "${ADMIN_AUTH[@]}")"
check "GET /admin/books" '"books"' "$(curl -s "${BASE}/admin/books" "${ADMIN_AUTH[@]}")"
check "PUT /admin/books/1" '"book"' "$(curl -s -X PUT "${BASE}/admin/books/1" "${ADMIN_AUTH[@]}" -d '{"stock":15}')"
check "GET /admin/borrow" '"borrow_requests"' "$(curl -s "${BASE}/admin/borrow" "${ADMIN_AUTH[@]}")"
check "PATCH /admin/borrow/1" '"approved"' "$(curl -s -X PATCH "${BASE}/admin/borrow/1" "${ADMIN_AUTH[@]}" -d '{"status":"approved"}')"
check "user cannot access admin -> 403" 'Forbidden' \
    "$(curl -s "${BASE}/admin/dashboard" "${AUTH[@]}")"

echo
echo "== Results: ${PASS} passed, ${FAIL} failed =="
[[ "${FAIL}" -eq 0 ]]
