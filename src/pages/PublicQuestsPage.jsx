import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
// import { getPublicQuests } from '@firebasegen/adv-guild-backend-connector'; // As used in SdkTestComponent
// import QuestCard from '../components/QuestCard'; // Assuming you want to reuse QuestCard

// Placeholder data for public quests - replace with actual data fetching
const initialPublicQuests = [
  { id: 'pq1', name: 'The Dragon\'s Pass Trail', synopsis: 'A scenic route said to be carved by an ancient dragon.', startLocation: { name: 'Mountain Foot Village' }, difficulty: { name: 'Hard' }, interest: { name: 'Hiking' }, questType: { name: 'Exploration' }, author: 'DragonSlayer92' },
  { id: 'pq2', name: 'Lost Temple of Aethel', synopsis: 'Uncover the secrets of a temple swallowed by the jungle.', startLocation: { name: 'Jungle Outpost' }, difficulty: { name: 'Moderate' }, interest: { name: 'Archaeology' }, questType: { name: 'Discovery' }, author: 'TempleSeeker' },
  { id: 'pq3', name: 'Coastal Wanderer\'s Route', synopsis: 'Explore charming fishing villages and hidden coves.', startLocation: { name: 'Seaside Town' }, difficulty: { name: 'Easy' }, interest: { name: 'Culture' }, questType: { name: 'Tour' }, author: 'SeaWanderer' },
];

const PublicQuestsPage = () => {
  const [publicQuests, setPublicQuests] = useState(initialPublicQuests);
  const [loading, setLoading] = useState(false); // Set to true if fetching data
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchQuests = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await getPublicQuests(); // Or your SDK function
  //       setPublicQuests(data.quests || []); // Adjust based on SDK response structure
  //       setError(null);
  //     } catch (err) {
  //       setError(err.message || 'Failed to fetch public quests.');
  //       setPublicQuests([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchQuests();
  // }, []);

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

        {/* Filter/Search Section - Future Enhancement */}
        <div className="bg-white rounded-xl shadow-md border-2 border-guild-highlight/20 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-guild-text font-medium">Filter by:</span>
              <select className="border-2 border-guild-neutral/30 rounded-lg px-3 py-2 text-guild-text focus:border-guild-highlight focus:outline-none">
                <option>All Difficulties</option>
                <option>Easy</option>
                <option>Moderate</option>
                <option>Hard</option>
                <option>Challenging</option>
              </select>
              <select className="border-2 border-guild-neutral/30 rounded-lg px-3 py-2 text-guild-text focus:border-guild-highlight focus:outline-none">
                <option>All Interests</option>
                <option>Hiking</option>
                <option>History</option>
                <option>Culture</option>
                <option>Archaeology</option>
              </select>
            </div>
            <div className="text-guild-neutral">
              <span className="font-medium">{publicQuests.length}</span> quests available
            </div>
          </div>
        </div>

        {publicQuests.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publicQuests.map(quest => (
              <div key={quest.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border-2 border-guild-highlight/20 hover:border-guild-highlight/40 group">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-semibold text-guild-primary mb-2 group-hover:text-guild-accent transition-colors">{quest.name}</h2>
                  <div className="text-guild-highlight text-lg">🏰</div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-guild-neutral flex items-center">
                    <span className="text-guild-highlight mr-2">📍</span>
                    Start: {quest.startLocation.name}
                  </p>
                  <p className="text-sm text-guild-neutral flex items-center">
                    <span className="text-guild-highlight mr-2">⭐</span>
                    Difficulty: {quest.difficulty.name}
                  </p>
                  <p className="text-sm text-guild-neutral flex items-center">
                    <span className="text-guild-highlight mr-2">🎯</span>
                    Interest: {quest.interest.name}
                  </p>
                  {quest.author && (
                    <p className="text-sm text-guild-neutral flex items-center">
                      <span className="text-guild-highlight mr-2">👤</span>
                      By: {quest.author}
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
                  <button className="px-4 py-2 border-2 border-guild-accent/30 text-guild-accent hover:border-guild-accent hover:bg-guild-accent hover:text-white rounded-lg transition-all">
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
              <h3 className="text-2xl font-bold text-guild-primary mb-4">No Public Quests</h3>
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