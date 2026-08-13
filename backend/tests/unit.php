<?php

declare(strict_types=1);

/**
 * BookBay unit tests — no Composer/PHPUnit needed.
 *
 * Boots a fresh SQLite database in /tmp, seeds it, and exercises the
 * Validator and Services directly. Error paths that end in a JSON
 * response are captured via the Response::$onTerminate test hook.
 *
 * Usage: php tests/unit.php
 */

putenv('DB_DRIVER=sqlite');
putenv('DB_DATABASE=/tmp/bookbay-unit-' . getmypid() . '.sqlite');

require __DIR__ . '/../autoload.php';

use BookBay\Core\Response;
use BookBay\Core\Validator;
use BookBay\Models\Book;
use BookBay\Models\BorrowRequest;
use BookBay\Models\CartItem;
use BookBay\Models\Order;
use BookBay\Models\User;
use BookBay\Models\Wallet;
use BookBay\Services\AuthService;
use BookBay\Services\BookService;
use BookBay\Services\BorrowService;
use BookBay\Services\ChatService;
use BookBay\Services\NotificationService;
use BookBay\Services\OrderService;
use BookBay\Services\WalletService;

// Buffer ALL output so header()/http_response_code() keep working inside
// captureResponse (PHP warns once real output has been sent).
ob_start();
require __DIR__ . '/../database/seed.php';

// --- Tiny harness ---------------------------------------------------------

final class ResponseTerminatedException extends RuntimeException
{
}

/** @var array<int, array{0: string, 1: callable}> */
$GLOBALS['tests'] = [];

function test(string $name, callable $fn): void
{
    $GLOBALS['tests'][] = [$name, $fn];
}

function same(mixed $expected, mixed $actual, string $msg = ''): void
{
    if ($expected !== $actual) {
        throw new RuntimeException(
            ($msg !== '' ? $msg . ' — ' : '')
            . 'expected ' . var_export($expected, true)
            . ', got ' . var_export($actual, true)
        );
    }
}

function ok(bool $cond, string $msg = ''): void
{
    if (!$cond) {
        throw new RuntimeException('assertion failed' . ($msg !== '' ? ': ' . $msg : ''));
    }
}

function contains(string $needle, string $haystack, string $msg = ''): void
{
    if (!str_contains($haystack, $needle)) {
        throw new RuntimeException(($msg !== '' ? $msg . ' — ' : '') . "expected '{$haystack}' to contain '{$needle}'");
    }
}

/**
 * Run a callable that ends in Response::json (an exit). Returns
 * [terminated, http_status, decoded_body].
 *
 * @return array{0: bool, 1: int, 2: mixed}
 */
function captureResponse(callable $fn): array
{
    Response::$onTerminate = static function (): never {
        throw new ResponseTerminatedException();
    };

    ob_start();
    http_response_code(200);

    try {
        $fn();
        $terminated = false;
    } catch (ResponseTerminatedException) {
        $terminated = true;
    } finally {
        Response::$onTerminate = null;
        $body = (string) ob_get_clean();
    }

    return [$terminated, (int) http_response_code(), $body === '' ? null : json_decode($body, true)];
}

function ensureUser(string $email, string $name): int
{
    $user = User::firstWhere('email', $email);
    if ($user !== null) {
        return (int) $user['id'];
    }

    return (int) AuthService::register(['name' => $name, 'email' => $email, 'password' => 'secret12'])['user']['id'];
}

// --- Validator -----------------------------------------------------------

test('validator: required', function (): void {
    same([], Validator::validate(['name' => 'x'], ['name' => 'required']));
    ok(isset(Validator::validate(['name' => ''], ['name' => 'required'])['name']), 'empty fails required');
    ok(isset(Validator::validate([], ['name' => 'required'])['name']), 'missing fails required');
});

test('validator: email', function (): void {
    same([], Validator::validate(['email' => 'a@b.com'], ['email' => 'email']));
    ok(isset(Validator::validate(['email' => 'nope'], ['email' => 'email'])['email']), 'invalid email fails');
});

test('validator: min compares numbers numerically', function (): void {
    same([], Validator::validate(['days' => 5], ['days' => 'min:1']));
    ok(isset(Validator::validate(['days' => 0], ['days' => 'min:1'])['days']), '0 below min:1');
});

test('validator: min compares strings by length', function (): void {
    same([], Validator::validate(['password' => 'secret12'], ['password' => 'min:6']));
    ok(isset(Validator::validate(['password' => 'abc'], ['password' => 'min:6'])['password']), 'short password fails');
});

