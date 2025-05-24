<?php

namespace App\Support;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;

class DatabaseHealthCheck
{
    /**
     * Check model relationship integrity
     * 
     * @param string $modelClass The fully qualified model class name
     * @param string $relation The name of the relationship method to check
     * @return array Result with success flag and any issues found
     */
    public static function checkRelationship(string $modelClass, string $relation): array
    {
        try {
            // Create a new instance of the model
            $model = new $modelClass();
            
            // Check if the relation method exists
            if (!method_exists($model, $relation)) {
                return [
                    'success' => false,
                    'message' => "Relationship method '{$relation}' does not exist in {$modelClass}"
                ];
            }
            
            // Call the relationship method
            $relationObject = $model->$relation();
            
            // Check if the returned object is a valid relationship
            if (!is_object($relationObject) || !method_exists($relationObject, 'getRelated')) {
                return [
                    'success' => false,
                    'message' => "Method '{$relation}' does not return a valid relationship in {$modelClass}"
                ];
            }
            
            // Try to get the related table info to validate the relationship
            $relatedTable = $relationObject->getRelated()->getTable();
            
            return [
                'success' => true,
                'message' => "Relationship '{$relation}' in {$modelClass} is valid",
                'details' => [
                    'related_table' => $relatedTable,
                    'relation_type' => get_class($relationObject)
                ]
            ];
        } catch (\Error $e) {
            // PHP errors like type errors
            return [
                'success' => false,
                'message' => "PHP Error in relationship: " . $e->getMessage(),
                'error_type' => get_class($e)
            ];
        } catch (\Exception $e) {
            // Other exceptions
            return [
                'success' => false,
                'message' => "Exception in relationship: " . $e->getMessage(),
                'error_type' => get_class($e)
            ];
        }
    }
    
    /**
     * Check if a table exists and has specific columns
     * 
     * @param string $table The table name
     * @param array $requiredColumns Array of column names that must exist
     * @param array $optionalColumns Array of column names that are optional
     * @return array Result with success flag and any issues found
     */
    public static function checkTable(string $table, array $requiredColumns = [], array $optionalColumns = []): array
    {
        $issues = [];
        
        try {
            // Check if table exists
            if (!Schema::hasTable($table)) {
                return [
                    'success' => false,
                    'message' => "Table '{$table}' does not exist",
                    'issues' => ["Table '{$table}' does not exist"]
                ];
            }
            
            // Check required columns
            $missingRequired = [];
            foreach ($requiredColumns as $column) {
                if (!Schema::hasColumn($table, $column)) {
                    $missingRequired[] = $column;
                }
            }
            
            if (!empty($missingRequired)) {
                $issues[] = "Table '{$table}' is missing required columns: " . implode(', ', $missingRequired);
            }
            
            // Check optional columns
            $missingOptional = [];
            foreach ($optionalColumns as $column) {
                if (!Schema::hasColumn($table, $column)) {
                    $missingOptional[] = $column;
                }
            }
            
            if (!empty($missingOptional)) {
                $issues[] = "Table '{$table}' is missing optional columns: " . implode(', ', $missingOptional);
            }
            
            return [
                'success' => empty($missingRequired),
                'message' => empty($issues) ? "Table '{$table}' structure is valid" : implode('; ', $issues),
                'issues' => $issues,
                'details' => [
                    'table' => $table,
                    'missing_required' => $missingRequired,
                    'missing_optional' => $missingOptional,
                    'existing_columns' => Schema::getColumnListing($table)
                ]
            ];
        } catch (\Exception $e) {
            Log::error("Error checking table '{$table}'", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'success' => false,
                'message' => "Error checking table '{$table}': " . $e->getMessage(),
                'issues' => ["Database error: " . $e->getMessage()],
                'error_type' => get_class($e)
            ];
        }
    }
    
    /**
     * Perform a sample query to check if a model's relationships work correctly
     * 
     * @param string $modelClass The fully qualified model class name
     * @param string $relation The name of the relationship to test
     * @return array Result with success flag and any issues found
     */
    public static function testRelationshipQuery(string $modelClass, string $relation): array
    {
        try {
            // Get an instance of the model (first record)
            $model = $modelClass::first();
            
            // If no records exist, we can't test the relationship
            if (!$model) {
                return [
                    'success' => true,
                    'message' => "No records exist in {$modelClass} to test relationship",
                    'details' => [
                        'status' => 'no_records'
                    ]
                ];
            }
            
            // Try to access the relationship
            $related = $model->$relation;
            
            return [
                'success' => true,
                'message' => "Successfully queried '{$relation}' relationship in {$modelClass}",
                'details' => [
                    'status' => 'success',
                    'count' => is_countable($related) ? count($related) : (is_null($related) ? 0 : 1)
                ]
            ];
        } catch (QueryException $e) {
            // SQL/Database errors
            return [
                'success' => false,
                'message' => "Database error in relationship query: " . $e->getMessage(),
                'error_type' => get_class($e),
                'sql' => $e->getSql() ?? 'Unknown SQL'
            ];
        } catch (\Error $e) {
            // PHP errors like type errors
            return [
                'success' => false,
                'message' => "PHP Error in relationship query: " . $e->getMessage(),
                'error_type' => get_class($e)
            ];
        } catch (\Exception $e) {
            // Other exceptions
            return [
                'success' => false,
                'message' => "Exception in relationship query: " . $e->getMessage(),
                'error_type' => get_class($e)
            ];
        }
    }
} 