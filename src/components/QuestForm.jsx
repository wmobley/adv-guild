import React, { useState, useEffect } from 'react';
import LocationForm from './LocationForm';

const QuestForm = ({ 
  onCreateQuest, 
  difficulties = [], 
  interests = [], 
  mapLocationsCount = 0,
  onSetInitialLocation,
  isLoadingLocation
}) => {
  const [formData, setFormData] = useState({
    name: '',
    synopsis: '',
    difficulty_id: '',
    interest_id: '',
    is_public: true, // Default to public
  });
  const [locationSearch, setLocationSearch] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Set default values for dropdowns if they are empty and data is available
  useEffect(() => {
    // This effect runs when the difficulties or interests lists are populated.
    // It sets the default value for the dropdowns if they haven't been set yet.
    // Using the updater function with a single update prevents issues with stale state.
    setFormData(prev => {
      const newFormData = { ...prev };
      let hasChanged = false;

      if (prev.difficulty_id === '' && difficulties.length > 0) {
        newFormData.difficulty_id = difficulties[0].id.toString();
        hasChanged = true;
      }
      if (prev.interest_id === '' && interests.length > 0) {
        newFormData.interest_id = interests[0].id.toString();
        hasChanged = true;
      }
      
      return hasChanged ? newFormData : prev;
    });
  }, [difficulties, interests]); // This dependency array is correct.

  const handleSubmit = (e) => {
    e.preventDefault();
    // The browser's native 'required' attribute handles empty fields.
    // The location requirement is handled by disabling the button.
    onCreateQuest(formData);
  };

  const handleLocationSelected = (location) => {
    if (onSetInitialLocation) {
      onSetInitialLocation(location);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-8 border-t-2 border-guild-highlight/20 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-guild-text mb-1">
            Quest Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-guild-neutral/30 rounded-md focus:outline-none focus:ring-2 focus:ring-guild-primary focus:border-transparent"
            placeholder="The Legend of the Lost Amulet"
            required
          />
        </div>
        <div className="md:pt-7">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-guild-accent focus:ring-guild-accent"
            />
            <span className="text-guild-text font-medium">Make this quest public?</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="synopsis" className="block text-sm font-medium text-guild-text mb-1">
          Synopsis *
        </label>
        <textarea
          id="synopsis"
          name="synopsis"
          value={formData.synopsis}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-guild-neutral/30 rounded-md focus:outline-none focus:ring-2 focus:ring-guild-primary focus:border-transparent"
          placeholder="A brief, enticing summary of the adventure."
          required
        />
      </div>

      {mapLocationsCount === 0 && (
        <div className="border-t-2 border-guild-highlight/20 pt-6">
          <h3 className="text-lg font-medium text-guild-primary mb-2">
            Where does the quest begin?
          </h3>
          <p className="text-sm text-guild-text mb-4">
            Add the starting point for your adventure. You can add more locations using the map afterward.
          </p>
          <LocationForm
            value={locationSearch}
            onChange={setLocationSearch}
            onLocationSelect={handleLocationSelected}
            label="Starting Location *"
            placeholder="Search for a city, landmark, or address..."
            required={true}
          />
          {isLoadingLocation && (
            <div className="flex items-center text-guild-text mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-guild-primary mr-2"></div>
              Adding location to the guild archives...
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="difficulty_id" className="block text-sm font-medium text-guild-text mb-1">
            Difficulty Level *
          </label>
          <select
            id="difficulty_id"
            name="difficulty_id"
            value={formData.difficulty_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-guild-neutral/30 rounded-md focus:outline-none focus:ring-2 focus:ring-guild-primary focus:border-transparent bg-white"
          >
            <option value="" disabled>Select Difficulty</option>
            {difficulties.map(diff => (
              <option key={diff.id} value={diff.id}>{diff.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="interest_id" className="block text-sm font-medium text-guild-text mb-1">
            Primary Interest *
          </label>
          <select
            id="interest_id"
            name="interest_id"
            value={formData.interest_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-guild-neutral/30 rounded-md focus:outline-none focus:ring-2 focus:ring-guild-primary focus:border-transparent bg-white"
          >
            <option value="" disabled>Select Interest</option>
            {interests.map(interest => (
              <option key={interest.id} value={interest.id}>{interest.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-guild-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-guild-accent transition-colors shadow-lg hover:shadow-xl disabled:bg-guild-neutral/50 disabled:cursor-not-allowed"
          disabled={mapLocationsCount === 0}
        >
          Submit Quest to Guild
        </button>
        {mapLocationsCount === 0 && (
          <p className="text-red-500 text-sm ml-4 self-center">Add at least one location via the map to submit.</p>
        )}
      </div>
    </form>
  );
};

export default QuestForm;
