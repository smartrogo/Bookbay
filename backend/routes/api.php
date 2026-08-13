<?php

declare(strict_types=1);

use BookBay\Http\Controllers\AdminController;
use BookBay\Http\Controllers\AuthController;
use BookBay\Http\Controllers\BookController;
use BookBay\Http\Controllers\BorrowController;
use BookBay\Http\Controllers\CartController;
use BookBay\Http\Controllers\CategoryController;
use BookBay\Http\Controllers\ChatController;
use BookBay\Http\Controllers\ExchangeController;
use BookBay\Http\Controllers\NewsletterController;
use BookBay\Http\Controllers\NotificationController;
use BookBay\Http\Controllers\OrderController;
use BookBay\Http\Controllers\PaymentController;
use BookBay\Http\Controllers\PostController;
use BookBay\Http\Controllers\ReviewController;
use BookBay\Http\Controllers\WalletController;
use BookBay\Http\Controllers\WishlistController;

/**
 * All routes live under /api/v1 (stripped by Request::path()).
 * Register more specific patterns before generic ones.
 *
 * @var Router $router
 */

// --- Authentication -----------------------------------------------------
$router->post('/auth/register', [AuthController::class, 'register']);
$router->post('/auth/login', [AuthController::class, 'login']);
$router->post('/auth/logout', [AuthController::class, 'logout']);
$router->get('/auth/me', [AuthController::class, 'me']);

// --- Categories ---------------------------------------------------------
$router->get('/categories', [CategoryController::class, 'index']);
$router->post('/categories', [CategoryController::class, 'store']);
$router->put('/categories/{id}', [CategoryController::class, 'update']);
$router->delete('/categories/{id}', [CategoryController::class, 'destroy']);

// --- Books --------------------------------------------------------------
$router->get('/books/user/{userId}', [BookController::class, 'userBooks']);
$router->get('/books', [BookController::class, 'index']);
$router->post('/books', [BookController::class, 'store']);
$router->get('/books/{id}', [BookController::class, 'show']);
$router->put('/books/{id}', [BookController::class, 'update']);
$router->delete('/books/{id}', [BookController::class, 'destroy']);

// --- Cart ---------------------------------------------------------------
$router->get('/cart/{userId}', [CartController::class, 'index']);
$router->post('/cart/{userId}', [CartController::class, 'store']);
$router->delete('/cart/{userId}/{cartItemId}', [CartController::class, 'destroy']);

// --- Payments -----------------------------------------------------------
$router->post('/payments/start/{userId}', [PaymentController::class, 'start']);
$router->post('/payments/verify/{userId}', [PaymentController::class, 'verify']);

// --- Orders -------------------------------------------------------------
$router->post('/orders', [OrderController::class, 'store']);
$router->get('/orders', [OrderController::class, 'index']);

// --- Wallet -------------------------------------------------------------
$router->get('/wallet/{userId}/transactions', [WalletController::class, 'transactions']);
$router->post('/wallet/{userId}/topup', [WalletController::class, 'topup']);
$router->post('/wallet/{userId}/transfer', [WalletController::class, 'transfer']);
$router->get('/wallet/{userId}', [WalletController::class, 'show']);

// --- Borrowing ----------------------------------------------------------
$router->post('/borrow/request', [BorrowController::class, 'store']);
$router->get('/borrow', [BorrowController::class, 'index']);
$router->post('/borrow', [BorrowController::class, 'store']);
$router->get('/borrow/{id}', [BorrowController::class, 'show']);
$router->put('/borrow/{id}', [BorrowController::class, 'update']);
$router->delete('/borrow/{id}', [BorrowController::class, 'destroy']);

// --- Exchange -----------------------------------------------------------
$router->get('/exchange', [ExchangeController::class, 'index']);
$router->post('/exchange', [ExchangeController::class, 'store']);
$router->get('/exchange/{id}', [ExchangeController::class, 'show']);
$router->put('/exchange/{id}', [ExchangeController::class, 'update']);
$router->delete('/exchange/{id}', [ExchangeController::class, 'destroy']);

// --- Chat ---------------------------------------------------------------
$router->get('/chat/conversations/{userId}', [ChatController::class, 'conversations']);
$router->post('/chat/conversations', [ChatController::class, 'createConversation']);
$router->get('/chat/{conversationId}/messages', [ChatController::class, 'messages']);
$router->post('/chat/{conversationId}/messages', [ChatController::class, 'sendMessage']);

// --- Notifications ------------------------------------------------------
$router->get('/notifications', [NotificationController::class, 'index']);
$router->post('/notifications/read-all', [NotificationController::class, 'readAll']);
$router->patch('/notifications/{id}/read', [NotificationController::class, 'read']);

// --- Newsletter ---------------------------------------------------------
$router->post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

// --- Reviews ------------------------------------------------------------
$router->get('/reviews', [ReviewController::class, 'index']);
$router->post('/reviews', [ReviewController::class, 'store']);

// --- Wishlist -----------------------------------------------------------
$router->get('/wishlist', [WishlistController::class, 'index']);
$router->post('/wishlist', [WishlistController::class, 'store']);
$router->delete('/wishlist/{id}', [WishlistController::class, 'destroy']);

// --- Blog ---------------------------------------------------------------
$router->get('/posts', [PostController::class, 'index']);
$router->get('/posts/{id}', [PostController::class, 'show']);
$router->post('/posts', [PostController::class, 'store']);
$router->put('/posts/{id}', [PostController::class, 'update']);
$router->delete('/posts/{id}', [PostController::class, 'destroy']);

// --- Admin --------------------------------------------------------------
$router->get('/admin/dashboard', [AdminController::class, 'dashboard']);
$router->get('/admin/users', [AdminController::class, 'users']);
$router->get('/admin/books', [AdminController::class, 'books']);
$router->put('/admin/books/{id}', [AdminController::class, 'updateBook']);
$router->get('/admin/borrow', [AdminController::class, 'borrow']);
$router->patch('/admin/borrow/{id}', [AdminController::class, 'updateBorrow']);
