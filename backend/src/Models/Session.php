<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class Session extends Model
{
    protected static string $table = 'sessions';

    protected static array $fillable = ['user_id', 'token', 'expires_at'];
}
