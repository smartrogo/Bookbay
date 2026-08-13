<?php

declare(strict_types=1);

namespace BookBay\Http\Controllers;

use BookBay\Core\Controller;
use BookBay\Services\AuditService;
use BookBay\Services\PaymentService;

final class PaymentController extends Controller
{
    public function start(int $userId): never
    {
        $this->requireOwnership($userId);

        $result = PaymentService::start($userId, $this->request()->input());

        AuditService::log($userId, 'payment.start', ['reference' => $result['reference'] ?? null]);

        $this->json($result);
    }

    public function verify(int $userId): never
    {
        $this->requireOwnership($userId);

        $result = PaymentService::verify($userId, $this->request()->input());

        AuditService::log($userId, 'payment.verify', ['reference' => $result['reference'] ?? null]);

        $this->json($result);
    }
}
