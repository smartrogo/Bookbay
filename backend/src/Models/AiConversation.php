<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class AiConversation extends Model
{
    protected static string $table = 'ai_conversations';

    protected static array $fillable = [
        'user_id', 'title',
    ];
}
