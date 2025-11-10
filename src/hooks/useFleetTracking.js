// // import { useState, useEffect, useCallback, useRef } from 'react';
// // import { loadTripData, getEventsSince } from '../utils/eventProcessor';

// // const TRIP_FILES = [
// //   'trip_1_cross_country.json',
// //   'trip_2_urban_dense.json',
// //   'trip_3_mountain_cancelled.json',
// //   'trip_4_southern_technical.json',
// //   'trip_5_regional_logistics.json'
// // ];

// // export const useFleetTracking = () => {
// //   const [trips, setTrips] = useState([]);
// //   const [isPlaying, setIsPlaying] = useState(false);
// //   const [playbackSpeed, setPlaybackSpeed] = useState(1);
// //   const [simulationTime, setSimulationTime] = useState(null);
// //   const [loading, setLoading] = useState(true);
  
// //   const intervalRef = useRef(null);
// //   const startTimeRef = useRef(null);

// //   // Load trip data on mount
// //   useEffect(() => {
// //     const loadData = async () => {
// //       setLoading(true);
// //       try {
// //         const loadedTrips = await loadTripData(TRIP_FILES);
        
// //         // Find the earliest timestamp across all trips
// //         let earliestTime = null;
// //         loadedTrips.forEach(trip => {
// //           if (trip.events && trip.events.length > 0) {
// //             const tripStartTime = new Date(trip.events[0].timestamp);
// //             if (!earliestTime || tripStartTime < earliestTime) {
// //               earliestTime = tripStartTime;
// //             }
// //           }
// //         });

// //         startTimeRef.current = earliestTime;
// //         setSimulationTime(earliestTime);
        
// //         // Initialize with empty processed events
// //         const initializedTrips = loadedTrips.map(trip => ({
// //           ...trip,
// //           processedEvents: []
// //         }));
        
// //         setTrips(initializedTrips);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error loading fleet data:', error);
// //         setLoading(false);
// //       }
// //     };

// //     loadData();
// //   }, []);

// //   // Simulation logic
// //   useEffect(() => {
// //     if (!isPlaying || !simulationTime || trips.length === 0) {
// //       if (intervalRef.current) {
// //         clearInterval(intervalRef.current);
// //         intervalRef.current = null;
// //       }
// //       return;
// //     }

// //     // Update interval based on playback speed (100ms real time = speed * seconds simulated)
// //     const updateInterval = 100; // milliseconds
// //     const timeIncrement = playbackSpeed * 1000; // milliseconds of simulated time

// //     intervalRef.current = setInterval(() => {
// //       setSimulationTime(prevTime => {
// //         const newTime = new Date(prevTime.getTime() + timeIncrement);
        
// //         // Check if all trips are finished
// //         const allTripsFinished = trips.every(trip => {
// //           const lastEvent = trip.events[trip.events.length - 1];
// //           return new Date(lastEvent.timestamp) <= newTime;
// //         });

// //         if (allTripsFinished) {
// //           setIsPlaying(false);
// //           return prevTime;
// //         }

// //         return newTime;
// //       });
// //     }, updateInterval);

// //     return () => {
// //       if (intervalRef.current) {
// //         clearInterval(intervalRef.current);
// //       }
// //     };
// //   }, [isPlaying, playbackSpeed, trips]);

// //   // Update processed events based on simulation time
// //   useEffect(() => {
// //     if (!simulationTime || trips.length === 0) return;

// //     setTrips(prevTrips => 
// //       prevTrips.map(trip => ({
// //         ...trip,
// //         processedEvents: getEventsSince(trip.events, simulationTime)
// //       }))
// //     );
// //   }, [simulationTime]);

// //   const togglePlayback = useCallback(() => {
// //     setIsPlaying(prev => !prev);
// //   }, []);

// //   const changeSpeed = useCallback((speed) => {
// //     setPlaybackSpeed(speed);
// //   }, []);

