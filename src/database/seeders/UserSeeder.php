<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminName = env('ADMIN_NAME', 'DevAdmin');
        $adminEmail = env('ADMIN_EMAIL', 'devadmin@example.com');
        $adminPassword = env('ADMIN_PASSWORD', 'devpassword');

        // Create default admin user
        $admin = new User();
        $admin->name = $adminName;
        $admin->email = $adminEmail;
        $admin->password = Hash::make($adminPassword);
        $admin->role = 'admin';
        $admin->save();
    }
}
