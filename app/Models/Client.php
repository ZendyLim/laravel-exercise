<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'email',
        'profile_picture'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class);
    }
}
