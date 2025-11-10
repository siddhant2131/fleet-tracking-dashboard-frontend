// import React, { useState, useMemo } from 'react';
// import { Play, Pause, RotateCcw, Truck, AlertTriangle, Clock, MapPin, Activity, X } from 'lucide-react';
// import { useFleetTracking } from '../hooks/useFleetTracking';
// import { calculateFleetMetrics } from '../utils/metrics';
// import { getTripStatus, calculateProgress, getLatestLocationForTrip, getEventIcon } from '../utils/eventProcessor';
// import PlaybackControls from './PlaybackControls';
// import FleetMetrics from './FleetMetrics';
// import TripCard from './TripCard';
// import EventTimeline from './EventTimeline';
// import AlertPanel from './AlertPanel';

// const Dashboard = () => {
//   const {
//     trips,
//     isPlaying,
//     playbackSpeed,
//     simulationTime,
//     loading,
//     togglePlayback,
//     changeSpeed,
//     resetSimulation
//   } = useFleetTracking();

//   const [selectedTrip, setSelectedTrip] = useState(null);

//   // Optimized calculations with useMemo
//   const metrics = useMemo(() => calculateFleetMetrics(trips), [trips]);
  
//   const recentEvents = useMemo(() => {
//     return trips
//       .flatMap(trip => trip.processedEvents || [])
//       .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
//       .slice(0, 50); // Limit to 50 most recent events
//   }, [trips]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
//         <div className="text-center">
//           <Truck className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-bounce" />
//           <p className="text-xl font-semibold text-gray-700">Loading Fleet Data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Fleet Tracking Dashboard</h1>
//           <p className="text-gray-600">Real-time monitoring of {trips.length} simultaneous trips</p>
//           {simulationTime && (
//             <p className="text-sm text-gray-500 mt-2">
//               Simulation Time: {simulationTime.toLocaleString()}
//             </p>
//           )}
//         </div>

//         <div className="mb-6">
//           <PlaybackControls
//             isPlaying={isPlaying}
//             playbackSpeed={playbackSpeed}
//             onTogglePlayback={togglePlayback}
//             onChangeSpeed={changeSpeed}
//             onReset={resetSimulation}
//           />
//         </div>

//         <FleetMetrics metrics={metrics} />

//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <h3 className="text-lg font-semibold mb-4">Fleet Progress Distribution</h3>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             {Object.entries(metrics.progressBrackets).map(([range, count]) => (
//               <div key={range} className="text-center p-4 bg-gray-50 rounded-lg">
//                 <p className="text-2xl font-bold text-blue-600">{count}</p>
//                 <p className="text-sm text-gray-600">{range}%</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           <div className="lg:col-span-2 space-y-4">
//             {trips.map(trip => (
//               <TripCard 
//                 key={trip.id} 
//                 trip={trip} 
//                 onClick={() => setSelectedTrip(trip)} 
//               />
//             ))}
//           </div>
//           <div className="space-y-6">
//             <AlertPanel trips={trips} />
//           </div>
//         </div>

//         <EventTimeline events={recentEvents} />

//         {selectedTrip && (
//           <TripModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
//         )}
//       </div>
//     </div>
//   );
// };

// // Separate modal component to prevent re-renders
// const TripModal = React.memo(({ trip, onClose }) => {
//   const recentEvents = useMemo(() => {
//     return (trip.processedEvents || []).slice(-20).reverse();
//   }, [trip]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex items-start justify-between mb-4">
//             <h2 className="text-2xl font-bold">
//               {trip.fileName.replace('.json', '').replace(/_/g, ' ')}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-600">Total Events</p>
//                 <p className="text-2xl font-bold">{trip.processedEvents?.length || 0}</p>
//               </div>
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-600">Status</p>
//                 <p className="text-2xl font-bold capitalize">
//                   {getTripStatus(trip.processedEvents || []).replace('_', ' ')}
//                 </p>
//               </div>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-2">Event Log</h3>
//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {recentEvents.map((event, idx) => (
//                   <div key={`${event.event_id}-${idx}`} className="p-3 bg-gray-50 rounded text-sm flex items-center gap-2">
//                     <span className="text-lg">{getEventIcon(event.event_type)}</span>
//                     <div className="flex-1">
//                       <span className="font-medium">{event.event_type}</span>
//                       <span className="text-gray-500 ml-2 text-xs">
//                         {new Date(event.timestamp).toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// TripModal.displayName = 'TripModal';

// export default Dashboard;



// import React, { useState, useMemo } from 'react';
// import { Play, Pause, RotateCcw, Truck, AlertTriangle, Clock, MapPin, Activity, X } from 'lucide-react';
// import { useFleetTracking } from '../hooks/useFleetTracking';
// import { calculateFleetMetrics } from '../utils/metrics';
// import { getTripStatus, calculateProgress, getLatestLocationForTrip, getEventIcon } from '../utils/eventProcessor';
// import PlaybackControls from './PlaybackControls';
// import FleetMetrics from './FleetMetrics';
// import TripCard from './TripCard';
// import EventTimeline from './EventTimeline';
// import AlertPanel from './AlertPanel';
// import MapView from './MapView';

// const Dashboard = () => {
//   const {
//     trips,
//     isPlaying,
//     playbackSpeed,
//     simulationTime,
//     loading,
//     togglePlayback,
//     changeSpeed,
//     resetSimulation
//   } = useFleetTracking();

//   const [selectedTrip, setSelectedTrip] = useState(null);
//   const [activeView, setActiveView] = useState('trips'); // 'trips' or 'map'

//   // Optimized calculations with useMemo
//   const metrics = useMemo(() => calculateFleetMetrics(trips), [trips]);
  
//   const recentEvents = useMemo(() => {
//     return trips
//       .flatMap(trip => trip.processedEvents || [])
//       .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
//       .slice(0, 50); // Limit to 50 most recent events
//   }, [trips]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
//         <div className="text-center">
//           <Truck className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-bounce" />
//           <p className="text-xl font-semibold text-gray-700">Loading Fleet Data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Fleet Tracking Dashboard</h1>
//           <p className="text-gray-600">Real-time monitoring of {trips.length} simultaneous trips</p>
//           {simulationTime && (
//             <p className="text-sm text-gray-500 mt-2">
//               Simulation Time: {simulationTime.toLocaleString()}
//             </p>
//           )}
//         </div>

//         <div className="mb-6">
//           <PlaybackControls
//             isPlaying={isPlaying}
//             playbackSpeed={playbackSpeed}
//             onTogglePlayback={togglePlayback}
//             onChangeSpeed={changeSpeed}
//             onReset={resetSimulation}
//           />
//         </div>

//         <FleetMetrics metrics={metrics} />

