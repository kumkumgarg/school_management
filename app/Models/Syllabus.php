<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Syllabus extends Model
{
    use HasFactory;

    protected $table = 'syllabus';

    protected $fillable = [
        'class_id',
        'subject_id',
        'chapter_no',
        'chapter_name',
        'chapter_topic',
    ];
}
