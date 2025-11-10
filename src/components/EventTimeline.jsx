// // import React from 'react';
// // import { getEventIcon } from '../utils/eventProcessor';

// // const EventTimeline = ({ events }) => {
// //   const recentEvents = events.slice(0, 15);

// //   return (
// //     <div className="bg-white rounded-lg shadow-lg p-6">
// //       <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
// //       <div className="space-y-3 max-h-96 overflow-y-auto">
// //         {recentEvents.length === 0 ? (
// //           <p className="text-gray-500 text-center py-8">No events yet. Press Play to start simulation.</p>
// //         ) : (
// //           recentEvents.map((event, index) => (
// //             <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg slide-in">
// //               <span className="text-2xl">{getEventIcon(event.event_type)}</span>
// //               <div className="flex-1">
// //                 <p className="font-medium text-gray-900">
// //                   {event.event_type.replace(/_/g, ' ').toUpperCase()}
// //                 </p>
// //                 <p className="text-sm text-gray-600">
// //                   {event.vehicle_id} • {new Date(event.timestamp).toLocaleTimeString()}
// //                 </p>
// //                 {event.location && (
// //                   <p className="text-xs text-gray-500 mt-1">
// //                     {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default EventTimeline;

// import React, { useMemo } from 'react';
// import { getEventIcon } from '../utils/eventProcessor';

// const EventTimeline = ({ events }) => {
//   // Only render the most recent 20 events for performance
//   const recentEvents = useMemo(() => {
//     return events.slice(0, 20);
//   }, [events]);

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6">
//       <h3 className="text-lg font-semibold mb-4">
//         Recent Events (Last 20 of {events.length.toLocaleString()})
//       </h3>
//       <div className="space-y-3 max-h-96 overflow-y-auto">
//         {recentEvents.length === 0 ? (
//           <p className="text-gray-500 text-center py-8">No events yet. Press Play to start simulation.</p>
//         ) : (
//           recentEvents.map((event, index) => (
//             <div key={`${event.event_id}-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg slide-in">
//               <span className="text-2xl">{getEventIcon(event.event_type)}</span>
//               <div className="flex-1">
//                 <p className="font-medium text-gray-900">
//                   {event.event_type.replace(/_/g, ' ').toUpperCase()}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   {event.vehicle_id} • {new Date(event.timestamp).toLocaleTimeString()}
//                 </p>
//                 {event.location && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default EventTimeline;

import React, { useMemo } from 'react';
import { getEventIcon } from '../utils/eventProcessor';

const EventTimeline = ({ events }) => {
  const recentEvents = useMemo(() => {
    return events.slice(0, 15);
  }, [events]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        Recent Events (Showing 15 of {events.length.toLocaleString()})
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recentEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No events yet. Press Play to start simulation.</p>
        ) : (
          recentEvents.map((event, index) => (
            <div 
              key={`${event.event_id || index}-${event.timestamp}`} 
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-2xl">{getEventIcon(event.event_type)}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {event.event_type.replace(/_/g, ' ').toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">
                  {event.vehicle_id} • {new Date(event.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(EventTimeline);