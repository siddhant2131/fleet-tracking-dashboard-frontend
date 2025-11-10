// // Fleet metrics calculation utilities

// export const calculateFleetMetrics = (allTripsData) => {
//   const metrics = {
//     totalTrips: allTripsData.length,
//     activeTrips: 0,
//     completedTrips: 0,
//     cancelledTrips: 0,
//     totalDistance: 0,
//     averageSpeed: 0,
//     totalAlerts: 0,
//     progressBrackets: {
//       '0-25': 0,
//       '25-50': 0,
//       '50-75': 0,
//       '75-100': 0,
//       'completed': 0
//     }
//   };

//   let totalSpeed = 0;
//   let speedCount = 0;

//   allTripsData.forEach(trip => {
//     const events = trip.processedEvents || [];
    
//     // Determine trip status
//     const lastEvent = events[events.length - 1];
//     if (lastEvent) {
//       if (lastEvent.event_type === 'trip_completed') {
//         metrics.completedTrips++;
//         metrics.progressBrackets['completed']++;
//       } else if (lastEvent.event_type === 'trip_cancelled') {
//         metrics.cancelledTrips++;
//       } else {
//         metrics.activeTrips++;
//       }
//     }

//     // Calculate progress bracket
//     const locationEvents = events.filter(e => e.event_type === 'location_ping');
//     if (locationEvents.length > 0) {
//       const lastLocation = locationEvents[locationEvents.length - 1];
//       const startEvent = events.find(e => e.event_type === 'trip_started');
      
//       if (lastLocation && startEvent) {
//         const progress = Math.min(100, 
//           ((lastLocation.distance_travelled_km || 0) / 
//           (startEvent.planned_distance_km || 1)) * 100
//         );

//         if (lastEvent?.event_type !== 'trip_completed') {
//           if (progress < 25) metrics.progressBrackets['0-25']++;
//           else if (progress < 50) metrics.progressBrackets['25-50']++;
//           else if (progress < 75) metrics.progressBrackets['50-75']++;
//           else metrics.progressBrackets['75-100']++;
//         }

//         metrics.totalDistance += lastLocation.distance_travelled_km || 0;
        
//         // Calculate average speed
//         totalSpeed += lastLocation.movement?.speed_kmh || 0;
//         speedCount++;
//       }
//     }

//     // Count alerts
//     const alertEvents = events.filter(e => 
//       ['overspeed_detected', 'harsh_braking', 'harsh_acceleration',
//        'low_fuel_warning', 'critical_fuel_alert', 'device_disconnected',
//        'signal_lost'].includes(e.event_type)
//     );
//     metrics.totalAlerts += alertEvents.length;
//   });

//   metrics.averageSpeed = speedCount > 0 ? totalSpeed / speedCount : 0;
//   metrics.totalDistance = Math.round(metrics.totalDistance);

//   return metrics;
// };

// export const calculateTripMetrics = (events) => {
//   const metrics = {
//     totalEvents: events.length,
//     distanceCovered: 0,
//     currentSpeed: 0,
//     averageSpeed: 0,
//     maxSpeed: 0,
//     alerts: 0,
//     restBreaks: 0,
//     fuelStops: 0,
//     duration: 0
//   };

//   const locationEvents = events.filter(e => e.event_type === 'location_ping');
  
//   if (locationEvents.length > 0) {
//     const lastLocation = locationEvents[locationEvents.length - 1];
//     metrics.distanceCovered = lastLocation.distance_travelled_km || 0;
//     metrics.currentSpeed = lastLocation.movement?.speed_kmh || 0;

//     // Calculate average and max speed
//     let totalSpeed = 0;
//     locationEvents.forEach(event => {
//       const speed = event.movement?.speed_kmh || 0;
//       totalSpeed += speed;
//       if (speed > metrics.maxSpeed) metrics.maxSpeed = speed;
//     });
//     metrics.averageSpeed = totalSpeed / locationEvents.length;
//   }

//   // Count different event types
//   metrics.alerts = events.filter(e => 
//     ['overspeed_detected', 'harsh_braking', 'harsh_acceleration',
//      'low_fuel_warning', 'critical_fuel_alert'].includes(e.event_type)
//   ).length;

