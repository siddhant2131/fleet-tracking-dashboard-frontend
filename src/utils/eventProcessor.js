// Event processor utilities for fleet tracking

export const loadTripData = async (tripFiles) => {
  try {
    const trips = await Promise.all(
      tripFiles.map(async (file, index) => {
        const data = await import(`../data/${file}`);
        return {
          id: index + 1,
          fileName: file,
          events: data.default || data,
          currentEventIndex: 0
        };
      })
    );
    return trips;
  } catch (error) {
    console.error('Error loading trip data:', error);
    return [];
  }
};

export const getEventsSince = (events, sinceTime) => {
  return events.filter(event => new Date(event.timestamp) <= sinceTime);
};

export const getLatestLocationForTrip = (events) => {
  const locationEvents = events.filter(e => e.event_type === 'location_ping');
  return locationEvents[locationEvents.length - 1] || null;
};

export const getTripStatus = (events) => {
  const lastEvent = events[events.length - 1];
  
  if (!lastEvent) return 'pending';
  
  if (lastEvent.event_type === 'trip_completed') return 'completed';
  if (lastEvent.event_type === 'trip_cancelled') return 'cancelled';
  if (lastEvent.event_type === 'trip_started') return 'in_progress';
  
  const hasStarted = events.some(e => e.event_type === 'trip_started');
  return hasStarted ? 'in_progress' : 'pending';
};

export const calculateProgress = (events) => {
  const startEvent = events.find(e => e.event_type === 'trip_started');
  const locationEvents = events.filter(e => e.event_type === 'location_ping');
  
  if (!startEvent || locationEvents.length === 0) return 0;
  
  const lastLocation = locationEvents[locationEvents.length - 1];
  const distanceTravelled = lastLocation?.distance_travelled_km || 0;
  const plannedDistance = startEvent?.planned_distance_km || 1;
  
  return Math.min(100, (distanceTravelled / plannedDistance) * 100);
};

export const getActiveAlerts = (events) => {
  const alertEvents = events.filter(e => 
    ['overspeed_detected', 'harsh_braking', 'harsh_acceleration', 
     'low_fuel_warning', 'critical_fuel_alert', 'device_disconnected',
     'signal_lost', 'geofence_violation'].includes(e.event_type)
  );
  
  return alertEvents.slice(-5); // Return last 5 alerts
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const formatDuration = (hours) => {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${hours.toFixed(1)} hrs`;
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  return `${days}d ${remainingHours}h`;
};

export const getEventTypeColor = (eventType) => {
  const colorMap = {
    'trip_started': 'text-green-600',
    'trip_completed': 'text-blue-600',
    'trip_cancelled': 'text-red-600',
    'location_ping': 'text-gray-500',
    'rest_break_started': 'text-yellow-600',
    'rest_break_ended': 'text-green-500',
    'overspeed_detected': 'text-red-500',
    'harsh_braking': 'text-orange-500',
    'harsh_acceleration': 'text-orange-500',
    'low_fuel_warning': 'text-yellow-500',
    'critical_fuel_alert': 'text-red-500',
    'refueling_started': 'text-blue-500',
    'refueling_completed': 'text-green-500',
  };
  
  return colorMap[eventType] || 'text-gray-600';
};

export const getEventIcon = (eventType) => {
  const iconMap = {
    'trip_started': '🚀',
    'trip_completed': '✅',
    'trip_cancelled': '❌',
    'location_ping': '📍',
    'rest_break_started': '☕',
    'rest_break_ended': '🏃',
    'overspeed_detected': '⚠️',
    'harsh_braking': '🛑',
    'harsh_acceleration': '⚡',
    'low_fuel_warning': '⛽',
    'critical_fuel_alert': '🚨',
    'refueling_started': '⛽',
    'refueling_completed': '✅',
    'maintenance_alert': '🔧',
    'device_disconnected': '📡',
    'signal_lost': '📶',
  };
  
  return iconMap[eventType] || '📌';
};