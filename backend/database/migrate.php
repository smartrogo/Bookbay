<?php

declare(strict_types=1);

/**
 * BookBay schema migration.
 *
 * Creates every core table from the backend spec. Runs against both
 * MySQL (DB_DRIVER=mysql, default) and SQLite (DB_DRIVER=sqlite, used
 * for local smoke tests). Idempotent — safe to run repeatedly.
 *
 * Usage: php database/migrate.php
 */

use BookBay\Core\Config;
use BookBay\Core\Database;

require __DIR__ . '/../autoload.php';

Config::load(__DIR__ . '/../.env');

$driver = Config::get('DB_DRIVER', 'mysql') === 'sqlite' ? 'sqlite' : 'mysql';

if ($driver === 'mysql' && !extension_loaded('pdo_mysql')) {
    fwrite(STDERR, "pdo_mysql is not loaded. Set DB_DRIVER=sqlite in .env to use the SQLite fallback.\n");
    exit(1);
}

if ($driver === 'mysql') {
    Database::createDatabase();
    Database::reset();
}

$db = Database::connection();

/**
 * Table definitions.
 *
 * Column spec: ['string', n], ['text'], ['int'], ['decimal', p, s],
 * ['boolean'], ['datetime'] (nullable). A unique key is added for every
 * entry in `unique`; every other non-id column gets a plain index.
 */
$tables = [
    'roles' => [
        'columns' => ['name' => ['string', 50]],
        'unique' => ['name'],
    ],

    'users' => [
        'columns' => [
            'name' => ['string', 191],
            'email' => ['string', 191],
            'password' => ['string', 191],
            'phone' => ['string', 50],
            'role_id' => ['int'],
            'is_admin' => ['boolean'],
            'is_superadmin' => ['boolean'],
            'status' => ['string', 20],
        ],
        'unique' => ['email'],
    ],

    'categories' => [
        'columns' => [
            'name' => ['string', 191],
            'slug' => ['string', 191],
        ],
        'unique' => ['slug'],
    ],

    'books' => [
        'columns' => [
            'seller_id' => ['int'],
            'title' => ['string', 191],
            'author' => ['string', 191],
            'category_id' => ['int'],
            'description' => ['text'],
            'cover' => ['text'],
            'cover_pic' => ['text'],
            'price_buy' => ['decimal', 10, 2],
            'price_borrow' => ['decimal', 10, 2],
            'stock' => ['int'],
            'year' => ['string', 10],
            'release_date' => ['string', 10],
            'status' => ['string', 20],
        ],
    ],

    'cart_items' => [
        'columns' => [
            'user_id' => ['int'],
            'book_id' => ['int'],
            'quantity' => ['int'],
        ],
    ],

    'payments' => [
        'columns' => [
            'user_id' => ['int'],
            'reference' => ['string', 64],
            'amount' => ['decimal', 10, 2],
            'status' => ['string', 20],
        ],
        'unique' => ['reference'],
    ],

    'orders' => [
        'columns' => [
            'user_id' => ['int'],
            'total' => ['decimal', 10, 2],
            'status' => ['string', 20],
            'reference' => ['string', 64],
        ],
    ],

    'order_items' => [
        'columns' => [
            'order_id' => ['int'],
            'book_id' => ['int'],
            'title' => ['string', 191],
            'price' => ['decimal', 10, 2],
            'quantity' => ['int'],
        ],
    ],

    'borrow_requests' => [
        'columns' => [
            'user_id' => ['int'],
            'book_id' => ['int'],
            'days' => ['int'],
            'status' => ['string', 20],
        ],
    ],

    'exchange_requests' => [
        'columns' => [
            'user_id' => ['int'],
            'offered_book_id' => ['int'],
            'wanted_book_id' => ['int'],
            'message' => ['text'],
            'status' => ['string', 20],
        ],
    ],

    'reviews' => [
        'columns' => [
            'user_id' => ['int'],
            'book_id' => ['int'],
            'rating' => ['int'],
            'comment' => ['text'],
        ],
    ],

    'wishlists' => [
        'columns' => [
            'user_id' => ['int'],
            'book_id' => ['int'],
        ],
    ],

    'wallets' => [
        'columns' => [
            'user_id' => ['int'],
            'balance' => ['decimal', 10, 2],
        ],
    ],

    'transactions' => [
        'columns' => [
            'wallet_id' => ['int'],
            'type' => ['string', 30],
            'amount' => ['decimal', 10, 2],
            'description' => ['string', 191],
        ],
    ],

    'notifications' => [
        'columns' => [
            'user_id' => ['int'],
            'title' => ['string', 191],
            'body' => ['text'],
            'is_read' => ['boolean'],
        ],
    ],

    'conversations' => [
        'columns' => [
            'user_a_id' => ['int'],
            'user_b_id' => ['int'],
        ],
    ],

    'messages' => [
        'columns' => [
            'conversation_id' => ['int'],
            'sender_id' => ['int'],
            'body' => ['text'],
            'is_read' => ['boolean'],
        ],
    ],

    'sessions' => [
        'columns' => [
            'user_id' => ['int'],
            'token' => ['string', 64],
            'expires_at' => ['datetime'],
        ],
        'unique' => ['token'],
    ],

    'newsletter_subscribers' => [
        'columns' => [
            'email' => ['string', 191],
        ],
        'unique' => ['email'],
    ],

    'posts' => [
        'columns' => [
            'user_id' => ['int'],
            'title' => ['string', 191],
            'slug' => ['string', 191],
            'excerpt' => ['text'],
            'body' => ['text'],
            'cover' => ['text'],
            'status' => ['string', 20],
        ],
        'unique' => ['slug'],
    ],

    'settings' => [
        'columns' => [
            'key' => ['string', 100],
            'value' => ['text'],
        ],
        'unique' => ['key'],
    ],

    'audit_logs' => [
        'columns' => [
            'user_id' => ['int'],
            'action' => ['string', 100],
            'details' => ['text'],
            'ip_address' => ['string', 45],
        ],
    ],

    'user_activities' => [
        'columns' => [
            'user_id' => ['int'],
            'book_id' => ['int'],
            'activity_type' => ['string', 50],
            'metadata' => ['text'],
        ],
    ],
];

