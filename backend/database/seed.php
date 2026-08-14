<?php

declare(strict_types=1);

/**
 * Bookbay database seeder.
 *
 * Idempotent — safe to run repeatedly. Seeds roles, admin users, demo
 * users, categories, books, orders, borrow requests, exchange requests,
 * reviews, newsletter subscribers, and site settings.
 *
 * Usage: php database/seed.php
 */

use Bookbay\Core\Config;
use Bookbay\Models\Book;
use Bookbay\Models\BorrowRequest;
use Bookbay\Models\Category;
use Bookbay\Models\ExchangeRequest;
use Bookbay\Models\NewsletterSubscriber;
use Bookbay\Models\Order;
use Bookbay\Models\OrderItem;
use Bookbay\Models\Review;
use Bookbay\Models\Role;
use Bookbay\Models\Setting;
use Bookbay\Models\User;
use Bookbay\Models\Wallet;

require __DIR__ . '/../autoload.php';

Config::load(__DIR__ . '/../.env');

require __DIR__ . '/migrate.php';

// --- Roles -------------------------------------------------------------

if (Role::all() === []) {
    foreach (['superadmin', 'admin', 'user'] as $name) {
        Role::create(['name' => $name]);
    }
    echo "Seeded roles: superadmin, admin, user.\n";
}

// --- Users -------------------------------------------------------------

$adminUsers = [
    ['Super Admin', 'superadmin@bookbay.test', '+2348000000001', 3, 1, 1, 'active'],
    ['Bookbay Admin', 'admin@bookbay.test', '+2348000000000', 1, 1, 0, 'active'],
];

$demoUsers = [
    ['Demo User', 'demo@bookbay.test', '+2348111111111', 2, 0, 0, 'active'],
    ['Aisha Bello', 'aisha@bookbay.test', '+2348012345678', 2, 0, 0, 'active'],
    ['John Mensah', 'john@bookbay.test', '+233201234567', 2, 0, 0, 'active'],
    ['Ngozi Okonkwo', 'ngozi@bookbay.test', '+2348023456789', 2, 0, 0, 'active'],
    ['Kwame Asante', 'kwame@bookbay.test', '+233241234567', 2, 0, 0, 'suspended'],
    ['Fatima Sani', 'fatima@bookbay.test', '+2348034567890', 2, 0, 0, 'active'],
    ['Chinedu Eze', 'chinedu@bookbay.test', '+2348045678901', 2, 0, 0, 'active'],
    ['Tunde Abiodun', 'tunde@bookbay.test', '+2348056789012', 2, 0, 0, 'active'],
    ['Amina Yusuf', 'amina@bookbay.test', '+2348067890123', 2, 0, 0, 'active'],
];

$userIds = [];

foreach (array_merge($adminUsers, $demoUsers) as [$name, $email, $phone, $roleId, $isAdmin, $isSuperAdmin, $status]) {
    $existing = User::firstWhere('email', $email);

    if ($existing === null) {
        $userId = User::create([
            'name' => $name,
            'email' => $email,
            'password' => password_hash('password', PASSWORD_DEFAULT),
            'phone' => $phone,
            'role_id' => $roleId,
            'is_admin' => $isAdmin,
            'is_superadmin' => $isSuperAdmin,
            'status' => $status,
        ]);
        Wallet::ensureForUser($userId);
        $userIds[$email] = $userId;
        echo "Seeded user: {$name} ({$email} / password).\n";
    } else {
        $userIds[$email] = (int) $existing['id'];
    }
}

$sellerId = $userIds['admin@bookbay.test'] ?? 1;
$demoUserId = $userIds['demo@bookbay.test'] ?? 2;
$aishaId = $userIds['aisha@bookbay.test'] ?? 3;
$johnId = $userIds['john@bookbay.test'] ?? 4;

// --- Categories --------------------------------------------------------

$categories = [
    'Fiction' => 'fiction',
    'Non-Fiction' => 'non-fiction',
    'Self-Help' => 'self-help',
    'Programming' => 'programming',
    'Science' => 'science',
    'History' => 'history',
    'Religious' => 'religious',
    'Computer' => 'computer',
    'Adventures' => 'adventures',
    'Biography' => 'biography',
    'Children/Adult' => 'children/adult',
    'Science/Technology' => 'science/technology',
    'Business/Economics' => 'business/economics',
    'Cooking & Food' => 'cooking&food',
    'Art & Photography' => 'art_and_photography',
    'Spirituality' => 'spirituality',
    'Education & Teaching' => 'education and teaching',
    'Health & Wellness' => 'health and wellness',
    'Philosophy' => 'philosophy',
    'Parenting & Family' => 'parenting and family',
];

