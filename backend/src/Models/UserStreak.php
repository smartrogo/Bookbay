<?php

declare(strict_types=1);

namespace BookBay\Models;

final class UserStreak extends Model
{
    protected static string $table = 'user_streaks';

    protected static array $fillable = [
        'user_id', 'current_streak', 'longest_streak', 'last_activity_date',
    ];
}
