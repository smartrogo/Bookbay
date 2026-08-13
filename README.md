# BookBay

Monorepo for the BookBay marketplace.

| Folder      | Contents                                                    |
| ----------- | ----------------------------------------------------------- |
| `frontend/` | React + Vite web app (see [`frontend/README.md`](frontend/README.md)) |
| `backend/`  | Laravel 12 API — **placeholder, not yet scaffolded** (see [`backend/README.md`](backend/README.md)) |

## Quick start (frontend)

```bash
cd frontend
npm install
npm run dev
```

The frontend talks to the Laravel backend at `/api/v1` via `VITE_API_BASE_URL`
(defaults to the deployed backend on Render).

## Docs

- [`BookBay_2.0_PRD_Laravel12.md`](BookBay_2.0_PRD_Laravel12.md) — overall product PRD
- [`backend/BookBay_Backend_PRD_Laravel12.md`](backend/BookBay_Backend_PRD_Laravel12.md) — backend spec
- [`frontend/frontend-phase1-task-map.md`](frontend/frontend-phase1-task-map.md) — frontend phase 1 task map

## Deploying the frontend on Vercel

Set the project **Root Directory** to `frontend/` (the Vercel/Netlify
configs `vercel.json` and `_redirects` live there with the app).
