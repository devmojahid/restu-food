import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
    <Loader2 className="w-8 h-8 animate-spin mb-4" />
    <p>{message}</p>
  </div>
); 