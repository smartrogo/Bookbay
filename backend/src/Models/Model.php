<?php

declare(strict_types=1);

namespace Bookbay\Models;

use Bookbay\Core\Database;
use PDO;

/**
 * Lightweight base model. Subclasses declare a $table and a $fillable
 * whitelist; queries are prepared statements against the PDO connection.
 */
abstract class Model
{
    protected static string $table = '';
    protected static array $fillable = [];

    public static function db(): PDO
    {
        return Database::connection();
    }

    public static function find(int $id): ?array
    {
        return static::firstWhere('id', $id);
    }

    public static function all(): array
    {
        return static::queryAll('SELECT * FROM ' . static::$table . ' ORDER BY id DESC');
    }

    public static function where(string $column, mixed $value): array
    {
        return static::queryAll(
            'SELECT * FROM ' . static::$table . " WHERE {$column} = ? ORDER BY id DESC",
            [$value]
        );
    }

    public static function firstWhere(string $column, mixed $value): ?array
    {
        $rows = static::where($column, $value);
        return $rows[0] ?? null;
    }

    /**
     * Insert a row (fillable fields only) and return the new id.
     */
    public static function create(array $data): int
    {
        $data = static::filtered($data);

        if ($data === []) {
            throw new \InvalidArgumentException('No fillable fields provided for ' . static::$table);
        }

        $columns = array_keys($data);
        $placeholders = implode(', ', array_fill(0, count($columns), '?'));
        $sql = 'INSERT INTO ' . static::$table
            . ' (' . implode(', ', $columns) . ') VALUES (' . $placeholders . ')';

        static::db()->prepare($sql)->execute(array_values($data));

        return (int) static::db()->lastInsertId();
    }

    public static function update(int $id, array $data): bool
    {
        $data = static::filtered($data);

        if ($data === []) {
            return false;
        }

        $sets = implode(', ', array_map(static fn (string $c): string => "{$c} = ?", array_keys($data)));
        $stmt = static::db()->prepare('UPDATE ' . static::$table . " SET {$sets} WHERE id = ?");

        return $stmt->execute([...array_values($data), $id]);
    }

    public static function delete(int $id): bool
    {
        return static::deleteWhere('id', $id);
    }

    public static function deleteWhere(string $column, mixed $value): bool
    {
        $stmt = static::db()->prepare('DELETE FROM ' . static::$table . " WHERE {$column} = ?");
        return $stmt->execute([$value]);
    }

    public static function queryAll(string $sql, array $params = []): array
    {
        $stmt = static::db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function queryOne(string $sql, array $params = []): ?array
    {
        $stmt = static::db()->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row === false ? null : $row;
    }

    public static function execute(string $sql, array $params = []): int
    {
        $stmt = static::db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    public static function countWhere(string $column, mixed $value): int
    {
        $row = static::queryOne('SELECT COUNT(*) AS total FROM ' . static::$table . " WHERE {$column} = ?", [$value]);
        return (int) ($row['total'] ?? 0);
    }

    private static function filtered(array $data): array
    {
        return array_intersect_key($data, array_flip(static::$fillable));
    }
}
