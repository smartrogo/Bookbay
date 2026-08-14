<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class Notification extends Model
{
    protected static string $table = 'notifications';

    protected static array $fillable = ['user_id', 'title', 'body', 'is_read'];
}
