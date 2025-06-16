import React, { useState } from 'react';
import PoiCard from './PoiCard';

const QuestRoute = ({ 
  mapLocations, 
  onRemoveLocation, 
  onReorderLocations, 
  onUpdateLocationDay,
  onSelectPoi,
  onUpdateLocation // Add this prop to handle POI updates
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Location type options - centralized here to match QuestMap
  const locationTypes = [
    'Shop', 'Museum', 'Trail', 'Restaurant', 'Park', 'Monument', 
    'Theater', 'Gallery', 'Library', 'Market', 'Landmark', 'Other'
  ];

  // Get type icon function - centralized here to match QuestMap
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

  if (mapLocations.length <= 1) return null;

  // Group locations by day
  const locationsByDay = mapLocations.reduce((acc, location, index) => {
    const day = location.day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push({ ...location, originalIndex: index });
    return acc;
  }, {});

  const sortedDays = Object.keys(locationsByDay).sort((a, b) => parseInt(a) - parseInt(b));

  const handleDragStart = (e, index) => {
    if (!onReorderLocations) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    if (!onReorderLocations) return;
    e.preventDefault();
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    if (!onReorderLocations) return;
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderLocations(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDayChange = (locationIndex, newDay) => {
    if (onUpdateLocationDay) {
      onUpdateLocationDay(locationIndex, parseInt(newDay));
    }
  };

  const handlePoiSelect = (poi, globalIndex) => {
    if (onSelectPoi) {
      onSelectPoi(poi);
    }
  };

  const handlePoiUpdate = (updatedPoi, globalIndex) => {
    if (onUpdateLocation) {
      onUpdateLocation(globalIndex, updatedPoi);
    }
  };

  return (
    <div className="mb-4 p-4 bg-guild-secondary/10 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-guild-primary">Quest Route</h4>
        <div className="text-sm text-guild-neutral">
          {sortedDays.length} day{sortedDays.length !== 1 ? 's' : ''} planned
        </div>
      </div>

      <div className="space-y-4">
        {sortedDays.map(day => (
          <div key={day} className="border border-guild-highlight/30 rounded-lg p-3 bg-white/50">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-guild-primary">Day {day}</h5>
              <div className="text-xs text-guild-neutral">
                {locationsByDay[day].length} location{locationsByDay[day].length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="space-y-3">
              {locationsByDay[day].map((location, dayIndex) => {
                const globalIndex = location.originalIndex;
                const isDragging = draggedIndex === globalIndex;
                const isDragOver = dragOverIndex === globalIndex;
                const canDrag = typeof onReorderLocations === 'function';
                
                return (
                  <div
                    key={globalIndex}
                    draggable={canDrag}
                    onDragStart={canDrag ? (e) => handleDragStart(e, globalIndex) : undefined}
                    onDragOver={canDrag ? (e) => handleDragOver(e, globalIndex) : undefined}
                    onDragLeave={canDrag ? handleDragLeave : undefined}
                    onDrop={canDrag ? (e) => handleDrop(e, globalIndex) : undefined}
                    className={`relative transition-all ${
                      canDrag ? 'cursor-move' : ''
                    } ${
                      isDragging 
                        ? 'opacity-50 scale-95' 
                        : isDragOver 
                        ? 'scale-105' 
                        : ''
                    }`}
                  >
                    {/* Drag handle overlay */}
                    {canDrag && (
                      <div className="absolute top-2 left-2 z-10 bg-white/90 rounded p-1 shadow-sm">
                        <svg className="w-4 h-4 text-guild-neutral hover:text-guild-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                        </svg>
                      </div>
                    )}

                    {/* Controls overlay */}
                    <div className="absolute bottom-2 right-2 z-10 flex items-center space-x-2">
                      {/* Day selector */}
                      {onUpdateLocationDay && (
                        <select
                          value={location.day || 1}
                          onChange={(e) => handleDayChange(globalIndex, e.target.value)}
                          className="text-xs border border-guild-highlight/30 rounded px-2 py-1 bg-white text-guild-text shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {[...Array(Math.max(5, parseInt(day) + 1))].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Day {i + 1}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Remove button */}
                      {globalIndex > 0 && onRemoveLocation && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveLocation(globalIndex);
                          }}
                          className="bg-white/90 text-red-500 hover:text-red-700 p-1 rounded shadow-sm hover:shadow-md transition-all"
                          title="Remove Point of Interest"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* POI Card */}
                    <div className="relative">
                      <PoiCard
                        poi={location}
                        onSelect={(poi) => handlePoiSelect(poi, globalIndex)}
                        isSelected={location.isSelected || false}
                        defaultExpanded={location.defaultExpanded || false} // Pass the flag for new POIs
                        onUpdate={(updatedData) => handlePoiUpdate(updatedData, globalIndex)} // Pass onUpdate
                        locationTypes={locationTypes} // Add missing prop
                        getTypeIcon={getTypeIcon} // Add missing prop
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quest summary */}
      <div className="mt-4 p-2 bg-guild-primary/5 rounded text-sm text-guild-neutral">
        <div className="flex justify-between items-center">
          <span>Total locations: {mapLocations.length}</span>
          <span>Duration: {sortedDays.length} day{sortedDays.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestRoute;
