const ItineraryForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add TanStack fetch logic here later
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-yellow-700 mb-4">Begin a New Quest</h3>
        <label>Where does your journey begin?</label>
        <label>What inspires your quest? (Myth, Author, Movie...)</label>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Starting Location</label>
          <input type="text" placeholder="e.g. Paris, France" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Interest (Myth, Movie, Author)</label>
          <input type="text" placeholder="e.g. Norse Mythology" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Generate Itinerary
          </button>
        </div>
      </form>
    </section>
  );
};

export default ItineraryForm;

