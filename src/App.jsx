import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import OperatorLoginPage from './pages/OperatorLoginPage';
import OperatorDashboardPage from './pages/OperatorDashboardPage';
import OperatorTicketPage from './pages/OperatorTicketPage';
import OperatorAnalyticsPage from './pages/OperatorAnalyticsPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/chat" element={<ChatPage />} />

      <Route path="/operator/login" element={<OperatorLoginPage />} />
      <Route path="/operator/dashboard" element={<OperatorDashboardPage />} />
      <Route path="/operator/tickets/:id" element={<OperatorTicketPage />} />
      <Route path="/operator/analytics" element={<OperatorAnalyticsPage />} />
    </Routes>
  );
}

export default App;