<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class Service
{
    protected function deleteImageFromStorage(string $imgPath): void
    {
        if (Storage::disk('public')->exists($imgPath)) {
            Storage::disk('public')->delete($imgPath);
        }
    }
}
