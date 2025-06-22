import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
// Assuming your Map component is reusable and can accept markers
import QuestMapDisplay from '/src/components/QuestMapDisplay.jsx';

import apiClient from '../services/advGuildApiClient'; // Import the API client


const MyJourneyPage = () => {
  const [savedQuestsList, setSavedQuestsList] = useState([]);
  const [locationsMap, setLocationsMap] = useState({});
  const [isLoadingSavedQuests, setIsLoadingSavedQuests] = useState(true);
  const [errorSavedQuests, setErrorSavedQuests] = useState(null);

  useEffect(() => {
    const fetchMyQuestsData = async () => {
      setIsLoadingSavedQuests(true);
      setErrorSavedQuests(null);
      try {
        console.log("Attempting to fetch saved quests and locations from adv-guild-api...");
        
        const [questsData, locationsData] = await Promise.all([
          apiClient.getSavedQuests(),
          apiClient.getLocations(),
        ]);

        setSavedQuestsList(questsData || []);

        const locMap = locationsData.reduce((acc, loc) => {
          acc[loc.id] = loc;
          return acc;
        }, {});
        setLocationsMap(locMap);

      } catch (err) {
        console.error("Failed to fetch saved quests:", err);
        setErrorSavedQuests(err.message || 'Failed to fetch saved quests. Ensure you are logged in and the API is reachable.');
        setSavedQuestsList([]); // Clear list on error
      } finally {
        setIsLoadingSavedQuests(false);
      }
    };

    fetchMyQuestsData();
  }, []);

  // Prepare marker data for the map from the fetched quest list
  const questMarkers = savedQuestsList
    .map(quest => {
      const location = locationsMap[quest.start_location_id];
      if (location && location.latitude && location.longitude) {
        return {
          coords: [location.latitude, location.longitude],
          popupContent: (
            <div className="font-sans">
              <strong className="text-guild-primary block text-lg">{quest.name}</strong>
              <span className="text-sm text-guild-neutral">{location.name}</span>
              <br />
              <a href={`/quests/${quest.id}`} className="text-guild-accent hover:underline mt-2 inline-block">View Itinerary</a>
            </div>
          )
        };
      }
      return null;
    })
    .filter(marker => marker !== null);

  return (
    <>
    <Header/>
      <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-guild-primary mb-4">My Saved Quests</h1>
            <p className="text-xl text-guild-text mt-2 max-w-3xl mx-auto">
              Here are the adventures you've bookmarked. Review your plans, check your maps, and prepare for the journey ahead.
            </p>
          </header>

          {/* Section for "My Saved Quests" large card */}
          <section className="mt-12">
            <div className="p-6 md:p-8 bg-white rounded-xl shadow-2xl border-2 border-guild-highlight/20">
              
              <div className="md:flex md:space-x-8">
                {/* Map Area */}
                <div className="md:w-2/3 h-80 md:h-96 bg-guild-secondary/30 rounded-lg mb-6 md:mb-0 flex items-center justify-center border-2 border-guild-highlight/20">
                  <QuestMapDisplay markers={questMarkers} />
                </div>
                
                {/* Quest List/Details Area */}
                <div className="md:w-1/3">
                  <h3 className="text-xl font-semibold text-guild-primary mb-4">Bookmarked Quests:</h3>
                  {isLoadingSavedQuests ? (
                    <div className="text-center py-8">
                      <div className="animate-pulse text-guild-highlight text-4xl mb-3">🧭</div>
                      <p className="text-guild-neutral">Loading your saved quests from the Guild API...</p>
                    </div>
                  ) : errorSavedQuests ? (
                    <div className="text-center py-8 bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="text-red-500 text-4xl mb-3">⚠️</div>
                      <p className="text-red-700 font-medium">Error loading saved quests.</p>
                      <p className="text-red-600 text-sm">{errorSavedQuests}</p>
                    </div>
                  ) : savedQuestsList.length > 0 ? (
                    <>
                      <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {savedQuestsList.map(quest => (
                          <Link key={quest.id} to={`/quests/${quest.id}`} className="block">
                            <li className="p-4 bg-gradient-to-r from-guild-secondary to-guild-secondary/70 hover:from-guild-highlight/20 hover:to-guild-accent/20 rounded-lg border-2 border-guild-highlight/40 hover:border-guild-accent transition-all cursor-pointer shadow-md hover:shadow-xl group transform hover:-translate-y-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-bold text-guild-primary mb-2 group-hover:text-guild-accent transition-colors text-lg">{quest.name}</p>
                                  <p className="text-sm text-guild-text flex items-center font-medium">
                                    <span className="text-guild-highlight mr-2 text-base">📍</span>
                                    {locationsMap[quest.start_location_id]?.name || 'Unknown Location'}
                                  </p>
                                  {/* You can display other quest details here if needed */}
                                  {/* quest.details && <p className="text-xs text-guild-neutral mt-1">{quest.details}</p> */}
                                </div>
                                <div className="text-guild-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 text-xl font-bold">
                                  →
                                </div>
                              </div>
                            </li>
                          </Link>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-guild-highlight text-4xl mb-3">⚔️</div>
                      <p className="text-guild-primary font-bold text-lg mb-1">You haven't saved any quests yet.</p>
                      <p className="text-guild-text font-medium mb-6">
                        Explore public quests or create your own to begin your adventure!
                      </p>
                      <Link
                        to="/create-quest"
                        className="bg-guild-accent hover:bg-guild-primary text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-300 inline-block"
                      >
                        Create Your First Quest
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default MyJourneyPage;