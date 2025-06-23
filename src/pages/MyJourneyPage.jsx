import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
// Assuming your Map component is reusable and can accept markers
import QuestMapDisplay from '/src/components/QuestMapDisplay.jsx';

import apiClient from '../services/advGuildApiClient'; // Import the API client


const MyJourneyPage = () => {
  const [savedQuestsList, setSavedQuestsList] = useState([]);
  const [ownedQuestsList, setOwnedQuestsList] = useState([]);
  const [locationsMap, setLocationsMap] = useState({});
  const [isLoadingSavedQuests, setIsLoadingSavedQuests] = useState(true);
  const [isLoadingOwnedQuests, setIsLoadingOwnedQuests] = useState(true);
  const [errorSavedQuests, setErrorSavedQuests] = useState(null);
  const [errorOwnedQuests, setErrorOwnedQuests] = useState(null);

  useEffect(() => {
    const fetchMyQuestsData = async () => {
      setIsLoadingSavedQuests(true);
      setIsLoadingOwnedQuests(true);
      setErrorSavedQuests(null);
      setErrorOwnedQuests(null);
      
      try {
        console.log("Attempting to fetch saved quests, owned quests, and locations from adv-guild-api...");
        
        const [questsData, ownedQuestsData, locationsData] = await Promise.all([
          apiClient.getSavedQuests().catch(err => {
            setErrorSavedQuests(err.message || 'Failed to fetch saved quests');
            return [];
          }),
          apiClient.getOwnedQuests().catch(err => {
            setErrorOwnedQuests(err.message || 'Failed to fetch owned quests');
            return [];
          }),
          apiClient.getLocations(),
        ]);

        setSavedQuestsList(questsData || []);
        setOwnedQuestsList(ownedQuestsData || []);

        const locMap = locationsData.reduce((acc, loc) => {
          acc[loc.id] = loc;
          return acc;
        }, {});
        setLocationsMap(locMap);

      } catch (err) {
        console.error("Failed to fetch quest data:", err);
        const errorMessage = err.message || 'Failed to fetch quest data. Ensure you are logged in and the API is reachable.';
        setErrorSavedQuests(errorMessage);
        setErrorOwnedQuests(errorMessage);
        setSavedQuestsList([]);
        setOwnedQuestsList([]);
      } finally {
        setIsLoadingSavedQuests(false);
        setIsLoadingOwnedQuests(false);
      }
    };

    fetchMyQuestsData();
  }, []);

  // Prepare marker data for the map from both saved and owned quests
  const allQuests = [...savedQuestsList, ...ownedQuestsList];
  const questMarkers = allQuests
    .map(quest => {
      let location = null;
      // Prioritize embedded start_location object
      if (quest.start_location && quest.start_location.latitude && quest.start_location.longitude) {
        location = quest.start_location;
      }
      // Fallback to using the locations map
      else if (quest.start_location_id && locationsMap[quest.start_location_id]) {
        location = locationsMap[quest.start_location_id];
      }

      if (location && location.latitude && location.longitude) {
        const isOwned = ownedQuestsList.some(ownedQuest => ownedQuest.id === quest.id);
        return {
          coords: [location.latitude, location.longitude],
          popupContent: (
            <div className="font-sans">
              <strong className="text-guild-primary block text-lg">{quest.name}</strong>
              <span className="text-sm text-guild-neutral">{location.name}</span>
              {isOwned && <span className="text-xs bg-guild-accent text-white px-2 py-1 rounded-full ml-2">Owned</span>}
              <br />
              <a href={`/quests/${quest.id}`} className="text-guild-accent hover:underline mt-2 inline-block">View Itinerary</a>
            </div>
          )
        };
      }
      return null;
    })
    .filter(marker => marker !== null);

  const QuestList = ({ quests, title, isLoading, error, emptyMessage, emptyActionText, emptyActionLink }) => (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-guild-primary mb-4">{title}</h3>
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-pulse text-guild-highlight text-4xl mb-3">🧭</div>
          <p className="text-guild-neutral">Loading your quests from the Guild API...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <p className="text-red-700 font-medium">Error loading quests.</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : quests.length > 0 ? (
        <ul className="space-y-3">
          {quests.map(quest => (
            <Link key={quest.id} to={`/quests/${quest.id}`} className="block">
              <li className="p-4 bg-gradient-to-r from-guild-secondary to-guild-secondary/70 hover:from-guild-highlight/20 hover:to-guild-accent/20 rounded-lg border-2 border-guild-highlight/40 hover:border-guild-accent transition-all cursor-pointer shadow-md hover:shadow-xl group transform hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-guild-primary mb-2 group-hover:text-guild-accent transition-colors text-lg">{quest.name}</p>
                    <p className="text-sm text-guild-text flex items-center font-medium">
                      <span className="text-guild-highlight mr-2 text-base">📍</span>
                      {locationsMap[quest.start_location_id]?.name || 'Unknown Location'}
                    </p>
                  </div>
                  <div className="text-guild-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 text-xl font-bold">
                    →
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <div className="text-guild-highlight text-4xl mb-3">⚔️</div>
          <p className="text-guild-primary font-bold text-lg mb-1">{emptyMessage}</p>
          <p className="text-guild-text font-medium mb-6">
            {title.includes('Owned') ? 'Create your first quest to start building adventures for others!' : 'Explore public quests or create your own to begin your adventure!'}
          </p>
          <Link
            to={emptyActionLink}
            className="bg-guild-accent hover:bg-guild-primary text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-300 inline-block"
          >
            {emptyActionText}
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <>
    <Header/>
      <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-guild-primary mb-4">My Journey</h1>
            <p className="text-xl text-guild-text mt-2 max-w-3xl mx-auto">
              Here are your saved quests and the adventures you've created. Review your plans, check your maps, and prepare for the journey ahead.
            </p>
          </header>

          {/* Map Section */}
          <section className="mt-12">
            <div className="p-6 md:p-8 bg-white rounded-xl shadow-2xl border-2 border-guild-highlight/20">
              <h2 className="text-2xl font-semibold text-guild-primary mb-6 text-center">Quest Map Overview</h2>
              <div className="h-80 md:h-96 bg-guild-secondary/30 rounded-lg flex items-center justify-center border-2 border-guild-highlight/20">
                <QuestMapDisplay markers={questMarkers} />
              </div>
            </div>
          </section>

          {/* Quest Lists Section */}
          <section className="mt-12">
            <div className="p-6 md:p-8 bg-white rounded-xl shadow-2xl border-2 border-guild-highlight/20">
              <QuestList
                quests={savedQuestsList}
                title="📖 Bookmarked Quests"
                isLoading={isLoadingSavedQuests}
                error={errorSavedQuests}
                emptyMessage="You haven't saved any quests yet."
                emptyActionText="Explore Quests"
                emptyActionLink="/quests"
              />
              
              <QuestList
                quests={ownedQuestsList}
                title="👑 My Created Quests"
                isLoading={isLoadingOwnedQuests}
                error={errorOwnedQuests}
                emptyMessage="You haven't created any quests yet."
                emptyActionText="Create Your First Quest"
                emptyActionLink="/create-quest"
              />
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default MyJourneyPage;