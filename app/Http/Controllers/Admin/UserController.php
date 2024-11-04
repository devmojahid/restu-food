<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Services\Admin\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

final class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'role' => $request->input('role'),
            'per_page' => $request->input('per_page', 10),
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $this->userService->getPaginated($filters),
            'filters' => $filters,
            'roles' => $this->userService->getAllRoles(),
        ]);
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:users,id'
            ]);

            $this->userService->bulkDelete($validated['ids']);

            return back()->with('success', 'Selected users deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting users: ' . $e->getMessage());
        }
    }

    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:users,id',
                'status' => 'required|boolean'
            ]);

            $this->userService->bulkUpdateStatus($validated['ids'], $validated['status']);

            return back()->with('success', 'User status updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Error updating status: ' . $e->getMessage());
        }
    }
}
