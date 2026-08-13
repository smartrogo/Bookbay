<?php

declare(strict_types=1);

namespace BookBay\Models;

final class Setting extends Model
{
    protected static string $table = 'settings';

    protected static array $fillable = ['key', 'value'];
}
