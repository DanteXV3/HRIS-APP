<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialServiceRequestAttachment extends Model
{
    use HasFactory;

    protected $fillable = ['msr_id', 'file_path', 'file_name'];

    public function msr(): BelongsTo
    {
        return $this->belongsTo(MaterialServiceRequest::class, 'msr_id');
    }
}
