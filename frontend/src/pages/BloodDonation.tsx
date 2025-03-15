import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bloodApi } from '../services/api';
import { BloodDonation as BloodDonationType } from '../types/api';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import assets
import bgPattern from '../assets/images/backgrounds/pattern-light.svg';
import emptyStateIllustration from '../assets/images/illustrations/empty-state.svg';
import errorIllustration from '../assets/images/illustrations/error.svg';
import loadingIllustration from '../assets/images/illustrations/loading.svg';

interface DonationFormData {
  blood_type: string;
  location: string;
  urgency: 'high' | 'medium' | 'low';
  contact_number: string;
  notes?: string;
}

const BloodDonation = () => {
  const [filters, setFilters] = useState({
    blood_type: '',
    location: '',
  });
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  // Determine which view to show based on the path
  const isDonateView = location.pathname.includes('/donate');
  const isRequestView = location.pathname.includes('/request');
  
  // Effect to check authentication for donation pages
  useEffect(() => {
    if ((isDonateView || isRequestView) && !isAuthenticated) {
      setShowAuthWarning(true);
    } else {
      setShowAuthWarning(false);
    }
  }, [isDonateView, isRequestView, isAuthenticated]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['blood-donations', filters],
    queryFn: () => bloodApi.getBloodDonations(filters),
    retry: 1,
    enabled: !showAuthWarning // Don't run the query if we know the user isn't authenticated
  });

  const createMutation = useMutation({
    mutationFn: (data: DonationFormData) => bloodApi.createBloodDonation({
      blood_type: data.blood_type,
      urgency: data.urgency || 'medium',
      location: data.location,
      contact_number: data.contact_number,
      notes: data.notes
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blood-donations'] });
      toast.success('Blood donation request created successfully!');
      // Reset the form
      const form = document.getElementById('donation-form') as HTMLFormElement;
      if (form) form.reset();
    },
    onError: (error: any) => {
      console.error('Blood donation creation error:', error);
      
      // Handle our new error format with friendly messages
      if (error.isServerError) {
        toast.error(error.message || 'A server error occurred. Please try again later.');
      } else if (error.isNetworkError) {
        toast.error(error.message || 'Network error. Please check your connection and try again.');
      } else if (error.response?.status === 401) {
        toast.error('You must be logged in to donate blood. Please sign in.');
        navigate('/login');
      } else if (error.response?.status === 422) {
        toast.error('Please check your form data and try again.');
      } else {
        toast.error(error.message || 'Failed to create blood donation request. Please try again.');
      }
    },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('You must be logged in to donate blood');
      navigate('/login');
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const availableUntil = formData.get('available_until');
    
    createMutation.mutate({
      blood_type: formData.get('blood_type') as string,
      location: formData.get('location') as string,
      contact_number: formData.get('contact_number') as string,
      urgency: (formData.get('urgency') as 'high' | 'medium' | 'low') || 'medium',
      notes: availableUntil ? `Available Until: ${availableUntil}` : undefined
    });
  };

  // Authentication warning message
  if (showAuthWarning) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ backgroundImage: `url(${bgPattern})` }}>
        <div className="max-w-md w-full bg-white shadow rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to {isDonateView ? 'donate blood' : 'request blood donations'}.
          </p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${bgPattern})` }}>
        <div className="text-center">
          <img src={loadingIllustration} alt="Loading" className="w-48 h-48 mx-auto animate-pulse" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Loading blood donation requests...</h3>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${bgPattern})` }}>
        <div className="text-center">
          <img src={errorIllustration} alt="Error" className="w-48 h-48 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Failed to load blood donation requests</h3>
          <p className="mt-2 text-sm text-gray-500">
            {error instanceof Error ? error.message : 'Please try again later'}
          </p>
          <button
            onClick={() => navigate('/blood-donation')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundImage: `url(${bgPattern})` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Blood Donation</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {isDonateView ? 'Donate Blood' : isRequestView ? 'Request Blood' : 'Blood Donation Service'}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            {isDonateView 
              ? 'Register as a blood donor to help save lives in your community' 
              : isRequestView 
                ? 'Find blood donors that match your requirements'
                : 'Connect with blood donors in your area or register as a donor to help others in need.'}
          </p>
          
          {/* Navigation buttons if we're on the main blood donation page */}
          {!isDonateView && !isRequestView && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => navigate('/blood-donation/donate')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Donate Blood
              </button>
              <button
                onClick={() => navigate('/blood-donation/request')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Request Blood
              </button>
            </div>
          )}
        </div>

        {/* Show filters only on main page or request page */}
        {(!isDonateView || isRequestView) && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="blood_type" className="block text-sm font-medium text-gray-700">
                Blood Type
              </label>
              <select
                id="blood_type"
                name="blood_type"
                value={filters.blood_type}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Types</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter city or zip code"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Show donation form based on view */}
          {(isDonateView || !isRequestView) && (
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Register as a Donor</h3>
                <form id="donation-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="new_blood_type" className="block text-sm font-medium text-gray-700">
                      Blood Type
                    </label>
                    <select
                      id="new_blood_type"
                      name="blood_type"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select blood type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                      Urgency Level
                    </label>
                    <select
                      id="urgency"
                      name="urgency"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      <option value="high">High</option>
                      <option value="medium" selected>Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="new_location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      id="new_location"
                      name="location"
                      required
                      placeholder="Enter your location"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contact_number"
                      name="contact_number"
                      required
                      placeholder="Enter your contact number"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="available_until" className="block text-sm font-medium text-gray-700">
                      Available Until
                    </label>
                    <input
                      type="datetime-local"
                      id="available_until"
                      name="available_until"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createMutation.isPending ? 'Registering...' : 'Register as Donor'}
                  </button>

                  {/* Show login message for unauthenticated users */}
                  {!isAuthenticated && (
                    <div className="mt-2 text-sm text-gray-500 text-center">
                      <p>You must be logged in to donate blood.</p>
                      <div className="mt-2 flex justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => navigate('/login')}
                          className="text-primary-600 hover:text-primary-500"
                        >
                          Sign In
                        </button>
                        <span>or</span>
                        <button
                          type="button"
                          onClick={() => navigate('/register')}
                          className="text-primary-600 hover:text-primary-500"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Show listings based on view */}
          {(isRequestView || !isDonateView) && (
            <div className={isDonateView ? "lg:col-span-3" : "lg:col-span-2"}>
              {!data?.data?.items?.length ? (
                <div className="text-center py-12">
                  <img src={emptyStateIllustration} alt="No donors found" className="w-48 h-48 mx-auto" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No donors found</h3>
                  <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or check back later</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {data?.data?.items?.map((donation: BloodDonationType) => (
                    <div
                      key={donation.id}
                      className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            {donation.blood_type}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Location: {donation.location}</p>
                          <p className="text-sm text-gray-500">Contact: {donation.contact_number}</p>
                          {donation.available_until && (
                            <p className="text-sm text-gray-500">
                              Available until: {new Date(donation.available_until).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="mt-6">
                          <button
                            onClick={() => window.location.href = `tel:${donation.contact_number}`}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Contact Donor
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodDonation;