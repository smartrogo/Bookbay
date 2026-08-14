<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Core\RateLimiter;
use Bookbay\Core\Validator;
use Bookbay\Models\NewsletterSubscriber;

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
