# BookBay Phase 1 Frontend Plan

## Goal
Create a phase-1 frontend that matches the PRD's core launch scope: Authentication, Marketplace, Search, Orders, Payments, and Admin.

## Current frontend coverage
- Existing product browsing and category UI: `src/pages/Categories.jsx`, `src/components/MiniSwipper.jsx`, `src/components/Book.jsx`
- Book details and add-to-cart flow: `src/pages/BookDetails.jsx`
- Cart and payment initiation: `src/pages/Cart.jsx`, `src/pages/Success.jsx`
- Auth pages and state: `src/pages/SignInPage.jsx`, `src/pages/SignUpPage.jsx`, `src/AuthContext.jsx`
- User-owned books: `src/pages/MyBooks.jsx`
- Navigation and protected routes: `src/components/Header.jsx`, `src/pages/ProtectedRoute.jsx`
- Static pages and home landing: `src/components/Home.jsx`, `src/pages/About.jsx`, `src/pages/FAQs.jsx`

## Missing frontend pieces for Phase 1
- Backend auth integration using Laravel Sanctum instead of Firebase/Clerk
- A reusable API client and service layer for backend calls
- Backend-powered book search / catalog endpoints instead of only OpenLibrary search
- Buy / order review page in `src/pages/Buy.jsx`
- Admin dashboard page and admin route guard in `src/pages/Dashboard.jsx`
- Profile page integration with backend user data in `src/pages/Profile.jsx`
- Centralized cart/order service rather than page-level direct Firebase calls
- Login state cleanup and route protection tied to backend session
- Environment configuration for `VITE_API_BASE_URL`

## Concrete Phase 1 task list

### 1. Create frontend API service layer
- `src/services/api.js` - base axios client for backend API
- `src/services/authService.js` - backend auth methods: login, register, logout, current user
- `src/services/bookService.js` - backend book/catalog/cart APIs

### 2. Replace Firebase auth in frontend
- `src/AuthContext.jsx` - turn auth provider into backend auth provider
- `src/pages/SignInPage.jsx` - login via `authService.signIn`
- `src/pages/SignUpPage.jsx` - register via `authService.signUp`
- `src/components/Header.jsx` - show login/logout links using backend auth state
- `src/pages/ProtectedRoute.jsx` - protect routes with backend auth session

### 3. Connect marketplace pages to backend
- `src/pages/Categories.jsx` - fetch categories/search from backend API
- `src/components/MiniSwipper.jsx` - optionally display featured backend books
- `src/pages/BookDetails.jsx` - fetch book metadata from backend by `bookId`
- `src/pages/MyBooks.jsx` - fetch user-owned books from backend

### 4. Build order/cart flow
- `src/pages/Cart.jsx` - load backend cart items, choose buy/borrow, start payment via backend endpoint
- `src/pages/Success.jsx` - verify payment callback with backend and show confirmation
- `src/pages/Buy.jsx` - add order review / checkout UI

### 5. Add admin and profile foundation
- `src/pages/Dashboard.jsx` - admin landing page + role guard
- `src/pages/Profile.jsx` - profile view connected to backend user data

### 6. Clean up deprecated services
- `src/firebase.js` and all Firebase imports should be removed or disabled once backend integration is complete
- `@clerk/clerk-react` import usage should be removed from pages no longer using Clerk

## File mapping summary
- `src/services/api.js` -> backend API client
- `src/services/authService.js` -> auth endpoints
- `src/services/bookService.js` -> book/cart/order endpoints
- `src/AuthContext.jsx` -> auth state provider
- `src/pages/SignInPage.jsx` -> sign-in form
- `src/pages/SignUpPage.jsx` -> sign-up form
- `src/components/Header.jsx` -> navigation + auth state
- `src/pages/ProtectedRoute.jsx` -> route guards
- `src/pages/Categories.jsx` -> catalog search page
- `src/components/MiniSwipper.jsx` -> home browsing feed
- `src/pages/BookDetails.jsx` -> details + add to cart
- `src/pages/Cart.jsx` -> cart/checkout
- `src/pages/Success.jsx` -> payment callback
- `src/pages/Buy.jsx` -> order review placeholder
- `src/pages/MyBooks.jsx` -> user library
- `src/pages/Dashboard.jsx` -> admin page
- `src/pages/Profile.jsx` -> profile page

## Next implementation step
1. Use `src/services/api.js` and `src/services/authService.js` from the new service layer.
2. Update `src/AuthContext.jsx` to call backend auth endpoints.
3. Replace page-level Firebase calls with service calls in `BookDetails.jsx`, `Cart.jsx`, and `MyBooks.jsx`.
4. Add `VITE_API_BASE_URL` to frontend environment.

> This plan starts the Phase 1 implementation with a service layer and task mapping directly to your current frontend files.
