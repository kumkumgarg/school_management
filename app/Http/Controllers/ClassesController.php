<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClassesController extends Controller
{
    public function index(Request $request)
    {
        if ($request->id === null) {
            $classes = Classes::paginate(10);
        } else {
            $classes = Classes::with('subjects')->where('id', $request->id)->first();

            // Ensure subjects is an empty array if no subjects are associated
            if ($classes) {
                $classes['subjectIds'] = $classes->subjects->pluck('id')->toArray();
            }
            unset($classes['subjects']);
        }

        return response()->json($classes, 200);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'class_category_id' => 'required|integer',
            'subjects' => 'required|array',
            'subjects.*' => 'required|string|exists:subjects,name',
        ]);

        DB::transaction(function () use ($request) {
            $class = Classes::create($request->only(['name', 'class_category_id']));
            $subjectIds = Subject::whereIn('name', $request->subjects)->pluck('id');
            $class->subjects()->sync($subjectIds);
        });

        return response()->json(['message' => 'Class created successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'class_category_id' => 'required|integer',
            'subjectIds' => 'required|array',
            'subjectIds.*' => 'required|integer|exists:subjects,id',
        ]);

        $class = Classes::findOrFail($id);

        DB::transaction(function () use ($request, $class) {
            // Update class details
            $class->update($request->only(['name', 'class_category_id']));

            // Sync subjects using subject IDs
            $class->subjects()->sync($request->subjectIds);
        });

        return response()->json(['message' => 'Class updated successfully'], 200);
    }

}
