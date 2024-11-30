import React from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Bell, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';

const KitchenAlerts = ({ alerts }) => {
    const getAlertIcon = (level) => {
        switch (level) {
            case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'medium': return <Bell className="w-4 h-4 text-amber-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Kitchen Alerts</h2>
                <Badge variant="outline">{alerts.length} Active</Badge>
            </div>
            
            <div className="space-y-4">
                {alerts.map((alert) => (
                    <div 
                        key={alert.id}
                        className={`p-4 rounded-lg border ${
                            alert.level === 'high' ? 'bg-red-50 border-red-100' :
                            alert.level === 'medium' ? 'bg-amber-50 border-amber-100' :
                            'bg-blue-50 border-blue-100'
                        }`}
                    >
                        <div className="flex items-start space-x-3">
                            {getAlertIcon(alert.level)}
                            <div className="flex-1">
                                <p className="font-medium">{alert.message}</p>
                                <p className="text-sm text-gray-500">
                                    {format(new Date(alert.time), 'HH:mm')}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default KitchenAlerts; 