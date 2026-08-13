<?php

declare(strict_types=1);

namespace BookBay\Models;

final class Category extends Model
{
    protected static string $table = 'categories';

    protected static array $fillable = ['name', 'slug'];
}
