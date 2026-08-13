<?php

declare(strict_types=1);

namespace BookBay\Services;

use BookBay\Core\Request;
use BookBay\Core\Response;
use BookBay\Models\Session;
use BookBay\Models\User;
use BookBay\Models\Wallet;

final class AuthService
{
    public const SESSION_COOKIE = 'bookbay_session';
    public const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days

    /**
     * @return array{user: array, token: string, message: string}
     */
    public static function register(array $data): array
    {
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');
        $name = trim((string) ($data['name'] ?? ''));
        $phone = trim((string) ($data['phone'] ?? ''));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::json(['message' => 'A valid email address is required.'], 422);
        }

        if (strlen($password) < 6) {
            Response::json(['message' => 'Password must be at least 6 characters.'], 422);
        }

        if (User::firstWhere('email', $email) !== null) {
            Response::json(['message' => 'Email is already registered.'], 409);
        }

        $userId = User::create([
            'name' => $name !== '' ? $name : explode('@', $email)[0],
            'email' => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'phone' => $phone,
            'role_id' => 2,
            'is_admin' => 0,
            'status' => 'active',
        ]);

        Wallet::ensureForUser($userId);

        $user = User::find($userId) ?? [];
        $token = self::issueToken($userId);

        return [
            'user' => self::publicUser($user),
            'token' => $token,
            'message' => 'Registration successful.',
        ];
    }

    /**
     * @return array{user: array, token: string, message: string}
     */
    public static function login(array $data): array
    {
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        $user = User::firstWhere('email', $email);

        if ($user === null || !password_verify($password, (string) $user['password'])) {
            Response::json(['message' => 'Invalid email or password.'], 401);
        }

        if (($user['status'] ?? 'active') !== 'active') {
            Response::json(['message' => 'This account has been suspended.'], 403);
        }

        $token = self::issueToken((int) $user['id']);

        return [
            'user' => self::publicUser($user),
            'token' => $token,
            'message' => 'Login successful.',
        ];
    }

    public static function logout(): void
    {
        $request = Request::capture();
        $token = $request->bearerToken() ?? $request->cookie(self::SESSION_COOKIE);

        if ($token !== null) {
            Session::deleteWhere('token', $token);
        }

        self::expireCookie();
    }

    public static function currentUser(): ?array
    {
        $request = Request::capture();
        $token = $request->bearerToken() ?? $request->cookie(self::SESSION_COOKIE);

        if ($token === null || $token === '') {
            return null;
        }

        $session = Session::firstWhere('token', $token);

        if ($session === null || strtotime((string) $session['expires_at']) < time()) {
            return null;
        }

        $user = User::find((int) $session['user_id']);

        if ($user === null || ($user['status'] ?? 'active') !== 'active') {
            return null;
        }

        return self::publicUser($user);
    }

    public static function isAdmin(array $user): bool
    {
        return ($user['is_admin'] ?? false) === true || ($user['role'] ?? '') === 'admin';
    }

    public static function issueToken(int $userId): string
    {
        $token = bin2hex(random_bytes(32));

        Session::create([
            'user_id' => $userId,
            'token' => $token,
            'expires_at' => date('Y-m-d H:i:s', time() + self::SESSION_TTL),
        ]);

        return $token;
    }

    public static function attachCookie(string $token): void
    {
        setcookie(self::SESSION_COOKIE, $token, [
            'expires' => time() + self::SESSION_TTL,
            'path' => '/',
            // SameSite=None + Secure is required for the cookie to travel
            // cross-origin from the Vite dev server (http://localhost:5173).
            // Browsers treat http://localhost as a secure context, so this
            // works in local dev too.
            'secure' => true,
            'httponly' => true,
            'samesite' => 'None',
        ]);
    }

    public static function expireCookie(): void
    {
        setcookie(self::SESSION_COOKIE, '', [
            'expires' => time() - 3600,
            'path' => '/',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'None',
        ]);
    }

    /**
     * The user payload the frontend understands:
     * id, email, name, phone, role, role_id, is_admin, status.
     */
    public static function publicUser(array $user): array
    {
        return [
            'id' => (int) $user['id'],
            'email' => (string) $user['email'],
            'name' => (string) $user['name'],
            'phone' => (string) ($user['phone'] ?? ''),
            'role' => self::roleName((int) ($user['role_id'] ?? 2)),
            'role_id' => (int) ($user['role_id'] ?? 2),
            'is_admin' => ((int) ($user['is_admin'] ?? 0)) === 1,
            'status' => (string) ($user['status'] ?? 'active'),
        ];
    }

    public static function roleName(int $roleId): string
    {
        return $roleId === 1 ? 'admin' : 'user';
    }
}
