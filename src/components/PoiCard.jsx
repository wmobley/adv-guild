import React, { useState, useEffect } from 'react';
import apiClient from '../services/advGuildApiClient';
import tokenService from '../services/tokenService';

const PoiCard = ({ 
  poi, 
  onSelect, 
  isSelected, 
  onUpdate, 
  onDelete,
  defaultExpanded = false, 
  questId, // Add questId prop to associate POI with a quest
  isNewPoi = false, // Flag to indicate if this is a new POI
  activeLocationTypes, // Prop for location types from parent
  getTypeIcon: activeGetTypeIcon // Prop for icon function from parent, aliased for consistency
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [interests, setInterests] = useState([]);
  const [loadingInterests, setLoadingInterests] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    narrative: '',
    type: '',
    lat: null,
    lng: null,
    address: ''
  });

  // Default location types as fallback if API fails
  const defaultLocationTypes = [
    'Shop', 'Museum', 'Trail', 'Restaurant', 'Park', 'Monument', 
    'Theater', 'Gallery', 'Library', 'Market', 'Landmark', 'Other'
  ];

  // Default icon function as fallback
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
      'Other': '📌',
      // Add more icons based on your API interests
      'Adventure': '⚔️',
      'History': '📜',
      'Nature': '🌿',
      'Culture': '🎨',
      'Food': '🍽️',
      'Entertainment': '🎭',
      'Shopping': '🛍️',
      'Sports': '⚽',
      'Technology': '💻',
      'Art': '🎨',
      'Music': '🎵',
      'Photography': '📸'
    };
    return icons[type] || '📌';
  };

  // Fetch interests from API on component mount
  useEffect(() => {
    const fetchInterests = async () => {
      setLoadingInterests(true);
      try {
        console.log('🎯 [PoiCard] Fetching interests from API...');
        const apiInterests = await apiClient.getInterests();
        console.log('✅ [PoiCard] Interests fetched:', apiInterests);
        
        if (Array.isArray(apiInterests)) {
          setInterests(apiInterests);
        } else {
          console.warn('⚠️ [PoiCard] API returned non-array interests:', apiInterests);
          setInterests(defaultLocationTypes);
        }
      } catch (error) {
        console.error('❌ [PoiCard] Failed to fetch interests:', error);
        // Fall back to default types
        setInterests(defaultLocationTypes);
      } finally {
        setLoadingInterests(false);
      }
    };

    fetchInterests();
  }, []);

  useEffect(() => {
    // Initialize isExpanded based on defaultExpanded, typically for new POIs
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  // Update editData when poi prop changes - use consistent property names
  useEffect(() => {
    console.log('POI prop changed:', poi);
    if (poi) {
      console.log(poi)
      const newEditData = {
        title: poi.title || poi.name || '',
        narrative: poi.narrative || poi.description || '',
        type: poi.type || poi.category || poi.interest || '',
        lat: poi.lat || poi.latitude || null,
        lng: poi.lng || poi.longitude || null,
        address: poi.address || ''
      };
      console.log('Setting editData to:', newEditData);
      setEditData(newEditData);
    }
  }, [poi]);

  // Clear success message after a delay
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleHeaderClick = (e) => {
    // Only expand/collapse when clicking on the header area (not buttons or inputs)
    if (e.target.closest('button') || e.target.closest('input')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleMinimizeClick = (e) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  const handleSelectClick = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(poi);
    }
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this POI?')) {
      try {
        await onDelete(poi);
      } catch (error) {
        console.error('Error deleting POI:', error);
        setSaveError('Failed to delete POI: ' + error.message);
      }
    }
  };

  const saveToApi = async (updatedPoi) => {
    if (!tokenService.hasToken()) {
      console.warn('No auth token available, skipping API save');
      return updatedPoi;
    }

    setIsSaving(true);
    setSaveError('');
    
    try {
      // Prepare data for API
      const apiData = {
        name: updatedPoi.title,
        description: updatedPoi.narrative,
        category: updatedPoi.type,
        interest: updatedPoi.type, // Map type to interest
        latitude: updatedPoi.lat,
        longitude: updatedPoi.lng,
        // Add any additional fields your API expects
        ...(updatedPoi.address && { address: updatedPoi.address }),
        ...(questId && { quest_id: questId })
      };

      let savedLocation;
      
      if (poi?.id || poi?.location_id) {
        // Update existing location (if your API supports updates)
        console.log('🔄 Updating existing location:', poi.id || poi.location_id);
        // Note: You'll need to add an updateLocation function to your API client
        // savedLocation = await updateLocation(poi.id || poi.location_id, apiData);
        console.warn('Location update not implemented yet');
        savedLocation = updatedPoi; // Fallback for now
      } else {
        // Create new location
        console.log('✨ Creating new location:', apiData);
        savedLocation = await apiClient.createLocation(apiData);
        console.log('✅ Location created:', savedLocation);
      }

      setSaveSuccess(true);
      return {
        ...updatedPoi,
        id: savedLocation.id || savedLocation.location_id,
        ...savedLocation
      };
    } catch (error) {
      console.error('❌ Failed to save POI to API:', error);
      setSaveError(error.message || 'Failed to save POI');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    
    // Ensure we're using consistent property names when updating
    const updatedPoi = {
      ...poi,
      title: editData.title,
      name: editData.title, // Keep both for compatibility
      narrative: editData.narrative,
      description: editData.narrative, // Keep both for compatibility
      type: editData.type,
      category: editData.type, // Keep both for compatibility
      interest: editData.type, // Map to interest field
      lat: editData.lat,
      latitude: editData.lat, // Keep both for compatibility
      lng: editData.lng,
      longitude: editData.lng // Keep both for compatibility
    };
    
    console.log('Saving POI:', updatedPoi);
    
    try {
      // Save to API first
      const savedPoi = await saveToApi(updatedPoi);
      
      // Then update local state
      if (onUpdate) {
        onUpdate(savedPoi);
      }
    } catch (error) {
      // Error is already handled in saveToApi
      console.error('Save failed:', error);
    }
  };

  const handleGenericInputChange = async (field, value) => {
    console.log(`Changing ${field} to:`, value);
    const newEditData = {
      ...editData,
      [field]: value
    };
    setEditData(newEditData);
    
    // Auto-save on change with consistent property names
    if (onUpdate && !isNewPoi) { // Don't auto-save for new POIs
      const updatedPoi = {
        ...poi,
        title: newEditData.title,
        name: newEditData.title,
        narrative: newEditData.narrative,
        description: newEditData.narrative,
        type: newEditData.type,
        category: newEditData.type,
        interest: newEditData.type,
        lat: newEditData.lat,
        latitude: newEditData.lat,
        lng: newEditData.lng,
        longitude: newEditData.lng
      };
      
      console.log('Auto-saving POI:', updatedPoi);
      
      try {
        const savedPoi = await saveToApi(updatedPoi);
        onUpdate(savedPoi);
      } catch (error) {
        // Error is already handled in saveToApi
        console.error('Auto-save failed:', error);
      }
    }
  };

  // Check if POI has valid coordinates - use current editData
  const hasValidCoordinates = editData?.lat && editData?.lng && 
    !isNaN(parseFloat(editData.lat)) && !isNaN(parseFloat(editData.lng));

  console.log('Rendering POI Card with editData:', editData);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md border-2 transition-all duration-300 hover:shadow-lg ${
        isSelected 
          ? 'border-guild-primary ring-2 ring-guild-primary/30 bg-gradient-to-br from-guild-primary/10 to-guild-primary/5' 
          : 'border-guild-highlight/40 hover:border-guild-primary/60 hover:shadow-xl'
      }`}
    >
      <div className="p-4">
        {/* Error display */}
        {saveError && (
          <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
            {saveError}
          </div>
        )}

        {/* Header - Clickable area for expand/collapse */}
        <div 
          className="cursor-pointer"
          onClick={handleHeaderClick}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 mr-3" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => handleGenericInputChange('title', e.target.value)}
                placeholder="Name this Point of Interest..."
                className={`font-bold text-base leading-tight bg-transparent w-full border-b-2 border-transparent hover:border-guild-primary/30 focus:border-guild-primary outline-none transition-colors ${
                  editData.title ? 'text-guild-primary' : 'text-guild-neutral placeholder-guild-neutral'
                }`}
              />
              {editData.address && (
                <p className="text-xs text-guild-neutral mt-1 truncate" title={editData.address}>
                  📍 {editData.address}
                </p>
              )}
            </div>
            <div className="flex items-center flex-shrink-0">
              {editData.type && (
                <span className="text-xs bg-gradient-to-r from-guild-secondary to-guild-highlight text-white px-2.5 py-1 rounded-full mr-2 whitespace-nowrap font-medium shadow-sm">
                  {activeGetTypeIcon ? activeGetTypeIcon(editData.type) : getTypeIcon(editData.type)} {editData.type}
                </span>
              )}
              
              {/* Save status indicators */}
              {isSaving && (
                <div className="flex items-center mr-2">
                  <svg className="animate-spin h-4 w-4 text-guild-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              
              {saveSuccess && (
                <div className="flex items-center mr-2" title="Saved successfully">
                  <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Delete button for existing POIs */}
              {!isNewPoi && onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="w-5 h-5 text-red-400 hover:text-red-600 transition-colors mr-2"
                  title="Delete POI"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              )}
              
              {/* Expand/Collapse arrow */}
              <svg 
                className={`w-5 h-5 text-guild-neutral transition-all duration-300 ${
                  isExpanded ? 'rotate-180 text-guild-primary' : 'hover:text-guild-primary'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Expanded Content - Not clickable for collapse */}
        <div className={isExpanded ? 'block' : 'hidden'}>
          <div className="mt-4 pt-4 border-t-2 border-guild-highlight/30 space-y-4">
            
            {/* Location Type Section */}
            <div className="bg-guild-secondary/10 rounded-lg p-3">
              <label className="text-xs font-bold text-guild-primary uppercase tracking-wider block mb-2">
                🏷️ Location Type:
              </label>
              <select
                value={editData.type}
                onChange={(e) => handleGenericInputChange('type', e.target.value)}
                className="text-sm font-medium w-full bg-white border border-guild-primary/30 rounded px-3 py-2 focus:border-guild-primary focus:ring-2 focus:ring-guild-primary/20 outline-none text-guild-text"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">Select location type...</option>
                {(activeLocationTypes || []).map(type => (
                  <option key={type} value={type}>
                    {activeGetTypeIcon ? activeGetTypeIcon(type) : '📌'} {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Narrative Section */}
            <div className="bg-gradient-to-r from-guild-primary/5 to-guild-highlight/5 rounded-lg p-3">
              <label className="text-xs font-bold text-guild-primary uppercase tracking-wider block mb-2">
                📝 Narrative:
              </label>
              <textarea
                value={editData.narrative}
                onChange={(e) => handleGenericInputChange('narrative', e.target.value)}
                placeholder="Narrate this location, what makes it special, what visitors can expect..."
                rows={4}
                className="text-sm leading-relaxed font-medium w-full bg-white border border-guild-primary/30 rounded px-3 py-2 focus:border-guild-primary focus:ring-2 focus:ring-guild-primary/20 outline-none text-guild-text resize-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Coordinates section - Show current coordinates from parent */}
            <div className={`rounded-lg p-3 ${hasValidCoordinates ? 'bg-green-50 border border-green-200' : 'bg-blue-50'}`}>
              <label className="text-xs font-bold text-guild-primary uppercase tracking-wider block mb-2">
                📍 Coordinates {hasValidCoordinates ? '(From Location Search)' : '(Optional)'}:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  value={editData.lat || ''}
                  onChange={(e) => handleGenericInputChange('lat', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Latitude"
                  className={`text-sm w-full border rounded px-3 py-2 focus:ring-2 focus:ring-guild-primary/20 outline-none ${
                    hasValidCoordinates 
                      ? 'bg-green-50 border-green-300 text-green-800' 
                      : 'bg-white border-guild-primary/30 focus:border-guild-primary'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                  readOnly={hasValidCoordinates}
                />
                <input
                  type="number"
                  step="any"
                  value={editData.lng || ''}
                  onChange={(e) => handleGenericInputChange('lng', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Longitude"
                  className={`text-sm w-full border rounded px-3 py-2 focus:ring-2 focus:ring-guild-primary/20 outline-none ${
                    hasValidCoordinates 
                      ? 'bg-green-50 border-green-300 text-green-800' 
                      : 'bg-white border-guild-primary/30 focus:border-guild-primary'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                  readOnly={hasValidCoordinates}
                />
              </div>
              <p className="text-xs text-guild-neutral mt-1">
                {hasValidCoordinates 
                  ? 'Coordinates automatically populated from location search' 
                  : 'Add coordinates to show this location on the map'
                }
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end items-center pt-3 mt-3 border-t border-guild-highlight/20">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-guild-primary text-white rounded-md hover:bg-guild-primary/80 text-sm font-medium"
              >
                Save POI Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoiCard;
