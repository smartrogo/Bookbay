<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Services\WalletService;

final class WalletController extends Controller
{
    public function show(int $userId): never
    {
        $this->requireOwnership($userId);
        $this->json(WalletService::show($userId));
    }

    public function transactions(int $userId): never
    {
        $this->requireOwnership($userId);
        $type = (string) $this->request()->query('type', '');
        $this->json(WalletService::transactions($userId, $type));
    }

    public function topup(int $userId): never
    {
        $this->requireOwnership($userId);
        $this->json(WalletService::topUp($userId, $this->request()->input()));
    }

    public function transfer(int $userId): never
    {
        $this->requireOwnership($userId);
        $this->json(WalletService::transfer($userId, $this->request()->input()));
    }
}
