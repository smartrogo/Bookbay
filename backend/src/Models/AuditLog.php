<?php

declare(strict_types=1);

namespace BookBay\Models;

final class AuditLog extends Model
{
    protected static string $table = 'audit_logs';

    protected static array $fillable = ['user_id', 'action', 'details', 'ip_address'];
}
