import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useBehavioralTracker } from './hooks/useBehavioralTracker';

// Layout & Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import IdentityDnaPage from './pages/IdentityDnaPage';
import AiDetectionPage from './pages/AiDetectionPage';
import BehavioralAnalyticsPage from './pages/BehavioralAnalyticsPage';
import LoginHistoryPage from './pages/LoginHistoryPage';
import SecurityEventsPage from './pages/SecurityEventsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function ProtectedLayout({ children, tracker }) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono text-cyan-400">
        Initializing Security Engine...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 cyber-grid">
      <Navbar
        confidence={tracker.confidenceScore}
        status={tracker.status}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppContent() {
  const tracker = useBehavioralTracker();

  return (
    <Routes>
      {/* Public Landing & Auth Routes */}
      <Route path="/" element={
        <div className="min-h-screen bg-[#020617]">
          <Navbar confidence={tracker.confidenceScore} status={tracker.status} />
          <LandingPage />
        </div>
      } />

      <Route path="/login" element={
        <div className="min-h-screen bg-[#020617]">
          <Navbar confidence={tracker.confidenceScore} status={tracker.status} />
          <LoginPage />
        </div>
      } />

      <Route path="/register" element={
        <div className="min-h-screen bg-[#020617]">
          <Navbar confidence={tracker.confidenceScore} status={tracker.status} />
          <RegisterPage />
        </div>
      } />

      <Route path="/onboarding" element={
        <div className="min-h-screen bg-[#020617]">
          <Navbar confidence={tracker.confidenceScore} status={tracker.status} />
          <OnboardingPage />
        </div>
      } />

      {/* Protected HUD Dashboard Routes */}
      <Route path="/dashboard" element={
        <ProtectedLayout tracker={tracker}>
          <DashboardPage tracker={tracker} />
        </ProtectedLayout>
      } />

      <Route path="/identity-dna" element={
        <ProtectedLayout tracker={tracker}>
          <IdentityDnaPage />
        </ProtectedLayout>
      } />

      <Route path="/ai-detection" element={
        <ProtectedLayout tracker={tracker}>
          <AiDetectionPage tracker={tracker} />
        </ProtectedLayout>
      } />

      <Route path="/analytics" element={
        <ProtectedLayout tracker={tracker}>
          <BehavioralAnalyticsPage />
        </ProtectedLayout>
      } />

      <Route path="/login-history" element={
        <ProtectedLayout tracker={tracker}>
          <LoginHistoryPage />
        </ProtectedLayout>
      } />

      <Route path="/security-events" element={
        <ProtectedLayout tracker={tracker}>
          <SecurityEventsPage />
        </ProtectedLayout>
      } />

      <Route path="/profile" element={
        <ProtectedLayout tracker={tracker}>
          <ProfilePage />
        </ProtectedLayout>
      } />

      <Route path="/settings" element={
        <ProtectedLayout tracker={tracker}>
          <SettingsPage />
        </ProtectedLayout>
      } />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
