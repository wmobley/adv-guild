import React from 'react';
import { Link } from 'react-router-dom';
// import QuestCard from '../components/QuestCard'; // Assuming you want to reuse QuestCard

// Placeholder data for user's saved quests - replace with actual data fetching
const userQuests = [
  { id: 'q1', name: 'The Whispering Peaks', synopsis: 'An adventurous trek through alpine wonders.', startLocation: { name: 'Alpine Village' }, difficulty: { name: 'Challenging' }, interest: { name: 'Hiking' }, questType: { name: 'Exploration' } },
  { id: 'q2', name: 'Sunken City Secrets', synopsis: 'Discover the mysteries of a forgotten coastal town.', startLocation: { name: 'Coastal Town' }, difficulty: { name: 'Moderate' }, interest: { name: 'History' }, questType: { name: 'Investigation' } },
  // Add more placeholder quests or fetch dynamically
];

const MyQuestsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-guild-primary mb-4">My Quests</h1>
          <p className="text-xl text-guild-text mt-2 max-w-2xl mx-auto">
            Your collection of planned and saved adventures.
          </p>
          <p className="text-lg text-guild-neutral mt-2">
            Manage your personal quest archive and track your legendary journeys.
          </p>
        </header>

        {userQuests.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userQuests.map(quest => (
              <div key={quest.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border-2 border-guild-highlight/20 hover:border-guild-highlight/40 group">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-semibold text-guild-primary mb-2 group-hover:text-guild-accent transition-colors">{quest.name}</h2>
                  <div className="text-guild-highlight text-lg">⚔️</div>
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
                </div>
                
                <p className="text-guild-text mb-6 leading-relaxed">{quest.synopsis}</p>
                
                <div className="flex space-x-3">
                  <Link 
                    to={`/quests/${quest.id}`} 
                    className="flex-1 bg-guild-accent hover:bg-guild-primary text-white font-medium py-2 px-4 rounded-lg text-center transition-colors shadow-md hover:shadow-lg"
                  >
                    View Details
                  </Link>
                  <button className="px-4 py-2 border-2 border-guild-neutral/30 text-guild-neutral hover:border-guild-highlight hover:text-guild-highlight rounded-lg transition-colors">
                    ⋯
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto border-2 border-guild-highlight/20">
              <div className="text-guild-neutral text-6xl mb-6">🗡️</div>
              <h3 className="text-2xl font-bold text-guild-primary mb-4">No Quests Yet</h3>
              <p className="text-guild-text mb-6 leading-relaxed">
                You haven't created or saved any quests yet. Begin your legendary journey by creating your first adventure!
              </p>
              <Link 
                to="/create-quest" 
                className="bg-guild-accent hover:bg-guild-primary text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-300 inline-block"
              >
                Create Your First Quest
              </Link>
              <div className="mt-4">
                <Link 
                  to="/public-quests" 
                  className="text-guild-neutral hover:text-guild-accent font-medium transition-colors"
                >
                  Or explore public quests for inspiration →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuestsPage;