<?php

declare(strict_types=1);

/**
 * Minimal PSR-4 style autoloader — no Composer required.
 * Maps the BookBay\ namespace to the src/ directory.
 */
spl_autoload_register(static function (string $class): void {
    $prefix = 'BookBay\\';

    if (!str_starts_with($class, $prefix)) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $file = __DIR__ . '/src/' . str_replace('\\', '/', $relative) . '.php';

    if (is_file($file)) {
        require $file;
    }
});
