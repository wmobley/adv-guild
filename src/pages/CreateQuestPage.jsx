import React from 'react';
import QuestForm from '../components/QuestForm';
import QuestMap from '../components/QuestMap';
import QuestRoute from '../components/QuestRoute';
import QuestTips from '../components/QuestTips';
import Header from '../components/Header';
import { useQuestPlanning } from '../hooks/useQuestPlanning';

const CreateQuestPage = () => {
  const {
    // State
    showMap,
    mapCenter,
    mapLocations,
    isLoadingLocation,
    suggestedPois,
    isLoadingSuggestions,
    selectedPoi,
    showPoiForm, // Make sure this is included
    
    // Actions
    handleBrainstormItinerary,
    handleFindNearbyAttractions,
    handleAddPointOfInterest,
    handleSelectPoi,
    handleRemovePointOfInterest,
    handleCloseMap,
    handleTogglePoiForm,
    handleUpdatePoi,
    handleReorderLocations,
    handleUpdateLocationDay
  } = useQuestPlanning();

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
              onCloseMap={handleCloseMap}
              onSelectPoi={handleSelectPoi}
              onRemoveLocation={handleRemovePointOfInterest}
              onFindNearbyAttractions={handleFindNearbyAttractions}
              onTogglePoiForm={handleTogglePoiForm} // This toggles the form visibility
              onAddPoi={handleAddPointOfInterest} // This handles adding the POI
              onUpdatePoi={handleUpdatePoi}
            />

            <QuestForm onBrainstormItinerary={handleBrainstormItinerary} />
            
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