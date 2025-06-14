import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
// Assuming your Map component is reusable and can accept markers
// import Map from '../components/Map';

// Placeholder data for saved quests - replace with actual data fetching
const savedQuests = [
  { id: 'q1', name: 'The Whispering Peaks', startLocation: { name: 'Alpine Village', lat: 46.59, lng: 7.90 } },
  { id: 'q2', name: 'Sunken City Secrets', startLocation: { name: 'Coastal Town', lat: 42.81, lng: -70.87 } },
  { id: 'q3', name: 'Forest of Shadows', startLocation: { name: 'Old Mill', lat: 40.71, lng: -74.00 } },
];

// Prepare marker data for the map (assuming Map component takes this format)
// const savedQuestStartLocations = savedQuests.map(quest => ({
//   lat: quest.startLocation.lat,
//   lng: quest.startLocation.lng,
//   popupContent: quest.name,
// }));

const DiscoveryPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-guild-primary mb-4">Discover Adventures</h1>
            <p className="text-xl text-guild-text mt-2 max-w-3xl mx-auto">
              Explore quests from fellow adventurers, manage your saved journeys, or forge new paths through legendary lands.
            </p>
          </header>

          {/* Section for "My Saved Quests" large card */}
          <section className="mt-12">
            <div className="p-6 md:p-8 bg-white rounded-xl shadow-2xl border-2 border-guild-highlight/20">
              <div className="text-center md:text-left mb-6">
                <h2 className="text-3xl font-bold text-guild-accent mb-2">My Saved Quests</h2>
                <p className="text-guild-neutral text-lg">Your adventures, mapped out and ready to explore.</p>
              </div>
              
              <div className="md:flex md:space-x-8">
                {/* Map Area */}
                <div className="md:w-2/3 h-80 md:h-96 bg-guild-secondary/30 rounded-lg mb-6 md:mb-0 flex items-center justify-center border-2 border-guild-highlight/20">
                  {/* 
                    Your Map component would go here. 
                    Example: <Map markers={savedQuestStartLocations} defaultZoom={5} /> 
                  */}
                  <div className="text-center p-6">
                    <div className="text-guild-highlight text-4xl mb-2">🗺️</div>
                    <p className="text-guild-neutral font-medium">Map of Saved Quest Start Locations</p>
                    <p className="text-guild-text text-sm mt-1">(Map component placeholder)</p>
                  </div>
                </div>
                
                {/* Quest List/Details Area */}
                <div className="md:w-1/3">
                  <h3 className="text-xl font-semibold text-guild-primary mb-4">Quest Start Points:</h3>
                  {savedQuests.length > 0 ? (
                    <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {savedQuests.map(quest => (
                        <Link key={quest.id} to={`/quests/${quest.id}`} className="block">
                          <li className="p-4 bg-gradient-to-r from-guild-secondary to-guild-secondary/70 hover:from-guild-highlight/20 hover:to-guild-accent/20 rounded-lg border-2 border-guild-highlight/40 hover:border-guild-accent transition-all cursor-pointer shadow-md hover:shadow-xl group transform hover:-translate-y-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-bold text-guild-primary mb-2 group-hover:text-guild-accent transition-colors text-lg">{quest.name}</p>
                                <p className="text-sm text-guild-text flex items-center font-medium">
                                  <span className="text-guild-highlight mr-2 text-base">📍</span>
                                  {quest.startLocation.name}
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
                      <p className="text-guild-primary font-bold text-lg mb-1">You haven't saved any quests yet.</p>
                      <p className="text-guild-accent font-medium">Start your first adventure below!</p>
                    </div>
                  )}
                  <Link 
                    to="/my-quests" 
                    className="mt-6 inline-block text-guild-accent hover:text-guild-primary font-semibold transition-colors border-b border-guild-accent/30 hover:border-guild-primary/50"
                  >
                    View All My Quests →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Section for "Explore" and "Create" cards */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border-2 border-guild-primary/20 hover:border-guild-primary/40 text-center group">
              <div className="text-guild-primary text-4xl mb-4 group-hover:scale-110 transition-transform">🏰</div>
              <h2 className="text-2xl font-semibold text-guild-primary mb-3">Explore Public Quests</h2>
              <p className="text-guild-text mb-6 leading-relaxed">
                See where others have journeyed and get inspired for your next trip. Discover hidden gems and legendary locations.
              </p>
              <Link 
                to="/public-quests" 
                className="inline-block bg-guild-primary hover:bg-guild-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Browse Quests →
              </Link>
            </div>

            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border-2 border-guild-accent/20 hover:border-guild-accent/40 text-center group">
              <div className="text-guild-accent text-4xl mb-4 group-hover:scale-110 transition-transform">✨</div>
              <h2 className="text-2xl font-semibold text-guild-accent mb-3">Create a New Quest</h2>
              <p className="text-guild-text mb-6 leading-relaxed">
                Forge a new path and plan your unique travel experience. Turn myths and legends into real adventures.
              </p>
              <Link 
                to="/create-quest" 
                className="inline-block bg-guild-accent hover:bg-guild-accent/90 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Plan New Quest
              </Link>
            </div>
          </section>

          {/* Placeholder for SdkTestComponent if you want to test public quests here */}
          {/* <SdkTestComponent /> */}
        </div>
      </div>
    </>
  );
};

export default DiscoveryPage;