import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import StatsComponent from "./Partials/Stats/Index";
import { Button } from "@/Components/ui/button";
import { Download } from "lucide-react";

const Stats = ({ stats, filters, can }) => {
    return (
        <AdminLayout>
            <Head title="Restaurant Statistics" />

            <div className="container mx-auto py-6 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Restaurant Statistics
                    </h1>
                    
                    {/* {can.exportStats && ( */}
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = route('app.restaurants.stats.export', { range: filters.range })}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                        </Button>
                    {/* )} */}
                </div>

                <StatsComponent 
                    stats={stats} 
                    filters={filters}
                    canViewStats={can.viewStats}
                />
            </div>
        </AdminLayout>
    );
};

export default Stats; 