$created = 0;

foreach ($tables as $table => $definition) {
    $created += createTable($db, $driver, $table, $definition['columns']);
    createIndexes($db, $driver, $table, array_keys($definition['columns']), $definition['unique'] ?? []);
}

$driverLabel = $driver === 'sqlite' ? 'SQLite' : 'MySQL';
echo "Migrated BookBay schema ({$driverLabel}): {$created} table(s) created.\n";

function createTable(PDO $db, string $driver, string $table, array $columns): int
{
    $exists = $db->query(
        "SELECT COUNT(*) AS c FROM sqlite_master WHERE type = 'table' AND name = '" . $table . "'"
    )->fetch()['c'] ?? 0;

    if ((int) $exists > 0) {
        return 0;
    }

    $defs = [idColumn($driver)];

    foreach ($columns as $column => $type) {
        $defs[] = columnDef($driver, $column, $type);
    }

    $defs[] = timestampDef($driver, 'created_at');
    $defs[] = timestampDef($driver, 'updated_at');

    $db->exec('CREATE TABLE ' . $table . ' (' . implode(', ', $defs) . ')');

    return 1;
}

function createIndexes(PDO $db, string $driver, string $table, array $columns, array $unique): void
{
    foreach ($columns as $column) {
        $isUnique = in_array($column, $unique, true);
        $name = ($isUnique ? 'uq_' : 'idx_') . $table . '_' . $column;

        if (indexExists($db, $driver, $name)) {
            continue;
        }

        $sql = ($isUnique ? 'CREATE UNIQUE INDEX ' : 'CREATE INDEX ') . $name . ' ON ' . $table . ' (' . $column . ')';

        if ($driver === 'sqlite') {
            $sql = str_replace('CREATE INDEX ', 'CREATE INDEX IF NOT EXISTS ', $sql);
            $sql = str_replace('CREATE UNIQUE INDEX ', 'CREATE UNIQUE INDEX IF NOT EXISTS ', $sql);
        }

        $db->exec($sql);
    }
}

function indexExists(PDO $db, string $driver, string $name): bool
{
    if ($driver === 'sqlite') {
        $row = $db->query("SELECT COUNT(*) AS c FROM sqlite_master WHERE type = 'index' AND name = '" . $name . "'")->fetch();
        return (int) ($row['c'] ?? 0) > 0;
    }

    $stmt = $db->prepare(
        'SELECT COUNT(*) AS c FROM information_schema.statistics
         WHERE table_schema = DATABASE() AND index_name = ?'
    );
    $stmt->execute([$name]);

    return (int) ($stmt->fetch()['c'] ?? 0) > 0;
}

function idColumn(string $driver): string
{
    return $driver === 'sqlite'
        ? 'id INTEGER PRIMARY KEY AUTOINCREMENT'
        : 'id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY';
}

function columnDef(string $driver, string $column, array $type): string
{
    [$kind] = $type;

    switch ($kind) {
        case 'string':
            $length = (int) ($type[1] ?? 191);
            return $column . ' ' . ($driver === 'sqlite' ? "VARCHAR({$length})" : "VARCHAR({$length})") . " NOT NULL DEFAULT ''";

        case 'text':
            return $column . " TEXT NOT NULL DEFAULT ''";

        case 'int':
            return $driver === 'sqlite'
                ? "{$column} INTEGER NOT NULL DEFAULT 0"
                : "{$column} INT NOT NULL DEFAULT 0";

        case 'decimal':
            $precision = (int) ($type[1] ?? 10);
            $scale = (int) ($type[2] ?? 2);
            return $driver === 'sqlite'
                ? "{$column} REAL NOT NULL DEFAULT 0"
                : "{$column} DECIMAL({$precision},{$scale}) NOT NULL DEFAULT 0";

        case 'boolean':
            return $driver === 'sqlite'
                ? "{$column} INTEGER NOT NULL DEFAULT 0"
                : "{$column} TINYINT(1) NOT NULL DEFAULT 0";

        case 'datetime':
            return "{$column} DATETIME NULL";
    }

    throw new RuntimeException("Unknown column type: {$kind}");
}

function timestampDef(string $driver, string $column): string
{
    return $driver === 'sqlite'
        ? "{$column} DATETIME DEFAULT CURRENT_TIMESTAMP"
        : "{$column} TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
}
