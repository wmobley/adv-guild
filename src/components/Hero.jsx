const Hero = () => (
  <section className="text-center py-20 bg-gradient-to-br from-yellow-50 to-white">
    <h1 className="text-6xl font-bold text-yellow-800 mb-4">Welcome to the Adventurer’s Guild</h1>
    <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
      This is your guild hall for legendary travel. Explore the real-world roots of fantasy, myth, and magic.
    </p>
    <a
      href="#map"
      className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-700 transition"
    >
      Begin Your Quest
    </a>
  </section>
);

export default Hero;