//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <h3 className="text-lg font-semibold mb-4">Fleet Progress Distribution</h3>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             {Object.entries(metrics.progressBrackets).map(([range, count]) => (
//               <div key={range} className="text-center p-4 bg-gray-50 rounded-lg">
//                 <p className="text-2xl font-bold text-blue-600">{count}</p>
//                 <p className="text-sm text-gray-600">{range}%</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* View Toggle Buttons */}
//         <div className="mb-6">
//           <div className="bg-white rounded-lg shadow-lg p-4">
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setActiveView('trips')}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//                   activeView === 'trips'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 <Truck className="w-4 h-4" />
//                 Trip List View
//               </button>
//               <button
//                 onClick={() => setActiveView('map')}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//                   activeView === 'map'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 <MapPin className="w-4 h-4" />
//                 Map View
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Conditional Rendering based on active view */}
//         {activeView === 'trips' ? (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//             <div className="lg:col-span-2 space-y-4">
//               {trips.map(trip => (
//                 <TripCard 
//                   key={trip.id} 
//                   trip={trip} 
//                   onClick={() => setSelectedTrip(trip)} 
//                 />
//               ))}
//             </div>
//             <div className="space-y-6">
//               <AlertPanel trips={trips} />
//               {/* Small map preview in trip view */}
//               <div className="bg-white rounded-lg shadow-lg p-6">
//                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                   <MapPin className="w-5 h-5 text-blue-600" />
//                   Map Preview
//                 </h3>
//                 <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
//                   <p className="text-gray-500 text-sm text-center">
//                     Switch to Map View for detailed visualization
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           // Map View Layout
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
//             <div className="lg:col-span-3">
//               <MapView trips={trips} />
//             </div>
//             <div className="space-y-6">
//               <AlertPanel trips={trips} />
//               <div className="bg-white rounded-lg shadow-lg p-6">
//                 <h3 className="text-lg font-semibold mb-4">Active Trips</h3>
//                 <div className="space-y-3 max-h-96 overflow-y-auto">
//                   {trips.slice(0, 5).map(trip => (
//                     <div 
//                       key={trip.id}
//                       onClick={() => setSelectedTrip(trip)}
//                       className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
//                     >
//                       <p className="font-medium text-gray-900">
//                         {trip.processedEvents[0]?.vehicle_id || `Vehicle ${trip.id}`}
//                       </p>
//                       <p className="text-sm text-gray-600 capitalize">
//                         {getTripStatus(trip.processedEvents || []).replace('_', ' ')}
//                       </p>
//                       <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//                         <div
//                           className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                           style={{ width: `${calculateProgress(trip.processedEvents || [])}%` }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <EventTimeline events={recentEvents} />

//         {selectedTrip && (
//           <TripModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
//         )}
//       </div>
//     </div>
//   );
// };

// // Separate modal component to prevent re-renders
// const TripModal = React.memo(({ trip, onClose }) => {
//   const recentEvents = useMemo(() => {
//     return (trip.processedEvents || []).slice(-20).reverse();
//   }, [trip]);

//   const tripMetrics = useMemo(() => {
//     const events = trip.processedEvents || [];
//     const locationEvents = events.filter(e => e.event_type === 'location_ping');
//     const lastLocation = locationEvents[locationEvents.length - 1];
//     const alertEvents = events.filter(e => 
//       ['overspeed_detected', 'harsh_braking', 'harsh_acceleration', 
//        'low_fuel_warning', 'critical_fuel_alert'].includes(e.event_type)
//     );

