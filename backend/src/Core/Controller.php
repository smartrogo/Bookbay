<?php

declare(strict_types=1);

namespace BookBay\Core;

use BookBay\Services\AuthService;

abstract class Controller
{
    protected function json(mixed $data, int $status = 200): never
    {
        Response::json($data, $status);
    }

    protected function request(): Request
    {
        return Request::capture();
    }

    protected function user(): ?array
    {
        return AuthService::currentUser();
    }

    /**
     * @return array<string, mixed> The authenticated user payload.
     */
    protected function requireAuth(): array
    {
        $user = AuthService::currentUser();

        if ($user === null) {
            Response::json(['message' => 'Unauthenticated.'], 401);
        }

        return $user;
    }

    /**
     * @return array<string, mixed> The authenticated admin user payload.
     */
    protected function requireAdmin(): array
    {
        $user = $this->requireAuth();

        if (!AuthService::isAdmin($user)) {
            Response::json(['message' => 'Forbidden.'], 403);
        }

        return $user;
    }

    /**
     * Require that the authenticated user owns the given resource id
     * (admins may always proceed). Returns the authenticated user.
     *
     * @return array<string, mixed>
     */
    protected function requireOwnership(int $ownerId): array
    {
        $user = $this->requireAuth();

        if ((int) $user['id'] !== $ownerId && !AuthService::isAdmin($user)) {
            Response::json(['message' => 'Forbidden.'], 403);
        }

        return $user;
    }

    /**
     * Require that the authenticated user is a superadmin.
     * Returns the authenticated user payload.
     *
     * @return array<string, mixed> The authenticated superadmin user payload.
     */
    protected function requireSuperAdmin(): array
    {
        $user = $this->requireAuth();

        if (!AuthService::isSuperAdmin($user)) {
            Response::json(['message' => 'Forbidden. Superadmin access required.'], 403);
        }

        return $user;
    }
}
