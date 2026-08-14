<?php

declare(strict_types=1);

use Bookbay\Http\Controllers\AdminController;
use Bookbay\Http\Controllers\AuthController;
use Bookbay\Http\Controllers\BookController;
use Bookbay\Http\Controllers\BorrowController;
use Bookbay\Http\Controllers\CartController;
use Bookbay\Http\Controllers\CategoryController;
use Bookbay\Http\Controllers\ChatController;
use Bookbay\Http\Controllers\ExchangeController;
use Bookbay\Http\Controllers\NewsletterController;
use Bookbay\Http\Controllers\NotificationController;
use Bookbay\Http\Controllers\OrderController;
use Bookbay\Http\Controllers\PaymentController;
use Bookbay\Http\Controllers\PostController;
use Bookbay\Http\Controllers\ReviewController;
use Bookbay\Http\Controllers\SettingsController;
use Bookbay\Http\Controllers\RecommendationController;
use Bookbay\Http\Controllers\AiController;
use Bookbay\Http\Controllers\GamificationController;
use Bookbay\Http\Controllers\WalletController;
use Bookbay\Http\Controllers\WishlistController;

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

// --- Recommendations -----------------------------------------------------
$router->get('/recommendations/personalized', [RecommendationController::class, 'personalized']);
$router->get('/recommendations/recently-viewed', [RecommendationController::class, 'recentlyViewed']);
$router->get('/recommendations/similar/{bookId}', [RecommendationController::class, 'similar']);
$router->post('/recommendations/track-view', [RecommendationController::class, 'trackView']);

// --- AI Assistant --------------------------------------------------------
$router->get('/ai/conversations', [AiController::class, 'conversations']);
$router->post('/ai/conversations', [AiController::class, 'createConversation']);
$router->get('/ai/conversations/{id}/messages', [AiController::class, 'messages']);
$router->post('/ai/conversations/{id}/messages', [AiController::class, 'sendMessage']);
$router->delete('/ai/conversations/{id}', [AiController::class, 'deleteConversation']);
$router->post('/ai/summarize', [AiController::class, 'summarize']);
$router->post('/ai/suggest', [AiController::class, 'suggest']);

// --- Gamification --------------------------------------------------------
$router->get('/gamification/summary', [GamificationController::class, 'summary']);
$router->get('/gamification/points', [GamificationController::class, 'points']);
$router->post('/gamification/points', [GamificationController::class, 'awardPoints']);
$router->get('/gamification/streak', [GamificationController::class, 'streak']);
$router->post('/gamification/streak', [GamificationController::class, 'recordActivity']);
$router->get('/gamification/badges', [GamificationController::class, 'badges']);
$router->get('/gamification/leaderboard', [GamificationController::class, 'leaderboard']);

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
$router->put('/admin/users/{id}', [AdminController::class, 'updateUser']);
$router->delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
$router->get('/admin/books', [AdminController::class, 'books']);
$router->put('/admin/books/{id}', [AdminController::class, 'updateBook']);
$router->get('/admin/borrow', [AdminController::class, 'borrow']);
$router->patch('/admin/borrow/{id}', [AdminController::class, 'updateBorrow']);
$router->get('/admin/orders', [AdminController::class, 'orders']);
$router->put('/admin/orders/{id}', [AdminController::class, 'updateOrder']);
$router->get('/admin/reviews', [AdminController::class, 'reviews']);
$router->delete('/admin/reviews/{id}', [AdminController::class, 'deleteReview']);
$router->get('/admin/exchanges', [AdminController::class, 'exchanges']);
$router->put('/admin/exchanges/{id}', [AdminController::class, 'updateExchange']);
$router->get('/admin/subscribers', [AdminController::class, 'subscribers']);
$router->delete('/admin/subscribers/{id}', [AdminController::class, 'deleteSubscriber']);
$router->get('/admin/settings', [SettingsController::class, 'index']);
$router->get('/admin/settings/export', [SettingsController::class, 'export']);
$router->post('/admin/settings/import', [SettingsController::class, 'import']);
$router->get('/admin/settings/{key}', [SettingsController::class, 'show']);
$router->put('/admin/settings/{key}', [SettingsController::class, 'update']);
$router->delete('/admin/settings/{key}', [SettingsController::class, 'destroy']);
