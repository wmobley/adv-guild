import React, { useState } from 'react';
import LocationForm from './LocationForm';

const QuestForm = ({ onBrainstormItinerary }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    inspiration: '',
    duration: '',
    difficulty: 'beginner'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (value) => {
    setFormData(prev => ({
      ...prev,
      location: value
    }));
  };

  const handleLocationSelect = (locationData) => {
    // Optional: Store additional location data like coordinates
    console.log('Full location data:', locationData);
    // You could store this in state if needed for other features
  };

  const handleBrainstormClick = (e) => {
    e.preventDefault();
    
    // Option 1: Remove validation entirely
    if (onBrainstormItinerary) {
      onBrainstormItinerary(formData.location || 'Default Location');
    }
    
    // Option 2: Keep validation but with better error message
    // if (!formData.location.trim()) {
    //   alert('Please enter a starting location to brainstorm your itinerary!');
    //   return;
    // }
    // 
    // if (onBrainstormItinerary) {
    //   onBrainstormItinerary(formData.location);
    // }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Quest created:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-guild-text mb-2">
          Quest Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-guild-highlight/30 rounded-lg focus:ring-2 focus:ring-guild-primary focus:border-transparent"
          placeholder="Enter your quest title..."
        />
      </div>

      {/* Use the new LocationForm component */}
      <LocationForm
        value={formData.location}
        onChange={handleLocationChange}
        onLocationSelect={handleLocationSelect}
        label="Starting Location"
        placeholder="Enter starting location (city, landmark, etc.)..."
        required={false}
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-guild-text mb-2">
          Quest Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 border border-guild-highlight/30 rounded-lg focus:ring-2 focus:ring-guild-primary focus:border-transparent"
          placeholder="Describe your quest adventure..."
        />
      </div>

      <div>
        <label htmlFor="inspiration" className="block text-sm font-medium text-guild-text mb-2">
          Inspiration Source
        </label>
        <input
          type="text"
          id="inspiration"
          name="inspiration"
          value={formData.inspiration}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-guild-highlight/30 rounded-lg focus:ring-2 focus:ring-guild-primary focus:border-transparent"
          placeholder="Book, movie, mythology, etc..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-guild-text mb-2">
            Duration
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-guild-highlight/30 rounded-lg focus:ring-2 focus:ring-guild-primary focus:border-transparent"
            placeholder="e.g., 3 days, 1 week..."
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-guild-text mb-2">
            Difficulty Level
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-guild-highlight/30 rounded-lg focus:ring-2 focus:ring-guild-primary focus:border-transparent"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={handleBrainstormClick}
          className="flex-1 bg-guild-highlight text-white py-3 px-6 rounded-lg hover:bg-guild-highlight/80 transition-colors font-medium"
        >
          🗺️ Brainstorm Itinerary
        </button>
        
        <button
          type="submit"
          className="flex-1 bg-guild-primary text-white py-3 px-6 rounded-lg hover:bg-guild-primary/80 transition-colors font-medium"
        >
          Create Quest
        </button>
      </div>
    </form>
  );
};

export default QuestForm;
