// import React from 'react';
// import { getTripStatus, calculateProgress, getLatestLocationForTrip } from '../utils/eventProcessor';

// const TripCard = ({ trip, onClick }) => {
//   const status = getTripStatus(trip.processedEvents);
//   const progress = calculateProgress(trip.processedEvents);
//   const latestLocation = getLatestLocationForTrip(trip.processedEvents);
//   const currentSpeed = latestLocation?.movement?.speed_kmh || 0;

//   const statusColors = {
//     'in_progress': 'bg-blue-100 text-blue-800',
//     'completed': 'bg-green-100 text-green-800',
//     'cancelled': 'bg-red-100 text-red-800',
//     'pending': 'bg-gray-100 text-gray-800'
//   };

//   return (
//     <div
//       onClick={onClick}
//       className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900">
//             Vehicle {trip.processedEvents[0]?.vehicle_id || 'Unknown'}
//           </h3>
//           <p className="text-sm text-gray-600">{trip.fileName.replace('.json', '').replace(/_/g, ' ')}</p>
//         </div>
//         <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
//           {status.replace('_', ' ').toUpperCase()}
//         </span>
//       </div>

//       <div className="mb-4">
//         <div className="flex justify-between text-sm text-gray-600 mb-2">
//           <span>Progress</span>
//           <span>{progress.toFixed(1)}%</span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-2">
//           <div
//             className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4 text-sm">
//         <div>
//           <p className="text-gray-600">Current Speed</p>
//           <p className="font-semibold text-gray-900">{currentSpeed.toFixed(1)} km/h</p>
//         </div>
//         <div>
//           <p className="text-gray-600">Events</p>
//           <p className="font-semibold text-gray-900">{trip.processedEvents.length}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TripCard;

import React from 'react';
import { getTripStatus, calculateProgress, getLatestLocationForTrip } from '../utils/eventProcessor';

const TripCard = React.memo(({ trip, onClick }) => {
  const status = getTripStatus(trip.processedEvents);
  const progress = calculateProgress(trip.processedEvents);
  const latestLocation = getLatestLocationForTrip(trip.processedEvents);
  const currentSpeed = latestLocation?.movement?.speed_kmh || 0;

  const statusColors = {
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'pending': 'bg-gray-100 text-gray-800'
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Vehicle {trip.processedEvents[0]?.vehicle_id || 'Unknown'}
          </h3>
          <p className="text-sm text-gray-600">{trip.fileName.replace('.json', '').replace(/_/g, ' ')}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Speed</p>
          <p className="font-semibold text-gray-900">{currentSpeed.toFixed(1)} km/h</p>
        </div>
        <div>
          <p className="text-gray-600">Events</p>
          <p className="font-semibold text-gray-900">{trip.processedEvents.length.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Total</p>
          <p className="font-semibold text-gray-900">{trip.events.length.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
});

TripCard.displayName = 'TripCard';

export default TripCard;