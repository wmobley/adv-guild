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
  const [startingLocation, setStartingLocation] = useState(null); // Store starting location without adding to map

  // State for reference data like difficulties and interests
  const [difficulties, setDifficulties] = useState([]);
  const [interests, setInterests] = useState([]);
  const [questTypes, setQuestTypes] = useState([]);
  const [isLoadingReferenceData, setIsLoadingReferenceData] = useState(true);

  // Fetch reference data on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      setIsLoadingReferenceData(true);
      try {
        console.log('Fetching reference data...');
        
        // Fetch difficulties and interests
        const difficultiesData = await apiClient.getDifficulties();
        const interestsData = await apiClient.getInterests();
        
        console.log('Difficulties data:', difficultiesData);
        console.log('Interests data:', interestsData);
        
        setDifficulties(difficultiesData || []);
        setInterests(interestsData || []);

        // Try to fetch quest types, but handle if it doesn't exist
        try {
          const questTypesData = await apiClient.getQuestTypes();
          console.log('Quest types data:', questTypesData);
          setQuestTypes(questTypesData || []);
        } catch (questTypeError) {
          console.log('QuestTypes API not available, using default');
          setQuestTypes([{ id: 1, name: 'Adventure' }]); // Default quest type
        }

      } catch (error) {
        console.error("Failed to fetch reference data for quest creation:", error);
        // Set some default values if the API calls fail
        setDifficulties([
          { id: 1, name: 'Easy' },
          { id: 2, name: 'Medium' },
          { id: 3, name: 'Hard' },
          { id: 4, name: 'Expert' }
        ]);
        setInterests([
          { id: 1, name: 'Adventure' },
          { id: 2, name: 'Culture' },
          { id: 3, name: 'Nature' },
          { id: 4, name: 'History' }
        ]);
        setQuestTypes([{ id: 1, name: 'Adventure' }]);
      } finally {
        setIsLoadingReferenceData(false);
      }
    };
    fetchReferenceData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Debug log when state changes
  useEffect(() => {
    console.log('Difficulties state updated:', difficulties);
  }, [difficulties]);

  useEffect(() => {
    console.log('Interests state updated:', interests);
  }, [interests]);

  useEffect(() => {
    console.log('Quest types state updated:', questTypes);
  }, [questTypes]);

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
      
      // Store the starting location but don't add to map or show map yet
      setStartingLocation(createdLocation);
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
    console.log('handleCreateQuest called with:', formData);
    console.log('startingLocation:', startingLocation);
    console.log('mapLocations:', mapLocations);
    
    if (!startingLocation) {
      alert("A quest must have a starting location.");
      return;
    }

    // Combine starting location with additional locations from the map
    const allLocations = [startingLocation, ...mapLocations];

    // Generate a basic itinerary from the locations
    const itineraryArray = allLocations.map((loc, index) => ({
      day: loc.day || 1,
      step: index + 1,
      location_name: loc.name,
      description: `Visit ${loc.name}`,
      location_id: loc.id
    }));

    const questData = {
      name: formData.name,
      synopsis: formData.synopsis,
      difficulty_id: parseInt(formData.difficulty_id, 10),
      interest_id: parseInt(formData.interest_id, 10),
      quest_type_id: parseInt(formData.quest_type_id || questTypes[0]?.id || 1, 10), // Use form data or default
      is_public: formData.is_public,
      start_location_id: startingLocation.id,
      itinerary: JSON.stringify(itineraryArray), // Convert to JSON string
      locations: allLocations.map((loc, index) => ({
        location_id: loc.id,
        step: index + 1,
        day: loc.day || 1,
      })),
    };

    console.log('Quest data being sent:', JSON.stringify(questData, null, 2));

    try {
      const newQuest = await apiClient.createQuest(questData);
      alert(`Successfully created quest: ${newQuest.name}`);
      navigate(`/quests/${newQuest.id}`); // Redirect to the new quest's itinerary page
    } catch (error) {
      console.error("Failed to create quest:", error);
      console.error("Error details:", error.detail || error.message || error);
      
      // Better error message formatting
      let errorMessage = "Error creating quest: ";
      if (error.detail && Array.isArray(error.detail)) {
        errorMessage += error.detail.map(err => {
          if (typeof err === 'object') {
            return `${err.field || 'Field'}: ${err.message || JSON.stringify(err)}`;
          }
          return err;
        }).join(', ');
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Unknown error occurred";
      }
      
      alert(errorMessage);
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

  // Show loading state while fetching reference data
  if (isLoadingReferenceData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-guild-primary mx-auto mb-4"></div>
            <p className="text-xl text-guild-text">Loading quest creation form...</p>
          </div>
        </div>
      </>
    );
  }

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
            <QuestForm
              onCreateQuest={handleCreateQuest}
              difficulties={difficulties}
              interests={interests}
              questTypes={questTypes}
              mapLocationsCount={startingLocation ? 1 + mapLocations.length : 0}
              onSetInitialLocation={handleSetInitialLocation}
              isLoadingLocation={isLoadingLocation}
            />

            {/* Show map section only after starting location is set */}
            {startingLocation && (
              <>
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
              </>
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