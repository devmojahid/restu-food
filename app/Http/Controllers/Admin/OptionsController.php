<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\OptionsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

final class OptionsController extends Controller
{
    public function __construct(
        private readonly OptionsService $optionsService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $group = $request->get('group', 'general');
        $options = $this->optionsService->getGroup($group);
        
        return response()->json($options);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'options' => ['required', 'array'],
            'options.*.key' => ['required', 'string'],
            'options.*.value' => ['required'],
            'group' => ['sometimes', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $group = $request->get('group', 'general');
        $options = collect($request->input('options'))
            ->mapWithKeys(fn ($item) => [$item['key'] => $item['value']])
            ->toArray();

        $this->optionsService->setMany($options, $group);

        return response()->json(['message' => 'Options saved successfully']);
    }

    public function destroy(string $key): JsonResponse
    {
        $deleted = $this->optionsService->delete($key);
        
        return response()->json([
            'message' => $deleted ? 'Option deleted successfully' : 'Option not found'
        ]);
    }
} 