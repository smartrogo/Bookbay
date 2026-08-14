<?php

declare(strict_types=1);

namespace Bookbay\Http\Controllers;

use Bookbay\Core\Controller;
use Bookbay\Core\Response;
use Bookbay\Core\Validator;
use Bookbay\Models\Post;
use Bookbay\Services\AuditService;

final class PostController extends Controller
{
    public function index(): never
    {
        $status = (string) $this->request()->query('status', '');

        $sql = 'SELECT p.*, u.name AS author_name FROM posts p JOIN users u ON u.id = p.user_id';
        $params = [];

        if ($status !== '') {
            $sql .= ' WHERE p.status = ?';
            $params[] = $status;
        }

        $sql .= ' ORDER BY p.id DESC';

        $this->json(['posts' => Post::queryAll($sql, $params)]);
    }

    public function show(int $id): never
    {
        $post = Post::queryOne(
            'SELECT p.*, u.name AS author_name FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?',
            [$id]
        );

        if ($post === null) {
            Response::json(['message' => 'Post not found.'], 404);
        }

        $this->json(['post' => $post]);
    }

    public function store(): never
    {
        $user = $this->requireAdmin();
        $data = $this->request()->input();

        Validator::check($data, [
            'title' => 'required|max:191',
            'body' => 'required',
        ]);

        $slug = $this->slugify((string) ($data['slug'] ?? $data['title']));

        $id = Post::create([
            'user_id' => (int) $user['id'],
            'title' => $data['title'],
            'slug' => $slug,
            'excerpt' => (string) ($data['excerpt'] ?? ''),
            'body' => $data['body'],
            'cover' => (string) ($data['cover'] ?? ''),
            'status' => (string) ($data['status'] ?? 'published'),
        ]);

        AuditService::log((int) $user['id'], 'post.create', ['post_id' => $id]);

        $this->json(['success' => true, 'post' => Post::find((int) $id)], 201);
    }

    public function update(int $id): never
    {
        $user = $this->requireAdmin();
        $data = $this->request()->input();

        if (Post::find($id) === null) {
            Response::json(['message' => 'Post not found.'], 404);
        }

        $clean = [];

        foreach (['title', 'excerpt', 'body', 'cover', 'status'] as $field) {
            if (isset($data[$field])) {
                $clean[$field] = $data[$field];
            }
        }

        if (isset($data['slug']) || isset($data['title'])) {
            $clean['slug'] = $this->slugify((string) ($data['slug'] ?? $data['title']));
        }

        Post::update($id, $clean);

        AuditService::log((int) $user['id'], 'post.update', ['post_id' => $id]);

        $this->json(['success' => true, 'post' => Post::find($id)]);
    }

    public function destroy(int $id): never
    {
        $user = $this->requireAdmin();

        if (Post::find($id) === null) {
            Response::json(['message' => 'Post not found.'], 404);
        }

        Post::delete($id);

        AuditService::log((int) $user['id'], 'post.delete', ['post_id' => $id]);

        $this->json(['success' => true, 'message' => 'Post deleted.']);
    }

    private function slugify(string $title): string
    {
        $slug = strtolower(trim($title));
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? 'post';
        return trim($slug, '-') !== '' ? trim($slug, '-') : 'post';
    }
}