test('validator: max', function (): void {
    same([], Validator::validate(['name' => 'abc'], ['name' => 'max:5']));
    ok(isset(Validator::validate(['name' => 'abcdef'], ['name' => 'max:5'])['name']), 'too long fails');
});

test('validator: integer and in', function (): void {
    same([], Validator::validate(['rating' => 3, 'status' => 'approved'], ['rating' => 'integer', 'status' => 'in:approved,rejected']));
    ok(isset(Validator::validate(['rating' => 'x'], ['rating' => 'integer'])['rating']), 'non-int fails');
    ok(isset(Validator::validate(['status' => 'weird'], ['status' => 'in:approved,rejected'])['status']), 'value not in list');
});

test('validator: returns one message per failing rule', function (): void {
    $errors = Validator::validate(['email' => 'nope'], ['email' => 'required|email']);
    same(1, count($errors['email'] ?? []));
});

// --- Auth ----------------------------------------------------------------

$authEmail = 'unit-auth-' . uniqid() . '@bookbay.test';

test('auth: register creates user, wallet and token', function () use ($authEmail): void {
    $result = AuthService::register(['name' => 'Unit Tester', 'email' => $authEmail, 'password' => 'secret12']);

    same('user', $result['user']['role']);
    same(false, $result['user']['is_admin']);
    ok($result['token'] !== '', 'token should be non-empty');

    $user = User::firstWhere('email', $authEmail);
    ok($user !== null, 'user row exists');
    ok(Wallet::firstWhere('user_id', (int) $user['id']) !== null, 'wallet auto-created');
});

test('auth: duplicate email rejected (409)', function () use ($authEmail): void {
    [, $status, $body] = captureResponse(fn (): mixed => AuthService::register(['email' => $authEmail, 'password' => 'secret12']));
    same(409, $status);
    same('Email is already registered.', $body['message']);
});

test('auth: invalid email rejected (422)', function (): void {
    [, $status, $body] = captureResponse(fn (): mixed => AuthService::register(['email' => 'not-an-email', 'password' => 'secret12']));
    same(422, $status);
    ok($body['message'] !== '', 'has an error message');
});

test('auth: login succeeds with correct password', function () use ($authEmail): void {
    $result = AuthService::login(['email' => $authEmail, 'password' => 'secret12']);
    same('Unit Tester', $result['user']['name']);
    ok($result['token'] !== '');
});

test('auth: login rejects wrong password (401)', function () use ($authEmail): void {
    [, $status, $body] = captureResponse(fn (): mixed => AuthService::login(['email' => $authEmail, 'password' => 'wrong']));
    same(401, $status);
    contains('Invalid', (string) $body['message']);
});

test('auth: currentUser resolves a bearer token', function () use ($authEmail): void {
    $token = AuthService::login(['email' => $authEmail, 'password' => 'secret12'])['token'];
    $_SERVER['HTTP_AUTHORIZATION'] = 'Bearer ' . $token;

    $user = AuthService::currentUser();
    ok($user !== null, 'currentUser resolves');
    same($authEmail, $user['email']);

    unset($_SERVER['HTTP_AUTHORIZATION']);
});

test('auth: currentUser returns null for a bogus token', function (): void {
    $_SERVER['HTTP_AUTHORIZATION'] = 'Bearer bogus-token';
    same(null, AuthService::currentUser());
    unset($_SERVER['HTTP_AUTHORIZATION']);
});

// --- Wallet --------------------------------------------------------------

$walletUserId = ensureUser('unit-wallet-' . uniqid() . '@bookbay.test', 'Wallet Tester');
$recipientId = ensureUser('unit-recipient-' . uniqid() . '@bookbay.test', 'Recipient');
$recipientEmail = (string) User::find($recipientId)['email'];

test('wallet: show returns a zero balance wallet', function () use ($walletUserId): void {
    $res = WalletService::show($walletUserId);
    same(0.0, $res['wallet']['balance']);
});

test('wallet: topUp credits balance and records transaction', function () use ($walletUserId): void {
    WalletService::topUp($walletUserId, ['amount' => 100]);
    same(100.0, WalletService::show($walletUserId)['wallet']['balance']);
    same(1, count(WalletService::transactions($walletUserId, 'topup')['transactions']));
});

test('wallet: topUp rejects non-positive amounts (422)', function () use ($walletUserId): void {
    [, $status] = captureResponse(fn (): mixed => WalletService::topUp($walletUserId, ['amount' => 0]));
    same(422, $status);
});

