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
check "POST /borrow/request (spec alias)" '"borrow_request"' "$(curl -s -X POST "${BASE}/borrow/request" "${AUTH[@]}" -d '{"book_id":7,"days":14}')"
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

check "GET /admin/orders" '"orders"' "$(curl -s "${BASE}/admin/orders" "${ADMIN_AUTH[@]}")"
check "PUT /admin/orders/1" '"success"' "$(curl -s -X PUT "${BASE}/admin/orders/1" "${ADMIN_AUTH[@]}" -d '{"status":"processing"}')"

check "GET /admin/reviews" '"reviews"' "$(curl -s "${BASE}/admin/reviews" "${ADMIN_AUTH[@]}")"
check "DELETE /admin/reviews/1" '"success"' "$(curl -s -X DELETE "${BASE}/admin/reviews/1" "${ADMIN_AUTH[@]}")"

check "GET /admin/exchanges" '"exchanges"' "$(curl -s "${BASE}/admin/exchanges" "${ADMIN_AUTH[@]}")"
check "PUT /admin/exchanges/1" '"success"' "$(curl -s -X PUT "${BASE}/admin/exchanges/1" "${ADMIN_AUTH[@]}" -d '{"status":"approved"}')"

check "GET /admin/subscribers" '"subscribers"' "$(curl -s "${BASE}/admin/subscribers" "${ADMIN_AUTH[@]}")"
check "DELETE /admin/subscribers/1" '"success"' "$(curl -s -X DELETE "${BASE}/admin/subscribers/1" "${ADMIN_AUTH[@]}")"

check "PUT /admin/users/3" '"user"' "$(curl -s -X PUT "${BASE}/admin/users/3" "${ADMIN_AUTH[@]}" -d '{"status":"suspended"}')"
check "PUT /admin/users/3 (reactivate)" '"user"' "$(curl -s -X PUT "${BASE}/admin/users/3" "${ADMIN_AUTH[@]}" -d '{"status":"active"}')"

# Superadmin tests - login as superadmin for admin role modifications
SUPERADMIN_LOGIN=$(curl -s -X POST "${BASE}/auth/login" -H 'Content-Type: application/json' \
    -d '{"email":"superadmin@bookbay.test","password":"password"}')
SUPERADMIN_TOKEN=$(echo "${SUPERADMIN_LOGIN}" | php -r 'echo json_decode(stream_get_contents(STDIN), true)["token"] ?? "";')
SUPERADMIN_AUTH=(-H "Authorization: Bearer ${SUPERADMIN_TOKEN}" -H 'Content-Type: application/json')

check "PUT /admin/users/3 (make admin)" '"user"' "$(curl -s -X PUT "${BASE}/admin/users/3" "${SUPERADMIN_AUTH[@]}" -d '{"is_admin":1}')"
check "PUT /admin/users/3 (remove admin)" '"user"' "$(curl -s -X PUT "${BASE}/admin/users/3" "${SUPERADMIN_AUTH[@]}" -d '{"is_admin":0}')"
check "PUT /admin/users/3 (make superadmin)" '"user"' "$(curl -s -X PUT "${BASE}/admin/users/3" "${SUPERADMIN_AUTH[@]}" -d '{"is_superadmin":1}')"
check "PUT /admin/users/3 (remove superadmin)" '"user"' "$(curl -s -X PUT "${BASE}/admin/users/3" "${SUPERADMIN_AUTH[@]}" -d '{"is_superadmin":0}')"
check "admin cannot modify admin roles -> 403" 'superadmins' \
    "$(curl -s -X PUT "${BASE}/admin/users/3" "${ADMIN_AUTH[@]}" -d '{"is_admin":1}')"

# Settings tests
check "GET /admin/settings" '"settings"' "$(curl -s "${BASE}/admin/settings" "${ADMIN_AUTH[@]}")"
check "PUT /admin/settings/test_key (superadmin)" '"setting"' "$(curl -s -X PUT "${BASE}/admin/settings/test_key" "${SUPERADMIN_AUTH[@]}" -d '{"value":"test_value"}')"
check "GET /admin/settings/test_key" '"setting"' "$(curl -s "${BASE}/admin/settings/test_key" "${ADMIN_AUTH[@]}")"
check "DELETE /admin/settings/test_key (superadmin)" '"success"' "$(curl -s -X DELETE "${BASE}/admin/settings/test_key" "${SUPERADMIN_AUTH[@]}")"
check "PUT /admin/settings/nope (admin denied)" 'Superadmin' \
    "$(curl -s -X PUT "${BASE}/admin/settings/nope" "${ADMIN_AUTH[@]}" -d '{"value":"nope"}')"

# Settings export/import tests
check "GET /admin/settings/export" 'settings' "$(curl -s "${BASE}/admin/settings/export" "${ADMIN_AUTH[@]}")"
check "POST /admin/settings/import (superadmin)" '"success"' "$(curl -s -X POST "${BASE}/admin/settings/import" "${SUPERADMIN_AUTH[@]}" -d '{"settings":[{"key":"import_test","value":"imported_value"}],"overwrite":true}')"
check "POST /admin/settings/import (admin denied)" 'Superadmin' \
    "$(curl -s -X POST "${BASE}/admin/settings/import" "${ADMIN_AUTH[@]}" -d '{"settings":[{"key":"nope","value":"nope"}]')"

check "user cannot access admin -> 403" 'Forbidden' \
    "$(curl -s "${BASE}/admin/dashboard" "${AUTH[@]}")"
check "user cannot access admin orders -> 403" 'Forbidden' \
    "$(curl -s "${BASE}/admin/orders" "${AUTH[@]}")"
check "user cannot access admin reviews -> 403" 'Forbidden' \
    "$(curl -s "${BASE}/admin/reviews" "${AUTH[@]}")"

echo
echo "== AI Assistant =="
AI_CONV=$(curl -s -X POST "${BASE}/ai/conversations" "${AUTH[@]}" -d '{"title":"Test Chat"}')
check "POST /ai/conversations" '"conversation_id"' "${AI_CONV}"
AI_CONV_ID=$(echo "${AI_CONV}" | php -r 'echo json_decode(stream_get_contents(STDIN), true)["conversation_id"] ?? "";')
check "GET /ai/conversations" '"conversations"' "$(curl -s "${BASE}/ai/conversations" "${AUTH[@]}")"
check "POST /ai/conversations/{id}/messages" '"reply"' "$(curl -s -X POST "${BASE}/ai/conversations/${AI_CONV_ID}/messages" "${AUTH[@]}" -d '{"message":"Hello, recommend me a book"}')"
check "GET /ai/conversations/{id}/messages" '"messages"' "$(curl -s "${BASE}/ai/conversations/${AI_CONV_ID}/messages" "${AUTH[@]}")"
check "POST /ai/summarize" '"summary"' "$(curl -s -X POST "${BASE}/ai/summarize" "${AUTH[@]}" -d '{"book_id":1}')"
check "POST /ai/suggest" '"suggestions"' "$(curl -s -X POST "${BASE}/ai/suggest" "${AUTH[@]}" -d '{"query":"fiction"}')"
check "DELETE /ai/conversations/{id}" '"success"' "$(curl -s -X DELETE "${BASE}/ai/conversations/${AI_CONV_ID}" "${AUTH[@]}")"

# Suppress unused variable warning
: "${AI_CONV_ID}"

echo "== Gamification =="
check "GET /gamification/summary" '"summary"' "$(curl -s "${BASE}/gamification/summary" "${AUTH[@]}")"
check "GET /gamification/points" '"points"' "$(curl -s "${BASE}/gamification/points" "${AUTH[@]}")"
check "POST /gamification/points" '"total_points"' "$(curl -s -X POST "${BASE}/gamification/points" "${AUTH[@]}" -d '{"type":"review","description":"Test review"}')"
check "GET /gamification/streak" '"streak"' "$(curl -s "${BASE}/gamification/streak" "${AUTH[@]}")"
check "POST /gamification/streak" '"streak"' "$(curl -s -X POST "${BASE}/gamification/streak" "${AUTH[@]}")"
check "GET /gamification/badges" '"badges"' "$(curl -s "${BASE}/gamification/badges" "${AUTH[@]}")"
check "GET /gamification/leaderboard" '"leaderboard"' "$(curl -s "${BASE}/gamification/leaderboard" "${AUTH[@]}")"

echo
echo "== Results: ${PASS} passed, ${FAIL} failed =="
[[ "${FAIL}" -eq 0 ]]
