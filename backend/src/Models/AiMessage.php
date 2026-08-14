<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class AiMessage extends Model
{
    protected static string $table = 'ai_messages';

    protected static array $fillable = [
        'conversation_id', 'role', 'content', 'tokens_used',
    ];
}
