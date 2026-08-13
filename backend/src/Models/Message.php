<?php

declare(strict_types=1);

namespace BookBay\Models;

final class Message extends Model
{
    protected static string $table = 'messages';

    protected static array $fillable = ['conversation_id', 'sender_id', 'body', 'is_read'];
}
