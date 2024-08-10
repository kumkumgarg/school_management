<?php

namespace App\Http\Controllers;

use App\Models\ClassCategory;
use Illuminate\Http\Request;

class ClassCategoryController extends Controller
{
    public function index(Request $request, $id = null)
    {
        if ($id === null) {
            $categories = ClassCategory::all();
            return response()->json($categories, 200);
        } else {
            $category = ClassCategory::find($id);
            if ($category) {
                return response()->json($category, 200);
            } else {
                return response()->json(['message' => 'Category not found'], 404);
            }
        }
    }
}
