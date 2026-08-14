<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class ExchangeRequest extends Model
{
    protected static string $table = 'exchange_requests';

    protected static array $fillable = ['user_id', 'offered_book_id', 'wanted_book_id', 'message', 'status'];
}
