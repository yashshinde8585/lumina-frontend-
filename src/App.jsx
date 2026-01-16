import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext'; // Context Provider
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Generator = lazy(() => import('./pages/Generator'));
const Editor = lazy(() => import('./pages/Editor'));
const LexicalEditor = lazy(() => import('./pages/LexicalEditor'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const MyResumesPage = lazy(() => import('./pages/MyResumesPage'));
const AccountProfile = lazy(() => import('./pages/AccountProfile'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-gray-500 font-medium text-sm">Loading application...</p>
    </div>
  </div>
);

import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <ResumeProvider>
        <Router>
          <div className="min-h-screen font-sans text-secondary bg-canvas">
            <Toaster position="top-center" richColors />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/generate" element={
                  <ProtectedRoute>
                    <Generator />
                  </ProtectedRoute>
                } />
                <Route path="/editor" element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                } />
                <Route path="/editor/:id" element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                } />
                <Route path="/lexical" element={
                  <ProtectedRoute>
                    <LexicalEditor />
                  </ProtectedRoute>
                } />
                <Route path="/job-details" element={
                  <ProtectedRoute>
                    <JobDetails />
                  </ProtectedRoute>
                } />
                <Route path="/resumes" element={
                  <ProtectedRoute>
                    <MyResumesPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <AccountProfile />
                  </ProtectedRoute>
                } />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ResumeProvider>
    </ErrorBoundary>
  );
}

export default App;