//     return {
//       totalEvents: events.length,
//       locationPings: locationEvents.length,
//       currentSpeed: lastLocation?.movement?.speed_kmh || 0,
//       totalAlerts: alertEvents.length,
//       distanceCovered: lastLocation?.distance_travelled_km || 0
//     };
//   }, [trip]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex items-start justify-between mb-6">
//             <div>
//               <h2 className="text-2xl font-bold">
//                 {trip.fileName.replace('.json', '').replace(/_/g, ' ')}
//               </h2>
//               <p className="text-gray-600">
//                 Vehicle {trip.processedEvents[0]?.vehicle_id || 'Unknown'}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 p-2"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             <div className="p-4 bg-blue-50 rounded-lg">
//               <p className="text-sm text-blue-600">Total Events</p>
//               <p className="text-2xl font-bold text-blue-700">{tripMetrics.totalEvents}</p>
//             </div>
//             <div className="p-4 bg-green-50 rounded-lg">
//               <p className="text-sm text-green-600">Location Pings</p>
//               <p className="text-2xl font-bold text-green-700">{tripMetrics.locationPings}</p>
//             </div>
//             <div className="p-4 bg-orange-50 rounded-lg">
//               <p className="text-sm text-orange-600">Current Speed</p>
//               <p className="text-2xl font-bold text-orange-700">{tripMetrics.currentSpeed} km/h</p>
//             </div>
//             <div className="p-4 bg-red-50 rounded-lg">
//               <p className="text-sm text-red-600">Alerts</p>
//               <p className="text-2xl font-bold text-red-700">{tripMetrics.totalAlerts}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div>
//               <h3 className="font-semibold mb-3 text-lg">Trip Information</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
//                   <span className="text-gray-600">Status</span>
//                   <span className="font-medium capitalize">
//                     {getTripStatus(trip.processedEvents || []).replace('_', ' ')}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
//                   <span className="text-gray-600">Progress</span>
//                   <span className="font-medium">
//                     {calculateProgress(trip.processedEvents || []).toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
//                   <span className="text-gray-600">Distance Covered</span>
//                   <span className="font-medium">
//                     {tripMetrics.distanceCovered.toFixed(1)} km
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
//                   <span className="text-gray-600">Trip Duration</span>
//                   <span className="font-medium">
//                     {trip.processedEvents && trip.processedEvents.length > 1 
//                       ? `${((new Date(trip.processedEvents[trip.processedEvents.length - 1].timestamp) - new Date(trip.processedEvents[0].timestamp)) / (1000 * 60 * 60)).toFixed(1)} hrs`
//                       : '0 hrs'
//                     }
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold mb-3 text-lg">Recent Events</h3>
//               <div className="space-y-2 max-h-80 overflow-y-auto">
//                 {recentEvents.map((event, idx) => (
//                   <div 
//                     key={`${event.event_id}-${idx}`} 
//                     className="p-3 bg-gray-50 rounded text-sm flex items-center gap-3"
//                   >
//                     <span className="text-xl flex-shrink-0">{getEventIcon(event.event_type)}</span>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900 truncate">
//                         {event.event_type.replace(/_/g, ' ').toUpperCase()}
//                       </p>
//                       <p className="text-gray-500 text-xs">
//                         {new Date(event.timestamp).toLocaleString()}
//                       </p>
//                       {event.location && (
//                         <p className="text-xs text-gray-400 mt-1">
//                           {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// TripModal.displayName = 'TripModal';

// export default Dashboard;


import React, { useState, useMemo } from 'react';
import { Truck, MapPin, X } from 'lucide-react'; // removed unused icons
import { useFleetTracking } from '../hooks/useFleetTracking';
import { calculateFleetMetrics } from '../utils/metrics';
import { getTripStatus, calculateProgress, getEventIcon } from '../utils/eventProcessor'; // removed getLatestLocationForTrip
import PlaybackControls from './PlaybackControls';
import FleetMetrics from './FleetMetrics';
import TripCard from './TripCard';
import EventTimeline from './EventTimeline';
import AlertPanel from './AlertPanel';
import MapView from './MapView';

