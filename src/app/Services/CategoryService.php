<?php

namespace App\Services;

use App\Models\Category;

class CategoryService extends Service
{
    /**
     * Create a new category.
     *
     * @param array $data
     * @param \Illuminate\Http\UploadedFile $img
     * @return \App\Models\Category
     */
    public function createCategory(array $data, $img): Category
    {
        // Create a new category record
        $category = Category::create($data);

        // Save the uploaded image
        $imgPath = $img->storeAs(
            Category::STORAGE_IMG_PATH,
            $category->id . '.' . $img->extension(),
            'public'
        );

        // Update the category record with the image path
        $category->update([
            'img_path' => $imgPath,
        ]);

        return $category;
    }

    /**
     * Update a category.
     *
     * @param \App\Models\Category $category
     * @param array $data
     * @param \Illuminate\Http\UploadedFile|null $img
     * @return \App\Models\Category
     */
    public function updateCategory(Category $category, array $data, $img = null): Category
    {
        // Check if the user uploaded a new image
        if ($img) {
            // Remove the old image
            if ($category->img_path) {
                $this->deleteImageFromStorage($category->img_path);
            }

            // Save the new image
            $imgPath = $img->storeAs(
                Category::STORAGE_IMG_PATH,
                $category->id . '.' . $img->extension(),
                'public'
            );
            $data['img_path'] = $imgPath;
        }

        // Update the category record
        $category->update($data);

        return $category;
    }

    /**
     * Delete a category.
     *
     * @param \App\Models\Category $category
     */
    public function deleteCategory(Category $category): void
    {
        // Remove the image
        if ($category->img_path) {
            $this->deleteImageFromStorage($category->img_path);
        }

        // Delete the category record
        $category->delete();
    }
}
