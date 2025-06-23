// src/components/Map.jsx
import React, { useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client'; // Import createRoot
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
  // Refs to hold the map instance and a layer group for markers
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);

  // Effect for initial map creation (runs once on mount)
  useEffect(() => {
    console.log('🚀 [Map] Initializing map...');
    if (mapRef.current) {
      // Map already initialized, skip
      console.log('⚠️ [Map] Map already initialized, skipping re-initialization.');
      return;
    }

    try {
      const map = L.map(mapId).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      mapRef.current = map; // Store the map instance
      markerLayerRef.current = L.layerGroup().addTo(map); // Create a layer group for markers

      console.log('✅ [Map] Map initialized successfully.');

      // Cleanup function to remove the map when the component unmounts
      return () => {
        if (mapRef.current) {
          console.log('🧹 [Map] Cleaning up map instance.');
          mapRef.current.remove();
          mapRef.current = null;
          markerLayerRef.current = null; // Clear marker layer ref too
        }
      };
    } catch (error) {
      console.error('❌ [Map] Error during initial map setup:', error);
    }
  }, [mapId, center, zoom]); // mapId, center, zoom are part of initial setup, so they are dependencies here.

  // Effect for updating markers and fitting bounds (runs when 'locations' prop changes)
  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;

    if (!map || !markerLayer) {
      console.log('⏳ [Map] Map or marker layer not ready for updates.');
      return; // Map not yet initialized
    }

    console.log('🔄 [Map] Updating map markers and view based on locations prop...');

    try {
      // Clear all existing markers from the layer group
      markerLayer.clearLayers();
      const leafletMarkers = []; // Renamed from validMarkers for clarity with Leaflet objects

      if (locations && Array.isArray(locations) && locations.length > 0) {
        locations.forEach((loc, index) => {
          // console.log(`\n📍 [Map] Processing location ${index} for update:`, loc); // Re-enable for detailed debug if needed

          if (!loc) {
            console.warn(`⚠️ [Map] Location at index ${index} is null or undefined, skipping.`);
            return;
          }

          const normalizedLocation = normalizeLocationData(loc);
          
          if (!normalizedLocation || !normalizedLocation.coords) {
            console.warn(`⚠️ [Map] Could not normalize valid coordinates for location at index ${index}, skipping:`, loc);
            return;
          }

          try {
            const marker = L.marker(normalizedLocation.coords);

            
            let popupNode; // Declare popupNode here
            if (React.isValidElement(normalizedLocation.popupContent)) {
              popupNode = document.createElement('div');
              const root = createRoot(popupNode);
              root.render(normalizedLocation.popupContent);
            } else {
              popupNode = document.createElement('div'); // Create a div for string content
              popupNode.innerHTML = `<strong>${normalizedLocation.name || 'Unknown'}</strong><br>${normalizedLocation.description || 'No description'}`;
            }
            marker.bindPopup(popupNode);
            
            markerLayer.addLayer(marker); // Add marker to the layer group
            leafletMarkers.push(marker);
            // console.log(`✅ [Map] Marker ${index} added to layer group.`); // Re-enable for detailed debug if needed
          } catch (error) {
            console.error(`❌ [Map] Error creating marker at index ${index}:`, error);
            console.error('❌ [Map] Location data:', normalizedLocation);
            console.error('❌ [Map] Error stack:', error.stack);
          }
        });

        // Fit map bounds to all markers
        if (leafletMarkers.length > 0) {
          const group = new L.featureGroup(leafletMarkers);
          map.fitBounds(group.getBounds().pad(0.5)); // Add some padding
          console.log(`🎯 [Map] Map fitted to ${leafletMarkers.length} markers.`);
        } else {
          // If no markers, reset view to a default or previous state
          map.setView(center, zoom); // Use initial center/zoom as fallback
          console.log('ℹ️ [Map] No valid markers found, resetting map view to default.');
        }
      } else {
        map.setView(center, zoom); // Use initial center/zoom as fallback
        console.log('ℹ️ [Map] Locations array is empty or invalid, resetting map view to default.');
      }
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
  )};