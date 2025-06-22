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
  const [error, setError] = useState(null);
  const locationInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Debounced geocoding function with enhanced error handling
  const searchLocations = useCallback(async (query) => {
    console.log('🔍 LocationForm: Searching for:', query);
    
    if (!query || query.trim().length < 3) {
      setFilteredLocations([]);
      setShowSuggestions(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodedQuery}`;
      
      console.log('🌐 LocationForm: Making request to:', url);

      // Using Nominatim API (OpenStreetMap's free geocoding service)
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'adv-guild-app/1.0', // Required by Nominatim
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        // Add timeout and other options
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      console.log('📡 LocationForm: Response status:', response.status, response.statusText);
      console.log('📡 LocationForm: Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ LocationForm: API Error Response:', errorText);
        throw new Error(`Geocoding request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📍 LocationForm: Received data:', data);

      if (!Array.isArray(data)) {
        console.error('❌ LocationForm: Invalid response format:', data);
        throw new Error('Invalid response format from geocoding service');
      }

      // Format the results for display
      const formattedLocations = data.map((item, index) => {
        console.log(`📍 LocationForm: Processing item ${index}:`, item);
        
        return {
          display_name: item.display_name || 'Unknown location',
          formatted: formatLocationName(item),
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          type: item.type || 'unknown',
          importance: parseFloat(item.importance) || 0,
          raw: item // Keep raw data for debugging
        };
      }).filter(location => {
        // Filter out invalid coordinates
        const isValid = !isNaN(location.lat) && !isNaN(location.lon);
        if (!isValid) {
          console.warn('⚠️ LocationForm: Filtered out invalid location:', location);
        }
        return isValid;
      });

      console.log('✅ LocationForm: Formatted locations:', formattedLocations);

      // Sort by importance (higher is better)
      formattedLocations.sort((a, b) => (b.importance || 0) - (a.importance || 0));

      setFilteredLocations(formattedLocations);
      setShowSuggestions(formattedLocations.length > 0);
      
      if (formattedLocations.length === 0) {
        setError('No locations found for your search');
      }
    } catch (error) {
      console.error('❌ LocationForm: Error fetching location suggestions:', error);
      console.error('❌ LocationForm: Error stack:', error.stack);
      
      let errorMessage = 'Failed to search locations';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Search request timed out';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error - please check your connection';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS error - trying alternative approach';
      } else if (error.message.includes('credentials')) {
        errorMessage = 'Authentication error with location service';
      }
      
      setError(errorMessage);
      setFilteredLocations([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Alternative search function using a different approach
  const searchLocationsAlternative = useCallback(async (query) => {
    console.log('🔄 LocationForm: Trying alternative search method');
    
    try {
      // Try using a CORS proxy or different endpoint
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const targetUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodeURIComponent(query)}`;
      const url = proxyUrl + encodeURIComponent(targetUrl);
      
      console.log('🌐 LocationForm: Alternative request to:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('📍 LocationForm: Alternative response:', data);
      // Process the same way as the main function
      // ... (same processing logic)
      
    } catch (error) {
      console.error('❌ LocationForm: Alternative method also failed:', error);
      throw error;
    }
  }, []);

  // Format location name for better display
  const formatLocationName = (item) => {
    try {
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
        return item.display_name && item.display_name.length > 60 
          ? item.display_name.substring(0, 60) + '...'
          : item.display_name || 'Unknown location';
      }

      return parts.join(', ');
    } catch (error) {
      console.error('❌ LocationForm: Error formatting location name:', error);
      return item.display_name || 'Unknown location';
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setError(null); // Clear error when user types

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
    console.log('📍 LocationForm: Location selected:', location);
    
    onChange(location.formatted);
    setShowSuggestions(false);
    setFilteredLocations([]);
    setError(null);
    
    // Call the optional callback with full location data
    if (onLocationSelect) {
      onLocationSelect({
        ...location,
        coords: [location.lat, location.lon] // Ensure coords are in [lat, lng] format
      });
    }
    
    // Store coordinates for future use
    console.log('📍 LocationForm: Selected location coordinates:', { 
      lat: location.lat, 
      lon: location.lon,
      coords: [location.lat, location.lon]
    });
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
      
      {/* Error message */}
      {error && (
        <div className="mt-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
      
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
      {showSuggestions && filteredLocations.length === 0 && !isLoading && value.trim().length >= 3 && !error && (
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