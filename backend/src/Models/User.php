<?php

declare(strict_types=1);

namespace BookBay\Models;

final class User extends Model
{
    protected static string $table = 'users';

    protected static array $fillable = [
        'name', 'email', 'password', 'phone', 'role_id', 'is_admin', 'is_superadmin', 'status',
    ];
}
