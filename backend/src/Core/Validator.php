<?php

declare(strict_types=1);

namespace Bookbay\Core;

/**
 * Minimal request validator — the framework's stand-in for Form
 * Requests. Rules are given as "rule:param" strings, e.g.
 * ['email' => 'required|email', 'days' => 'required|integer|min:1'].
 */
final class Validator
{
    /**
     * @return array<string, array<int, string>> field => list of messages
     */
    public static function validate(array $data, array $rules): array
    {
        $errors = [];

        foreach ($rules as $field => $ruleSet) {
            $ruleList = is_array($ruleSet) ? $ruleSet : explode('|', $ruleSet);
            $value = $data[$field] ?? null;

            foreach ($ruleList as $rule) {
                [$name, $param] = array_pad(explode(':', (string) $rule, 2), 2, null);

                switch ($name) {
                    case 'required':
                        if ($value === null || $value === '' || (is_array($value) && $value === [])) {
                            $errors[$field][] = "The {$field} field is required.";
                        }
                        break;

                    case 'email':
                        if ($value !== null && $value !== '' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $errors[$field][] = "The {$field} must be a valid email address.";
                        }
                        break;

                    case 'min':
                        if ($value !== null && $value !== '' && !self::atLeast($value, (int) $param)) {
                            $errors[$field][] = "The {$field} must be at least {$param}.";
                        }
                        break;

                    case 'max':
                        if ($value !== null && $value !== '' && !self::atMost($value, (int) $param)) {
                            $errors[$field][] = "The {$field} must not be more than {$param}.";
                        }
                        break;

                    case 'numeric':
                        if ($value !== null && $value !== '' && !is_numeric($value)) {
                            $errors[$field][] = "The {$field} must be a number.";
                        }
                        break;

                    case 'integer':
                        if ($value !== null && $value !== '' && filter_var($value, FILTER_VALIDATE_INT) === false) {
                            $errors[$field][] = "The {$field} must be an integer.";
                        }
                        break;

                    case 'in':
                        $allowed = explode(',', (string) $param);
                        if ($value !== null && $value !== '' && !in_array((string) $value, $allowed, true)) {
                            $errors[$field][] = "The {$field} must be one of: {$param}.";
                        }
                        break;
                }
            }
        }

        return $errors;
    }

    /**
     * min/max compare numbers numerically and strings by length.
     */
    private static function atLeast(mixed $value, int $min): bool
    {
        return is_numeric($value) ? (float) $value >= $min : strlen((string) $value) >= $min;
    }

    private static function atMost(mixed $value, int $max): bool
    {
        return is_numeric($value) ? (float) $value <= $max : strlen((string) $value) <= $max;
    }

    /**
     * Respond 422 with the validation errors.
     */
    public static function fail(array $errors): never
    {
        Response::json([
            'message' => 'The given data was invalid.',
            'errors' => $errors,
        ], 422);
    }

    /**
     * Validate and bail out on the first field error.
     */
    public static function check(array $data, array $rules): void
    {
        $errors = self::validate($data, $rules);

        if ($errors !== []) {
            self::fail($errors);
        }
    }
}
