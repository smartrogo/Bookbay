<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class BorrowRequest extends Model
{
    protected static string $table = 'borrow_requests';

    protected static array $fillable = ['user_id', 'book_id', 'days', 'status'];
}
