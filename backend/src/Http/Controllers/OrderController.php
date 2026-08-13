<?php

declare(strict_types=1);

namespace BookBay\Http\Controllers;

use BookBay\Core\Controller;
use BookBay\Services\AuditService;
use BookBay\Services\OrderService;

final class OrderController extends Controller
{
    public function store(): never
    {
        $user = $this->requireAuth();

        $order = OrderService::placeFromCart((int) $user['id']);

        AuditService::log((int) $user['id'], 'order.placed', ['order_id' => $order['order_id']]);

        $this->json($order, 201);
    }

    public function index(): never
    {
        $user = $this->requireAuth();
        $status = (string) $this->request()->query('status', '');

        $this->json(['orders' => OrderService::forUser((int) $user['id'], $status)]);
    }
}
