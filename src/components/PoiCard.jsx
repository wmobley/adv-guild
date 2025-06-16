import React, { useState, useEffect } from 'react';
import LocationForm from './LocationForm'; // Import LocationForm

const PoiCard = ({ poi, onSelect, isSelected, onUpdate, defaultExpanded = false, locationTypes = [], getTypeIcon }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    narrative: '',
    type: '',
    lat: null,
    lng: null
  });

  // Default location types as fallback if not provided via props
  const defaultLocationTypes = [
    'Shop', 'Museum', 'Trail', 'Restaurant', 'Park', 'Monument', 
    'Theater', 'Gallery', 'Library', 'Market', 'Landmark', 'Other'
  ];

  // Default icon function as fallback if not provided via props
  const defaultGetTypeIcon = (type) => {
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

  // Use props if provided, otherwise fall back to defaults
  const activeLocationTypes = locationTypes.length > 0 ? locationTypes : defaultLocationTypes;
  const activeGetTypeIcon = getTypeIcon || defaultGetTypeIcon;

  useEffect(() => {
    // Initialize isExpanded based on defaultExpanded, typically for new POIs
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  // Update editData when poi prop changes - use consistent property names
  useEffect(() => {
    console.log('POI prop changed:', poi);
    if (poi) {
      const newEditData = {
        title: poi.title || poi.name || '',
        narrative: poi.narrative || '',
        type: poi.type || '',
        lat: poi.lat || null,
        lng: poi.lng || null
      };
      console.log('Setting editData to:', newEditData);
      setEditData(newEditData);
    }
  }, [poi, poi?.title, poi?.name, poi?.narrative, poi?.type, poi?.lat, poi?.lng]); // Watch for changes in specific properties

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

  const handleSave = (e) => {
    e.stopPropagation();
    if (onUpdate) {
      // Ensure we're using consistent property names when updating
      const updatedPoi = {
        ...poi,
        title: editData.title,
        name: editData.title, // Keep both for compatibility
        narrative: editData.narrative,
        type: editData.type,
        lat: editData.lat,
        lng: editData.lng
      };
      console.log('Saving POI:', updatedPoi);
      onUpdate(updatedPoi);
    }
  };

  const handleGenericInputChange = (field, value) => {
    console.log(`Changing ${field} to:`, value);
    const newEditData = {
      ...editData,
      [field]: value
    };
    setEditData(newEditData);
    
    // Auto-save on change with consistent property names
    if (onUpdate) {
      const updatedPoi = {
        ...poi,
        title: newEditData.title,
        name: newEditData.title, // Keep both for compatibility
        narrative: newEditData.narrative,
        type: newEditData.type,
        lat: newEditData.lat,
        lng: newEditData.lng
      };
      console.log('Auto-saving POI:', updatedPoi);
      onUpdate(updatedPoi);
    }
  };

  const handleLocationFormChange = (value) => {
    console.log('Location form changed:', value);
    const newEditData = {
      ...editData,
      title: value,
    };
    setEditData(newEditData);
    
    if (onUpdate) {
      const updatedPoi = {
        ...poi,
        title: newEditData.title,
        name: newEditData.title, // Keep both for compatibility
        narrative: newEditData.narrative,
        type: newEditData.type,
        lat: newEditData.lat,
        lng: newEditData.lng
      };
      console.log('Auto-saving from location form:', updatedPoi);
      onUpdate(updatedPoi);
    }
  };

  const handleLocationFormSelect = (locationData) => {
    console.log('Location selected:', locationData);
    // This is when a location is selected from suggestions
    const newEditData = {
      ...editData,
      title: locationData.name || locationData.label || editData.title,
      lat: locationData.lat,
      lng: locationData.lng,
    };
    setEditData(newEditData);
    
    // Auto-save on selection with consistent property names
    if (onUpdate) {
      const updatedPoi = {
        ...poi,
        title: newEditData.title,
        name: newEditData.title, // Keep both for compatibility
        narrative: newEditData.narrative,
        type: newEditData.type,
        lat: newEditData.lat,
        lng: newEditData.lng
      };
      console.log('Auto-saving from location select:', updatedPoi);
      onUpdate(updatedPoi);
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
        {/* Header - Clickable area for expand/collapse */}
        <div 
          className="cursor-pointer"
          onClick={handleHeaderClick}
        >
          <div className="flex items-start justify-between mb-3">
            {/* Replace text input with LocationForm for title/location search */}
            <div className="flex-1 mr-3" onClick={(e) => e.stopPropagation()}>
              <LocationForm
                value={editData.title}
                onChange={handleLocationFormChange}
                onLocationSelect={handleLocationFormSelect}
                placeholder="Enter POI name or search location..."
                label="" // No separate label needed here
                // Apply minimal styling to blend in, actual input styling is via inputClassName
                className="w-full" 
                inputClassName={`font-bold text-base leading-tight bg-transparent w-full border-b-2 border-transparent hover:border-guild-primary/30 focus:border-guild-primary outline-none transition-colors ${
                  editData.title ? 'text-guild-primary' : 'text-guild-neutral placeholder-guild-neutral'
                }`}
              />
            </div>
            <div className="flex items-center flex-shrink-0">
              {editData.type && (
                <span className="text-xs bg-gradient-to-r from-guild-secondary to-guild-highlight text-white px-2.5 py-1 rounded-full mr-2 whitespace-nowrap font-medium shadow-sm">
                  {activeGetTypeIcon(editData.type)} {editData.type}
                </span>
              )}
              
              {/* Minimize button when expanded */}
              {isExpanded ? (
                <button
                  onClick={handleMinimizeClick}
                  className="w-5 h-5 text-guild-neutral hover:text-guild-primary transition-colors mr-2"
                  title="Minimize"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              ) : null}
              
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
                {activeLocationTypes.map(type => (
                  <option key={type} value={type}>
                    {activeGetTypeIcon(type)} {type}
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
