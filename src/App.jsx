import './firebaseInit'; // Import to initialize Firebase
import Home from './pages/Home';
// import SdkTestComponent from './components/SdkTestComponent'; // Can be re-enabled if needed
import CreateUserPage from './pages/CreateUserPage';
import LoginPage from './pages/LoginPage';
import DiscoveryPage from './pages/DiscoveryPage';
import CreateQuestPage from './pages/CreateQuestPage';
import MyQuestsPage from './pages/MyQuestsPage';
import PublicQuestsPage from './pages/PublicQuestsPage'; // Import the new page
import ItineraryPage from './pages/ItineraryPage'; // Import the ItineraryPage
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
         <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-user" element={<CreateUserPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/discovery" element={<DiscoveryPage />} />
                    <Route path="/create-quest" element={<CreateQuestPage />} />
                    <Route path="/my-quests" element={<MyQuestsPage />} /> {/* Add route for My Quests */}
                    <Route path="/public-quests" element={<PublicQuestsPage />} />
                    <Route path="/quests/:questId" element={<ItineraryPage />} /> {/* Route for specific quest itinerary */}
                </Routes>
                {/* <hr /> */}
                {/* <SdkTestComponent /> */}
            </div>
        </Router>
    );
}

export default App;
