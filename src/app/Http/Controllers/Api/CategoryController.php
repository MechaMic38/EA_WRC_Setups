<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Categories\StoreCategoryRequest;
use App\Http\Requests\Categories\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): ResourceCollection
    {
        $categories = Category::query()
            // Filter by name (case-insensitive partial match)
            ->when($request->name, function ($query, $name) {
                $query->where('name', 'like', '%' . $name . '%');
            })
            ->paginate(15);

        return CategoryResource::collection($categories);
    }

    /**
     * Store a newly created resource in storage.
     * TODO: turn into transaction
     */
    public function store(StoreCategoryRequest $request, CategoryService $categoryService)
    {
        $validated = $request->validated();

        // Create a new category record
        $category = new Category();
        $category->name = $validated['name'];

        // Save the category record
        $category->save();

        // Save the uploaded image
        $img = $request->file('img');
        $imgPath = $img->storeAs(
            Category::STORAGE_IMG_PATH,
            $category->id . '.' . $img->extension(),
            'public'
        );

        // Update the category record with the image path
        $category->update([
            'img_path' => $imgPath,
        ]);

        return new CategoryResource($category);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return new CategoryResource($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category, CategoryService $categoryService)
    {
        $data = $request->validated();

        // Check if the user uploaded a new image
        if ($request->hasFile('img')) {
            // Remove the old image
            if ($category->img_path) {
                $this->deleteImage($category->img_path);
            }

            // Save the new image
            $img = $request->file('img');
            $imgPath = $img->storeAs(
                Category::STORAGE_IMG_PATH,
                $category->id . '.' . $img->extension(),
                'public'
            );
            $data['img_path'] = $imgPath;
        }

        // Update the category with the new data
        $category->update($data);

        return new CategoryResource($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category, CategoryService $categoryService)
    {
        // TODO: add gate policy to check if user can delete category

        // Delete the category image if it exists
        if ($category->img_path) {
            $this->deleteImage($category->img_path);
        }

        // Delete the category record
        $category->delete();
    }
}
