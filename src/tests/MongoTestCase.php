<?php

namespace Tests;

use Dotenv\Dotenv;
use RuntimeException;

/** Base class for tests that use MongoDB. Enforce the safety boundary before migrations run. */
abstract class MongoTestCase extends TestCase
{
    protected function setUp(): void
    {
        // PHPUnit starts before Laravel boots, so load the same environment file Laravel
        // will use. PHPUnit's forced DB_DATABASE value remains authoritative.
        $environmentPath = dirname(__DIR__);
        $environmentFile = file_exists($environmentPath.'/.env.testing')
            ? '.env.testing'
            : '.env';

        if (file_exists($environmentPath.'/'.$environmentFile)) {
            Dotenv::createImmutable($environmentPath, $environmentFile)->safeLoad();
        }

        $database = $_ENV['DB_DATABASE'] ?? $_SERVER['DB_DATABASE'] ?? getenv('DB_DATABASE') ?: null;
        $dsn = $_ENV['DB_URI'] ?? $_SERVER['DB_URI'] ?? getenv('DB_URI') ?: null;
        $host = is_string($dsn) ? parse_url($dsn, PHP_URL_HOST) : null;

        if ($database !== 'ea_wrc_setups_test') {
            throw new RuntimeException('Database-backed tests require DB_DATABASE=ea_wrc_setups_test.');
        }

        // 127.0.0.1/localhost are for tests run directly on the host. When tests run
        // inside Docker Compose, use the local service DNS name "mongodb" instead.
        if (! in_array($host, ['127.0.0.1', 'localhost', 'mongodb'], true)) {
            throw new RuntimeException(
                'Database-backed tests only connect to local MongoDB at 127.0.0.1, localhost, or the Compose service mongodb. ' .
                'Do not point tests at MongoDB Atlas or any production database.'
            );
        }

        parent::setUp();
    }
}
