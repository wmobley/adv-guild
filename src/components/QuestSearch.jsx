import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationForm from './LocationForm';

const QuestSearch = () => {
  const [locationSearch, setLocationSearch] = useState('');
  const navigate = useNavigate();

  const handleLocationSelected = (location) => {
    // The location object from LocationForm can have different structures.
    // e.g., { formatted: '...', lat: '...', lon: '...', display_name: '...' }
    if (location && location.lat && location.lon) {
      // Navigate to public quests page with location data as query params
      navigate(`/public-quests?lat=${location.lat}&lon=${location.lon}&name=${encodeURIComponent(location.formatted || location.display_name)}`);
    }
  };

  return (
    <section className="py-16 bg-white rounded-xl shadow-2xl border-2 border-guild-highlight/20">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-guild-primary mb-4">Where would you like to go?</h2>
        <p className="text-lg text-guild-text mb-8">
          Start your adventure by searching for a destination.
        </p>
        <div className="max-w-xl mx-auto">
          <LocationForm
            value={locationSearch}
            onChange={setLocationSearch}
            onLocationSelect={handleLocationSelected}
            placeholder="Search for a city, landmark, or country..."
            label=""
          />
        </div>
      </div>
    </section>
  );
};

export default QuestSearch;