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
use App\Models\User;

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

    public function create(): Response
    {
        $data = [
            'roles' => $this->userService->getAllRoles()
        ];
        return Inertia::render('Admin/Users/Create', $data);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['files'] = [
                'avatar' => $request->input('avatar'),
            ];

            $user = $this->userService->store($data);

            return redirect()
                ->route('app.users.edit', $user)
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'User created successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error creating user: ' . $e->getMessage()
                ]);
        }
    }

    public function show(User $user): Response
    {
        $user->load(['roles', 'files']);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    public function edit(User $user): Response
    {
        $user->load(['roles', 'files']);

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => $this->userService->getAllRoles(),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['files'] = [
                'avatar' => $request->input('avatar'),
            ];

            $this->userService->update($user->id, $data);

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'User updated successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error updating user: ' . $e->getMessage()
                ]);
        }
    }

    public function destroy(User $user): RedirectResponse
    {
        try {
            $this->userService->delete($user->id);
            return redirect()
                ->route('app.users.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'User deleted successfully.'
                ]);
        } catch (\Exception $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error deleting user: ' . $e->getMessage()
            ]);
        }
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:users,id'
            ]);

            $this->userService->bulkDelete($validated['ids']);

            return back()->with('toast', [
                'type' => 'success',
                'message' => 'Selected users deleted successfully'
            ]);
        } catch (\Exception $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error deleting users: ' . $e->getMessage()
            ]);
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

            return back()->with('toast', [
                'type' => 'success',
                'message' => 'User status updated successfully'
            ]);
        } catch (\Exception $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error updating status: ' . $e->getMessage()
            ]);
        }
    }
}
