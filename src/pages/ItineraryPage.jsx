import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/advGuildApiClient';
import Header from '../components/Header';
import ItineraryEditor from '../components/ItineraryEditor';

const ItineraryPage = () => {
  const { questId } = useParams(); // Get questId from URL
  const [quest, setQuest] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const questData = await apiClient.getQuestById(questId);
        
        // Try to get current user, but don't fail if not available
        let userData = null;
        try {
          userData = await apiClient.getCurrentUser();
        } catch (userError) {
          console.log('No current user or user API not available:', userError);
        }

        // The API may return the itinerary as a single string, but the component
        // expects an array to .map() over. This ensures it's always an array.
        if (questData && questData.itinerary && typeof questData.itinerary === 'string') {
          // Try to parse if it's JSON, otherwise treat as single item
          try {
            questData.itinerary = JSON.parse(questData.itinerary);
          } catch {
            questData.itinerary = [questData.itinerary];
          }
        }
        
        setQuest(questData);
        setCurrentUser(userData);
        
        // Debug logging
        console.log('Quest data:', questData);
        console.log('Current user:', userData);
        console.log('Quest created_by:', questData?.created_by);
        console.log('Quest owner_id:', questData?.owner_id);
        console.log('Quest user_id:', questData?.user_id);
        
      } catch (err) {
        setError(err.message || 'Quest not found.');
        console.error("Failed to fetch quest details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (questId) {
      fetchData();
    }
  }, [questId]);

  // For now, let's make this always true for testing, then we can fix the ownership logic
  const isOwner = true; // TODO: Fix ownership check
  
  // Original ownership check (commented out for debugging):
  // const isOwner = currentUser && quest && (
  //   currentUser.id === quest.created_by || 
  //   currentUser.id === quest.owner_id ||
  //   currentUser.id === quest.user_id
  // );

  console.log('isOwner:', isOwner);
  console.log('currentUser:', currentUser);
  console.log('quest owner fields:', quest ? {
    created_by: quest.created_by,
    owner_id: quest.owner_id,
    user_id: quest.user_id
  } : 'no quest');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveItinerary = async (updateData) => {
    setIsSaving(true);
    try {
      // Convert itinerary to JSON string if it's an array
      const dataToSend = {
        ...updateData,
        itinerary: Array.isArray(updateData.itinerary) 
          ? JSON.stringify(updateData.itinerary) 
          : updateData.itinerary
      };

      // TODO: Implement updateQuestItinerary in apiClient
      console.log('Would save itinerary:', dataToSend);
      // const updatedQuest = await apiClient.updateQuestItinerary(questId, dataToSend);
      
      // For now, just update local state
      setQuest({ 
        ...quest, 
        itinerary: updateData.itinerary,
        locations: updateData.locations 
      });
      setIsEditing(false);
      
      alert('Itinerary updated successfully! (Note: This is just a local update for now)');
    } catch (err) {
      console.error("Failed to save itinerary:", err);
      alert("Failed to save itinerary. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-10">
          <Link 
            to="/discovery" 
            className="text-guild-accent hover:text-guild-primary mb-4 inline-flex items-center font-medium transition-colors group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Discovery
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg border-2 border-guild-highlight/20 p-8 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-bold text-guild-primary">{quest.name}</h1>
              {isOwner && (
                <div className="flex items-center space-x-2">
                  <span className="bg-guild-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                    👑 Owner
                  </span>
                </div>
              )}
            </div>
            
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

        {/* Itinerary Section */}
        <section className="bg-white p-8 rounded-xl shadow-lg border-2 border-guild-highlight/20 mb-8">
          {isEditing ? (
            <ItineraryEditor
              quest={quest}
              onSaveItinerary={handleSaveItinerary}
              onCancelEdit={handleCancelEdit}
              isSaving={isSaving}
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-guild-highlight text-2xl mr-3">🗓️</span>
                  <h2 className="text-2xl font-semibold text-guild-primary">Suggested Itinerary</h2>
                </div>
                
                {/* Edit Button - Always show for now (for testing) */}
                <button
                  onClick={handleEditClick}
                  className="bg-guild-accent hover:bg-guild-primary text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center"
                >
                  <span className="mr-2">✏️</span>
                  Edit Itinerary
                </button>
              </div>
              
              {quest.itinerary && quest.itinerary.length > 0 ? (
                <div className="space-y-4">
                  {quest.itinerary.map((item, index) => (
                    <div key={index} className="flex items-start p-4 bg-guild-secondary/30 rounded-lg border border-guild-highlight/20">
                      <div className="flex-shrink-0 w-8 h-8 bg-guild-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-guild-text leading-relaxed">
                          {typeof item === 'string' ? item : item.description || item.location_name || 'Itinerary step'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-guild-secondary/20 rounded-lg border border-guild-highlight/20">
                  <div className="text-guild-neutral text-3xl mb-3">📋</div>
                  <p className="text-guild-neutral">No detailed itinerary available for this quest yet.</p>
                  <div>
                    <p className="text-guild-text text-sm mt-1 mb-4">You can add an itinerary to help adventurers plan their journey!</p>
                    <button
                      onClick={handleEditClick}
                      className="bg-guild-accent hover:bg-guild-primary text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                      Add Itinerary
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Action buttons - Only show when not editing */}
        {!isEditing && (
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
        )}

        {/* Map placeholder - Only show when not editing */}
        {!isEditing && (
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
        )}
      </div>
    </div>
  );
};

export default ItineraryPage;