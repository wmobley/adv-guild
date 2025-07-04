import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import apiClient from '../services/advGuildApiClient';

// Helper function to validate coordinates
const isValidCoords = (coords) => {
  console.log('🔍 Validating coords:', coords, 'Type:', typeof coords);
  
  if (!coords) {
    console.log('❌ Coords is falsy');
    return false;
  }
  
  if (!Array.isArray(coords)) { 
    console.log('❌ Coords is not an array, it is:', typeof coords);
    return false;
  }
  
  if (coords.length !== 2) {
    console.log('❌ Coords array length is not 2, it is:', coords.length);
    return false;
  }
  
  const [lat, lng] = coords;
  console.log('🔍 Lat:', lat, 'Type:', typeof lat, 'Lng:', lng, 'Type:', typeof lng);
  
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    console.log('❌ Lat or Lng is not a number');
    return false;
  }
  
  if (isNaN(lat) || isNaN(lng)) {
    console.log('❌ Lat or Lng is NaN');
    return false;
  }
  
  if (lat < -90 || lat > 90) {
    console.log('❌ Lat out of range:', lat);
    return false;
  }
  
  if (lng < -180 || lng > 180) {
    console.log('❌ Lng out of range:', lng);
    return false;
  }
  
  console.log('✅ Coords are valid');
  return true;
};

// Helper function to normalize marker data
const normalizeMarkerData = (markerData) => {
  console.log('🔄 Normalizing marker data:', markerData);
  
  if (!markerData) {
    console.log('❌ No marker data provided');
    return null;
  }

  let coords = null;

  // Check if coords already exists and is valid
  if (markerData.coords && isValidCoords(markerData.coords)) {
    coords = markerData.coords;
  }
  // Check if latitude/longitude properties exist
  else if (markerData.latitude !== undefined && markerData.longitude !== undefined) {
    const lat = parseFloat(markerData.latitude);
    const lng = parseFloat(markerData.longitude);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      coords = [lat, lng];
      console.log('🔄 Converted lat/lng to coords:', coords);
    }
  }
  // Check if lat/lng properties exist (alternative naming)
  else if (markerData.lat !== undefined && markerData.lng !== undefined) {
    const lat = parseFloat(markerData.lat);
    const lng = parseFloat(markerData.lng);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      coords = [lat, lng];
      console.log('🔄 Converted lat/lng to coords:', coords);
    }
  }

  if (!coords || !isValidCoords(coords)) {
    console.log('❌ Could not extract valid coordinates from marker data');
    return null;
  }

  return {
    ...markerData,
    coords: coords
  };
};

const QuestMapDisplay = ({ markers, center, zoom }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerInstancesRef = useRef({});

  // Debug props on every render
  console.log('🗺️ QuestMapDisplay render with props:', {
    markers: markers,
    markersLength: markers?.length,
    center,
    zoom,
    markersType: typeof markers,
    markersIsArray: Array.isArray(markers)
  });

  useEffect(() => {
    console.log('🚀 Map initialization effect running');
    
    // Initialize map only once
    if (mapContainerRef.current && !mapInstanceRef.current) {
      try {
        console.log('🔧 Creating new map instance');
        const mapCenter = isValidCoords(center) ? center : [30, 0];
        const mapZoom = (typeof zoom === 'number' && zoom > 0) ? zoom : 2;

        console.log('🎯 Map center:', mapCenter, 'zoom:', mapZoom);

        const map = L.map(mapContainerRef.current, {
          center: mapCenter,
          zoom: mapZoom,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        mapInstanceRef.current = map;
        console.log('✅ Map initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing map:', error);
      }
    } else {
      console.log('⏭️ Skipping map initialization - already exists or container not ready');
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        try {
          console.log('🧹 Cleaning up map');
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error('❌ Error cleaning up map:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    console.log('🎯 Markers effect running');
    const map = mapInstanceRef.current;
    
    if (!map) {
      console.log('⏭️ No map instance, skipping markers update');
      return;
    }

    try {
      console.log('🧹 Clearing existing markers');
      // Clear existing markers
      Object.entries(markerInstancesRef.current).forEach(([key, marker]) => {
        try {
          console.log(`🗑️ Removing marker ${key}`);
          marker.remove();
        } catch (error) {
          console.error(`❌ Error removing marker ${key}:`, error);
        }
      });
      markerInstancesRef.current = {};

      if (!markers) {
        console.log('⏭️ No markers provided');
        return;
      }

      if (!Array.isArray(markers)) {
        console.error('❌ Markers is not an array:', typeof markers, markers);
        return;
      }

      if (markers.length === 0) {
        console.log('⏭️ Empty markers array');
        return;
      }

      console.log(`📍 Processing ${markers.length} markers`);

      // Add new markers
      const bounds = [];
      console.log(markers)
      markers.forEach((markerData, index) => {
        console.log(`\n📍 Processing marker ${index}:`, markerData);

        if (!markerData) {
          console.warn(`⚠️ Marker at index ${index} is null or undefined`);
          return;
        }

        // Normalize the marker data to ensure coords are in the right format
        const normalizedMarker = normalizeMarkerData(markerData);
        
        if (!normalizedMarker) {
          console.warn(`⚠️ Could not normalize marker at index ${index}:`, markerData);
          return;
        }

        console.log(`🔍 Normalized marker ${index} coords:`, normalizedMarker.coords);

        try {
          console.log(`✨ Creating Leaflet marker ${index} with coords:`, normalizedMarker.coords);
          const marker = L.marker(normalizedMarker.coords).addTo(map);
          
          if (normalizedMarker.popupContent) {
            console.log(`🎈 Adding popup to marker ${index}`);
            const popupNode = document.createElement('div');
            const root = createRoot(popupNode);
            root.render(normalizedMarker.popupContent);
            marker.bindPopup(popupNode);
          }
          
          markerInstancesRef.current[index] = marker;
          bounds.push(normalizedMarker.coords);
          console.log(`✅ Marker ${index} created successfully`);
        } catch (error) {
          console.error(`❌ Error creating marker at index ${index}:`, error);
          console.error('❌ Error stack:', error.stack);
        }
      });

      console.log(`📏 Bounds array has ${bounds.length} entries:`, bounds);

      if (bounds.length > 0) {
        try {
          const latLngBounds = L.latLngBounds(bounds);
          console.log('📐 Created LatLngBounds:', latLngBounds);
          
          if (bounds.length > 1 || (!center && !zoom)) {
            console.log('🎯 Fitting map to bounds');
            map.fitBounds(latLngBounds, { padding: [50, 50], maxZoom: 14 });
            // Sometimes Leaflet needs a nudge to redraw correctly after DOM changes
            // and fitting bounds, especially in a dynamic React layout.
            setTimeout(() => {
              map.invalidateSize();
            }, 100);
          } else {
            console.log('⏭️ Skipping fitBounds - single marker with explicit center/zoom');
          }
        } catch (error) {
          console.error('❌ Error fitting bounds:', error);
          console.error('❌ Bounds data:', bounds);
        }
      }
    } catch (error) {
      console.error('❌ Error in markers effect:', error);
      console.error('❌ Error stack:', error.stack);
    }
  }, [markers, center, zoom]);

  return (
    <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} className="rounded-lg" />
  );
};

export default QuestMapDisplay;