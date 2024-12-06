<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Zone;
use App\Services\Admin\ZoneService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Admin\Zone\{
    StoreZoneRequest,
    UpdateZoneRequest
};
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class ZoneController extends Controller
{
    protected $zoneService;

    public function __construct(ZoneService $zoneService)
    {
        $this->zoneService = $zoneService;
    }

    public function index()
    {
        try {
            $zones = $this->zoneService->getPaginatedZones();
            $stats = $this->zoneService->getZoneStats();

            // Check if user has permissions using Spatie
            $user = Auth::user();
            $permissions = [
                // 'create' => $user->hasPermissionTo('zone.create') || $user->hasRole('Admin'),
                // 'edit' => $user->hasPermissionTo('zone.edit') || $user->hasRole('Admin'),
                // 'delete' => $user->hasPermissionTo('zone.delete') || $user->hasRole('Admin'),
            ];

            return Inertia::render('Admin/Zones/Index', [
                'zones' => [
                    'data' => $zones->items(),
                    'meta' => [
                        'current_page' => $zones->currentPage(),
                        'last_page' => $zones->lastPage(),
                        'per_page' => $zones->perPage(),
                        'total' => $zones->total(),
                        'from' => $zones->firstItem() ?? 0,
                        'to' => $zones->lastItem() ?? 0,
                    ],
                ],
                'stats' => $stats,
                'can' => $permissions,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load zones index', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        
            dd($e->getMessage());

            return redirect()->back()->with('error', 'Failed to load zones. Please try again.');
        }
    }

    public function store(StoreZoneRequest $request)
    {
        try {
            $validated = $request->validated();
            
            // Add validation for coordinates
            if (empty($validated['coordinates']) || count($validated['coordinates']) < 3) {
                return back()->withErrors([
                    'coordinates' => 'Please draw a valid zone area with at least 3 points'
                ])->withInput();
            }

            // Validate coordinates structure
            foreach ($validated['coordinates'] as $coord) {
                if (!isset($coord['lat']) || !isset($coord['lng'])) {
                    return back()->withErrors([
                        'coordinates' => 'Invalid coordinate format'
                    ])->withInput();
                }
            }

            DB::beginTransaction();
            
            try {
                $zone = $this->zoneService->createZone($validated);
                
                DB::commit();
                
                return redirect()->back()->with([
                    'success' => true,
                    'message' => 'Zone created successfully'
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Failed to create zone', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $validated ?? null
            ]);

            return redirect()->back()
                ->withErrors(['error' => 'Failed to create zone: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function update(UpdateZoneRequest $request, Zone $zone)
    {
        try {
            DB::beginTransaction();
            
            try {
                $this->zoneService->updateZone($zone, $request->validated());
                
                DB::commit();
                
                return redirect()->back()->with('success', 'Zone updated successfully');
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Failed to update zone', [
                'zone_id' => $zone->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->withErrors(['error' => 'Failed to update zone: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(Zone $zone)
    {
        try {
            DB::beginTransaction();
            
            try {
                $this->zoneService->deleteZone($zone);
                
                DB::commit();
                
                return redirect()->back()->with('success', 'Zone deleted successfully');
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Failed to delete zone', [
                'zone_id' => $zone->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Failed to delete zone');
        }
    }

    public function toggleStatus(Zone $zone)
    {
        try {
            $this->zoneService->toggleZoneStatus($zone);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Failed to toggle zone status', [
                'zone_id' => $zone->id,
                'error' => $e->getMessage()
            ]);
            return response()->json(['error' => 'Failed to toggle zone status'], 500);
        }
    }

    public function validateCoordinates(Request $request)
    {
        try {
            $result = $this->zoneService->validateZoneCoordinates($request->all());
            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Failed to validate coordinates', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);
            return response()->json(['valid' => false, 'message' => $e->getMessage()], 422);
        }
    }
} 