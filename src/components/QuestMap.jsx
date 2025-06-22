import React, { useState } from 'react';
import Map from './Map';
import PoiCard from './PoiCard';
import LocationForm from './LocationForm';
import apiClient from '../services/advGuildApiClient';

const QuestMap = ({
  showMap,
  mapCenter,
  mapLocations,
  isLoadingLocation,
  suggestedPois,
  isLoadingSuggestions,
  selectedPoi,
  onCloseMap,
  onSelectPoi,
  onRemoveLocation,
  onFindNearbyAttractions,
  onTogglePoiForm,
  showPoiForm,
  onUpdatePoi,
  onAddPoi
}) => {
  const [newPoi, setNewPoi] = useState({
    name: '',
    narrative: '',
    type: '',
    address: '',
    lat: null,
    lng: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Location type options - centralized here
  const locationTypes = [
    'Shop', 'Museum', 'Trail', 'Restaurant', 'Park', 'Monument', 
    'Theater', 'Gallery', 'Library', 'Market', 'Landmark', 'Other'
  ];

  if (!showMap) return null;

  const handlePoiUpdate = (updatedPoi) => {
    if (onUpdatePoi) onUpdatePoi(updatedPoi);
  };

  const handleAddPoi = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!newPoi.name.trim()) {
      alert('Please enter a name for the Point of Interest!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for our backend API (Points of Interest are 'Locations' in the backend)
      const locationData = {
        name: newPoi.name.trim(),
        description: newPoi.narrative || null, // Map narrative to description
        address: newPoi.address || null,
        latitude: newPoi.lat || null,
        longitude: newPoi.lng || null,
        // 'type' from the form is not part of the backend Location model, so we omit it.
      };

      console.log('Submitting to Adv Guild API:', locationData);
      const newLocation = await apiClient.createLocation(locationData);
      console.log('Successfully created location:', newLocation);

      // Call the parent handler with the complete location object from the API
      if (onAddPoi) {
        // The response from the API should be the full location object including id, etc.
        onAddPoi(newLocation);
      }

      // Reset form and close
      setNewPoi({ name: '', narrative: '', type: '', address: '', lat: null, lng: null });
      onTogglePoiForm();
      
      alert('Point of Interest added successfully!');
      
    } catch (error) {
      console.error('API Error creating location:', error);
      alert(`Error adding Point of Interest: ${error.message || 'Failed to create POI'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} to:`, value);
    setNewPoi(prev => ({ ...prev, [field]: value }));
  };

  const handleCancelForm = () => {
    setNewPoi({ name: '', narrative: '', type: '', address: '', lat: null, lng: null });
    onTogglePoiForm();
  };

  const handleLocationSelect = (locationData) => {
    // Store the selected location data with coordinates
    setNewPoi(prev => ({
      ...prev,
      address: locationData.formatted,
      lat: parseFloat(locationData.lat) || null,
      lng: parseFloat(locationData.lon) || null
    }));
    console.log('Selected location:', locationData);
  };

  // Handle updates to the new POI from the POI card
  const handleNewPoiUpdate = (updatedPoi) => {
    // Using the functional form of setState to prevent issues with stale state,
    // which can happen when state is updated based on its previous value.
    setNewPoi(prev => {
      // Guard against the updated POI object being undefined.
      if (!updatedPoi) return prev;

      return {
        ...prev,
        name: updatedPoi.title || updatedPoi.name || '',
        narrative: updatedPoi.narrative || '',
        type: updatedPoi.type || '',
        address: updatedPoi.address || prev.address,
        lat: updatedPoi.lat ?? prev.lat,
        lng: updatedPoi.lng ?? prev.lng
      };
    });
  };

  // Get type icon - centralized here
  const getTypeIcon = (type) => {
    const icons = {
      'Shop': '🛍️',
      'Museum': '🏛️',
      'Trail': '🥾',
      'Restaurant': '🍽️',
      'Park': '🌳',
      'Monument': '🗿',
      'Theater': '🎭',
      'Gallery': '🎨',
      'Library': '📚',
      'Market': '🏪',
      'Landmark': '📍',
      'Other': '📌'
    };
    return icons[type] || '📌';
  };

  // Create a POI object from the form data for display in POI card
  const newPoiForDisplay = {
    id: 'new-poi-temp',
    title: newPoi.name,
    name: newPoi.name,
    narrative: newPoi.narrative,
    type: newPoi.type,
    address: newPoi.address,
    lat: newPoi.lat,
    lng: newPoi.lng
  };

  return (
    <> 
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-2xl font-bold text-guild-primary mr-4">Quest Map</h3>
          <span className="text-sm text-guild-text bg-guild-secondary/20 px-2 py-1 rounded">
            {mapLocations.length} location{mapLocations.length !== 1 ? 's' : ''}
          </span>
          {isLoadingLocation && (
            <div className="flex items-center text-guild-text ml-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-guild-primary mr-2"></div>
              Finding location...
            </div>
          )}
        </div>
        <button
          onClick={onCloseMap}
          className="text-guild-neutral hover:text-guild-primary transition-colors p-2"
          title="Close map"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Add POI Form */}
      {showPoiForm && (
        <div className="mb-6 p-4 bg-guild-secondary/10 border-2 border-guild-highlight/30 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-guild-primary">Add New Point of Interest</h4>
            <button
              onClick={handleCancelForm}
              className="text-guild-neutral hover:text-guild-primary transition-colors"
              title="Close form"
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Show loading/error states similar to SdkTestComponent */}
          {isSubmitting && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-700">Creating Point of Interest...</p>
            </div>
          )}
          
          <form onSubmit={handleAddPoi} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-guild-text mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newPoi.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-guild-neutral/30 rounded-md focus:outline-none focus:ring-2 focus:ring-guild-primary focus:border-transparent"
                  placeholder="Enter POI name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-guild-text mb-1">
                  Location Type
                </label>
                <select
                  value={newPoi.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-guild-neutral/30 rounded-md focus:outline-none focus:ring-2 focus:ring-guild-primary focus:border-transparent"
                  disabled={isSubmitting}
                >
                  <option value="">Select location type</option>
                  {locationTypes.map(type => (
                    <option key={type} value={type}>
                      {getTypeIcon(type)} {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <LocationForm
                value={newPoi.address}
                onChange={(value) => handleInputChange('address', value)}
                onLocationSelect={handleLocationSelect}
                label="Address"
                placeholder="Enter address or location..."
                required={false}
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-guild-text mb-1">
                Narrative
              </label>
              <textarea
                value={newPoi.narrative}
                onChange={(e) => handleInputChange('narrative', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-guild-neutral/30 rounded-md focus:outline-none focus:ring-2 focus:ring-guild-primary focus:border-transparent"
                placeholder="Enter narrative"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-guild-primary text-white rounded hover:bg-guild-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {isSubmitting ? 'Adding...' : 'Add Point of Interest'}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                disabled={isSubmitting}
                className="px-4 py-2 bg-guild-neutral text-white rounded hover:bg-guild-neutral/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Map 
            locations={mapLocations}
            center={mapCenter && mapCenter.length === 2 ? mapCenter : [34.5, -92.5]}
            zoom={13}
            mapId="quest-brainstorm-map"
            height="400px"
          />
        </div>

        {/* Suggested POIs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-guild-primary">Suggested Points of Interest</h4>
            {isLoadingSuggestions && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-guild-primary"></div>
            )}
          </div>
          
          {/* Show new POI being created if form is open and has data */}
          {showPoiForm && (newPoi.name || newPoi.narrative || newPoi.type) && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-guild-primary mb-2">New POI Preview:</h5>
              <PoiCard 
                key="new-poi-preview"
                poi={newPoiForDisplay}
                onSelect={() => {}} // No selection for new POI
                isSelected={false}
                defaultExpanded={true} // Show expanded by default
                onUpdate={handleNewPoiUpdate}
                locationTypes={locationTypes}
                getTypeIcon={getTypeIcon}
              />
            </div>
          )}
          
          {suggestedPois.length > 0 ? (
            <div className="space-y-4">
              {suggestedPois.map((poi, index) => (
                <PoiCard 
                  key={poi.id || index}
                  poi={poi}
                  onSelect={() => onSelectPoi(poi)}
                  isSelected={selectedPoi?.name === poi.name}
                  defaultExpanded={false}
                  onUpdate={handlePoiUpdate}
                  locationTypes={locationTypes}
                  getTypeIcon={getTypeIcon}
                />
              ))}
            </div>
          ) : (
            <p className="text-guild-text">No suggestions available. Try finding nearby attractions first.</p>
          )}
        </div>
      </div>

      {/* Quest Planning Tools */}
      <div className="mt-6 p-4 bg-guild-secondary/20 rounded-lg">
        <h4 className="font-semibold text-guild-primary mb-3">Quest Planning Tools</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <button 
            onClick={onFindNearbyAttractions}
            className="px-3 py-2 bg-guild-highlight text-white rounded hover:bg-guild-highlight/80 transition-colors"
          >
            Find Nearby Attractions
          </button>
          <button 
            onClick={onTogglePoiForm}
            className="px-3 py-2 bg-guild-primary text-white rounded hover:bg-guild-primary/80 transition-colors"
          >
            {showPoiForm ? 'Cancel' : 'Add New Point of Interest'}
          </button>
          <button className="px-3 py-2 bg-guild-secondary text-guild-text rounded hover:bg-guild-secondary/80 transition-colors">
            Weather Info
          </button>
          <button className="px-3 py-2 bg-guild-neutral text-white rounded hover:bg-guild-neutral/80 transition-colors">
            Save Route
          </button>
        </div>
      </div>
    </>
  );
};

export default QuestMap;