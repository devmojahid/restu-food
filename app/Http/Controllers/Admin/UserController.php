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
        // Clean the filters by removing empty values
        $filters = array_filter([
            'search' => $request->input('search'),
            'role' => $request->input('role'),
            'per_page' => $request->input('per_page', 10),
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
            'status' => $request->input('status'),
            'sort' => $request->input('sort', 'created_at'),
            'direction' => $request->input('direction', 'desc'),
        ], function ($value) {
            return $value !== null && $value !== '';
        });

        // Get the data using the service, with proper pagination for infinite scrolling
        $users = $this->userService->getPaginated($filters);

        // Enhanced meta information for client-side handling
        $meta = [
            'hasMorePages' => $users->hasMorePages(),
            'currentPage' => $users->currentPage(),
            'lastPage' => $users->lastPage(),
            'total' => $users->total(),
            'from' => $users->firstItem(),
            'to' => $users->lastItem(),
            'lastUpdated' => now()->toIso8601String(),
            'cacheControl' => 'private, max-age=60',
        ];

        // Set up polling for real-time updates if requested
        $pollingInterval = $request->input('polling', null);
        
        if ($pollingInterval && is_numeric($pollingInterval)) {
            Inertia::share('polling', [
                'interval' => (int) $pollingInterval,
                'endpoint' => route('app.users.index', array_merge($filters, ['only' => 'users,meta'])),
            ]);
        }

        // For prefetching next page data
        if ($users->hasMorePages()) {
            Inertia::share('prefetch', [
                'next_page' => route('app.users.index', array_merge($filters, ['page' => $users->currentPage() + 1, 'only' => 'users,meta']))
            ]);
        }
        
        // Return the Inertia response without manually adding headers
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'roles' => fn () => $this->userService->getAllRoles(), // Deferred prop
            'meta' => $meta,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => fn () => $this->userService->getAllRoles() // Deferred prop
        ]);
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
            'roles' => fn () => $this->userService->getAllRoles(), // Deferred prop
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
        dd("dsad");
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
