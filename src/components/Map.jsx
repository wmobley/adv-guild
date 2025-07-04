// src/components/Map.jsx
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from 'react-dom/client'; // Import createRoot
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import apiClient from '../services/advGuildApiClient';

const defaultLocations = [
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
  locations: propLocations, // Rename to avoid confusion with state
  center = [34.5, -92.5], 
  zoom = 6, 
  mapId = "myth-map",
  height = "400px",
  useApiData = true // New prop to control whether to fetch from API
}) {
  // Refs to hold the map instance and a layer group for markers
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  
  // State for API locations
  const [apiLocations, setApiLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine which locations to use
  const locations = propLocations || (useApiData ? apiLocations : defaultLocations);

  // Effect to fetch locations from API
  useEffect(() => {
    if (!useApiData || propLocations) {
      // Skip API fetch if useApiData is false or locations are provided via props
      return;
    }

    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      console.log('🌐 [Map] Fetching locations from API...');

      try {
        // Try public endpoint first, then authenticated if needed
        let data;
        try {
          data = await apiClient.getLocationsPublic();
          console.log('✅ [Map] Public locations fetched:', data);
        } catch (publicError) {
          console.log('⚠️ [Map] Public locations failed, trying authenticated:', publicError.message);
          data = await apiClient.getLocations();
          console.log('✅ [Map] Authenticated locations fetched:', data);
        }

        if (Array.isArray(data)) {
          setApiLocations(data);
          console.log(`✅ [Map] Successfully loaded ${data.length} locations from API`);
        } else {
          console.warn('⚠️ [Map] API returned non-array data:', data);
          setApiLocations([]);
        }
      } catch (error) {
        console.error('❌ [Map] Failed to fetch locations from API:', error);
        setError(error.message);
        // Fall back to default locations on error
        setApiLocations(defaultLocations);
        console.log('🔄 [Map] Falling back to default locations');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [useApiData, propLocations]);

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

  // Effect for updating markers and fitting bounds (runs when 'locations' changes)
  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;

    if (!map || !markerLayer) {
      console.log('⏳ [Map] Map or marker layer not ready for updates.');
      return; // Map not yet initialized
    }

    console.log('🔄 [Map] Updating map markers and view based on locations...', {
      locationsCount: locations?.length,
      loading,
      error
    });

    try {
      // Clear all existing markers from the layer group
      markerLayer.clearLayers();
      const leafletMarkers = []; // Renamed from validMarkers for clarity with Leaflet objects

      if (locations && Array.isArray(locations) && locations.length > 0) {
        locations.forEach((loc, index) => {
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
              // Enhanced popup content with API data
              const name = normalizedLocation.name || 'Unknown Location';
              const description = normalizedLocation.description || 'No description available';
              
              // Add additional fields that might come from API
              let additionalInfo = '';
              if (normalizedLocation.address) {
                additionalInfo += `<br><em>📍 ${normalizedLocation.address}</em>`;
              }
              if (normalizedLocation.category) {
                additionalInfo += `<br><span style="background: #e3f2fd; padding: 2px 6px; border-radius: 3px; font-size: 0.8em;">${normalizedLocation.category}</span>`;
              }
              if (normalizedLocation.created_at) {
                const date = new Date(normalizedLocation.created_at).toLocaleDateString();
                additionalInfo += `<br><small style="color: #666;">Added: ${date}</small>`;
              }
              
              popupNode.innerHTML = `
                <div style="max-width: 250px;">
                  <strong style="color: #2c5aa0; font-size: 1.1em;">${name}</strong>
                  <br>
                  <span style="color: #555; line-height: 1.4;">${description}</span>
                  ${additionalInfo}
                </div>
              `;
            }
            marker.bindPopup(popupNode);
            
            markerLayer.addLayer(marker); // Add marker to the layer group
            leafletMarkers.push(marker);
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
        locations: locations?.length,
        center,
        zoom,
        mapId,
        height,
        loading,
        error
      });
    }
  }, [locations, center, zoom, mapId, loading]);

  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      {/* Loading indicator */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 text-sm text-center">
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading locations...
          </div>
        </div>
      )}
      
      {/* Error indicator */}
      {error && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 text-sm text-center">
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Error loading locations: {error}
          </div>
        </div>
      )}
      
      <div id={mapId} className="w-full z-0 rounded-xl" style={{ height }} />
    </div>
  )};