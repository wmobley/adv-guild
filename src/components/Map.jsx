// src/components/Map.jsx
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

const defaultLocations = [
  {
    name: "O. Henry Museum",
    description: "Home of America's twist-ending master.",
    coords: [30.2672, -97.7431],
  },
  {
    name: "Branch Davidian Compound",
    description: "Apocalyptic modern myth site.",
    coords: [31.5820, -97.1771],
  },
  {
    name: "Hot Springs National Park",
    description: "Native healing waters turned luxury spa town.",
    coords: [34.5133, -93.0540],
  },
  {
    name: "Petit Jean State Park",
    description: "Named after a ghostly love legend.",
    coords: [35.1334, -92.9371],
  },
  {
    name: "Memphis Pyramid",
    description: "Modern monument to weird Americana.",
    coords: [35.1557, -90.0520],
  },
  {
    name: "Bell Witch Cave",
    description: "Infamous American haunting legend.",
    coords: [36.5850, -87.0669],
  },
  {
    name: "Jonesborough, TN",
    description: "Oldest town in TN, home of storytelling.",
    coords: [36.2948, -82.4735],
  },
];

// Helper function to validate coordinates
const isValidCoords = (coords) => {
  console.log('🔍 [Map] Validating coords:', coords, 'Type:', typeof coords);
  
  if (!coords) {
    console.log('❌ [Map] Coords is falsy');
    return false;
  }
  
  if (!Array.isArray(coords)) {
    console.log('❌ [Map] Coords is not an array, it is:', typeof coords);
    return false;
  }
  
  if (coords.length !== 2) {
    console.log('❌ [Map] Coords array length is not 2, it is:', coords.length);
    return false;
  }
  
  const [lat, lng] = coords;
  console.log('🔍 [Map] Lat:', lat, 'Type:', typeof lat, 'Lng:', lng, 'Type:', typeof lng);
  
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    console.log('❌ [Map] Lat or Lng is not a number');
    return false;
  }
  
  if (isNaN(lat) || isNaN(lng)) {
    console.log('❌ [Map] Lat or Lng is NaN');
    return false;
  }
  
  if (lat < -90 || lat > 90) {
    console.log('❌ [Map] Lat out of range:', lat);
    return false;
  }
  
  if (lng < -180 || lng > 180) {
    console.log('❌ [Map] Lng out of range:', lng);
    return false;
  }
  
  console.log('✅ [Map] Coords are valid');
  return true;
};

// Helper function to normalize location data
const normalizeLocationData = (location) => {
  console.log('🔄 [Map] Normalizing location data:', location);
  
  if (!location) {
    console.log('❌ [Map] No location data provided');
    return null;
  }

  let coords = null;

  // Check if coords already exists and is valid
  if (location.coords && isValidCoords(location.coords)) {
    coords = location.coords;
  }
  // Check if latitude/longitude properties exist
  else if (location.latitude !== undefined && location.longitude !== undefined) {
    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      coords = [lat, lng];
      console.log('🔄 [Map] Converted lat/lng to coords:', coords);
    }
  }
  // Check if lat/lng properties exist (alternative naming)
  else if (location.lat !== undefined && location.lng !== undefined) {
    const lat = parseFloat(location.lat);
    const lng = parseFloat(location.lng);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      coords = [lat, lng];
      console.log('🔄 [Map] Converted lat/lng to coords:', coords);
    }
  }

  if (!coords || !isValidCoords(coords)) {
    console.log('❌ [Map] Could not extract valid coordinates from location data');
    return null;
  }

  return {
    ...location,
    coords: coords
  };
};

export default function Map({ 
  locations = defaultLocations, 
  center = [34.5, -92.5], 
  zoom = 6, 
  mapId = "myth-map",
  height = "400px"
}) {
  console.log('🗺️ [Map] Component render with props:', {
    locations,
    locationsLength: locations?.length,
    locationsType: typeof locations,
    locationsIsArray: Array.isArray(locations),
    center,
    zoom,
    mapId,
    height
  });

  useEffect(() => {
    console.log('🚀 [Map] useEffect running');
    console.log('📍 [Map] Locations data:', locations);

    try {
      // Remove existing map if it exists
      const existingMap = document.getElementById(mapId);
      if (existingMap && existingMap._leaflet_id) {
        console.log('🧹 [Map] Removing existing map');
        existingMap._leaflet_id = null;
      }

      console.log('🔧 [Map] Creating new map with center:', center, 'zoom:', zoom);
      const map = L.map(mapId).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const bounds = [];

      console.log(`📍 [Map] Processing ${locations.length} locations`);

      locations.forEach((loc, index) => {
        console.log(`\n📍 [Map] Processing location ${index}:`, loc);

        if (!loc) {
          console.warn(`⚠️ [Map] Location at index ${index} is null or undefined`);
          return;
        }

        // Normalize the location data to ensure coords are in the right format
        const normalizedLocation = normalizeLocationData(loc);
        
        if (!normalizedLocation) {
          console.warn(`⚠️ [Map] Could not normalize location at index ${index}:`, loc);
          return;
        }

        console.log(`🔍 [Map] Normalized location ${index} coords:`, normalizedLocation.coords);

        try {
          console.log(`✨ [Map] Creating Leaflet marker ${index} with coords:`, normalizedLocation.coords);
          const marker = L.marker(normalizedLocation.coords).addTo(map);
          
          const popupContent = `<strong>${normalizedLocation.name || 'Unknown'}</strong><br>${normalizedLocation.description || 'No description'}`;
          console.log(`🎈 [Map] Adding popup to marker ${index}:`, popupContent);
          marker.bindPopup(popupContent);
          
          bounds.push(normalizedLocation.coords);
          console.log(`✅ [Map] Marker ${index} created successfully`);
        } catch (error) {
          console.error(`❌ [Map] Error creating marker at index ${index}:`, error);
          console.error('❌ [Map] Location data:', normalizedLocation);
          console.error('❌ [Map] Error stack:', error.stack);
        }
      });

      console.log(`📏 [Map] Bounds array has ${bounds.length} entries:`, bounds);

      if (bounds.length > 1) {
        try {
          console.log('🎯 [Map] Fitting map to bounds');
          map.fitBounds(bounds, { padding: [50, 50] });
        } catch (error) {
          console.error('❌ [Map] Error fitting bounds:', error);
          console.error('❌ [Map] Bounds data:', bounds);
        }
      }

      return () => {
        try {
          console.log('🧹 [Map] Cleanup - removing map');
          map.remove(); // Cleanup
        } catch (error) {
          console.error('❌ [Map] Error during cleanup:', error);
        }
      };
    } catch (error) {
      console.error('❌ [Map] Error in useEffect:', error);
      console.error('❌ [Map] Error stack:', error.stack);
      console.error('❌ [Map] Props at time of error:', {
        locations,
        center,
        zoom,
        mapId,
        height
      });
    }
  }, [locations, center, zoom, mapId]);

  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <div id={mapId} className="w-full z-0 rounded-xl" style={{ height }} />
    </div>
  );
}
