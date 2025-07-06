<?php

declare(strict_types=1);

namespace Modules\SettingsManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CurrencyRequest;
use App\Models\Currency;
use Modules\SettingsManagement\Services\CurrencyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

final class CurrencyController extends Controller
{
    public function __construct(
        private readonly CurrencyService $currencyService
    ) {
        // $this->middleware('permission:currency.list')->only(['index', 'show']);
        // $this->middleware('permission:currency.create')->only(['create', 'store']);
        // $this->middleware('permission:currency.edit')->only(['edit', 'update', 'updateRates']);
        // $this->middleware('permission:currency.delete')->only('destroy');
    }

    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::module('SettingsManagement::Currency/Index', [
            'currencies' => Currency::orderBy('is_default', 'desc')
                ->orderBy('code')
                ->paginate(10),
            'stats' => [
                'total' => Currency::count(),
                'active' => Currency::where('is_enabled', true)->count(),
                'inactive' => Currency::where('is_enabled', false)->count(),
            ],
            'can' => [
                'create' => $user->can('currency.create'),
                'edit' => $user->can('currency.edit'),
                'delete' => $user->can('currency.delete'),
            ],
        ]);
    }

    public function store(CurrencyRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();
            
            // Normalize boolean values
            $validated['is_default'] = (bool) ($validated['is_default'] ?? false);
            $validated['is_enabled'] = (bool) ($validated['is_enabled'] ?? true);
            $validated['space_between'] = (bool) ($validated['space_between'] ?? false);
            
            $currency = $this->currencyService->store($validated);

            return redirect()
                ->route('app.settings.currencies.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => "Currency {$currency->code} created successfully."
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error creating currency: ' . $e->getMessage()
                ]);
        }
    }

    public function update(CurrencyRequest $request, Currency $currency): RedirectResponse
    {
        try {
            $this->currencyService->update($currency, $request->validated());

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Currency updated successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error updating currency: ' . $e->getMessage()
                ]);
        }
    }

    public function destroy(Currency $currency): RedirectResponse
    {
        try {
            if ($currency->is_default) {
                throw new \Exception('Cannot delete default currency.');
            }

            $currency->delete();

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Currency deleted successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    public function updateRates(Request $request): RedirectResponse
    {
        try {
            $this->currencyService->updateExchangeRates();

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Exchange rates updated successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error updating exchange rates: ' . $e->getMessage()
                ]);
        }
    }

    public function toggleStatus(Currency $currency): RedirectResponse
    {
        try {
            if ($currency->is_default && !$currency->is_enabled) {
                throw new \Exception('Cannot disable default currency.');
            }

            $currency->update(['is_enabled' => !$currency->is_enabled]);

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Currency status updated successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'action' => ['required', 'string', 'in:delete,enable,disable'],
                'ids' => ['required', 'array'],
                'ids.*' => ['required', 'exists:currencies,id']
            ]);

            $currencies = Currency::whereIn('id', $validated['ids'])->get();
            
            foreach ($currencies as $currency) {
                match ($validated['action']) {
                    'delete' => $this->destroy($currency),
                    'enable' => $currency->update(['is_enabled' => true]),
                    'disable' => $currency->update(['is_enabled' => false]),
                };
            }

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Bulk action completed successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error performing bulk action: ' . $e->getMessage()
                ]);
        }
    }

    public function convert(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'amount' => ['required', 'numeric', 'min:0'],
                'from' => ['required', 'string', 'exists:currencies,code'],
                'to' => ['required', 'string', 'exists:currencies,code']
            ]);

            $convertedAmount = $this->currencyService->convertAmount(
                (float) $validated['amount'],
                $validated['from'],
                $validated['to']
            );

            return response()->json([
                'success' => true,
                'amount' => $convertedAmount
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function switch(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'currency' => ['required', 'string', 'exists:currencies,code']
            ]);

            $currency = $this->currencyService->switchCurrency($validated['currency']);

            Cache::forget("current_currency_{$currency->code}");
            Cache::forget('enabled_currencies');

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => "Currency switched to {$currency->name}"
                ]);
        } catch (\Exception $e) {
            Log::error('Error switching currency: ' . $e->getMessage());
            
            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Unable to switch currency. Please try again.'
                ]);
        }
    }
} 