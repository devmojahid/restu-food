import React from 'react';
import { Link } from '@inertiajs/react';

export default function Index() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Product Module</h1>
      </div>
      
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <p className="text-gray-700">Welcome to Product Module!</p>
      </div>
    </div>
  );
} 