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

class ZoneController extends Controller
{
    protected $zoneService;

    public function __construct(ZoneService $zoneService)
    {
        $this->zoneService = $zoneService;
    }

    public function index()
    {
        $zones = $this->zoneService->getPaginatedZones();
        $stats = $this->zoneService->getZoneStats();

        return Inertia::render('Admin/Zones/Index', [
            'zones' => $zones,
            'stats' => $stats,
        ]);
    }

    public function store(StoreZoneRequest $request)
    {
        $zone = $this->zoneService->createZone($request->validated());

        return redirect()->back()->with('success', 'Zone created successfully');
    }

    public function show(Zone $zone)
    {
        return response()->json([
            'zone' => $zone->load('deliveryCharges')
        ]);
    }

    public function update(UpdateZoneRequest $request, Zone $zone)
    {
        $this->zoneService->updateZone($zone, $request->validated());

        return redirect()->back()->with('success', 'Zone updated successfully');
    }

    public function destroy(Zone $zone)
    {
        $this->zoneService->deleteZone($zone);

        return redirect()->back()->with('success', 'Zone deleted successfully');
    }

    public function bulkAction(Request $request)
    {
        $this->zoneService->handleBulkAction($request->all());

        return redirect()->back()->with('success', 'Bulk action completed successfully');
    }

    public function toggleStatus(Zone $zone)
    {
        $this->zoneService->toggleZoneStatus($zone);

        return redirect()->back()->with('success', 'Zone status updated successfully');
    }

    public function search(Request $request)
    {
        $zones = $this->zoneService->searchZones($request->get('query'));

        return response()->json($zones);
    }

    public function validateCoordinates(Request $request)
    {
        $result = $this->zoneService->validateZoneCoordinates($request->all());

        return response()->json($result);
    }
} 