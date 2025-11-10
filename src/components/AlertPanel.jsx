import React, { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';

const AlertPanel = ({ trips }) => {
  const allAlerts = useMemo(() => {
    const alerts = [];
    
    // Early return if no trips
    if (!trips || trips.length === 0) return alerts;
    
    trips.forEach(trip => {
      const processedEvents = trip.processedEvents || [];
      
      // Process only necessary events
      for (const event of processedEvents) {
        if (['overspeed_detected', 'harsh_braking', 'harsh_acceleration', 
             'low_fuel_warning', 'critical_fuel_alert', 'device_disconnected', 
             'signal_lost'].includes(event.event_type)) {
          alerts.push({
            event_type: event.event_type,
            timestamp: event.timestamp,
            vehicleId: processedEvents[0]?.vehicle_id,
            event_id: event.event_id
          });
        }
      }
    });
    
    return alerts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  }, [trips]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        Active Alerts ({allAlerts.length})
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {allAlerts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No active alerts</p>
        ) : (
          allAlerts.map((alert, index) => (
            <div 
              key={`${alert.event_id}-${index}`} 
              className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-red-900 truncate">
                  {alert.event_type.replace(/_/g, ' ').toUpperCase()}
                </p>
                <p className="text-sm text-red-700">
                  {alert.vehicleId} • {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(AlertPanel);