// //   const resetSimulation = useCallback(() => {
// //     setIsPlaying(false);
// //     setSimulationTime(startTimeRef.current);
// //     setTrips(prevTrips => 
// //       prevTrips.map(trip => ({
// //         ...trip,
// //         processedEvents: []
// //       }))
// //     );
// //   }, []);

// //   const seekTo = useCallback((percentage) => {
// //     if (!startTimeRef.current || trips.length === 0) return;

// //     // Find the latest timestamp across all trips
// //     let latestTime = startTimeRef.current;
// //     trips.forEach(trip => {
// //       if (trip.events && trip.events.length > 0) {
// //         const tripEndTime = new Date(trip.events[trip.events.length - 1].timestamp);
// //         if (tripEndTime > latestTime) {
// //           latestTime = tripEndTime;
// //         }
// //       }
// //     });

// //     const totalDuration = latestTime - startTimeRef.current;
// //     const newTime = new Date(startTimeRef.current.getTime() + (totalDuration * percentage / 100));
// //     setSimulationTime(newTime);
// //   }, [trips]);

// //   return {
// //     trips,
// //     isPlaying,
// //     playbackSpeed,
// //     simulationTime,
// //     loading,
// //     togglePlayback,
// //     changeSpeed,
// //     resetSimulation,
// //     seekTo
// //   };
// // };

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { loadTripData, getEventsSince } from '../utils/eventProcessor';

// const TRIP_FILES = [
//   'trip_1_cross_country.json',
//   'trip_2_urban_dense.json',
//   'trip_3_mountain_cancelled.json',
//   'trip_4_southern_technical.json',
//   'trip_5_regional_logistics.json'
// ];

// export const useFleetTracking = () => {
//   const [trips, setTrips] = useState([]);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [simulationTime, setSimulationTime] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   const intervalRef = useRef(null);
//   const startTimeRef = useRef(null);
//   const tripsLengthRef = useRef(0);

//   // Load trip data on mount
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       console.log('Loading trip data...');
//       try {
//         const loadedTrips = await loadTripData(TRIP_FILES);
        
//         console.log('Loaded trips:', loadedTrips.map(t => ({
//           file: t.fileName,
//           eventCount: t.events.length
//         })));
        
//         // Find the earliest timestamp across all trips
//         let earliestTime = null;
//         loadedTrips.forEach(trip => {
//           if (trip.events && trip.events.length > 0) {
//             const tripStartTime = new Date(trip.events[0].timestamp);
//             if (!earliestTime || tripStartTime < earliestTime) {
//               earliestTime = tripStartTime;
//             }
//           }
//         });

//         startTimeRef.current = earliestTime;
//         setSimulationTime(earliestTime);
        
//         // Initialize with empty processed events
//         const initializedTrips = loadedTrips.map(trip => ({
//           ...trip,
//           processedEvents: []
//         }));
        
//         setTrips(initializedTrips);
//         tripsLengthRef.current = initializedTrips.length;
//         setLoading(false);
//         console.log('Trip data loaded successfully!');
//       } catch (error) {
//         console.error('Error loading fleet data:', error);
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Simulation logic - optimized update interval
//   useEffect(() => {
//     if (!isPlaying || !simulationTime || tripsLengthRef.current === 0) {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//       return;
//     }

//     // Optimized: Update less frequently for better performance
//     const updateInterval = 200; // 200ms instead of 100ms
//     const timeIncrement = playbackSpeed * 2000; // 2 seconds per update

//     intervalRef.current = setInterval(() => {
//       setSimulationTime(prevTime => {
//         const newTime = new Date(prevTime.getTime() + timeIncrement);
        
//         // Check if all trips are finished
//         setTrips(currentTrips => {
//           const allTripsFinished = currentTrips.every(trip => {
//             const lastEvent = trip.events[trip.events.length - 1];
//             return new Date(lastEvent.timestamp) <= newTime;
//           });

//           if (allTripsFinished) {
//             setIsPlaying(false);
//             console.log('All trips completed!');
//           }

//           return currentTrips;
//         });

//         return newTime;
//       });
//     }, updateInterval);

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [isPlaying, playbackSpeed, simulationTime]);

