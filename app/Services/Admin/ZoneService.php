<?php

namespace App\Services\Admin;

use App\Models\Zone;
use App\Models\DeliveryCharge;
use App\Facades\Options;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class ZoneService
{
    public function getPaginatedZones()
    {
        return Zone::with('deliveryCharges')
            ->latest()
            ->paginate(10);
    }

    public function getZoneSettings()
    {
        return [
            'default_delivery_charge' => Options::get('default_delivery_charge', 0),
            'max_cod_amount' => Options::get('max_cod_amount', 1000),
            'default_radius' => Options::get('default_zone_radius', 5),
        ];
    }

    public function createZone(array $data)
    {
        DB::beginTransaction();

        try {
            $zone = Zone::create([
                'name' => $data['name'],
                'display_name' => $data['display_name'],
                'coordinates' => $data['coordinates'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            $this->createOrUpdateDeliveryCharges($zone, $data['delivery_charges']);

            DB::commit();
            return $zone;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateZone(Zone $zone, array $data)
    {
        DB::beginTransaction();

        try {
            $zone->update([
                'name' => $data['name'],
                'display_name' => $data['display_name'],
                'coordinates' => $data['coordinates'],
                'is_active' => $data['is_active'] ?? $zone->is_active,
            ]);

            $this->createOrUpdateDeliveryCharges($zone, $data['delivery_charges']);

            DB::commit();
            return $zone;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    protected function createOrUpdateDeliveryCharges(Zone $zone, array $charges)
    {
        $zone->deliveryCharges()->updateOrCreate(
            ['zone_id' => $zone->id],
            [
                'min_charge' => $charges['min_charge'],
                'max_charge' => $charges['max_charge'],
                'per_km_charge' => $charges['per_km_charge'],
                'max_cod_amount' => $charges['max_cod_amount'],
                'increase_percentage' => $charges['increase_percentage'],
                'increase_message' => $charges['increase_message'],
            ]
        );
    }

    public function deleteZone(Zone $zone)
    {
        DB::beginTransaction();

        try {
            $zone->deliveryCharges()->delete();
            $zone->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function handleBulkAction(array $data)
    {
        $action = $data['action'];
        $zoneIds = $data['ids'];

        switch ($action) {
            case 'delete':
                Zone::whereIn('id', $zoneIds)->delete();
                break;
            case 'activate':
                Zone::whereIn('id', $zoneIds)->update(['is_active' => true]);
                break;
            case 'deactivate':
                Zone::whereIn('id', $zoneIds)->update(['is_active' => false]);
                break;
        }
    }

    public function toggleZoneStatus(Zone $zone)
    {
        $zone->update(['is_active' => !$zone->is_active]);
    }

    public function searchZones($query)
    {
        return Zone::where('name', 'like', "%{$query}%")
            ->orWhere('display_name', 'like', "%{$query}%")
            ->with('deliveryCharges')
            ->get();
    }

    public function calculateDeliveryCharge($zoneId, $distance, $orderAmount)
    {
        $zone = Zone::with('deliveryCharges')->findOrFail($zoneId);
        $charges = $zone->deliveryCharges;

        $baseCharge = $charges->per_km_charge * $distance;
        $totalCharge = max($charges->min_charge, min($baseCharge, $charges->max_charge));

        // Apply surge pricing if enabled
        if ($charges->increase_percentage > 0) {
            $surgeAmount = ($totalCharge * $charges->increase_percentage) / 100;
            $totalCharge += $surgeAmount;
        }

        return [
            'base_charge' => $baseCharge,
            'total_charge' => $totalCharge,
            'surge_applied' => $charges->increase_percentage > 0,
            'surge_message' => $charges->increase_message,
        ];
    }

    public function findZoneByCoordinates($lat, $lng)
    {
        $zones = Zone::where('is_active', true)->get();
        
        foreach ($zones as $zone) {
            if ($this->pointInPolygon($lat, $lng, $zone->coordinates)) {
                return $zone;
            }
        }

        return null;
    }

    protected function pointInPolygon($lat, $lng, $polygon)
    {
        if (empty($polygon)) {
            return false;
        }

        $vertices = count($polygon);
        $inside = false;

        for ($i = 0, $j = $vertices - 1; $i < $vertices; $j = $i++) {
            $xi = $polygon[$i]['lat'];
            $yi = $polygon[$i]['lng'];
            $xj = $polygon[$j]['lat'];
            $yj = $polygon[$j]['lng'];

            $intersect = (($yi > $lng) != ($yj > $lng))
                && ($lat < ($xj - $xi) * ($lng - $yi) / ($yj - $yi) + $xi);

            if ($intersect) {
                $inside = !$inside;
            }
        }

        return $inside;
    }

    public function validateZoneCoordinates(array $data)
    {
        $coordinates = $data['coordinates'] ?? [];
        
        if (count($coordinates) < 3) {
            return [
                'valid' => false,
                'message' => 'A zone must have at least 3 points',
            ];
        }

        // Check for self-intersecting polygon
        if ($this->isSelfIntersecting($coordinates)) {
            return [
                'valid' => false,
                'message' => 'Zone boundaries cannot intersect',
            ];
        }

        // Check for overlapping with existing zones
        if ($this->isOverlappingWithOtherZones($coordinates, $data['zone_id'] ?? null)) {
            return [
                'valid' => false,
                'message' => 'Zone overlaps with existing zones',
            ];
        }

        return [
            'valid' => true,
            'message' => 'Coordinates are valid',
        ];
    }

    protected function isSelfIntersecting(array $coordinates)
    {
        $n = count($coordinates);
        for ($i = 0; $i < $n; $i++) {
            for ($j = $i + 2; $j < $n; $j++) {
                if ($this->doLineSegmentsIntersect(
                    $coordinates[$i],
                    $coordinates[($i + 1) % $n],
                    $coordinates[$j],
                    $coordinates[($j + 1) % $n]
                )) {
                    return true;
                }
            }
        }
        return false;
    }

    protected function doLineSegmentsIntersect($p1, $p2, $p3, $p4)
    {
        $o1 = $this->orientation($p1, $p2, $p3);
        $o2 = $this->orientation($p1, $p2, $p4);
        $o3 = $this->orientation($p3, $p4, $p1);
        $o4 = $this->orientation($p3, $p4, $p2);

        return ($o1 != $o2 && $o3 != $o4);
    }

    protected function orientation($p, $q, $r)
    {
        $val = ($q['lng'] - $p['lng']) * ($r['lat'] - $q['lat']) -
               ($q['lat'] - $p['lat']) * ($r['lng'] - $q['lng']);

        if ($val == 0) return 0;
        return ($val > 0) ? 1 : 2;
    }

    protected function isOverlappingWithOtherZones(array $coordinates, $excludeZoneId = null)
    {
        $zones = Zone::when($excludeZoneId, function ($query) use ($excludeZoneId) {
            return $query->where('id', '!=', $excludeZoneId);
        })->get();

        foreach ($zones as $zone) {
            if ($this->doPolygonsIntersect($coordinates, $zone->coordinates)) {
                return true;
            }
        }

        return false;
    }

    protected function doPolygonsIntersect(array $poly1, array $poly2)
    {
        // Implementation of polygon intersection check
        // This is a simplified version - you might want to use a geometry library
        // for more accurate results
        $n1 = count($poly1);
        $n2 = count($poly2);

        for ($i = 0; $i < $n1; $i++) {
            for ($j = 0; $j < $n2; $j++) {
                if ($this->doLineSegmentsIntersect(
                    $poly1[$i],
                    $poly1[($i + 1) % $n1],
                    $poly2[$j],
                    $poly2[($j + 1) % $n2]
                )) {
                    return true;
                }
            }
        }

        return false;
    }

    public function clearZoneCache()
    {
        Cache::tags(['zones'])->flush();
    }

    public function getZoneStats()
    {
        return [
            'total' => Zone::count(),
            'active' => Zone::where('is_active', true)->count(),
            'coverage_area' => $this->calculateTotalCoverageArea(),
        ];
    }

    protected function calculateTotalCoverageArea()
    {
        $totalArea = 0;
        $zones = Zone::where('is_active', true)->get();
        
        foreach ($zones as $zone) {
            $totalArea += $this->calculatePolygonArea($zone->coordinates);
        }
        
        return round($totalArea, 2) . ' km²';
    }

    protected function calculatePolygonArea($coordinates)
    {
        if (count($coordinates) < 3) return 0;
        
        $area = 0;
        $j = count($coordinates) - 1;
        
        for ($i = 0; $i < count($coordinates); $i++) {
            $area += ($coordinates[$j]['lng'] + $coordinates[$i]['lng']) * 
                     ($coordinates[$j]['lat'] - $coordinates[$i]['lat']);
            $j = $i;
        }
        
        return abs($area / 2) * 111.32 * 111.32; // Convert to square kilometers
    }
} 