$categoryIds = [];

foreach ($categories as $name => $slug) {
    $category = Category::firstWhere('slug', $slug);

    if ($category !== null) {
        $categoryIds[$slug] = (int) $category['id'];
        continue;
    }

    $categoryIds[$slug] = Category::create(['name' => $name, 'slug' => $slug]);
}

echo 'Seeded/verified ' . count($categories) . " categories.\n";

// --- Demo books --------------------------------------------------------

$demoBooks = [
    ['Things Fall Apart', 'Chinua Achebe', 'fiction', 24.99, 8.99, 10, '1958'],
    ['Atomic Habits', 'James Clear', 'self-help', 19.5, 6.5, 8, '2018'],
    ['The Alchemist', 'Paulo Coelho', 'fiction', 15.75, 5.25, 12, '1988'],
    ['Sapiens', 'Yuval Noah Harari', 'history', 31.2, 9.5, 5, '2011'],
    ['Clean Code', 'Robert C. Martin', 'programming', 39.99, 12.25, 7, '2008'],
    ['The Pragmatic Programmer', 'Andrew Hunt', 'programming', 34.4, 10.8, 6, '1999'],
    ['The Psychology of Money', 'Morgan Housel', 'business/economics', 18.8, 6.8, 9, '2020'],
    ['Deep Work', 'Cal Newport', 'self-help', 17.2, 5.9, 4, '2016'],
];

$seededBooks = 0;

foreach ($demoBooks as [$title, $author, $slug, $buy, $borrow, $stock, $year]) {
    if (Book::firstWhere('title', $title) !== null) {
        continue;
    }

    $categoryId = $categoryIds[$slug] ?? null;

    Book::create([
        'seller_id' => $sellerId,
        'title' => $title,
        'author' => $author,
        'category_id' => $categoryId,
        'description' => "A curated {$title} title from Bookbay.",
        'cover' => placeholderCover($title),
        'cover_pic' => placeholderCover($title),
        'price_buy' => $buy,
        'price_borrow' => $borrow,
        'stock' => $stock,
        'year' => $year,
        'release_date' => $year,
        'status' => 'active',
    ]);

    $seededBooks++;
}

echo "Seeded/verified {$seededBooks} demo book(s).\n";

// --- Settings ----------------------------------------------------------

$defaultSettings = [
    'site_name' => 'Bookbay',
    'site_description' => 'Your online bookstore for buying, selling, and borrowing books.',
    'site_url' => 'https://bookbay.com',
    'support_email' => 'support@bookbay.com',
    'maintenance_mode' => 'false',
    'allow_registration' => 'true',
    'max_books_per_user' => '50',
    'borrow_max_days' => '30',
    'min_borrow_days' => '1',
    'currency' => 'USD',
];

$settingsSeeded = 0;

foreach ($defaultSettings as $key => $value) {
    if (Setting::firstWhere('key', $key) === null) {
        Setting::create(['key' => $key, 'value' => $value]);
        $settingsSeeded++;
    }
}

if ($settingsSeeded > 0) {
    echo "Seeded {$settingsSeeded} site settings.\n";
}

// --- Orders ------------------------------------------------------------

$existingOrders = Order::queryAll('SELECT COUNT(*) AS c FROM orders');
$orderCount = (int) ($existingOrders[0]['c'] ?? 0);

if ($orderCount === 0) {
    $orderStatuses = ['completed', 'processing', 'pending', 'completed', 'cancelled'];
    $orderUserEmails = ['aisha@bookbay.test', 'john@bookbay.test', 'demo@bookbay.test', 'ngozi@bookbay.test', 'fatima@bookbay.test'];

    foreach ($orderUserEmails as $i => $email) {
        $userId = $userIds[$email] ?? 2;
        $orderId = Order::create([
            'user_id' => $userId,
            'total' => round(15.00 + ($i * 8.50), 2),
            'status' => $orderStatuses[$i],
            'reference' => 'ORD-' . strtoupper(substr(bin2hex(random_bytes(5)), 0, 10)),
        ]);

        OrderItem::create([
            'order_id' => $orderId,
            'book_id' => 1 + $i,
            'title' => ['Things Fall Apart', 'Atomic Habits', 'The Alchemist', 'Sapiens', 'Clean Code'][$i],
            'price' => round(15.00 + ($i * 8.50), 2),
            'quantity' => 1,
        ]);
    }

    echo "Seeded 5 demo orders.\n";
}