const Dashboard = () => {
  const {
    trips,
    isPlaying,
    playbackSpeed,
    simulationTime,
    loading,
    togglePlayback,
    changeSpeed,
    resetSimulation
  } = useFleetTracking();

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [activeView, setActiveView] = useState('trips'); // 'trips' or 'map'

  // Optimized calculations with useMemo
  const metrics = useMemo(() => calculateFleetMetrics(trips), [trips]);
  
  const recentEvents = useMemo(() => {
    return trips
      .flatMap(trip => trip.processedEvents || [])
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50); // Limit to 50 most recent events
  }, [trips]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Truck className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-bounce" />
          <p className="text-xl font-semibold text-gray-700">Loading Fleet Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fleet Tracking Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring of {trips.length} simultaneous trips</p>
          {simulationTime && (
            <p className="text-sm text-gray-500 mt-2">
              Simulation Time: {simulationTime.toLocaleString()}
            </p>
          )}
        </div>

        <div className="mb-6">
          <PlaybackControls
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onTogglePlayback={togglePlayback}
            onChangeSpeed={changeSpeed}
            onReset={resetSimulation}
          />
        </div>

        <FleetMetrics metrics={metrics} />

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Fleet Progress Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(metrics.progressBrackets).map(([range, count]) => (
              <div key={range} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-sm text-gray-600">{range}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView('trips')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'trips'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Truck className="w-4 h-4" />
                Trip List View
              </button>
              <button
                onClick={() => setActiveView('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'map'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Map View
              </button>
            </div>
          </div>
        </div>

        {/* Conditional Rendering based on active view */}
        {activeView === 'trips' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-4">
              {trips.map(trip => (
                <TripCard 
                  key={trip.id} 
                  trip={trip} 
                  onClick={() => setSelectedTrip(trip)} 
                />
              ))}
            </div>
            <div className="space-y-6">
              <AlertPanel trips={trips} />
              {/* Small map preview in trip view */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Map Preview
                </h3>
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-sm text-center">
                    Switch to Map View for detailed visualization
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Map View Layout
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3">
              <MapView trips={trips} />
            </div>
            <div className="space-y-6">
              <AlertPanel trips={trips} />
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Active Trips</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {trips.slice(0, 5).map(trip => (
                    <div 
                      key={trip.id}
                      onClick={() => setSelectedTrip(trip)}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <p className="font-medium text-gray-900">
                        {trip.processedEvents[0]?.vehicle_id || `Vehicle ${trip.id}`}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {getTripStatus(trip.processedEvents || []).replace('_', ' ')}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(trip.processedEvents || [])}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <EventTimeline events={recentEvents} />

        {selectedTrip && (
          <TripModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
        )}
      </div>
    </div>
  );
};

// Separate modal component to prevent re-renders
const TripModal = React.memo(({ trip, onClose }) => {
  const recentEvents = useMemo(() => {
    return (trip.processedEvents || []).slice(-20).reverse();
  }, [trip]);

  const tripMetrics = useMemo(() => {
    const events = trip.processedEvents || [];
    const locationEvents = events.filter(e => e.event_type === 'location_ping');
    const lastLocation = locationEvents[locationEvents.length - 1];
    const alertEvents = events.filter(e => 
      ['overspeed_detected', 'harsh_braking', 'harsh_acceleration', 
       'low_fuel_warning', 'critical_fuel_alert'].includes(e.event_type)
    );

    return {
      totalEvents: events.length,
      locationPings: locationEvents.length,
      currentSpeed: lastLocation?.movement?.speed_kmh || 0,
      totalAlerts: alertEvents.length,
      distanceCovered: lastLocation?.distance_travelled_km || 0
    };
  }, [trip]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {trip.fileName.replace('.json', '').replace(/_/g, ' ')}
              </h2>
              <p className="text-gray-600">
                Vehicle {trip.processedEvents[0]?.vehicle_id || 'Unknown'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Total Events</p>
              <p className="text-2xl font-bold text-blue-700">{tripMetrics.totalEvents}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Location Pings</p>
              <p className="text-2xl font-bold text-green-700">{tripMetrics.locationPings}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600">Current Speed</p>
              <p className="text-2xl font-bold text-orange-700">{tripMetrics.currentSpeed} km/h</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Alerts</p>
              <p className="text-2xl font-bold text-red-700">{tripMetrics.totalAlerts}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-lg">Trip Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium capitalize">
                    {getTripStatus(trip.processedEvents || []).replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {calculateProgress(trip.processedEvents || []).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Distance Covered</span>
                  <span className="font-medium">
                    {tripMetrics.distanceCovered.toFixed(1)} km
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Trip Duration</span>
                  <span className="font-medium">
                    {trip.processedEvents && trip.processedEvents.length > 1 
                      ? `${((new Date(trip.processedEvents[trip.processedEvents.length - 1].timestamp) - new Date(trip.processedEvents[0].timestamp)) / (1000 * 60 * 60)).toFixed(1)} hrs`
                      : '0 hrs'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-lg">Recent Events</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {recentEvents.map((event, idx) => (
                  <div 
                    key={`${event.event_id}-${idx}`} 
                    className="p-3 bg-gray-50 rounded text-sm flex items-center gap-3"
                  >
                    <span className="text-xl flex-shrink-0">{getEventIcon(event.event_type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {event.event_type.replace(/_/g, ' ').toUpperCase()}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.location && (
                        <p className="text-xs text-gray-400 mt-1">
                          {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TripModal.displayName = 'TripModal';

export default Dashboard;


