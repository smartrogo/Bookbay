<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class Role extends Model
{
    protected static string $table = 'roles';

    protected static array $fillable = ['name'];
}
