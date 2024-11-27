<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class ReviewVote extends Model
{
    protected $fillable = [
        'review_id',
        'user_id',
        'vote_type',
    ];

    public function review()
    {
        return $this->belongsTo(Review::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 