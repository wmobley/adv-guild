import React, { useState, useEffect } from 'react';
import QuestMap from './QuestMap';
import QuestRoute from './QuestRoute';
import apiClient from '../services/advGuildApiClient';

const ItineraryEditor = ({ 
  quest, 
  onSaveItinerary,
  onCancelEdit,
  isSaving = false
}) => {
  const [mapLocations, setMapLocations] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [mapCenter, setMapCenter] = useState([34.5, -92.5]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [suggestedPois, setSuggestedPois] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showPoiForm, setShowPoiForm] = useState(false);
  const [startingLocation, setStartingLocation] = useState(null);

  // Initialize locations from quest data
  useEffect(() => {
    const initializeLocations = async () => {
      if (!quest) return;

      try {
        // Set starting location
        if (quest.start_location) {
          setStartingLocation(quest.start_location);
          setMapCenter([quest.start_location.latitude, quest.start_location.longitude]);
        }

        // If quest has locations array, load those
        if (quest.locations && quest.locations.length > 0) {
          // Filter out the starting location from the additional locations
          const additionalLocations = quest.locations.filter(
            loc => loc.id !== quest.start_location_id
          );
          setMapLocations(additionalLocations);
        } else if (quest.itinerary && Array.isArray(quest.itinerary)) {
          // Try to extract locations from itinerary if locations array not available
          // This is a fallback - you might need to adjust based on your data structure
          const locationsFromItinerary = [];
          for (const item of quest.itinerary) {
            if (item.location_id && item.location_id !== quest.start_location_id) {
              try {
                const location = await apiClient.getLocationById(item.location_id);
                locationsFromItinerary.push({ ...location, day: item.day || 1 });
              } catch (err) {
                console.warn(`Could not load location ${item.location_id}:`, err);
              }
            }
          }
          setMapLocations(locationsFromItinerary);
        }
      } catch (error) {
        console.error('Error initializing locations:', error);
      }
    };

    initializeLocations();
  }, [quest]);

  // Generate complete itinerary whenever locations change
  const generateItinerary = () => {
    if (!startingLocation) return [];
    
    const allLocations = [startingLocation, ...mapLocations];
    return allLocations.map((loc, index) => ({
      day: loc.day || 1,
      step: index + 1,
      location_name: loc.name,
      description: index === 0 ? `Start your quest at ${loc.name}` : `Visit ${loc.name}`,
      location_id: loc.id,
      address: loc.address || '',
      latitude: loc.latitude,
      longitude: loc.longitude
    }));
  };

  // Called from QuestMap after a new location is created via the API
  const handleAddPointOfInterest = (newLocation) => {
    setMapLocations(prevLocations => [...prevLocations, { ...newLocation, day: 1 }]);
  };

  const handleRemovePointOfInterest = (poiId) => {
    setMapLocations(prev => prev.filter(loc => loc.id !== poiId));
  };

  const handleReorderLocations = (reorderedLocations) => {
    setMapLocations(reorderedLocations);
  };

  const handleUpdateLocationDay = (locationId, newDay) => {
    setMapLocations(prev => prev.map(loc => (loc.id === locationId ? { ...loc, day: newDay } : loc)));
  };

  const handleSelectPoi = (poi) => {
    setSelectedPoi(poi);
    if (poi.latitude && poi.longitude) {
      setMapCenter([poi.latitude, poi.longitude]);
    }
  };

  const handleSaveItinerary = async () => {
    const completeItinerary = generateItinerary();
    const allLocations = [startingLocation, ...mapLocations];

    const updateData = {
      itinerary: completeItinerary, // Pass as array, let the parent handle JSON.stringify if needed
      locations: allLocations.map((loc, index) => ({
        location_id: loc.id,
        step: index + 1,
        day: loc.day || 1,
      })),
    };

    await onSaveItinerary(updateData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-guild-primary">Edit Quest Itinerary</h3>
          <p className="text-guild-text">Add, remove, or reorder locations for your quest.</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSaveItinerary}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center"
          >
            <span className="mr-2">💾</span>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onCancelEdit}
            disabled={isSaving}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center"
          >
            <span className="mr-2">❌</span>
            Cancel
          </button>
        </div>
      </div>

      {/* Quest Map Section */}
      <QuestMap
        showMap={showMap}
        mapCenter={mapCenter}
        mapLocations={mapLocations}
        isLoadingLocation={isLoadingLocation}
        suggestedPois={suggestedPois}
        isLoadingSuggestions={isLoadingSuggestions}
        selectedPoi={selectedPoi}
        showPoiForm={showPoiForm}
        onCloseMap={() => setShowMap(false)}
        onSelectPoi={handleSelectPoi}
        onRemoveLocation={handleRemovePointOfInterest}
        onFindNearbyAttractions={() => alert('Finding nearby attractions is not yet implemented.')}
        onTogglePoiForm={() => setShowPoiForm(prev => !prev)}
        onAddPoi={handleAddPointOfInterest}
        onUpdatePoi={(updatedPoi) => setMapLocations(prev => prev.map(loc => (loc.id === updatedPoi.id ? { ...loc, ...updatedPoi } : loc)))}
      />

      {showMap && (
        <QuestRoute
          mapLocations={mapLocations}
          onRemoveLocation={handleRemovePointOfInterest}
          onReorderLocations={handleReorderLocations}
          onUpdateLocationDay={handleUpdateLocationDay}
          onSelectPoi={handleSelectPoi}
        />
      )}

      {/* Current Itinerary Preview */}
      <div className="bg-guild-secondary/20 rounded-lg p-4">
        <h4 className="font-semibold text-guild-primary mb-3">Current Itinerary Preview:</h4>
        <div className="space-y-2">
          {generateItinerary().map((item, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className="w-6 h-6 bg-guild-accent text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                {index + 1}
              </div>
              <span className="text-guild-text">{item.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryEditor;