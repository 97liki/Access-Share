import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AssistiveDevices from './pages/AssistiveDevices';
import BloodDonation from './pages/BloodDonation';
import Caregivers from './pages/Caregivers';
import CreateCaregiver from './pages/CreateCaregiver';

// Static Pages
import Mission from './pages/static/Mission';
import HowItWorks from './pages/static/HowItWorks';
import Impact from './pages/static/Impact';
import Contact from './pages/static/Contact';
import FAQ from './pages/static/FAQ';
import Privacy from './pages/static/Privacy';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AnimatedRoutes = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Don't redirect during initial loading
  if (isLoading) {
    return null; // Or a loading spinner
  }

  // Only redirect authenticated users away from auth pages
  if (isAuthenticated && ['/login', '/register'].includes(location.pathname)) {
    // If there's a "from" state, redirect there instead of home
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Static Pages */}
        <Route path="/mission" element={<Mission />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Feature Pages */}
        <Route path="/assistive-devices" element={<AssistiveDevices />} />
        <Route path="/blood-donation" element={<BloodDonation />} />
        <Route path="/caregivers" element={<Caregivers />} />

        {/* Additional sub-routes for blood donation */}
        <Route path="/blood-donation/donate" element={<BloodDonation />} />
        <Route path="/blood-donation/request" element={<BloodDonation />} />

        {/* Additional sub-routes for assistive devices */}
        <Route path="/devices/donate" element={<AssistiveDevices />} />
        <Route path="/devices/request" element={<AssistiveDevices />} />

        {/* Additional sub-routes for caregivers */}
        <Route path="/caregivers/offer" element={<Caregivers />} />
        <Route path="/caregivers/find" element={<Caregivers />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create-caregiver" element={<CreateCaregiver />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#4aed88',
              color: '#fff',
            },
          },
        }}
      />
      
      <Navbar />
      
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      
      <Footer />
    </div>
  );
};

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default AppWrapper;
