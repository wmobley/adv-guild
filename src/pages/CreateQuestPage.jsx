import React from 'react';
import QuestForm from '../components/QuestForm'; // Assuming QuestForm is ready for reuse

const CreateQuestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-guild-primary mb-4">Create Your New Quest</h1>
          <p className="text-xl text-guild-text max-w-2xl mx-auto mb-2">
            Detail your adventure for the guild!
          </p>
          <p className="text-lg text-guild-neutral max-w-3xl mx-auto">
            Share your legendary journey with fellow adventurers. Whether inspired by ancient myths, 
            beloved tales, or mystical lands, your quest awaits documentation in the guild archives.
          </p>
        </header>
        
        <div className="bg-white rounded-xl shadow-2xl border-2 border-guild-highlight/20 p-8">
          <QuestForm />
        </div>
        
        {/* Optional: Add some helpful tips */}
        <div className="mt-8 bg-guild-secondary/50 rounded-lg p-6 border border-guild-highlight/30">
          <h3 className="text-lg font-semibold text-guild-primary mb-3">Quest Creation Tips</h3>
          <ul className="text-guild-text space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-guild-highlight mr-2">•</span>
              Be specific about your starting location for better recommendations
            </li>
            <li className="flex items-start">
              <span className="text-guild-highlight mr-2">•</span>
              Include the source of inspiration (book, movie, mythology, etc.)
            </li>
            <li className="flex items-start">
              <span className="text-guild-highlight mr-2">•</span>
              Consider the time of year and seasonal attractions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestPage;