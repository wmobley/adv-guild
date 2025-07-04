import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestForm from '../components/QuestForm';
import QuestItineraryBuilder from '../components/QuestItineraryBuilder';
import QuestTips from '../components/QuestTips';
import Header from '../components/Header';
import apiClient from '../services/advGuildApiClient';

const CreateQuestPage = () => {
  const navigate = useNavigate();

  // State for the quest creation process
  const [startingLocation, setStartingLocation] = useState(null); // Store starting location without adding to map
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // State for reference data like difficulties and interests
  const [difficulties, setDifficulties] = useState([]);
  const [interests, setInterests] = useState([]);
  const [questTypes, setQuestTypes] = useState([]);
  const [isLoadingReferenceData, setIsLoadingReferenceData] = useState(true);

  // New state for quest creation flow
  const [createdQuest, setCreatedQuest] = useState(null);
  const [isQuestCreated, setIsQuestCreated] = useState(false);
  const [isCreatingQuest, setIsCreatingQuest] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

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

    } catch (error) {
      console.error("Failed to set initial location:", error);
      alert(`Error setting initial location: ${error.message}`);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Initial quest creation handler - creates quest with basic info
  const handleCreateQuest = async (formData) => {
    console.log('handleCreateQuest called with:', formData);
    console.log('startingLocation:', startingLocation);
    
    if (!startingLocation) {
      alert("A quest must have a starting location.");
      return;
    }

    setIsCreatingQuest(true);

    // Create basic quest with minimal itinerary (just starting location)
    const basicItinerary = [{
      day: 1,
      step: 1,
      location_name: startingLocation.name,
      description: `Start your quest at ${startingLocation.name}`,
      location_id: startingLocation.id
    }];

    const questData = {
      name: formData.name,
      synopsis: formData.synopsis,
      difficulty_id: parseInt(formData.difficulty_id, 10),
      interest_id: parseInt(formData.interest_id, 10),
      quest_type_id: parseInt(formData.quest_type_id || questTypes[0]?.id || 1, 10),
      is_public: formData.is_public,
      start_location_id: startingLocation.id,
      itinerary: JSON.stringify(basicItinerary),
      locations: [{
        location_id: startingLocation.id,
        step: 1,
        day: 1,
      }],
    };

    console.log('Quest data being sent:', JSON.stringify(questData, null, 2));

    try {
      const newQuest = await apiClient.createQuest(questData);
      console.log('Quest created successfully:', newQuest);
      
      setCreatedQuest(newQuest);
      setIsQuestCreated(true);
      
      // Show success message
      alert(`Quest "${newQuest.name}" created successfully! Now add more locations to build your itinerary.`);
      
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
    } finally {
      setIsCreatingQuest(false);
    }
  };

  // Handler to finalize the quest with complete itinerary
  const handleFinalizeQuest = async (updateData) => {
    if (!createdQuest) {
      alert("Cannot finalize a quest that hasn't been created yet.");
      return;
    }
    setIsFinalizing(true);
    try {
      console.log('Updating quest with complete itinerary:', updateData);
      
      // Ensure the itinerary is a JSON string before sending, which is consistent
      // with the API's expected format for this complex data type.
      const payload = {
        ...updateData,
        itinerary: Array.isArray(updateData.itinerary)
          ? JSON.stringify(updateData.itinerary)
          : updateData.itinerary,
      };

      const updatedQuest = await apiClient.updateQuest(createdQuest.id, payload);
      console.log('Quest updated successfully:', updatedQuest);
      
      alert(`Quest "${createdQuest.name}" has been finalized with your complete itinerary!`);
      navigate(`/quests/${createdQuest.id}`); // Now redirect to the quest detail page
      
    } catch (error) {
      console.error("Failed to finalize quest:", error);
      alert(`Error finalizing quest: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsFinalizing(false);
    }
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
            <h1 className="text-5xl font-bold text-guild-primary mb-4">
              {isQuestCreated ? `Building "${createdQuest?.name}"` : 'Create Your New Quest'}
            </h1>
            <p className="text-xl text-guild-text max-w-2xl mx-auto mb-2">
              {isQuestCreated 
                ? 'Add locations and build your complete quest itinerary!'
                : 'Detail your adventure for the guild!'
              }
            </p>
            <p className="text-lg text-guild-neutral max-w-3xl mx-auto">
              {isQuestCreated
                ? 'Your quest has been created! Now use the map below to add more locations and build out your complete adventure itinerary.'
                : 'Share your legendary journey with fellow adventurers. Whether inspired by ancient myths, beloved tales, or mystical lands, your quest awaits documentation in the guild archives.'
              }
            </p>
          </header>

          {/* Quest Form Section - Hide after quest is created */}
          {!isQuestCreated && (
            <div className="bg-white rounded-xl shadow-2xl border-2 border-guild-highlight/20 p-8">
              <QuestForm
                onCreateQuest={handleCreateQuest}
                difficulties={difficulties}
                interests={interests}
                questTypes={questTypes}
                mapLocationsCount={startingLocation ? 1 : 0}
                onSetInitialLocation={handleSetInitialLocation}
                isLoadingLocation={isLoadingLocation}
                isCreatingQuest={isCreatingQuest}
              />
            </div>
          )}

          {/* Show itinerary builder only after the initial quest has been created */}
          {isQuestCreated && (
            <div className="bg-white rounded-xl shadow-2xl border-2 border-guild-highlight/20 p-8 mt-8">
              {/* Quest Map Section */}
              <QuestItineraryBuilder
                quest={createdQuest}
                onFinalizeQuest={handleFinalizeQuest}
                isFinalizing={isFinalizing}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateQuestPage;