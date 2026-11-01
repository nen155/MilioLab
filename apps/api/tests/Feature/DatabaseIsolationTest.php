<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DatabaseIsolationTest extends TestCase
{
    /**
     * Red de seguridad: los tests nunca deben ejecutarse contra la base de datos
     * de desarrollo (RefreshDatabase la vaciaría).
     */
    public function test_tests_run_against_the_test_database(): void
    {
        $this->assertSame('miliolab_test', DB::connection()->getDatabaseName());
    }
}