// --- Borrow Requests ---------------------------------------------------

$existingBorrows = BorrowRequest::queryAll('SELECT COUNT(*) AS c FROM borrow_requests');
$borrowCount = (int) ($existingBorrows[0]['c'] ?? 0);

if ($borrowCount === 0) {
    $borrowData = [
        [$aishaId, 1, 14, 'pending'],
        [$johnId, 2, 7, 'approved'],
        [$demoUserId, 3, 21, 'pending'],
        [$aishaId, 4, 10, 'returned'],
        [$johnId, 5, 14, 'overdue'],
        [$demoUserId, 6, 7, 'pending'],
        [$aishaId, 7, 14, 'approved'],
    ];

    foreach ($borrowData as [$userId, $bookId, $days, $status]) {
        BorrowRequest::create([
            'user_id' => $userId,
            'book_id' => $bookId,
            'days' => $days,
            'status' => $status,
        ]);
    }

    echo "Seeded 7 borrow requests.\n";
}

// --- Exchange Requests -------------------------------------------------

$existingExchanges = ExchangeRequest::queryAll('SELECT COUNT(*) AS c FROM exchange_requests');
$exchangeCount = (int) ($existingExchanges[0]['c'] ?? 0);

if ($exchangeCount === 0) {
    $exchangeData = [
        [$aishaId, 1, 2, 'pending'],
        [$johnId, 3, 4, 'approved'],
        [$demoUserId, 5, 6, 'pending'],
        [$aishaId, 7, 8, 'completed'],
    ];

    foreach ($exchangeData as [$userId, $offeredId, $wantedId, $status]) {
        ExchangeRequest::create([
            'user_id' => $userId,
            'offered_book_id' => $offeredId,
            'wanted_book_id' => $wantedId,
            'message' => 'I would like to exchange these books.',
            'status' => $status,
        ]);
    }

    echo "Seeded 4 exchange requests.\n";
}

// --- Reviews -----------------------------------------------------------

$existingReviews = Review::queryAll('SELECT COUNT(*) AS c FROM reviews');
$reviewCount = (int) ($existingReviews[0]['c'] ?? 0);

if ($reviewCount === 0) {
    $reviewData = [
        [$aishaId, 1, 5, 'A masterpiece of African literature. Highly recommended!'],
        [$johnId, 2, 4, 'Very practical and easy to implement habits.'],
        [$demoUserId, 3, 5, 'Beautifully written, deeply moving story.'],
        [$aishaId, 4, 4, 'Fascinating perspective on human history.'],
        [$johnId, 5, 5, 'Essential reading for any programmer.'],
        [$demoUserId, 6, 4, 'Great insights into the tech industry.'],
        [$aishaId, 7, 4, 'Very insightful book about money.'],
        [$johnId, 8, 5, 'Changed my approach to work and focus.'],
    ];

    foreach ($reviewData as [$userId, $bookId, $rating, $comment]) {
        Review::create([
            'user_id' => $userId,
            'book_id' => $bookId,
            'rating' => $rating,
            'comment' => $comment,
        ]);
    }

    echo "Seeded 8 reviews.\n";
}

// --- Newsletter Subscribers ---------------------------------------------

$existingSubscribers = NewsletterSubscriber::queryAll('SELECT COUNT(*) AS c FROM newsletter_subscribers');
$subscriberCount = (int) ($existingSubscribers[0]['c'] ?? 0);

if ($subscriberCount === 0) {
    $subscriberEmails = [
        'aisha@bookbay.test',
        'john@bookbay.test',
        'ngozi@bookbay.test',
        'kwame@bookbay.test',
        'fatima@bookbay.test',
        'newsletter-fan@example.com',
    ];

    foreach ($subscriberEmails as $email) {
        NewsletterSubscriber::create(['email' => $email]);
    }

    echo "Seeded " . count($subscriberEmails) . " newsletter subscribers.\n";
}

echo "\n=== Test Credentials ===\n";
echo "Super Admin: superadmin@bookbay.test / password\n";
echo "Admin: admin@bookbay.test / password\n";
echo "User: demo@bookbay.test / password\n";
echo "User: aisha@bookbay.test / password\n";
echo "User (suspended): kwame@bookbay.test / password\n";
echo "========================\n\n";

echo "Seeding complete.\n";

function placeholderCover(string $title): string
{
    $text = urlencode($title);
    return "https://placehold.co/600x900/eef2ff/4f46e5?text={$text}";
}
