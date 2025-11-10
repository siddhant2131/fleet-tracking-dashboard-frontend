// import React, { useMemo, useRef, useEffect } from 'react';
// import { MapPin, Navigation } from 'lucide-react';

// const MapView = ({ trips }) => {
//   const canvasRef = useRef(null);

//   const activeVehicles = useMemo(() => {
//     return trips.map(trip => {
//       const locationEvents = trip.processedEvents.filter(e => e.event_type === 'location_ping');
//       const lastLocation = locationEvents[locationEvents.length - 1];
      
//       if (!lastLocation?.location) return null;
      
//       return {
//         id: trip.id,
//         vehicleId: trip.processedEvents[0]?.vehicle_id || `Vehicle ${trip.id}`,
//         lat: lastLocation.location.lat,
//         lng: lastLocation.location.lng,
//         speed: lastLocation.movement?.speed_kmh || 0,
//         heading: lastLocation.movement?.heading || 0
//       };
//     }).filter(Boolean);
//   }, [trips]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || activeVehicles.length === 0) return;

//     const ctx = canvas.getContext('2d');
//     const width = canvas.width;
//     const height = canvas.height;

//     ctx.clearRect(0, 0, width, height);

//     // Find bounds
//     const lats = activeVehicles.map(v => v.lat);
//     const lngs = activeVehicles.map(v => v.lng);
//     const minLat = Math.min(...lats) - 0.5;
//     const maxLat = Math.max(...lats) + 0.5;
//     const minLng = Math.min(...lngs) - 0.5;
//     const maxLng = Math.max(...lngs) + 0.5;

//     // Draw vehicles
//     activeVehicles.forEach(vehicle => {
//       const x = ((vehicle.lng - minLng) / (maxLng - minLng)) * width;
//       const y = height - ((vehicle.lat - minLat) / (maxLat - minLat)) * height;

//       // Draw vehicle marker
//       ctx.fillStyle = vehicle.speed > 0 ? '#3b82f6' : '#ef4444';
//       ctx.beginPath();
//       ctx.arc(x, y, 8, 0, 2 * Math.PI);
//       ctx.fill();

//       // Draw label
//       ctx.fillStyle = '#000';
//       ctx.font = '10px sans-serif';
//       ctx.fillText(vehicle.vehicleId, x + 12, y + 4);
//     });
//   }, [activeVehicles]);

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6">
//       <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//         <MapPin className="w-5 h-5 text-blue-600" />
//         Live Map View
//       </h3>
//       <div className="relative bg-gray-100 rounded-lg overflow-hidden">
//         <canvas 
//           ref={canvasRef} 
//           width={800} 
//           height={500}
//           className="w-full h-auto"
//         />
//         {activeVehicles.length === 0 && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <p className="text-gray-500">No active vehicles</p>
//           </div>
//         )}
//       </div>
//       <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-blue-600"></div>
//           <span>Moving</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-red-600"></div>
//           <span>Stopped</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapView;





import React, { useMemo, useRef, useEffect, useState } from 'react';
import { MapPin, Navigation, RefreshCw } from 'lucide-react';

const MapView = ({ trips }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });

  // Update canvas size based on container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: Math.min(800, width - 48), // Account for padding
          height: 400
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const activeVehicles = useMemo(() => {
    if (!trips || trips.length === 0) return [];
    
    return trips.map(trip => {
      const locationEvents = (trip.processedEvents || []).filter(e => e.event_type === 'location_ping');
      const lastLocation = locationEvents[locationEvents.length - 1];
      
      if (!lastLocation?.location) return null;
      
      return {
        id: trip.id,
        vehicleId: trip.processedEvents[0]?.vehicle_id || `Vehicle ${trip.id}`,
        lat: lastLocation.location.lat,
        lng: lastLocation.location.lng,
        speed: lastLocation.movement?.speed_kmh || 0,
        heading: lastLocation.movement?.heading || 0
      };
    }).filter(Boolean);
  }, [trips]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeVehicles.length === 0) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSize;

    // Set canvas display size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // Set canvas drawing buffer size
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    // Scale context to account for device pixel ratio
    ctx.scale(scale, scale);

    // Clear canvas with a light background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Draw grid background
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    const gridSize = 50;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Calculate bounds with padding
    const lats = activeVehicles.map(v => v.lat);
    const lngs = activeVehicles.map(v => v.lng);
    
    if (lats.length === 0 || lngs.length === 0) return;

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Add padding to bounds (10% of range)
    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;
    const padding = 0.1;
    
    const bounds = {
      minLat: minLat - latRange * padding,
      maxLat: maxLat + latRange * padding,
      minLng: minLng - lngRange * padding,
      maxLng: maxLng + lngRange * padding
    };

    // If bounds are too small (single point), expand them
    if (latRange === 0) {
      bounds.minLat -= 0.1;
      bounds.maxLat += 0.1;
    }
    if (lngRange === 0) {
      bounds.minLng -= 0.1;
      bounds.maxLng += 0.1;
    }

    // Draw vehicles
    activeVehicles.forEach(vehicle => {
      const x = ((vehicle.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width;
      const y = height - ((vehicle.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height;

      // Skip if coordinates are invalid
      if (x < 0 || x > width || y < 0 || y > height) return;

      // Draw vehicle direction indicator if moving
      if (vehicle.speed > 0 && vehicle.heading) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((vehicle.heading * Math.PI) / 180);
        
        // Direction triangle
        ctx.fillStyle = vehicle.speed > 0 ? '#3b82f6' : '#ef4444';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(-6, 6);
        ctx.lineTo(6, 6);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      } else {
        // Stationary circle
        ctx.fillStyle = vehicle.speed > 0 ? '#3b82f6' : '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw vehicle label with background
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px sans-serif';
      const text = `${vehicle.vehicleId} (${Math.round(vehicle.speed)} km/h)`;
      const textWidth = ctx.measureText(text).width;
      
      // Label background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(x + 8, y - 18, textWidth + 8, 20);
      
      // Label text
      ctx.fillStyle = '#1f2937';
      ctx.fillText(text, x + 12, y - 4);
    });

    // Draw map border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

  }, [activeVehicles, canvasSize]);

  // Debug information
  console.log('MapView Debug:', {
    tripsCount: trips?.length,
    activeVehiclesCount: activeVehicles.length,
    canvasSize,
    vehicles: activeVehicles
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Live Map View
          {activeVehicles.length > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              ({activeVehicles.length} vehicles)
            </span>
          )}
        </h3>
        <button 
          onClick={() => setCanvasSize(prev => ({ ...prev }))}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          title="Refresh map"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <div 
        ref={containerRef}
        className="relative bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden"
      >
        <canvas 
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="block mx-auto"
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            background: '#f8fafc'
          }}
        />
        
        {activeVehicles.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90">
            <Navigation className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-center">
              {trips?.length > 0 ? 'No vehicle locations available' : 'No trips data'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {trips?.length > 0 ? 'Start simulation to see vehicle positions' : 'Loading trip data...'}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span>Moving Vehicles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span>Stopped Vehicles</span>
        </div>
      </div>
      
      {activeVehicles.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            Showing {activeVehicles.length} active vehicle{activeVehicles.length !== 1 ? 's' : ''} on map
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(MapView);