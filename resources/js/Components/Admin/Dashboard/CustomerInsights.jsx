import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { 
    Users,
    Star,
    MessageSquare,
    TrendingUp
} from 'lucide-react';

const CustomerInsights = ({ data = {} }) => {
    const { segments = {}, satisfaction = {}, feedback_summary = {} } = data;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Customer Insights
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Customer Segments */}
                <div className="space-y-4">
                    <h3 className="font-medium text-sm text-gray-500">Customer Segments</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(segments).map(([key, value]) => (
                            <div key={key} className="p-3 rounded-lg bg-gray-50">
                                <div className="text-sm text-gray-500 capitalize">
                                    {key.replace('_', ' ')}
                                </div>
                                <div className="text-2xl font-semibold mt-1">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Satisfaction Ratings */}
                <div className="mt-8 space-y-4">
                    <h3 className="font-medium text-sm text-gray-500">Satisfaction Ratings</h3>
                    {Object.entries(satisfaction).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm capitalize">
                                    {key.replace('_', ' ')}
                                </span>
                                <span className="font-medium">{value}/5</span>
                            </div>
                            <Progress value={value * 20} className="h-1" />
                        </div>
                    ))}
                </div>

                {/* Feedback Summary */}
                <div className="mt-8 space-y-4">
                    <h3 className="font-medium text-sm text-gray-500">Recent Feedback</h3>
                    {feedback_summary.recent_comments?.map((comment, index) => (
                        <div 
                            key={index}
                            className="p-3 rounded-lg bg-gray-50 space-y-2"
                        >
                            <div className="flex justify-between items-start">
                                <p className="text-sm">{comment.comment}</p>
                                <div className="flex items-center text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="ml-1 text-sm">{comment.rating}</span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {new Date(comment.date).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default CustomerInsights; 