import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-guild-primary text-guild-secondary shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold hover:text-guild-highlight">
          The Adventurer’s Guild
        </Link>

        <nav>
          <ul className="flex space-x-6 text-sm font-semibold">
            <li><Link to="/" className="hover:text-guild-highlight">Home</Link></li>
            <li><Link to="/discovery" className="hover:text-guild-highlight">Discovery</Link></li>
            {/* Add other relevant links, e.g., My Quests, Create Quest if user is logged in */}
            {/* Example for a map page if you create one */}
            {/* <li><Link to="/map" className="hover:text-guild-highlight">World Map</Link></li> */}
            <li><Link to="/public-quests" className="hover:text-guild-highlight">Public Quests</Link></li>
          </ul>
        </nav>
        <div className="space-x-4">
          <Link to="/login"
            className="inline-block bg-guild-accent py-2 px-4 border border-transparent rounded-md text-xs font-medium text-white hover:bg-opacity-80"
          >
            Sign in
          </Link>
          <Link to="/create-user"
            className="inline-block bg-guild-secondary py-2 px-4 border border-guild-accent rounded-md text-xs font-medium text-guild-accent hover:bg-opacity-80"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
