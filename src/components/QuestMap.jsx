import React from 'react';
import Map from './Map';

/**
 * A simplified map component specifically for displaying a quest route.
 * It takes an array of markers and passes them to the underlying Map component.
 * @param {object} props
 * @param {Array} props.markers - An array of marker objects to display on the map.
 *   Each marker should have a `coords` property (e.g., [lat, lng]).
 */
const QuestMap = ({ markers = [] }) => {
  // The underlying <Map /> component expects a 'locations' prop.
  // We will pass the 'markers' from ItineraryPage to it.
  const locations = markers;
  
  // Determine a sensible center for the map.
  // If there are markers, center on the first one. Otherwise, use a default.
  const mapCenter = locations.length > 0 && locations[0].coords 
    ? locations[0].coords 
    : [34.5, -92.5]; // Default center (e.g., USA)
  
  // Determine a sensible zoom level.
  const zoom = locations.length > 0 ? 5 : 2;
  
  return (
    <Map 
      locations={locations}
      center={mapCenter}
      zoom={zoom}
      mapId="itinerary-map"
      height="100%" // Use 100% to fill the parent container from ItineraryPage
    />
  );
};

export default QuestMap;