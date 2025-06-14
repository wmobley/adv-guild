const ItineraryForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add TanStack fetch logic here later
  };

  return (
    <section className="bg-guild-secondary p-6 rounded-xl shadow-md border border-guild-highlight/20">
      <h3 className="text-2xl font-bold text-guild-primary mb-4">Begin a New Quest</h3>
        <label className="text-guild-text font-medium">Where does your journey begin?</label>
        <label className="text-guild-text font-medium">What inspires your quest? (Myth, Author, Movie...)</label>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <label className="block text-sm font-medium text-guild-text">Starting Location</label>
          <input 
            type="text" 
            placeholder="e.g. Paris, France" 
            className="mt-1 block w-full rounded-md border-guild-neutral/30 shadow-sm bg-white text-guild-text placeholder-guild-neutral focus:border-guild-highlight focus:ring-guild-highlight" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-guild-text">Interest (Myth, Movie, Author)</label>
          <input 
            type="text" 
            placeholder="e.g. Norse Mythology" 
            className="mt-1 block w-full rounded-md border-guild-neutral/30 shadow-sm bg-white text-guild-text placeholder-guild-neutral focus:border-guild-highlight focus:ring-guild-highlight" 
          />
        </div>
        <div className="md:col-span-2">
          <button 
            type="submit" 
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-guild-accent hover:bg-guild-accent/90 transition-colors"
          >
            Generate Itinerary
          </button>
        </div>
      </form>
    </section>
  );
};

export default ItineraryForm;
