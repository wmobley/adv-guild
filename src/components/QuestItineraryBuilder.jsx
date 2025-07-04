import React, { useState, useEffect, useMemo } from 'react';
import QuestMapDisplay from './QuestMapDisplay';
import QuestRoute from './QuestRoute';
import LocationForm from './LocationForm';
import apiClient from '../services/advGuildApiClient';

const QuestItineraryBuilder = ({ quest, onFinalizeQuest, isFinalizing }) => {
  const [locationSearch, setLocationSearch] = useState('');
  const [mapLocations, setMapLocations] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [mapCenter, setMapCenter] = useState([34.5, -92.5]); // Default center
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [suggestedPois, setSuggestedPois] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showPoiForm, setShowPoiForm] = useState(false);

  // Derive startingLocation from the quest object for consistency.
  const startingLocation = quest?.start_location;

  useEffect(() => {
    console.log('Quest data updated:', quest);
    // When the quest data (and thus starting location) becomes available,
    // center the map on it.
    if (quest?.start_location?.latitude && quest?.start_location?.longitude) {
      setMapCenter([
        parseFloat(quest.start_location.latitude),
        parseFloat(quest.start_location.longitude)
      ]);
    }
  }, [quest]);

  // Combine starting location and added locations for the map display
  const allMapMarkers = useMemo(() => {
    if (!startingLocation) return [];
    
    // Add a property to distinguish the starting point on the map if needed
    const startMarker = { ...startingLocation, isStart: true };
    
    return [startMarker, ...mapLocations];
  }, [startingLocation, mapLocations]);


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

  // Handles creating a new location from the search form
  const handleLocationSelected = async (locationData) => {
    setIsLoadingLocation(true);
    try {
      const newLocationPayload = {
        name: locationData.formatted,
        address: locationData.display_name,
        latitude: parseFloat(locationData.lat),
        longitude: parseFloat(locationData.lon),
      };

      const createdLocation = await apiClient.createLocation(newLocationPayload);
      handleAddPointOfInterest(createdLocation);
      setLocationSearch(''); // Clear search form
      setShowPoiForm(false); // Hide form after adding
    } catch (error) {
      console.error("Failed to add new location:", error);
      alert(`Error adding location: ${error.message}`);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleRemovePointOfInterest = (poiId) => {
    setMapLocations(prev => prev.filter(loc => loc.id !== poiId));
  };

  const handleUpdateLocation = (locationId, updatedData) => {
    setMapLocations(prev =>
      prev.map(loc =>
        loc.id === locationId ? { ...loc, ...updatedData } : loc
      )
    );
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
    // The check for mapLocations.length is removed to allow finalizing
    // a quest with only a starting point.
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
          {quest ? (
            <>Building Itinerary for "{quest.name}"</>
          ) : (
            <>
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-guild-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading Quest Details...
              </div>
            </>
          )}
        </h2>
        <p className="text-lg text-guild-neutral">
          Add locations and build your complete quest itinerary!
        </p>
        <p className="text-md text-guild-text mt-2">
          Your quest has been created! Now use the map below to add more locations and build out your complete adventure itinerary.
        </p>
      </header>

      {/* Controls for adding locations */}
      <div className="bg-guild-secondary/30 p-4 rounded-lg border-2 border-dashed border-guild-highlight/40 mb-6 text-center">
        <h3 className="text-lg font-semibold text-guild-primary mb-2">Build Your Route</h3>
        <p className="text-guild-text text-sm mb-4">
          Use the button below to search for new locations, or click directly on the map to add a point of interest.
        </p>
        <button
          onClick={() => setShowPoiForm(prev => !prev)}
          className="bg-guild-accent hover:bg-guild-primary text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md flex items-center mx-auto"
        >
          <span className="mr-2 text-xl">➕</span>
          {showPoiForm ? 'Hide Location Search' : 'Search for a Location'}
        </button>
      </div>

      {/* Conditionally render the location search form */}
      {showPoiForm && (
        <div className="my-6 p-4 bg-guild-secondary/50 rounded-lg border-2 border-dashed border-guild-highlight/40">
          <LocationForm
            value={locationSearch}
            onChange={setLocationSearch}
            onLocationSelect={handleLocationSelected}
            label="Search for a new location to add"
            placeholder="e.g., The Prancing Pony, Bree"
          />
          {isLoadingLocation && <p className="text-guild-text mt-2">Adding location to archives...</p>}
        </div>
      )}

      {/* Quest Map Section */}
      <div className="h-96 w-full bg-guild-secondary/20 rounded-lg border-2 border-guild-highlight/20 overflow-hidden my-6">
        <QuestMapDisplay
          markers={allMapMarkers}
          center={mapCenter}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-guild-primary mb-3">Quest Route</h3>
        {/* Display the starting location as the first, non-editable step */}
        {startingLocation && (
          <div className="p-4 bg-guild-secondary/50 rounded-lg border-2 border-guild-highlight/30 flex items-center mb-3">
            <div className="flex-shrink-0 w-8 h-8 bg-guild-accent text-white rounded-full flex items-center justify-center text-lg font-bold mr-4" title="Starting Point">
              🏁
            </div>
            <div className="flex-1">
              <p className="font-bold text-guild-primary">Start: {startingLocation.name}</p>
              <p className="text-sm text-guild-text">{startingLocation.address}</p>
            </div>
            <div className="text-guild-neutral text-sm font-medium">
              Day 1
            </div>
          </div>
        )}

        {showMap && (
          <QuestRoute
            mapLocations={mapLocations}
            onRemoveLocation={handleRemovePointOfInterest}
            onReorderLocations={handleReorderLocations}
            onUpdateLocationDay={handleUpdateLocationDay}
            onSelectPoi={handleSelectPoi}
            onUpdateLocation={handleUpdateLocation}
          />
        )}
      </div>

      {/* Finalize Quest Button */}
      <div className="flex justify-end pt-6">
        <button
          className="bg-guild-primary hover:bg-guild-accent text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg disabled:bg-guild-neutral/50 disabled:cursor-not-allowed"
          onClick={handleFinalizeQuest}
          disabled={isFinalizing}
        >
          {isFinalizing ? 'Finalizing...' : 'Finalize Quest'}
        </button>
      </div>
    </div>
  );
};

export default QuestItineraryBuilder;