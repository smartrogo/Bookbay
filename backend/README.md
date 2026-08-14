# Bookbay Backend

PHP 8.3+ API for the Bookbay marketplace. Implements the modules in
[`Bookbay_Backend.md`](./Bookbay_Backend.md): authentication, users, roles,
books, categories, orders, borrowing, reviews, wishlists, wallets,
transactions, notifications, messaging, admin, blog, and newsletter.

> **Note on the stack:** the spec lists Laravel 12, but this backend is a
> small dependency-free PHP framework (`src/Core`) with PDO — no Composer
> required, deployable anywhere PHP runs. It honors the spec's architecture
> (Controllers / Models / Services), API prefix `/api/v1`, and security
> checklist (RBAC, validation, rate limiting, audit logs, prepared
> statements). Production driver is MySQL 8; SQLite is supported for local
> dev and smoke tests.

## Quick start

```bash
cd backend
cp .env.example .env          # defaults to MySQL; switch DB_DRIVER=sqlite to skip a server
php database/seed.php         # creates tables (migrate) and seeds roles, admin, categories, demo books
php -S 127.0.0.1:8000 -t public public/index.php
```

Seeded accounts:

| Email                | Password | Role  |
| -------------------- | -------- | ----- |
| admin@bookbay.test   | password | admin |
| demo@bookbay.test    | password | user  |

All endpoints live under `/api/v1`.

## Structure

```
backend/
├── public/index.php          # front controller (web root = public/)
├── routes/api.php            # all /api/v1 routes
├── database/
│   ├── migrate.php           # schema for MySQL + SQLite (idempotent)
│   └── seed.php              # roles, admin/demo users, categories, demo books, settings
├── src/
│   ├── Core/                 # Router, Request, Response, Config, Database,
│   │                         # Controller, Validator, RateLimiter (Redis-aware)
│   ├── Models/               # 23 models — one per core table
│   ├── Services/             # Auth, Book, Order, Payment, Wallet, Borrow,
│   │                         # Chat, Notification, Audit
│   └── Http/Controllers/     # 16 controllers
└── tests/
    ├── smoke.sh              # boots the API and runs 45 end-to-end checks
    └── unit.php              # dependency-free unit tests (39 checks)
```

## Endpoints

| Method | Path | Auth | Notes |
| ------ | ---- | ---- | ----- |
| POST | `/auth/register`, `/auth/login`, `/auth/logout` | – / – / token | token returned + cookie set |
| GET | `/auth/me` | token | |
| GET/POST | `/categories` | – / admin | |
| PUT/DELETE | `/categories/{id}` | admin | |
| GET | `/books` | – | `q`, `category`, `user_id`, `page`, `limit` filters |
| GET | `/books/{id}`, `/books/user/{userId}` | – | |
| POST | `/books` | user | seller creates their own listing |
| PUT/DELETE | `/books/{id}` | owner/admin | |
| GET/POST | `/cart/{userId}` | owner | add upserts quantity |
| DELETE | `/cart/{userId}/{cartItemId}` | owner | |
| POST | `/payments/start/{userId}`, `/payments/verify/{userId}` | owner | demo gateway; verify converts cart into order |
| POST | `/orders` | user | place order from cart |
| GET | `/orders` | user | `status` filter |
| GET | `/wallet/{userId}` | owner | |
| GET | `/wallet/{userId}/transactions` | owner | `type` filter |
| POST | `/wallet/{userId}/topup`, `/wallet/{userId}/transfer` | owner | |
| POST | `/borrow` (and spec alias `/borrow/request`) | user | |
| GET/PUT/DELETE | `/borrow/{id}` | owner | |
| GET/POST | `/exchange` | user | |
| PUT/DELETE | `/exchange/{id}` | owner | |
| GET/POST | `/chat/conversations/{userId}` / `/chat/conversations` | owner/user | |
| GET/POST | `/chat/{conversationId}/messages` | participant | |
| GET | `/notifications` | user | `unread` filter + `unread_count` |
| POST | `/notifications/read-all`; PATCH `/notifications/{id}/read` | user | |
| POST | `/newsletter/subscribe` | – | |
| GET/POST | `/reviews` | – / user | `book_id` filter |
| GET/POST | `/wishlist` | user | add is idempotent |
| DELETE | `/wishlist/{id}` | owner | |
| GET | `/posts`, `/posts/{id}` | – | blog |
| POST/PUT/DELETE | `/posts` | admin | |
| GET | `/admin/dashboard` | admin | stats + monthly revenue + recent orders |
| GET | `/admin/users`, `/admin/books`, `/admin/borrow` | admin | |
| PUT | `/admin/books/{id}`; PATCH `/admin/borrow/{id}` | admin | approve/reject borrow |

## Running the tests

```bash
php tests/unit.php    # 39 unit checks (Validator + all Services, no PHPUnit needed)
bash tests/smoke.sh   # 45 end-to-end checks over HTTP
```

The unit runner boots a fresh SQLite database in `/tmp` and exercises the
Validator and every Service directly (including error paths via the
`Response::$onTerminate` test hook). The smoke test starts the API on a
random port and drives the main flows over HTTP: auth, cart → payment →
order, wallet, borrow, exchange, chat, wishlist, admin.

## Deployment

Point the web root at `backend/public/` and set the `.env` values (MySQL
host/credentials, `CORS_ALLOWED_ORIGINS`). The frontend talks to this API
via `VITE_API_BASE_URL` (see `frontend/.env.development`).

## Not yet implemented

- **AI module** (spec lists it; no feature defined yet)
- Real payment gateway (Paystack/Flutterwave) behind `PaymentService`

## Rate limiting

The limiter uses Redis (fixed window via `INCR`/`EXPIRE`) when the phpredis
extension is loaded and `REDIS_HOST` is set in `.env` — required for
multi-process deployments. Otherwise it falls back to a per-process
in-memory sliding window (fine for `php -S` and single-worker setups).
