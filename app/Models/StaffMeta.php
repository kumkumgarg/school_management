<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffMeta extends Model
{
    use HasFactory;

    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'dob',
        'gender',
        'phone2',
        'profile_pic',
        'permanent_address',
        'residential_address',
        'language',
        'documents',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'documents' => 'object',
            'meta' => 'object',
        ];
    }

    /**
     * Get the user's full name.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