//   // Update processed events based on simulation time
//   // Optimized: Use useMemo pattern to avoid unnecessary recalculations
//   useEffect(() => {
//     if (!simulationTime || tripsLengthRef.current === 0) return;

//     setTrips(prevTrips => 
//       prevTrips.map(trip => ({
//         ...trip,
//         processedEvents: getEventsSince(trip.events, simulationTime)
//       }))
//     );
//   }, [simulationTime]);

//   const togglePlayback = useCallback(() => {
//     setIsPlaying(prev => !prev);
//   }, []);

//   const changeSpeed = useCallback((speed) => {
//     setPlaybackSpeed(speed);
//     console.log(`Playback speed changed to ${speed}x`);
//   }, []);

//   const resetSimulation = useCallback(() => {
//     setIsPlaying(false);
//     setSimulationTime(startTimeRef.current);
//     setTrips(prevTrips => 
//       prevTrips.map(trip => ({
//         ...trip,
//         processedEvents: []
//       }))
//     );
//     console.log('Simulation reset');
//   }, []);

//   const seekTo = useCallback((percentage) => {
//     if (!startTimeRef.current || tripsLengthRef.current === 0) return;

//     setTrips(currentTrips => {
//       let latestTime = startTimeRef.current;
//       currentTrips.forEach(trip => {
//         if (trip.events && trip.events.length > 0) {
//           const tripEndTime = new Date(trip.events[trip.events.length - 1].timestamp);
//           if (tripEndTime > latestTime) {
//             latestTime = tripEndTime;
//           }
//         }
//       });

//       const totalDuration = latestTime - startTimeRef.current;
//       const newTime = new Date(startTimeRef.current.getTime() + (totalDuration * percentage / 100));
//       setSimulationTime(newTime);
//       console.log(`Seeked to ${percentage}%`);

//       return currentTrips;
//     });
//   }, []);

//   return {
//     trips,
//     isPlaying,
//     playbackSpeed,
//     simulationTime,
//     loading,
//     togglePlayback,
//     changeSpeed,
//     resetSimulation,
//     seekTo
//   };
// };

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { loadTripData, getEventsSince } from '../utils/eventProcessor';

// const TRIP_FILES = [
//   'trip_1_cross_country.json',
//   'trip_2_urban_dense.json',
//   'trip_3_mountain_cancelled.json',
//   'trip_4_southern_technical.json',
//   'trip_5_regional_logistics.json'
// ];

// export const useFleetTracking = () => {
//   const [trips, setTrips] = useState([]);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [simulationTime, setSimulationTime] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   const intervalRef = useRef(null);
//   const startTimeRef = useRef(null);
//   const rawTripsRef = useRef([]);

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const loadedTrips = await loadTripData(TRIP_FILES);
        
//         let earliestTime = null;
//         loadedTrips.forEach(trip => {
//           if (trip.events && trip.events.length > 0) {
//             const tripStartTime = new Date(trip.events[0].timestamp);
//             if (!earliestTime || tripStartTime < earliestTime) {
//               earliestTime = tripStartTime;
//             }
//           }
//         });

//         startTimeRef.current = earliestTime;
//         setSimulationTime(earliestTime);
        
//         const initializedTrips = loadedTrips.map(trip => ({
//           ...trip,
//           processedEvents: []
//         }));
        
