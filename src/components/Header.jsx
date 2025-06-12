const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-indigo-600">Mythos Atlas</h1>
        <nav>
          <ul className="flex space-x-6 text-sm font-semibold text-gray-700">
            <li><a href="#" className="hover:text-indigo-600">Home</a></li>
            <li><a href="#" className="hover:text-indigo-600">Explore</a></li>
            <li><a href="#" className="hover:text-indigo-600">Map</a></li>
            <li><a href="#" className="hover:text-indigo-600">Itinerary</a></li>
            <li><a href="#" className="hover:text-indigo-600">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
