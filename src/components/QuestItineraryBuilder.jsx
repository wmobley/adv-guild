import React, { useState } from 'react';
import QuestMapDisplay from './QuestMapDisplay';
import QuestRoute from './QuestRoute';

const QuestItineraryBuilder = ({ 
  quest, 
  startingLocation, 
  onFinalizeQuest 
}) => {
  const [mapLocations, setMapLocations] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [mapCenter, setMapCenter] = useState([
    startingLocation?.latitude || 34.5, 
    startingLocation?.longitude || -92.5
  ]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [suggestedPois, setSuggestedPois] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showPoiForm, setShowPoiForm] = useState(false);

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

  // Called from QuestMapDisplay after a new location is created via the API
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

  const handleFinalizeQuest = async () => {
    if (mapLocations.length === 0) {
      alert("Please add at least one additional location to your quest before finalizing.");
      return;
    }

    const completeItinerary = generateItinerary();
    const allLocations = [startingLocation, ...mapLocations];

    const updateData = {
      itinerary: JSON.stringify(completeItinerary),
      locations: allLocations.map((loc, index) => ({
        location_id: loc.id,
        step: index + 1,
        day: loc.day || 1,
      })),
    };

    await onFinalizeQuest(updateData);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border-2 border-guild-highlight/20 p-8">
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-guild-primary mb-4">
          Building Itinerary for "{quest?.name}"
        </h2>
        <p className="text-lg text-guild-neutral">
          Add locations and build your complete quest itinerary!
        </p>
        <p className="text-md text-guild-text mt-2">
          Your quest has been created! Now use the map below to add more locations and build out your complete adventure itinerary.
        </p>
      </header>

      {/* Quest Map Section */}
      <QuestMapDisplay
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

      {/* Finalize Quest Button */}
      <div className="flex justify-end pt-6">
        <button
          className="bg-guild-primary hover:bg-guild-accent text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
          onClick={handleFinalizeQuest}
        >
          Finalize Quest
        </button>
      </div>
    </div>
  );
};

export default QuestItineraryBuilder;