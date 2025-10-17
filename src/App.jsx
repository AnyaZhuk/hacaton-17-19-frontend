import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage'; // <-- Импортируем нашу единственную страницу

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;