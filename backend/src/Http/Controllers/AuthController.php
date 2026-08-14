<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Core\RateLimiter;
use Bookbay\Core\Response;
use Bookbay\Core\Validator;
use Bookbay\Services\AuthService;
use Bookbay\Services\AuditService;

final class AuthController extends Controller
{
    public function register(): never
    {
        RateLimiter::check('register', 10, 60);

        $data = $this->request()->input();

        Validator::check($data, [
            'name' => 'max:191',
            'email' => 'required|email',
            'password' => 'required|min:6',
            'phone' => 'max:50',
        ]);

        $result = AuthService::register($data);
        AuthService::attachCookie($result['token']);

        AuditService::log((int) $result['user']['id'], 'auth.register');

        $this->json($result, 201);
    }

    public function login(): never
    {
        RateLimiter::check('login', 10, 60);

        $data = $this->request()->input();

        Validator::check($data, [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $result = AuthService::login($data);
        AuthService::attachCookie($result['token']);

        AuditService::log((int) $result['user']['id'], 'auth.login');

        $this->json($result);
    }

    public function logout(): never
    {
        AuthService::logout();
        $this->json(['success' => true, 'message' => 'Logged out.']);
    }

    public function me(): never
    {
        $user = $this->user();

        if ($user === null) {
            Response::json(['message' => 'Unauthenticated.'], 401);
        }

        $this->json(['user' => $user]);
    }
}
