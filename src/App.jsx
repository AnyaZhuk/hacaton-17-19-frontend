import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage'; 
import StatisticsPage from './pages/StatisticsPage';

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Routes>
    </div>
  );
}

export default App;