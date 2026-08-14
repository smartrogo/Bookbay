<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Core\Response;
use Bookbay\Core\Validator;
use Bookbay\Models\Book;
use Bookbay\Models\Review;

final class ReviewController extends Controller
{
    public function index(): never
    {
        $bookId = (int) $this->request()->query('book_id', 0);

        $sql = 'SELECT r.*, u.name AS user_name FROM reviews r JOIN users u ON u.id = r.user_id';
        $params = [];

        if ($bookId > 0) {
            $sql .= ' WHERE r.book_id = ?';
            $params[] = $bookId;
        }

        $sql .= ' ORDER BY r.id DESC';

        $this->json(['reviews' => Review::queryAll($sql, $params)]);
    }

    public function store(): never
    {
        $user = $this->requireAuth();
        $data = $this->request()->input();

        Validator::check($data, [
            'book_id' => 'required|integer|min:1',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if (Book::find((int) $data['book_id']) === null) {
            Response::json(['message' => 'Book not found.'], 404);
        }

        $id = Review::create([
            'user_id' => (int) $user['id'],
            'book_id' => (int) $data['book_id'],
            'rating' => (int) $data['rating'],
            'comment' => trim((string) ($data['comment'] ?? '')),
        ]);

        $this->json([
            'success' => true,
            'review' => Review::find((int) $id),
        ], 201);
    }
}
