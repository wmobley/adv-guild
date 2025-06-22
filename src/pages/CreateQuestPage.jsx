import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestForm from '../components/QuestForm';
import QuestMap from '../components/QuestMap';
import QuestRoute from '../components/QuestRoute';
import QuestTips from '../components/QuestTips';
import Header from '../components/Header';
import apiClient from '../services/advGuildApiClient';

const CreateQuestPage = () => {
  const navigate = useNavigate();

  // State for the quest creation process
  const [mapLocations, setMapLocations] = useState([]); // This is the quest route
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState([34.5, -92.5]); // Default center
  const [isLoadingLocation, setIsLoadingLocation] = useState(false); // Placeholder
  const [suggestedPois, setSuggestedPois] = useState([]); // Placeholder
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false); // Placeholder
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showPoiForm, setShowPoiForm] = useState(false);

  // State for reference data like difficulties and interests
  const [difficulties, setDifficulties] = useState([]);
  const [interests, setInterests] = useState([]);

  // Fetch reference data on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [difficultiesData, interestsData] = await Promise.all([
          apiClient.getDifficulties(),
          apiClient.getInterests(),
        ]);
        setDifficulties(difficultiesData || []);
        setInterests(interestsData || []);
      } catch (error) {
        console.error("Failed to fetch reference data for quest creation:", error);
      }
    };
    fetchReferenceData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Action Handlers ---

  // Called from QuestMap after a new location is created via the API
  const handleAddPointOfInterest = (newLocation) => {
    setMapLocations(prevLocations => [...prevLocations, { ...newLocation, day: 1 }]);
    if (!showMap) {
      setShowMap(true);
    }
  };

  const handleSetInitialLocation = async (locationData) => {
    // locationData comes from LocationForm's onLocationSelect
    // e.g., { formatted: '...', lat: '...', lon: '...', display_name: '...' }
    setIsLoadingLocation(true);
    try {
      const newLocationPayload = {
        name: locationData.formatted,
        address: locationData.display_name,
        latitude: parseFloat(locationData.lat),
        longitude: parseFloat(locationData.lon),
      };

      const createdLocation = await apiClient.createLocation(newLocationPayload);
      
      handleAddPointOfInterest(createdLocation); // This adds to state and shows map
      setMapCenter([createdLocation.latitude, createdLocation.longitude]);

    } catch (error) {
      console.error("Failed to set initial location:", error);
      alert(`Error setting initial location: ${error.message}`);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Main quest submission handler, passed to QuestForm
  const handleCreateQuest = async (formData) => {
    if (mapLocations.length === 0) {
      alert("A quest must have at least one location.");
      return;
    }

    const questData = {
      name: formData.name,
      synopsis: formData.synopsis,
      difficulty_id: parseInt(formData.difficulty_id, 10),
      interest_id: parseInt(formData.interest_id, 10),
      is_public: formData.is_public,
      start_location_id: mapLocations[0].id,
      locations: mapLocations.map((loc, index) => ({
        location_id: loc.id,
        step: index + 1,
        day: loc.day || 1,
      })),
    };

    try {
      const newQuest = await apiClient.createQuest(questData);
      alert(`Successfully created quest: ${newQuest.name}`);
      navigate(`/quests/${newQuest.id}`); // Redirect to the new quest's itinerary page
    } catch (error) {
      console.error("Failed to create quest:", error);
      alert(`Error creating quest: ${error.message}`);
    }
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
    setShowMap(true);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <header className="text-center mb-10">
            <h1 className="text-5xl font-bold text-guild-primary mb-4">Create Your New Quest</h1>
            <p className="text-xl text-guild-text max-w-2xl mx-auto mb-2">
              Detail your adventure for the guild!
            </p>
            <p className="text-lg text-guild-neutral max-w-3xl mx-auto">
              Share your legendary journey with fellow adventurers. Whether inspired by ancient myths, 
              beloved tales, or mystical lands, your quest awaits documentation in the guild archives.
            </p>
          </header>

          {/* Quest Form Section */}
          <div className="bg-white rounded-xl shadow-2xl border-2 border-guild-highlight/20 p-8">
            {/* Quest Map Section */}
            <QuestMap
              showMap={showMap}
              mapCenter={mapCenter}
              mapLocations={mapLocations}
              isLoadingLocation={isLoadingLocation}
              suggestedPois={suggestedPois}
              isLoadingSuggestions={isLoadingSuggestions}
              selectedPoi={selectedPoi}
              showPoiForm={showPoiForm} // Add this prop
              onCloseMap={() => setShowMap(false)}
              onSelectPoi={handleSelectPoi}
              onRemoveLocation={handleRemovePointOfInterest}
              onFindNearbyAttractions={() => alert('Finding nearby attractions is not yet implemented.')}
              onTogglePoiForm={() => setShowPoiForm(prev => !prev)} // This toggles the form visibility
              onAddPoi={handleAddPointOfInterest} // This handles adding the POI
              onUpdatePoi={(updatedPoi) => setMapLocations(prev => prev.map(loc => (loc.id === updatedPoi.id ? { ...loc, ...updatedPoi } : loc)))}
            />

            <QuestForm
              onCreateQuest={handleCreateQuest}
              difficulties={difficulties}
              interests={interests}
              mapLocationsCount={mapLocations.length}
              onSetInitialLocation={handleSetInitialLocation}
              isLoadingLocation={isLoadingLocation}
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
          </div>
          
          {/* Quest Creation Tips */}
          <QuestTips />
        </div>
      </div>
    </>
  );
};

export default CreateQuestPage;