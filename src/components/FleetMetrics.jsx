import React from 'react';
import { Truck, Activity, MapPin, AlertTriangle } from 'lucide-react';

const FleetMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Trips</p>
            <p className="text-3xl font-bold text-blue-600">{metrics.activeTrips}</p>
          </div>
          <Truck className="w-12 h-12 text-blue-600 opacity-20" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-600">{metrics.completedTrips}</p>
          </div>
          <Activity className="w-12 h-12 text-green-600 opacity-20" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Distance</p>
            <p className="text-3xl font-bold text-purple-600">{metrics.totalDistance} km</p>
          </div>
          <MapPin className="w-12 h-12 text-purple-600 opacity-20" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Alerts</p>
            <p className="text-3xl font-bold text-red-600">{metrics.totalAlerts}</p>
          </div>
          <AlertTriangle className="w-12 h-12 text-red-600 opacity-20" />
        </div>
      </div>
    </div>
  );
};

export default FleetMetrics;