test('wallet: transfer moves funds between users', function () use ($walletUserId, $recipientId, $recipientEmail): void {
    $res = WalletService::transfer($walletUserId, ['amount' => 30, 'recipient_email' => $recipientEmail]);
    ok($res['success']);
    same(70.0, $res['balance']);
    same(30.0, WalletService::show($recipientId)['wallet']['balance']);
    same(1, count(WalletService::transactions($recipientId, 'transfer_in')['transactions']));
});

test('wallet: transfer with insufficient balance rejected (422)', function () use ($walletUserId, $recipientEmail): void {
    [, $status, $body] = captureResponse(fn (): mixed => WalletService::transfer($walletUserId, ['amount' => 99999, 'recipient_email' => $recipientEmail]));
    same(422, $status);
    contains('Insufficient', (string) $body['message']);
});

// --- Books ---------------------------------------------------------------

test('book: list defaults to active books only', function (): void {
    $books = BookService::list();
    ok(count($books) > 0);
    foreach ($books as $book) {
        same('active', $book['status']);
    }
});

test('book: search by q', function (): void {
    $books = BookService::list(['q' => 'atomic']);
    same('Atomic Habits', $books[0]['title'] ?? '');
});

test('book: filter by category slug', function (): void {
    $books = BookService::list(['category' => 'programming']);
    ok(count($books) >= 2, 'has programming books');
    foreach ($books as $book) {
        same('Programming', $book['category'], 'category field carries the category name');
    }
});

test('book: find returns the frontend aliased shape', function (): void {
    $book = BookService::find(1);
    ok(isset($book['priceBuy'], $book['priceBorrow'], $book['coverPic'], $book['sellerId']), 'camelCase aliases present');
    ok(isset($book['category']), 'category name joined');
});

test('book: sanitize maps camelCase and whitelists fields', function (): void {
    $clean = BookService::sanitize([
        'title' => 'X', 'priceBuy' => 9.99, 'releaseDate' => '2020',
        'evil' => 'dropped', 'seller_id' => 999,
    ], 5);

    same('X', $clean['title']);
    same(9.99, $clean['price_buy']);
    same('2020', $clean['release_date']);
    same(5, $clean['seller_id'], 'seller_id always overwritten with auth user');
    ok(!isset($clean['evil']), 'unknown fields dropped');
});

// --- Orders --------------------------------------------------------------

$orderUserId = ensureUser('unit-buyer-' . uniqid() . '@bookbay.test', 'Order Buyer');

test('order: empty cart rejected (422)', function () use ($orderUserId): void {
    [, $status, $body] = captureResponse(fn (): mixed => OrderService::placeFromCart($orderUserId));
    same(422, $status);
    contains('empty', (string) $body['message']);
});

test('order: placeFromCart creates order, clears cart, decrements stock', function () use ($orderUserId): void {
    CartItem::create(['user_id' => $orderUserId, 'book_id' => 2, 'quantity' => 2]);
    $stockBefore = (int) Book::find(2)['stock'];

    $result = OrderService::placeFromCart($orderUserId);

    ok($result['success']);
    same(1, $result['items'], 'one cart line ordered');
    same('completed', Order::find((int) $result['order_id'])['status']);
    same([], OrderService::cartItems($orderUserId), 'cart cleared');
    same($stockBefore - 2, (int) Book::find(2)['stock'], 'stock decremented');
});

test('order: forUser lists orders with item count', function () use ($orderUserId): void {
    $orders = OrderService::forUser($orderUserId);
    ok(count($orders) >= 1);
    same(1, (int) $orders[0]['item_count'], 'one order line recorded');
});

// --- Borrowing -----------------------------------------------------------

$borrowerId = ensureUser('unit-borrower-' . uniqid() . '@bookbay.test', 'Borrower');

test('borrow: request creates a pending request', function () use ($borrowerId): void {
    $res = BorrowService::request($borrowerId, ['book_id' => 1, 'days' => 7]);
    same('pending', $res['borrow_request']['status']);
});

test('borrow: duplicate pending request rejected (409)', function () use ($borrowerId): void {
    [, $status] = captureResponse(fn (): mixed => BorrowService::request($borrowerId, ['book_id' => 1, 'days' => 5]));
    same(409, $status);
});

test('borrow: missing book rejected (404)', function () use ($borrowerId): void {
    [, $status] = captureResponse(fn (): mixed => BorrowService::request($borrowerId, ['book_id' => 99999, 'days' => 5]));
    same(404, $status);
});

