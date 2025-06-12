import Header from '../components/Header';
import QuestForm from '../components/QuestForm';
import QuestCard from "../components/QuestCard"
import Map from '../components/Map';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <>
      <Header />
   <Hero />
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <Map />

        <section className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Discover the Myths Beneath Our World</h2>
          <p className="text-lg leading-relaxed text-gray-600 max-w-3xl mx-auto">
            <em>Mythos Atlas</em> is a nerdy travel journal that explores the real-world places behind the legends, myths, and iconic moments of pop culture...
          </p>
        </section>

        <QuestForm />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <QuestCard
            title="Lauterbrunnen Valley, Switzerland"
            subtitle="Inspiration for Tolkien's Rivendell"
            description="Tolkien hiked through Lauterbrunnen in 1911 and was captivated by its towering cliffs and cascading waterfalls..."
          />
          <QuestCard
            title="Newburyport, Massachusetts"
            subtitle="Inspiration for Lovecraft's Innsmouth"
            description="This coastal town inspired H.P. Lovecraft’s eerie fishing village in 'The Shadow over Innsmouth'..."
          />
        </section>
      </main>
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 text-center">
          &copy; 2025 Mythos Atlas. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Home;
