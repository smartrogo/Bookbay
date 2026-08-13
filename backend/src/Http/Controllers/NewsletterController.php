<?php

declare(strict_types=1);

namespace BookBay\Http\Controllers;

use BookBay\Core\Controller;
use BookBay\Core\RateLimiter;
use BookBay\Core\Validator;
use BookBay\Models\NewsletterSubscriber;

final class NewsletterController extends Controller
{
    public function subscribe(): never
    {
        RateLimiter::check('newsletter', 5, 60);

        $data = $this->request()->input();

        Validator::check($data, ['email' => 'required|email']);

        $email = strtolower(trim((string) $data['email']));

        $existing = NewsletterSubscriber::firstWhere('email', $email);

        if ($existing === null) {
            NewsletterSubscriber::create(['email' => $email]);
        }

        $this->json([
            'success' => true,
            'message' => $existing === null ? 'Subscribed successfully.' : 'Already subscribed.',
        ]);
    }
}
