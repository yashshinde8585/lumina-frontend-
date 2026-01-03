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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/generate" element={<Generator />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/editor/:id" element={<Editor />} />
                <Route path="/lexical" element={<LexicalEditor />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/job-details" element={<JobDetails />} />
                <Route path="/resumes" element={<MyResumesPage />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ResumeProvider>
    </ErrorBoundary>
  );
}

export default App;
