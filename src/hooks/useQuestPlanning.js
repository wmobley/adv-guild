import { useState } from 'react';

export const useQuestPlanning = () => {
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
  const [questLocation, setQuestLocation] = useState('');
  const [mapLocations, setMapLocations] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showPoiForm, setShowPoiForm] = useState(false);
  const [poiInput, setPoiInput] = useState('');
  const [isAddingPoi, setIsAddingPoi] = useState(false);
  const [suggestedPois, setSuggestedPois] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [nerdInterest, setNerdInterest] = useState('');

  const handleBrainstormItinerary = async (location) => {
    if (!location.trim()) {
      alert('Please enter a location first!');
      return;
    }

    setIsLoadingLocation(true);
    setQuestLocation(location);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const coords = [parseFloat(lat), parseFloat(lon)];
        
        setMapCenter(coords);
        setMapLocations([
          {
            name: "Quest Starting Point",
            description: `Your adventure begins here: ${display_name}`,
            coords: coords,
          }
        ]);
        setShowMap(true);
      } else {
        alert('Location not found. Please try a different location.');
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
      alert('Error finding location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleFindNearbyAttractions = async () => {
    if (!questLocation.trim()) {
      alert('Please set a quest location first!');
      return;
    }

    if (!nerdInterest.trim()) {
      const interest = prompt('What\'s your nerd interest? (e.g., Fantasy books, Marvel movies, Greek mythology, RPG games)');
      if (!interest) return;
      setNerdInterest(interest);
    }

    setIsLoadingSuggestions(true);

    try {
      // Mock data for demonstration - replace with actual LLM API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockData = {
        pointsOfInterest: [
          {
            name: "The Enchanted Library",
            location: "Downtown Public Library",
            nerdConnection: "Lord of the Rings, Fantasy Literature",
            narrative: "Within these hallowed halls, ancient tomes whisper secrets of forgotten realms. The leather-bound volumes seem to glow with an otherworldly light, and locals swear they've seen hooded figures browsing the mythology section at midnight.",
            latitude: mapCenter[0] + 0.01,
            longitude: mapCenter[1] + 0.01
          },
          {
            name: "The Alchemist's Tower",
            location: "Historic Clock Tower",
            nerdConnection: "Harry Potter, Medieval Fantasy",
            narrative: "This ancient spire has stood for centuries, its bells marking time for generations of seekers. Legend speaks of a hidden chamber where a master alchemist once practiced his craft, leaving behind mysterious symbols etched in stone.",
            latitude: mapCenter[0] - 0.01,
            longitude: mapCenter[1] + 0.01
          },
          {
            name: "The Dragon's Hoard Tavern",
            location: "Historic Inn & Restaurant",
            nerdConnection: "D&D, Fantasy RPGs",
            narrative: "This weathered tavern has welcomed weary travelers for generations. The barkeep speaks in riddles, and the walls are adorned with maps of distant lands. Some say the basement holds treasures from forgotten adventures.",
            latitude: mapCenter[0] + 0.005,
            longitude: mapCenter[1] - 0.005
          }
        ]
      };

      setSuggestedPois(mockData.pointsOfInterest);
    } catch (error) {
      console.error('Error fetching POI suggestions:', error);
      alert('Error getting suggestions. Please try again.');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Updated function to handle POI objects from the form
  const handleAddPointOfInterest = async (poiData) => {
    console.log('handleAddPointOfInterest called with:', poiData);
    console.log('Type of poiData:', typeof poiData);
    
    // If it's a string (legacy usage), use the old logic
    if (typeof poiData === 'string') {
      console.log('Using legacy string handler');
      return handleAddPointOfInterestLegacy(poiData);
    }

    // New logic for POI objects from the form
    console.log('Using new POI object handler');
    console.log('poiData.name:', poiData.name);
    console.log('poiData.name?.trim():', poiData.name?.trim());
    
    if (!poiData.name?.trim()) {
      console.log('Validation failed: name is empty');
      alert('Please enter a Point of Interest name!');
      return;
    }

    setIsAddingPoi(true);

    try {
      // If address is provided, geocode it
      let coords = null;
      if (poiData.address?.trim()) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(poiData.address)}&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          coords = [parseFloat(lat), parseFloat(lon)];
        }
      }

      // If no address or geocoding failed, place near map center
      if (!coords) {
        coords = [
          mapCenter[0] + (Math.random() - 0.5) * 0.01,
          mapCenter[1] + (Math.random() - 0.5) * 0.01
        ];
      }

      const newPoi = {
        name: poiData.name,
        description: poiData.description || `${poiData.category ? `${poiData.category}: ` : ''}${poiData.name}`,
        coords: coords,
        category: poiData.category,
        address: poiData.address
      };

      setMapLocations(prev => [...prev, newPoi]);
      setShowPoiForm(false);
    } catch (error) {
      console.error('Error adding Point of Interest:', error);
      alert('Error adding Point of Interest. Please try again.');
    } finally {
      setIsAddingPoi(false);
    }
  };

  // Legacy function for string-based POI input
  const handleAddPointOfInterestLegacy = async (poiInput) => {
    if (!poiInput.trim()) {
      alert('Please enter a Point of Interest location!');
      return;
    }

    setIsAddingPoi(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(poiInput)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const coords = [parseFloat(lat), parseFloat(lon)];
        
        const newPoi = {
          name: `Point of Interest ${mapLocations.length}`,
          description: `Stop along your quest: ${display_name}`,
          coords: coords,
        };

        setMapLocations(prev => [...prev, newPoi]);
        setPoiInput('');
        setShowPoiForm(false);
      } else {
        alert('Point of Interest location not found. Please try a different location.');
      }
    } catch (error) {
      console.error('Error geocoding Point of Interest:', error);
      alert('Error finding Point of Interest location. Please try again.');
    } finally {
      setIsAddingPoi(false);
    }
  };

  const handleSelectPoi = (poi) => {
    setSelectedPoi(poi);
    // Add to map if not already there
    const isAlreadyOnMap = mapLocations.some(loc => 
      Math.abs(loc.coords[0] - poi.latitude) < 0.001 && 
      Math.abs(loc.coords[1] - poi.longitude) < 0.001
    );
    
    if (!isAlreadyOnMap) {
      const newMapLocation = {
        name: poi.name,
        description: poi.narrative,
        coords: [poi.latitude, poi.longitude]
      };
      setMapLocations(prev => [...prev, newMapLocation]);
    }
  };

  const handleRemovePointOfInterest = (index) => {
    if (index === 0) {
      alert("Cannot remove the starting point!");
      return;
    }
    setMapLocations(prev => prev.filter((_, i) => i !== index));
  };

  const handleCloseMap = () => {
    setShowMap(false);
    setShowPoiForm(false);
    setPoiInput('');
  };

  const handleTogglePoiForm = () => {
    setShowPoiForm(!showPoiForm);
    if (showPoiForm) {
      setPoiInput('');
    }
  };

  const handlePoiInputChange = (value) => {
    setPoiInput(value);
  };

  const handleCancelPoiForm = () => {
    setShowPoiForm(false);
    setPoiInput('');
  };

  const handleReorderLocations = (fromIndex, toIndex) => {
    setMapLocations(prev => {
      const newLocations = [...prev];
      const [movedItem] = newLocations.splice(fromIndex, 1);
      newLocations.splice(toIndex, 0, movedItem);
      return newLocations;
    });
  };

  const handleUpdateLocationDay = (locationIndex, newDay) => {
    setMapLocations(prev => 
      prev.map((location, index) => 
        index === locationIndex 
          ? { ...location, day: newDay }
          : location
      )
    );
  };

  return {
    // State
    showMap,
    mapCenter,
    questLocation,
    mapLocations,
    isLoadingLocation,
    showPoiForm,
    poiInput,
    isAddingPoi,
    suggestedPois,
    isLoadingSuggestions,
    selectedPoi,
    nerdInterest,
    
    // Actions
    handleBrainstormItinerary,
    handleFindNearbyAttractions,
    handleAddPointOfInterest,
    handleSelectPoi,
    handleRemovePointOfInterest,
    handleCloseMap,
    handleTogglePoiForm,
    handlePoiInputChange,
    handleCancelPoiForm,
    handleReorderLocations,
    handleUpdateLocationDay
  };
};