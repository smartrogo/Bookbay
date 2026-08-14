<?php

declare(strict_types=1);

namespace BookBay\Http\Controllers;

use BookBay\Core\Controller;
use BookBay\Core\Response;
use BookBay\Core\Validator;
use BookBay\Models\Setting;
use BookBay\Services\AuditService;

final class SettingsController extends Controller
{
    /**
     * GET /admin/settings
     * List all site settings. Admin can read, only superadmin can modify.
     */
    public function index(): never
    {
        $this->requireAdmin();

        $settings = Setting::queryAll('SELECT * FROM settings ORDER BY key ASC');

        $this->json(['settings' => $settings]);
    }

    /**
     * GET /admin/settings/{key}
     * Get a single setting by key.
     */
    public function show(string $key): never
    {
        $this->requireAdmin();

        $setting = Setting::firstWhere('key', $key);

        if ($setting === null) {
            Response::json(['message' => 'Setting not found.'], 404);
        }

        $this->json(['setting' => $setting]);
    }

    /**
     * PUT /admin/settings/{key}
     * Create or update a setting. Superadmin only.
     */
    public function update(string $key): never
    {
        $admin = $this->requireSuperAdmin();

        $data = $this->request()->input();

        Validator::check($data, ['value' => 'required']);

        $existing = Setting::firstWhere('key', $key);

        if ($existing !== null) {
            Setting::update((int) $existing['id'], ['value' => $data['value']]);
        } else {
            Setting::create(['key' => $key, 'value' => $data['value']]);
        }

        AuditService::log((int) $admin['id'], 'admin.setting.update', ['key' => $key]);

        $this->json(['success' => true, 'setting' => Setting::firstWhere('key', $key)]);
    }

    /**
     * DELETE /admin/settings/{key}
     * Delete a setting. Superadmin only.
     */
    public function destroy(string $key): never
    {
        $admin = $this->requireSuperAdmin();

        $setting = Setting::firstWhere('key', $key);

        if ($setting === null) {
            Response::json(['message' => 'Setting not found.'], 404);
        }

        Setting::delete((int) $setting['id']);

        AuditService::log((int) $admin['id'], 'admin.setting.delete', ['key' => $key]);

        $this->json(['success' => true, 'message' => 'Setting deleted.']);
    }

    // ── Import / Export ─────────────────────────────────────────────

    /**
     * GET /admin/settings/export
     * Export all settings as a JSON file download. Admin can export.
     */
    public function export(): never
    {
        $admin = $this->requireAdmin();

        $settings = Setting::queryAll('SELECT key, value FROM settings ORDER BY key ASC');

        $export = [
            'exported_at' => date('c'),
            'exported_by' => (string) $admin['email'],
            'version' => '1.0',
            'settings' => $settings,
        ];

        AuditService::log((int) $admin['id'], 'admin.settings.export', ['count' => count($settings)]);

        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="bookbay-settings-' . date('Y-m-d-His') . '.json"');
        echo json_encode($export, JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * POST /admin/settings/import
     * Import settings from uploaded JSON. Superadmin only.
     * Accepts JSON body with a "settings" array of {key, value} objects.
     * If "overwrite" is true, existing settings are replaced.
     */
    public function import(): never
    {
        $admin = $this->requireSuperAdmin();

        $data = $this->request()->input();

        if (!isset($data['settings']) || !is_array($data['settings'])) {
            Response::json(['message' => 'Invalid import format. Expected { settings: [{key, value}, ...] }.'], 422);
        }

        $overwrite = ($data['overwrite'] ?? false) === true;
        $imported = 0;
        $skipped = 0;
        $errors = [];

        foreach ($data['settings'] as $item) {
            $key = (string) ($item['key'] ?? '');
            $value = (string) ($item['value'] ?? '');

            if ($key === '') {
                $skipped++;
                continue;
            }

            $existing = Setting::firstWhere('key', $key);

            if ($existing !== null) {
                if ($overwrite) {
                    Setting::update((int) $existing['id'], ['value' => $value]);
                    $imported++;
                } else {
                    $skipped++;
                }
            } else {
                Setting::create(['key' => $key, 'value' => $value]);
                $imported++;
            }
        }

        AuditService::log((int) $admin['id'], 'admin.settings.import', [
            'imported' => $imported,
            'skipped' => $skipped,
            'overwrite' => $overwrite,
        ]);

        $this->json([
            'success' => true,
            'imported' => $imported,
            'skipped' => $skipped,
            'message' => "Imported {$imported} setting(s), skipped {$skipped}.",
        ]);
    }
}