//   metrics.restBreaks = events.filter(e => 
//     e.event_type === 'rest_break_started'
//   ).length;

//   metrics.fuelStops = events.filter(e => 
//     e.event_type === 'refueling_started'
//   ).length;

//   // Calculate duration
//   if (events.length > 0) {
//     const firstEvent = new Date(events[0].timestamp);
//     const lastEvent = new Date(events[events.length - 1].timestamp);
//     metrics.duration = (lastEvent - firstEvent) / (1000 * 60 * 60); // in hours
//   }

//   return metrics;
// };

// export const getSpeedDistribution = (events) => {
//   const locationEvents = events.filter(e => e.event_type === 'location_ping');
//   const distribution = {
//     '0-30': 0,
//     '30-60': 0,
//     '60-90': 0,
//     '90+': 0
//   };

//   locationEvents.forEach(event => {
//     const speed = event.movement?.speed_kmh || 0;
//     if (speed < 30) distribution['0-30']++;
//     else if (speed < 60) distribution['30-60']++;
//     else if (speed < 90) distribution['60-90']++;
//     else distribution['90+']++;
//   });

//   return distribution;
// };

// export const getEventTypeDistribution = (events) => {
//   const distribution = {};
  
//   events.forEach(event => {
//     const type = event.event_type;
//     distribution[type] = (distribution[type] || 0) + 1;
//   });

//   return Object.entries(distribution)
//     .map(([name, value]) => ({ name, value }))
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 10); // Top 10 event types
// };

// Fleet metrics calculation utilities
export const calculateFleetMetrics = (allTripsData) => {
  const metrics = {
    totalTrips: allTripsData.length,
    activeTrips: 0,
    completedTrips: 0,
    cancelledTrips: 0,
    totalDistance: 0,
    averageSpeed: 0,
    totalAlerts: 0,
    progressBrackets: {
      '0-25': 0,
      '25-50': 0,
      '50-75': 0,
      '75-100': 0,
      'completed': 0
    }
  };

  let totalSpeed = 0;
  let speedCount = 0;

  allTripsData.forEach(trip => {
    const events = trip.processedEvents || [];
    
    // Determine trip status
    const lastEvent = events[events.length - 1];
    if (lastEvent) {
      if (lastEvent.event_type === 'trip_completed') {
        metrics.completedTrips++;
        metrics.progressBrackets['completed']++;
      } else if (lastEvent.event_type === 'trip_cancelled') {
        metrics.cancelledTrips++;
      } else {
        metrics.activeTrips++;
      }
    }

    // Calculate progress bracket
    const locationEvents = events.filter(e => e.event_type === 'location_ping');
    if (locationEvents.length > 0) {
      const lastLocation = locationEvents[locationEvents.length - 1];
      const startEvent = events.find(e => e.event_type === 'trip_started');
      
      if (lastLocation && startEvent) {
        const progress = Math.min(100, 
          ((lastLocation.distance_travelled_km || 0) / 
          (startEvent.planned_distance_km || 1)) * 100
        );

        if (lastEvent?.event_type !== 'trip_completed') {
          if (progress < 25) metrics.progressBrackets['0-25']++;
          else if (progress < 50) metrics.progressBrackets['25-50']++;
          else if (progress < 75) metrics.progressBrackets['50-75']++;
          else metrics.progressBrackets['75-100']++;
        }

        metrics.totalDistance += lastLocation.distance_travelled_km || 0;
        
        // Calculate average speed
        totalSpeed += lastLocation.movement?.speed_kmh || 0;
        speedCount++;
      }
    }

    // Count alerts
    const alertEvents = events.filter(e => 
      ['overspeed_detected', 'harsh_braking', 'harsh_acceleration',
       'low_fuel_warning', 'critical_fuel_alert', 'device_disconnected',
       'signal_lost'].includes(e.event_type)
    );
    metrics.totalAlerts += alertEvents.length;
  });

  metrics.averageSpeed = speedCount > 0 ? Math.round(totalSpeed / speedCount) : 0;
  metrics.totalDistance = Math.round(metrics.totalDistance);

  return metrics;
};