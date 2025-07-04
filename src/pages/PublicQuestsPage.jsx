import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import apiClient from '../services/advGuildApiClient'; // Import the API client
import QuestMapDisplay from '/src/components/QuestMapDisplay.jsx'; // Use the correct display component with an absolute path

const PublicQuestsPage = () => {
  const [publicQuests, setPublicQuests] = useState([]);
  const [loading, setLoading] = useState(true); // Start in loading state
  const [error, setError] = useState(null);
  const [locationsMap, setLocationsMap] = useState({});
  const [difficultiesMap, setDifficultiesMap] = useState({});
  const [interestsMap, setInterestsMap] = useState({});

  // State for filters
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedInterest, setSelectedInterest] = useState('all');
  // We might also want to fetch users if we want to display author names instead of IDs
  // const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    const fetchQuestsAndReferenceData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Attempting to fetch public quests and reference data from adv-guild-api...");
        
        const [questsData, 
          locationsData, 
          difficultiesData, 
          interestsData
        ] = await Promise.all([
          apiClient.getPublicQuests(),
          apiClient.getLocations(),
          apiClient.getDifficulties(),
          apiClient.getInterests(),
          // apiClient.getUsers() // If you have an endpoint for all users
        ]);
        console.log(questsData)
        // Process quests
        setPublicQuests(questsData.quests || questsData || []);

        // Process reference data into maps for easy lookup
        const locMap = locationsData.reduce((acc, loc) => {
          acc[loc.id] = loc;
          return acc;
        }, {});
        setLocationsMap(locMap);

        const diffMap = difficultiesData.reduce((acc, diff) => {
          acc[diff.id] = diff;
          return acc;
        }, {});
        setDifficultiesMap(diffMap);

        const intMap = interestsData.reduce((acc, interest) => {
          acc[interest.id] = interest;
          return acc;
        }, {});
        setInterestsMap(intMap);

      } catch (err) {
        console.error("Failed to fetch public quests:", err);
        setError(err.message || 'Failed to fetch public quests.');
        setPublicQuests([]); // Clear list on error
      } finally {
        setLoading(false);
      }
    };

    fetchQuestsAndReferenceData();
  }, []); // Empty dependency array means this effect runs once on mount

  // Create a memoized list of quests that updates when filters change
  const filteredQuests = React.useMemo(() => {
    if (loading) return []; // Don't filter while loading
    return publicQuests.filter(quest => {
      const difficultyMatch = selectedDifficulty === 'all' || quest.difficulty_id === parseInt(selectedDifficulty, 10);
      const interestMatch = selectedInterest === 'all' || quest.interest_id === parseInt(selectedInterest, 10);
      return difficultyMatch && interestMatch;
    });
  }, [publicQuests, selectedDifficulty, selectedInterest, loading]);

  // Prepare markers for the map from the filtered quest data, memoized for performance
  const questMarkers = React.useMemo(() => {
    return filteredQuests
      .map((quest, index) => {
        // --- DIAGNOSTIC LOGGING: Inspect the quest object from the API ---
        console.log(`[Marker Processing] Quest #${index + 1} (ID: ${quest.id}):`, quest);

        let location = null;

        // Logic to find the location data, checking multiple possible structures
        if (quest.startLocation && quest.startLocation.latitude && quest.startLocation.longitude) {
          location = quest.startLocation; // Check for embedded 'startLocation' (camelCase)
        } else if (quest.start_location && quest.start_location.latitude && quest.start_location.longitude) {
          location = quest.start_location; // Check for embedded 'start_location' (snake_case)
        } else if (quest.start_location_id && locationsMap[quest.start_location_id]) {
          location = locationsMap[quest.start_location_id]; // Fallback to using the locations map by ID
        }

        if (location && location.latitude && location.longitude) {
          const coords = [parseFloat(location.latitude), parseFloat(location.longitude)];
          // Final check for valid coordinates after parsing
          if (!isNaN(coords[0]) && !isNaN(coords[1])) {
            return {
              coords: coords,
              popupContent: (
                <div className="font-sans">
                  <strong className="text-guild-primary block text-lg">{quest.name}</strong>
                  <span className="text-sm text-guild-neutral">{location.name}</span>
                  <br />
                  <a href={`/quests/${quest.id}`} className="text-guild-accent hover:underline mt-2 inline-block">View Quest</a>
                </div>
              )
            };
          } else {
            console.warn(`[Marker Processing] Invalid coordinates for quest ID ${quest.id} after parsing:`, location);
          }
        } else {
            console.warn(`[Marker Processing] No valid location found for quest ID ${quest.id}.`);
        }

        return null;
      })
      .filter(marker => marker !== null);
  }, [filteredQuests, locationsMap]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-guild-highlight text-4xl mb-4">🏰</div>
        <p className="text-guild-text text-lg">Loading public quests from the guild archives...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg border-2 border-red-200">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg mb-4">Error: {error}</p>
        <Link to="/discovery" className="text-guild-accent hover:text-guild-primary font-medium">
          Return to Discovery →
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white">
      <Header/>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-guild-primary mb-4">Explore Public Quests</h1>
          <p className="text-xl text-guild-text mt-2 max-w-3xl mx-auto">
            Discover adventures shared by the Guild community.
          </p>
          <p className="text-lg text-guild-neutral mt-2">
            Find inspiration from fellow adventurers and embark on legendary journeys.
          </p>
        </header>

        {/* Interactive Map Section */}
        <section className="mb-12">
          <div className="h-96 md:h-[500px] bg-white rounded-xl shadow-lg border-2 border-guild-highlight/20 p-2">
            <QuestMapDisplay markers={questMarkers} />
          </div>
        </section>

        {/* Filter/Search Section - Future Enhancement */}
        <div className="bg-white rounded-xl shadow-md border-2 border-guild-highlight/20 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-guild-text font-medium">Filter by:</span>
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border-2 border-guild-neutral/30 rounded-lg px-3 py-2 text-guild-text focus:border-guild-highlight focus:outline-none bg-white"
              >
                <option value="all">All Difficulties</option>
                {Object.values(difficultiesMap).map(diff => (
                  <option key={diff.id} value={diff.id}>{diff.name}</option>
                ))}
              </select>
              <select 
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="border-2 border-guild-neutral/30 rounded-lg px-3 py-2 text-guild-text focus:border-guild-highlight focus:outline-none bg-white"
              >
                <option value="all">All Interests</option>
                {Object.values(interestsMap).map(interest => (
                  <option key={interest.id} value={interest.id}>{interest.name}</option>
                ))}
              </select>
            </div>
            <div className="text-guild-neutral">
              <span className="font-medium">{filteredQuests.length}</span> of 
              <span className="font-medium"> {publicQuests.length}</span> quests shown
            </div>
          </div>
        </div>

        {publicQuests.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuests.map(quest => (
              
              <div key={quest.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border-2 border-guild-highlight/20 hover:border-guild-highlight/40 group">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-semibold text-guild-primary mb-2 group-hover:text-guild-accent transition-colors">{quest.name}</h2>
                  <div className="text-guild-highlight text-lg">🏰</div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-guild-neutral flex items-center">
                    <span className="text-guild-highlight mr-2">📍</span>
                    Start: {quest.startLocation?.name || quest.start_location?.name || locationsMap[quest.start_location_id]?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-guild-neutral flex items-center">
                    <span className="text-guild-highlight mr-2">⭐</span>
                    Difficulty: {difficultiesMap[quest.difficulty_id]?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-guild-neutral flex items-center">
                    <span className="text-guild-highlight mr-2">🎯</span>
                    Interest: {interestsMap[quest.interest_id]?.name || 'N/A'}
                  </p>
                  {quest.author_id && (
                    <p className="text-sm text-guild-neutral flex items-center">
                      <span className="text-guild-highlight mr-2">👤</span>
                      By: Author ID {quest.author_id} {/* Replace with usersMap[quest.author_id]?.display_name if fetching users */}
                    </p>
                  )}
                </div>
                
                <p className="text-guild-text mb-6 leading-relaxed">{quest.synopsis}</p>
                
                <div className="flex space-x-3">
                  <Link 
                    to={`/quests/${quest.id}`} 
                    className="flex-1 bg-guild-primary hover:bg-guild-accent text-white font-medium py-2 px-4 rounded-lg text-center transition-colors shadow-md hover:shadow-lg"
                  >
                    View Details
                  </Link>
                  <button className="px-4 py-2 border-2 border-guild-accent/30 text-guild-accent hover:border-guild-accent hover:bg-guild-accent hover:text-white rounded-lg transition-all" title="Save Quest">
                    💾
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto border-2 border-guild-highlight/20">
              <div className="text-guild-neutral text-6xl mb-6">🏰</div>
              <h3 className="text-2xl font-bold text-guild-primary mb-4">{filteredQuests.length === 0 && publicQuests.length > 0 ? 'No Quests Match Your Filters' : 'No Public Quests'}</h3>
              <p className="text-guild-text mb-6 leading-relaxed">
                No public quests available at the moment. Check back soon for new adventures from the guild community!
              </p>
              <Link 
                to="/create-quest" 
                className="bg-guild-accent hover:bg-guild-primary text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-300 inline-block"
              >
                Create the First Quest
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicQuestsPage;