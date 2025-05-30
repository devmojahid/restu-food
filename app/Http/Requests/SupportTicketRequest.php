<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupportTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'message' => 'required|string|max:5000',
            'order_number' => 'nullable|string|max:100',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|max:10240', // 10MB max file size
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter your name',
            'email.required' => 'Please enter your email address',
            'email.email' => 'Please enter a valid email address',
            'subject.required' => 'Please enter a subject for your ticket',
            'category.required' => 'Please select a category for your ticket',
            'priority.required' => 'Please select a priority level',
            'priority.in' => 'Please select a valid priority level',
            'message.required' => 'Please enter your message',
            'attachments.*.max' => 'Attachments must be less than 10MB',
        ];
    }
} 