//         rawTripsRef.current = loadedTrips;
//         setTrips(initializedTrips);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error loading fleet data:', error);
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   useEffect(() => {
//     if (!isPlaying || !simulationTime || rawTripsRef.current.length === 0) {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//       return;
//     }

//     const updateInterval = 250;
//     const timeIncrement = playbackSpeed * 2500;

//     intervalRef.current = setInterval(() => {
//       setSimulationTime(prevTime => {
//         const newTime = new Date(prevTime.getTime() + timeIncrement);
        
//         const allTripsFinished = rawTripsRef.current.every(trip => {
//           const lastEvent = trip.events[trip.events.length - 1];
//           return new Date(lastEvent.timestamp) <= newTime;
//         });

//         if (allTripsFinished) {
//           setIsPlaying(false);
//         }

//         return newTime;
//       });
//     }, updateInterval);

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [isPlaying, playbackSpeed]);

//   useEffect(() => {
//     if (!simulationTime || rawTripsRef.current.length === 0) return;

//     setTrips(rawTripsRef.current.map(trip => ({
//       ...trip,
//       processedEvents: getEventsSince(trip.events, simulationTime)
//     })));
//   }, [simulationTime]);

//   const togglePlayback = useCallback(() => {
//     setIsPlaying(prev => !prev);
//   }, []);

//   const changeSpeed = useCallback((speed) => {
//     setPlaybackSpeed(speed);
//   }, []);

//   const resetSimulation = useCallback(() => {
//     setIsPlaying(false);
//     setSimulationTime(startTimeRef.current);
//     setTrips(rawTripsRef.current.map(trip => ({
//       ...trip,
//       processedEvents: []
//     })));
//   }, []);

//   return {
//     trips,
//     isPlaying,
//     playbackSpeed,
//     simulationTime,
//     loading,
//     togglePlayback,
//     changeSpeed,
//     resetSimulation
//   };
// };

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadTripData, getEventsSince } from '../utils/eventProcessor';

const TRIP_FILES = [
  'trip_1_cross_country.json',
  'trip_2_urban_dense.json',
  'trip_3_mountain_cancelled.json',
  'trip_4_southern_technical.json',
  'trip_5_regional_logistics.json'
];

export const useFleetTracking = () => {
  const [trips, setTrips] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [simulationTime, setSimulationTime] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const rawTripsRef = useRef([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const loadedTrips = await loadTripData(TRIP_FILES);
        
        let earliestTime = null;
        loadedTrips.forEach(trip => {
          if (trip.events && trip.events.length > 0) {
            const tripStartTime = new Date(trip.events[0].timestamp);
            if (!earliestTime || tripStartTime < earliestTime) {
              earliestTime = tripStartTime;
            }
          }
        });

        startTimeRef.current = earliestTime;
        setSimulationTime(earliestTime);
        
        const initializedTrips = loadedTrips.map(trip => ({
          ...trip,
          processedEvents: []
        }));
        
        rawTripsRef.current = loadedTrips;
        setTrips(initializedTrips);
        setLoading(false);
      } catch (error) {
        console.error('Error loading fleet data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isPlaying || !simulationTime || rawTripsRef.current.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const updateInterval = 300; // Increased interval for better performance
    const timeIncrement = playbackSpeed * 3000; // 3 seconds per update

    intervalRef.current = setInterval(() => {
      setSimulationTime(prevTime => {
        const newTime = new Date(prevTime.getTime() + timeIncrement);
        
        const allTripsFinished = rawTripsRef.current.every(trip => {
          const lastEvent = trip.events[trip.events.length - 1];
          return new Date(lastEvent.timestamp) <= newTime;
        });

        if (allTripsFinished) {
          setIsPlaying(false);
        }

        return newTime;
      });
    }, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Throttle the event processing
  useEffect(() => {
    if (!simulationTime || rawTripsRef.current.length === 0) return;

    const updateTrips = () => {
      setTrips(rawTripsRef.current.map(trip => ({
        ...trip,
        processedEvents: getEventsSince(trip.events, simulationTime)
      })));
    };

    // Use requestAnimationFrame for better performance
    const rafId = requestAnimationFrame(updateTrips);
    return () => cancelAnimationFrame(rafId);
  }, [simulationTime]);

  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const changeSpeed = useCallback((speed) => {
    setPlaybackSpeed(speed);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsPlaying(false);
    setSimulationTime(startTimeRef.current);
    setTrips(rawTripsRef.current.map(trip => ({
      ...trip,
      processedEvents: []
    })));
  }, []);

  return {
    trips,
    isPlaying,
    playbackSpeed,
    simulationTime,
    loading,
    togglePlayback,
    changeSpeed,
    resetSimulation
  };
};