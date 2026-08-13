<?php

declare(strict_types=1);

namespace BookBay\Http\Controllers;

use BookBay\Core\Controller;
use BookBay\Core\Response;
use BookBay\Core\Validator;
use BookBay\Models\Category;
use BookBay\Services\AuditService;

final class CategoryController extends Controller
{
    public function index(): never
    {
        $this->json(['categories' => Category::queryAll('SELECT * FROM categories ORDER BY name ASC')]);
    }

    public function store(): never
    {
        $user = $this->requireAdmin();
        $data = $this->request()->input();

        Validator::check($data, ['name' => 'required|max:191']);

        $slug = $this->slugify((string) $data['name']);

        if (Category::firstWhere('slug', $slug) !== null) {
            Response::json(['message' => 'A category with this name already exists.'], 409);
        }

        $id = Category::create(['name' => $data['name'], 'slug' => $slug]);

        AuditService::log((int) $user['id'], 'category.create', ['category_id' => $id]);

        $this->json([
            'success' => true,
            'category' => Category::find($id),
        ], 201);
    }

    public function update(int $id): never
    {
        $user = $this->requireAdmin();

        $category = Category::find($id);
        if ($category === null) {
            Response::json(['message' => 'Category not found.'], 404);
        }

        $data = $this->request()->input();

        $clean = [];
        if (isset($data['name'])) {
            $clean['name'] = $data['name'];
            $clean['slug'] = $this->slugify((string) $data['name']);
        }

        Category::update($id, $clean);

        AuditService::log((int) $user['id'], 'category.update', ['category_id' => $id]);

        $this->json(['success' => true, 'category' => Category::find($id)]);
    }

    public function destroy(int $id): never
    {
        $user = $this->requireAdmin();

        $category = Category::find($id);
        if ($category === null) {
            Response::json(['message' => 'Category not found.'], 404);
        }

        Category::delete($id);

        AuditService::log((int) $user['id'], 'category.delete', ['category_id' => $id]);

        $this->json(['success' => true, 'message' => 'Category deleted.']);
    }

    private function slugify(string $name): string
    {
        $slug = strtolower(trim($name));
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? 'category';
        return trim($slug, '-') !== '' ? trim($slug, '-') : 'category';
    }
}
