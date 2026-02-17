import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AIInsights from './pages/AIInsights';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/analytics"
        element={
          isAuthenticated ? (
            <Layout>
              <Analytics />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/ai-insights"
        element={
          isAuthenticated ? (
            <Layout>
              <AIInsights />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
