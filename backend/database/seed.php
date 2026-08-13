<?php

declare(strict_types=1);

/**
 * BookBay database seeder.
 *
 * Idempotent — safe to run repeatedly. Seeds roles, an admin and demo
 * user, the category tree the frontend understands, demo books, and a
 * couple of site settings.
 *
 * Usage: php database/seed.php
 */

use BookBay\Core\Config;
use BookBay\Models\Book;
use BookBay\Models\Category;
use BookBay\Models\Role;
use BookBay\Models\Setting;
use BookBay\Models\User;
use BookBay\Models\Wallet;

require __DIR__ . '/../autoload.php';

Config::load(__DIR__ . '/../.env');

require __DIR__ . '/migrate.php';

// --- Roles -------------------------------------------------------------

if (Role::all() === []) {
    foreach (['admin', 'user'] as $name) {
        Role::create(['name' => $name]);
    }
    echo "Seeded roles: admin, user.\n";
}

// --- Users -------------------------------------------------------------

$admin = User::firstWhere('email', 'admin@bookbay.test');

if ($admin === null) {
    $adminId = User::create([
        'name' => 'BookBay Admin',
        'email' => 'admin@bookbay.test',
        'password' => password_hash('password', PASSWORD_DEFAULT),
        'phone' => '+2348000000000',
        'role_id' => 1,
        'is_admin' => 1,
        'status' => 'active',
    ]);
    Wallet::ensureForUser($adminId);
    echo "Seeded admin user (admin@bookbay.test / password).\n";
}

$demo = User::firstWhere('email', 'demo@bookbay.test');

if ($demo === null) {
    $demoId = User::create([
        'name' => 'Demo User',
        'email' => 'demo@bookbay.test',
        'password' => password_hash('password', PASSWORD_DEFAULT),
        'phone' => '+2348111111111',
        'role_id' => 2,
        'is_admin' => 0,
        'status' => 'active',
    ]);
    Wallet::ensureForUser($demoId);
    echo "Seeded demo user (demo@bookbay.test / password).\n";
}

$sellerId = (int) (User::firstWhere('email', 'admin@bookbay.test')['id'] ?? 1);

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
        'description' => "A curated {$title} title from BookBay.",
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

if (Setting::firstWhere('key', 'site_name') === null) {
    Setting::create(['key' => 'site_name', 'value' => 'BookBay']);
}

echo "Seeding complete.\n";

function placeholderCover(string $title): string
{
    $text = urlencode($title);
    return "https://placehold.co/600x900/eef2ff/4f46e5?text={$text}";
}
