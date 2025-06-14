import { Link } from 'react-router-dom';

const Hero = () => (
  <section className="text-center py-20 bg-test-red">
    <h1 className="text-6xl font-bold text-guild-primary mb-4">Welcome to the Adventurer's Guild</h1>
    <p className="text-xl text-guild-text max-w-2xl mx-auto mb-8">
      This is your guild hall for legendary travel. Explore the real-world roots of fantasy, myth, and magic.
    </p>
    <Link
      to="/login"
      className="bg-guild-accent hover:bg-guild-primary text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-300"
    >
      Login & Begin Your Quest
    </Link>
  </section>
);

export default Hero;
