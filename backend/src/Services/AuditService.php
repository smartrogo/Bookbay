<?php

declare(strict_types=1);

namespace BookBay\Services;

use BookBay\Models\AuditLog;

final class AuditService
{
    /**
     * Record an audit trail entry (spec: Audit Logs under Security).
     * Never throws — auditing must not break the request it accompanies.
     */
    public static function log(?int $userId, string $action, array $details = []): void
    {
        try {
            AuditLog::create([
                'user_id' => $userId,
                'action' => $action,
                'details' => json_encode($details, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '{}',
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
            ]);
        } catch (\Throwable) {
            // Best-effort only.
        }
    }
}
