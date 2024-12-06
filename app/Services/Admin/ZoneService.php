<?php

namespace App\Services\Admin;

use App\Models\Zone;
use App\Models\DeliveryCharge;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ZoneService
{
    public function getPaginatedZones()
    {
        try {
            $cacheKey = 'zones.paginated.' . request()->get('page', 1);
            
            if (Cache::has($cacheKey)) {
                return Cache::get($cacheKey);
            }

            $zones = Zone::with('deliveryCharges')
                ->latest()
                ->paginate(10);

            Cache::put($cacheKey, $zones, now()->addMinutes(30));
            
            return $zones;
        } catch (\Exception $e) {
            Log::error('Error fetching paginated zones', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function createZone(array $data)
    {
        DB::beginTransaction();

        try {
            // Create zone
            $zone = Zone::create([
                'name' => $data['name'],
                'display_name' => $data['display_name'],
                'coordinates' => $data['coordinates'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            // Create delivery charges
            if (isset($data['delivery_charges'])) {
                $zone->deliveryCharges()->create([
                    'min_charge' => $data['delivery_charges']['min_charge'],
                    'max_charge' => $data['delivery_charges']['max_charge'],
                    'per_km_charge' => $data['delivery_charges']['per_km_charge'],
                    'max_cod_amount' => $data['delivery_charges']['max_cod_amount'],
                    'increase_percentage' => $data['delivery_charges']['increase_percentage'] ?? 0,
                    'increase_message' => $data['delivery_charges']['increase_message'] ?? null,
                ]);
            }

            DB::commit();
            $this->clearZoneCache();
            
            return $zone->load('deliveryCharges');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create zone', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data
            ]);
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

            if (isset($data['delivery_charges'])) {
                $zone->deliveryCharges()->updateOrCreate(
                    ['zone_id' => $zone->id],
                    [
                        'min_charge' => $data['delivery_charges']['min_charge'],
                        'max_charge' => $data['delivery_charges']['max_charge'],
                        'per_km_charge' => $data['delivery_charges']['per_km_charge'],
                        'max_cod_amount' => $data['delivery_charges']['max_cod_amount'],
                        'increase_percentage' => $data['delivery_charges']['increase_percentage'] ?? 0,
                        'increase_message' => $data['delivery_charges']['increase_message'] ?? null,
                    ]
                );
            }

            DB::commit();
            $this->clearZoneCache();
            
            return $zone->fresh(['deliveryCharges']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update zone', [
                'zone_id' => $zone->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function deleteZone(Zone $zone)
    {
        DB::beginTransaction();

        try {
            $zone->deliveryCharges()->delete();
            $zone->delete();

            DB::commit();
            $this->clearZoneCache();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete zone', [
                'zone_id' => $zone->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function toggleZoneStatus(Zone $zone)
    {
        try {
            $zone->update(['is_active' => !$zone->is_active]);
            $this->clearZoneCache();
            return $zone->fresh();
        } catch (\Exception $e) {
            Log::error('Failed to toggle zone status', [
                'zone_id' => $zone->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function validateZoneCoordinates(array $data)
    {
        try {
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
        } catch (\Exception $e) {
            Log::error('Error validating zone coordinates', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function getZoneStats()
    {
        try {
            return [
                'total' => Zone::count(),
                'active' => Zone::where('is_active', true)->count(),
                'inactive' => Zone::where('is_active', false)->count(),
                'coverage_area' => $this->calculateTotalCoverageArea(),
            ];
        } catch (\Exception $e) {
            Log::error('Error getting zone stats', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
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

    protected function clearZoneCache()
    {
        try {
            if (config('cache.default') === 'redis' && Cache::getStore() instanceof \Illuminate\Cache\RedisStore) {
                Cache::tags(['zones'])->flush();
            } else {
                Cache::flush(); // Fallback for non-taggable cache drivers
            }
        } catch (\Exception $e) {
            Log::warning('Cache clearing failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            // Continue execution even if cache clearing fails
        }
    }

    protected function getCachedZones()
    {
        try {
            $cacheKey = 'zones.all';
            return Cache::remember($cacheKey, now()->addHours(1), function () {
                return Zone::with('deliveryCharges')->latest()->get();
            });
        } catch (\Exception $e) {
            Log::warning('Cache retrieval failed', [
                'error' => $e->getMessage()
            ]);
            return Zone::with('deliveryCharges')->latest()->get();
        }
    }
} 