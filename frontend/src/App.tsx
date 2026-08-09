import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { ResumeUpload } from './pages/ResumeUpload';
import { ResumeAnalysis } from './pages/ResumeAnalysis';
import { FakeJobDetector } from './pages/FakeJobDetector';
import { JobMatcher } from './pages/JobMatcher';
import { Recommendations } from './pages/Recommendations';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagement } from './pages/UserManagement';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">Loading CareerShield...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex flex-1 items-start relative">
        <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />
        <main className="flex-1 p-3 sm:p-6 md:p-8 bg-slate-50 min-w-0 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Application Pages */}
          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/resume-builder" element={<ProtectedLayout><ResumeBuilder /></ProtectedLayout>} />
          <Route path="/resume-upload" element={<ProtectedLayout><ResumeUpload /></ProtectedLayout>} />
          <Route path="/resume-analysis" element={<ProtectedLayout><ResumeAnalysis /></ProtectedLayout>} />
          <Route path="/fake-job-detector" element={<ProtectedLayout><FakeJobDetector /></ProtectedLayout>} />
          <Route path="/job-matcher" element={<ProtectedLayout><JobMatcher /></ProtectedLayout>} />
          <Route path="/recommendations" element={<ProtectedLayout><Recommendations /></ProtectedLayout>} />
          
          {/* Super Admin Management Pages */}
          <Route path="/admin-dashboard" element={<ProtectedLayout><AdminDashboard /></ProtectedLayout>} />
          <Route path="/user-management" element={<ProtectedLayout><UserManagement /></ProtectedLayout>} />

          {/* Fallback to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
