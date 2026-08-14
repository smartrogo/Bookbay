# Bookbay 2.0 PRD (Laravel 12)

## Executive Summary

Bookbay transforms into Africa's student super app for buying,
selling, borrowing, renting, exchanging and reading books.

## Technology Stack
-   Frontend: Reactjs (shadcn-ui, Tailwind CSS)
-   Backend : PHP OOP 
-   Database: MySQL 
-   Payments: Paystack, Flutterwave
-   AI: OpenAI APIs
-   Realtime: WebSockets

## Core Modules

1.  Authentication & RBAC
2.  Marketplace
3.  Search
4.  Borrow & Rental
5.  Exchange
6.  Wallet & Rewards
7.  Messaging
8.  Reviews
9.  Notifications
10. Blog/CMS
11. Admin Portal
12. AI Assistant

## Database

Core tables: - users - roles - books - categories - orders -
borrow_requests - reviews - wallets - transactions - notifications -
posts

## API

    /api/v1
    /auth
    /books
    /orders
    /borrow
    /chat
    /wallet
    /admin
    /search
    /notifications

## PHP Architecture

-   Controllers
-   Models
-   Form Requests
-   Policies
-   Services
-   Repositories
-   Jobs
-   Events
-   Notifications
-   Middleware

## Security

-   Sanctum Authentication
-   RBAC
-   CSRF/XSS/SQL Injection Protection
-   Rate Limiting
-   Audit Logs
-   Encrypted Sensitive Data


## Roadmap

### Phase 1

Authentication, Marketplace, Search, Orders, Payments, Admin.

### Phase 2

Borrowing, Exchange, Wallet, Messaging.

### Phase 3

AI Assistant, Read-to-Earn, Gamification.

### Phase 4

Mobile Apps, Blockchain, University APIs.

## Recommendation

Adopt Laravel 12 as the backend framework for maintainability,
scalability, testing, queues, events, notifications, and secure API
development.

### Stack

- 

### Modules

Authentication Users Roles Books Categories Orders Borrowing Wishlist
Reviews Wallet Transactions Notifications Messaging Admin Blog AI

### Core Tables

users roles books categories orders order_items borrow_requests reviews
wallets transactions notifications messages posts settings audit_logs

### API Prefix

/api/v1

Endpoints: - POST /register - POST /login - GET /me -
GET/POST/PUT/DELETE /books - GET /categories - POST /orders - POST
/borrow/request - GET /wallet - GET /notifications - GET
/admin/dashboard
` 