<?php

declare(strict_types=1);

namespace Bookbay\Models;

final class NewsletterSubscriber extends Model
{
    protected static string $table = 'newsletter_subscribers';

    protected static array $fillable = ['email'];
}