test('borrow: admin decision approves and notifies the user', function () use ($borrowerId): void {
    $request = BorrowService::request($borrowerId, ['book_id' => 3, 'days' => 10])['borrow_request'];
    $decided = BorrowService::decide((int) $request['id'], 'approved', 1);

    same('approved', $decided['borrow_request']['status']);
    $notifications = NotificationService::forUser($borrowerId);
    ok(count($notifications) >= 1, 'user notified');
});

test('borrow: cancel works for pending requests', function () use ($borrowerId): void {
    $request = BorrowService::request($borrowerId, ['book_id' => 4, 'days' => 3])['borrow_request'];
    $id = (int) $request['id'];

    BorrowService::cancel($id, $borrowerId);
    same('cancelled', BorrowService::find($id, $borrowerId)['status']);
});

test('borrow: decide rejects unknown statuses (422)', function (): void {
    $request = BorrowService::all('pending')[0] ?? ['id' => 1];
    [, $status] = captureResponse(fn (): mixed => BorrowService::decide((int) $request['id'], 'maybe', 1));
    same(422, $status);
});

// --- Chat ----------------------------------------------------------------

$chatA = ensureUser('unit-chat-a-' . uniqid() . '@bookbay.test', 'Chat A');
$chatB = ensureUser('unit-chat-b-' . uniqid() . '@bookbay.test', 'Chat B');

test('chat: start finds-or-creates a conversation', function () use ($chatA, $chatB): void {
    $res = ChatService::start($chatA, ['user_id' => $chatB]);
    same($chatB, $res['conversation']['user_id']);

    $again = ChatService::start($chatA, ['user_id' => $chatB]);
    same($res['conversation']['id'], $again['conversation']['id'], 'same conversation returned');
});

test('chat: sending a message lists it for both parties', function () use ($chatA, $chatB): void {
    $conversationId = (int) ChatService::start($chatA, ['user_id' => $chatB])['conversation']['id'];

    ChatService::send($conversationId, $chatA, 'Hello there');

    $messages = ChatService::messages($conversationId, $chatA);
    same(1, count($messages));
    same('Hello there', $messages[0]['body']);
    same(1, count(ChatService::messages($conversationId, $chatB)));

    $conversations = ChatService::conversationsFor($chatA);
    ok(count($conversations) >= 1, 'conversation listed');
    same('Hello there', $conversations[0]['last_message']);
});

test('chat: non-participant cannot read messages (404)', function () use ($chatA, $chatB): void {
    $outsider = ensureUser('unit-chat-out-' . uniqid() . '@bookbay.test', 'Outsider');
    $conversationId = (int) ChatService::start($chatA, ['user_id' => $chatB])['conversation']['id'];

    [, $status] = captureResponse(fn (): mixed => ChatService::messages($conversationId, $outsider));
    same(404, $status);
});

test('chat: empty message rejected (422)', function () use ($chatA, $chatB): void {
    $conversationId = (int) ChatService::start($chatA, ['user_id' => $chatB])['conversation']['id'];

    [, $status] = captureResponse(fn (): mixed => ChatService::send($conversationId, $chatA, '   '));
    same(422, $status);
});

// --- Notifications -------------------------------------------------------

$notifUserId = ensureUser('unit-notif-' . uniqid() . '@bookbay.test', 'Notified');

test('notification: send, list, unread count, mark read', function () use ($notifUserId): void {
    NotificationService::send($notifUserId, 'Welcome', 'Hello');

    same(1, NotificationService::unreadCount($notifUserId));
    $notifications = NotificationService::forUser($notifUserId);
    same(1, count($notifications));
    same('Welcome', $notifications[0]['title']);

    NotificationService::markRead((int) $notifications[0]['id'], $notifUserId);
    same(0, NotificationService::unreadCount($notifUserId));
});

test('notification: markAllRead clears everything', function () use ($notifUserId): void {
    NotificationService::send($notifUserId, 'Second', '');
    NotificationService::send($notifUserId, 'Third', '');
    NotificationService::markAllRead($notifUserId);

    same(0, NotificationService::unreadCount($notifUserId));
    same(0, count(NotificationService::forUser($notifUserId, true)));
});

// --- Run ------------------------------------------------------------------

$failed = 0;

foreach ($GLOBALS['tests'] as [$name, $fn]) {
    try {
        $fn();
        echo "  ok   {$name}\n";
    } catch (Throwable $e) {
        $failed++;
        echo "  FAIL {$name}\n       {$e->getMessage()}\n";
    }
}

$passed = count($GLOBALS['tests']) - $failed;
echo "\n== Results: {$passed} passed, {$failed} failed ==\n";

if (ob_get_level() > 0) {
    ob_end_flush();
}

exit($failed === 0 ? 0 : 1);
