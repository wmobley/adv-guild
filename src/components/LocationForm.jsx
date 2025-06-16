import React, { useState, useRef, useEffect, useCallback } from 'react';

const LocationForm = ({ 
  value, 
  onChange, 
  label = "Location", 
  placeholder = "Enter location...",
  required = false,
  className = "",
  onLocationSelect 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const locationInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Debounced geocoding function
  const searchLocations = useCallback(async (query) => {
    if (!query || query.trim().length < 3) {
      setFilteredLocations([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Using Nominatim API (OpenStreetMap's free geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'User-Agent': 'adv-guild-app' // Required by Nominatim
          }
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();
      
      // Format the results for display
      const formattedLocations = data.map(item => ({
        display_name: item.display_name,
        formatted: formatLocationName(item),
        lat: item.lat,
        lon: item.lon,
        type: item.type,
        importance: item.importance
      }));

      // Sort by importance (higher is better)
      formattedLocations.sort((a, b) => (b.importance || 0) - (a.importance || 0));

      setFilteredLocations(formattedLocations);
      setShowSuggestions(formattedLocations.length > 0);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setFilteredLocations([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Format location name for better display
  const formatLocationName = (item) => {
    const address = item.address || {};
    const parts = [];

    // Add city/town/village
    if (address.city) parts.push(address.city);
    else if (address.town) parts.push(address.town);
    else if (address.village) parts.push(address.village);
    else if (address.hamlet) parts.push(address.hamlet);

    // Add state/province
    if (address.state) parts.push(address.state);
    else if (address.province) parts.push(address.province);

    // Add country
    if (address.country) parts.push(address.country);

    // If we couldn't parse the address well, use the display name but truncate it
    if (parts.length === 0) {
      return item.display_name.length > 60 
        ? item.display_name.substring(0, 60) + '...'
        : item.display_name;
    }

    return parts.join(', ');
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      searchLocations(newValue);
    }, 300); // 300ms delay
  };

  const handleLocationSelect = (location) => {
    onChange(location.formatted);
    setShowSuggestions(false);
    setFilteredLocations([]);
    
    // Call the optional callback with full location data
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    
    // Optional: Store coordinates for future use
    console.log('Selected location coordinates:', { lat: location.lat, lon: location.lon });
  };

  const handleLocationFocus = () => {
    if (value.trim().length >= 3 && filteredLocations.length > 0) {
      setShowSuggestions(true);
    } else if (value.trim().length >= 3) {
      searchLocations(value);
    }
  };

  const handleLocationBlur = () => {
    // Delay hiding suggestions to allow for clicks on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <label htmlFor="location" className="block text-sm font-medium text-guild-text mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          ref={locationInputRef}
          type="text"
          id="location"
          name="location"
          value={value}
          onChange={handleInputChange}
          onFocus={handleLocationFocus}
          onBlur={handleLocationBlur}
          className="w-full px-4 py-2 pr-10 border border-guild-highlight/30 rounded-lg focus:ring-2 focus:ring-guild-primary focus:border-transparent"
          placeholder={placeholder}
          autoComplete="off"
          required={required}
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-guild-primary border-t-transparent"></div>
          </div>
        )}
      </div>
      
      {/* Location Suggestions Dropdown */}
      {showSuggestions && filteredLocations.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-guild-highlight/30 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredLocations.map((location, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleLocationSelect(location)}
              className="w-full px-4 py-3 text-left hover:bg-guild-primary/10 focus:bg-guild-primary/10 focus:outline-none border-b border-guild-highlight/10 last:border-b-0"
            >
              <div className="flex flex-col">
                <span className="text-guild-text font-medium">{location.formatted}</span>
                {location.formatted !== location.display_name && (
                  <span className="text-xs text-guild-text/60 mt-1 truncate">
                    {location.display_name}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && filteredLocations.length === 0 && !isLoading && value.trim().length >= 3 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-guild-highlight/30 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-guild-text/60 text-sm">
            No locations found. Try a different search term.
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationForm;