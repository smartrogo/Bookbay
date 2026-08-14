<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class Conversation extends Model
{
    protected static string $table = 'conversations';

    protected static array $fillable = ['user_a_id', 'user_b_id'];
}
