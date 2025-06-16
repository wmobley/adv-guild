import React from 'react';

const QuestTips = () => {
  return (
    <div className="mt-8 bg-guild-secondary/50 rounded-lg p-6 border border-guild-highlight/30">
      <h3 className="text-lg font-semibold text-guild-primary mb-3">Quest Creation Tips</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <ul className="text-guild-text space-y-2 text-sm">
          <li className="flex items-start">
            <span className="text-guild-highlight mr-2">•</span>
            Use the map to explore nearby points of interest
          </li>
          <li className="flex items-start">
            <span className="text-guild-highlight mr-2">•</span>
            Add Points of Interest to create an epic multi-stop journey
          </li>
          <li className="flex items-start">
            <span className="text-guild-highlight mr-2">•</span>
            Share photos and stories from your adventures
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QuestTips;