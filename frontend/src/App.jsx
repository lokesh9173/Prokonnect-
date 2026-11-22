import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RoleSelection from './pages/RoleSelection';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import InfluencerDashboard from './pages/InfluencerDashboard';
import BusinessDetail from './pages/BusinessDetail';
import InfluencerDetail from './pages/InfluencerDetail';
import PromotionDetail from './pages/PromotionDetail';
import EditProfile from './pages/EditProfile';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import About from './pages/About';
import Features from './pages/Features';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import DemoBanner from './components/DemoBanner';

import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <DemoBanner />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Navigate to="/role-selection" replace />} />

          <Route
            path="/business-dashboard"
            element={
              <ProtectedRoute requiredRole="business">
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/influencer-dashboard"
            element={
              <ProtectedRoute requiredRole="influencer">
                <InfluencerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/business/:id"
            element={
              <ProtectedRoute>
                <BusinessDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/promotion/:id"
            element={
              <ProtectedRoute>
                <PromotionDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/influencer/:id"
            element={
              <ProtectedRoute>
                <InfluencerDetail />
              </ProtectedRoute>
            }
          />

          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunities/:id" element={<OpportunityDetail />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Global Chatbot Widget */}
        <ChatWidget />
      </Router>
    </>
  );
}

export default App;
