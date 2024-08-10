<?php

namespace App\Models;

use App\Models\StaffMeta;
use App\Models\Location;
use Illuminate\Support\Str;
use Laravel\Passport\HasApiTokens;
use Kyslik\ColumnSortable\Sortable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, SoftDeletes, Sortable, HasApiTokens;

    public static function booted(){
        static::creating(function (User $user) {
            $user->uuid = random_strings('User', 10);
        });
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'default_location_id',
        'role',
        'email',
        'email_verified_at',
        'phone',
        'phone_verified_at',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The attributes that should be appended to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['full_name'];

    /**
     * Set the name to uppercase.
     *
     * @param  string  $value
     * @return void
     */
    public function setPhoneAttribute($value)
    {
        $this->attributes['phone'] = Str::of($value)->replaceMatches('/[^A-Za-z0-9]++/', '');
    }

    public function staff_meta()
    {
        return $this->hasOne(StaffMeta::class, 'user_id');   // this is foriegn key
    }

   /**
     * Get the user that owns the WaitList
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

     /**
     * Get the user's full name.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        // Assuming you have 'first_name' and 'last_name' columns in your users table
        return $this->first_name . ' ' . $this->last_name;
    }
}
