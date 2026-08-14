<?php

declare(strict_types=1);

namespace BookBay\Models;

final class UserBadge extends Model
{
    protected static string $table = 'user_badges';

    protected static array $fillable = [
        'user_id', 'badge_name', 'badge_icon', 'description',
    ];
}
