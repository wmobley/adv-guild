import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/advGuildApiClient';
import Header from '../components/Header';

const ItineraryPage = () => {
  const { questId } = useParams(); // Get questId from URL
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.getQuestById(questId);
        // The API may return the itinerary as a single string, but the component
        // expects an array to .map() over. This ensures it's always an array.
        if (data && data.itinerary && typeof data.itinerary === 'string') {
          // Treat the entire string as a single itinerary item.
          data.itinerary = [data.itinerary];
        }
        setQuest(data);
      } catch (err) {
        setError(err.message || 'Quest not found.');
        console.error("Failed to fetch quest details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (questId) {
      fetchQuestDetails();
    }
  }, [questId]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-guild-highlight text-4xl mb-4">⚔️</div>
        <p className="text-guild-text text-lg">Loading your quest details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg border-2 border-red-200 max-w-md">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg mb-4">Error: {error}</p>
        <Link to="/discovery" className="text-guild-accent hover:text-guild-primary font-medium transition-colors">
          Go to Discovery →
        </Link>
      </div>
    </div>
  );

  if (!quest) return (
    <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg border-2 border-guild-highlight/20 max-w-md">
        <div className="text-guild-neutral text-4xl mb-4">🗡️</div>
        <p className="text-guild-text text-lg mb-4">Quest details not available.</p>
        <Link to="/discovery" className="text-guild-accent hover:text-guild-primary font-medium transition-colors">
          Go to Discovery →
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-guild-secondary to-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-10">
          <Link 
            to="/discovery" 
            className="text-guild-accent hover:text-guild-primary mb-4 inline-flex items-center font-medium transition-colors group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Discovery
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg border-2 border-guild-highlight/20 p-8 mb-8">
            <h1 className="text-4xl font-bold text-guild-primary mb-4">{quest.name}</h1>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <span className="text-guild-highlight mr-2">⭐</span>
                <span className="text-guild-neutral">Difficulty:</span>
                <span className="text-guild-text font-medium ml-1">{quest.difficulty?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-guild-highlight mr-2">🎯</span>
                <span className="text-guild-neutral">Interest:</span>
                <span className="text-guild-text font-medium ml-1">{quest.interest?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-guild-highlight mr-2">📍</span>
                <span className="text-guild-neutral">Start:</span>
                <span className="text-guild-text font-medium ml-1">{quest.start_location?.name || 'N/A'}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="bg-white p-8 rounded-xl shadow-lg border-2 border-guild-highlight/20 mb-8">
          <div className="flex items-center mb-4">
            <span className="text-guild-highlight text-2xl mr-3">📜</span>
            <h2 className="text-2xl font-semibold text-guild-primary">Quest Synopsis</h2>
          </div>
          <p className="text-guild-text leading-relaxed text-lg">{quest.synopsis}</p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg border-2 border-guild-highlight/20 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-guild-highlight text-2xl mr-3">🗓️</span>
            <h2 className="text-2xl font-semibold text-guild-primary">Suggested Itinerary</h2>
          </div>
          
          {quest.itinerary && quest.itinerary.length > 0 ? (
            <div className="space-y-4">
              {quest.itinerary.map((item, index) => (
                <div key={index} className="flex items-start p-4 bg-guild-secondary/30 rounded-lg border border-guild-highlight/20">
                  <div className="flex-shrink-0 w-8 h-8 bg-guild-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-guild-text leading-relaxed">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-guild-secondary/20 rounded-lg border border-guild-highlight/20">
              <div className="text-guild-neutral text-3xl mb-3">📋</div>
              <p className="text-guild-neutral">No detailed itinerary available for this quest yet.</p>
              <p className="text-guild-text text-sm mt-1">Check back later for updates!</p>
            </div>
          )}
        </section>

        {/* Action buttons */}
        <section className="bg-white p-6 rounded-xl shadow-lg border-2 border-guild-highlight/20">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-guild-accent hover:bg-guild-primary text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
              Save Quest
            </button>
            <button className="bg-guild-primary hover:bg-guild-accent text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
              Share Quest
            </button>
            <button className="border-2 border-guild-neutral/30 text-guild-neutral hover:border-guild-highlight hover:text-guild-highlight font-medium py-3 px-6 rounded-lg transition-colors">
              Print Itinerary
            </button>
          </div>
        </section>

        {/* Map placeholder */}
        <section className="mt-8 bg-white p-8 rounded-xl shadow-lg border-2 border-guild-highlight/20">
          <div className="flex items-center mb-6">
            <span className="text-guild-highlight text-2xl mr-3">🗺️</span>
            <h2 className="text-2xl font-semibold text-guild-primary">Quest Route</h2>
          </div>
          
          <div className="h-96 bg-guild-secondary/30 rounded-lg flex items-center justify-center border-2 border-guild-highlight/20">
            <div className="text-center p-6">
              <div className="text-guild-highlight text-4xl mb-3">🗺️</div>
              <p className="text-guild-neutral font-medium">Interactive Map for {quest.name}</p>
              <p className="text-guild-text text-sm mt-1">(Map component placeholder)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItineraryPage;