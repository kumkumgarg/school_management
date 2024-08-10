<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use App\Models\Syllabus;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class SyllabusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $class_id = $request->class_id;
        $subject_id = Subject::where('name', $request->subject)->first()->id;

        // Fetch syllabus data based on class_id and subject
        $syllabus = Syllabus::where('class_id', $class_id)
            ->where('subject_id', $subject_id)
            ->select('chapter_no', 'chapter_name', 'chapter_topic') // Specify columns to select
            ->get();

        // Return response
        return response()->json($syllabus);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required|integer',
            'subject' => 'required|string',
            'chapterTopicList' => 'nullable|json',
            'file' => 'nullable|file|mimes:xlsx,xls,csv'
        ]);

        $class_id = $request->class_id;
        $subject_id = Subject::where('name', $request->subject)->first()->id;

        $filePath = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('excel_files', 'public');

            // Load the Excel file
            $spreadsheet = IOFactory::load(storage_path('app/public/' . $filePath));
            $sheet = $spreadsheet->getActiveSheet();
            $data = $sheet->toArray();

            // Skip the first row (header) and process the rest
            for ($rowIndex = 1; $rowIndex < count($data); $rowIndex++) {
                $row = $data[$rowIndex];

                // Skip empty rows if needed
                if (empty($row[0])) continue;

                Syllabus::create([
                    'class_id' => $class_id,
                    'subject_id' => $subject_id,
                    'chapter_no' => $row[0],
                    'chapter_name' => $row[1],
                    'chapter_topic' => $row[2],
                    'file_path' => $filePath,
                ]);
            }

            // Delete the file after processing
            Storage::disk('public')->delete($filePath);
        }

        // Process JSON data if provided and not empty
        if ($request->has('chapterTopicList') && !empty($request->chapterTopicList)) {
            $chapterTopicList = json_decode($request->chapterTopicList, true);

            foreach ($chapterTopicList as $chapterTopic) {
                Syllabus::create([
                    'class_id' => $class_id,
                    'subject_id' => $subject_id,
                    'chapter_no' => $chapterTopic['number'],
                    'chapter_name' => $chapterTopic['chapter'],
                    'chapter_topic' => $chapterTopic['topic'],
                    'file_path' => $filePath,
                ]);
            }
        }

        return response()->json(['message' => 'Syllabus added successfully']);
    }


    /**
     * Display the specified resource.
     */
    public function show(Syllabus $syllabus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Syllabus $syllabus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Syllabus $syllabus)
    {
        //
    }
}
