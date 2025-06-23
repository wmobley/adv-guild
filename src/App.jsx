import Home from './pages/Home';
import CreateUserPage from './pages/CreateUserPage';
import LoginPage from './pages/LoginPage';
import MyJourneyPage from './pages/MyJourneyPage';
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
                    <Route path="/my-journey" element={<MyJourneyPage />} />
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
