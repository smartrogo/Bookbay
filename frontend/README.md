# BookBay Frontend

React + Vite frontend for the BookBay marketplace, wired to the Laravel backend at `/api/v1`.

## Getting started

```bash
npm install
npm run dev
```

Set the backend base URL via env (optional — defaults to the deployed backend):

```bash
# .env
VITE_API_BASE_URL=https://bookbayapp.onrender.com/api/v1
```

## Admin portal

| Route | Description |
| --- | --- |
| `/admin/login` | Dedicated admin sign-in page |
| `/admin` | Admin dashboard (protected — admins only) |

The admin login authenticates against the same backend `/auth/login` endpoint and only
grants access to accounts whose role is `admin` (the app accepts `role`, `role_id`,
`is_admin`, or a `roles` array in the user payload).

### Default admin credentials

```
Email:    admin@bookbay.com
Password: BookBay@2026
```

> **Important:** the admin account must be seeded in the Laravel backend for these
> credentials to work. Add an `admin` role user via a Laravel seeder/migration, e.g.:
> `UsersTableSeeder` creating `admin@bookbay.com` with the `admin` role. Until the
> backend admin endpoints (`/admin/dashboard`, `/admin/books`, `/admin/users`,
> `/admin/borrow`) respond, the dashboard falls back to demo data so the UI stays usable.

Admin dashboard data is loaded from `src/services/adminService.js` — swap the demo
fallbacks for real endpoints as the backend ships them.
