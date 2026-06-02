import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import SchedulePage from './pages/dashboard/SchedulePage';
import ContentPage from './pages/dashboard/ContentPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import PersonalInfoPage from './pages/dashboard/PersonalInfoPage';
import SecurityPage from './pages/dashboard/SecurityPage';
import BillingPage from './pages/dashboard/BillingPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/register" element={<AuthPage type="register" />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/personal-info" element={<PersonalInfoPage />} />
            <Route path="profile/security" element={<SecurityPage />} />
            <Route path="profile/billing" element={<BillingPage />} />
            <Route path="profile/notifications" element={<NotificationsPage />} />
            {/* Redirect /dashboard/settings to profile for now since profile has settings */}
            <Route path="settings" element={<Navigate to="/dashboard/profile" />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
