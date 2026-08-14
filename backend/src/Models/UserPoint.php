<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class UserPoint extends Model
{
    protected static string $table = 'user_points';

    protected static array $fillable = [
        'user_id', 'points', 'type', 'description', 'reference_id', 'reference_type',
    ];
}
