import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/authContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

import DashboardHome from './pages/dashboard';
import UploadDataset from './pages/upload';
import ChatbotPage from './pages/chatbot';
import ManualCleaning from './pages/clean';
import InsightsPage from './pages/insights';
import HistoryPage from './pages/history';
import DownloadData from './pages/download';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadDataset /></ProtectedRoute>} />
          <Route path="/clean" element={<ProtectedRoute><ManualCleaning /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/download" element={<ProtectedRoute><DownloadData /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
