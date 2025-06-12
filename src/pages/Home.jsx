import Header from '../components/Header';
import Hero from '../components/Hero';
import QuestForm from '../components/QuestForm';
import QuestCard from '../components/QuestCard';
import Map from '../components/Map';

const Home = () => {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <Hero />
        <Map />
        <QuestForm />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <QuestCard
            title="The Elven Valley"
            subtitle="Based on Lauterbrunnen, Switzerland"
            description="This misty alpine valley inspired Tolkien's Rivendell — a serene haven amidst towering waterfalls."
          />
          <QuestCard
            title="The Drowned Port"
            subtitle="Based on Newburyport, MA"
            description="Foggy shores and Gothic buildings formed the backdrop to Lovecraft’s Innsmouth — beware what sleeps below."
          />
        </section>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 text-center">
          &copy; 2025 The Adventurer’s Guild. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Home;
