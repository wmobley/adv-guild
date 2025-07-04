import Header from '../components/Header';
import Hero from '../components/Hero';
import QuestSearch from '../components/QuestSearch';
import Map from '../components/Map';

const Home = () => {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        <Hero />
        <QuestSearch />
        <h2 className="text-3xl font-bold text-guild-primary text-center pt-8">Explore Quest Starting Points</h2>
        <Map useApiData={true} height="500px" />
       
      </main>

      <footer className="bg-guild-secondary border-t border-guild-neutral/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-guild-neutral text-center">
          &copy; 2025 The Adventurer's Guild. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Home;
