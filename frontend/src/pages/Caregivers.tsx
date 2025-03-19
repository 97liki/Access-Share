import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { caregiversApi, caregiverApi, authApi } from '../services/api';
import { CaregiverListing } from '../types/api';
import { useAuth } from '../contexts/AuthContext';

// Import assets
import bgPattern from '../assets/images/backgrounds/pattern-light.svg';
import emptyStateIllustration from '../assets/images/illustrations/empty-state.svg';
import errorIllustration from '../assets/images/illustrations/error.svg';
import loadingIllustration from '../assets/images/illustrations/loading.svg';

const serviceTypes = [
  { id: 'personal_care', name: 'Personal Care' },
  { id: 'medical_care', name: 'Medical Care' },
  { id: 'emotional_support', name: 'Emotional Support' },
  { id: 'transportation', name: 'Transportation' },
  { id: 'other', name: 'Other' },
];

const experienceLevels = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
  { id: 'expert', name: 'Expert' },
];

const CaregiverCard = ({ caregiver }: { caregiver: CaregiverListing }) => {
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.me(),
    enabled: !!localStorage.getItem('userEmail')
  });

  const isMyListing = userData?.id === caregiver.caregiver_id;
  const status = caregiver.availability_status || 'unknown';

  const handleContactCaregiver = async (caregiver: CaregiverListing) => {
    try {
      await caregiversApi.contactCaregiver(caregiver.id, "I'm interested in your services");
      toast.success('Message sent to caregiver successfully!');
    } catch (error) {
      console.error('Error contacting caregiver:', error);
      toast.error('Failed to send message to caregiver');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${isMyListing ? 'bg-blue-50 border-2 border-blue-200' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{caregiver.service_type}</h3>
          <p className="text-sm text-gray-500">{caregiver.location}</p>
        </div>
        <div className="flex items-center space-x-2">
          {isMyListing && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              My Listing
            </span>
          )}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'available' ? 'bg-green-100 text-green-800' :
            status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
            status === 'unavailable' ? 'bg-red-100 text-red-800' :
            status === 'temporarily_unavailable' ? 'bg-orange-100 text-orange-800' :
            status === 'on_vacation' ? 'bg-purple-100 text-purple-800' :
            status === 'limited_availability' ? 'bg-blue-100 text-blue-800' :
            status === 'booked' ? 'bg-indigo-100 text-indigo-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">Experience: {caregiver.experience_level}</p>
        <p className="text-sm text-gray-500">Rate: ${caregiver.hourly_rate}/hour</p>
        <p className="text-sm text-gray-500">Contact: {caregiver.contact_info}</p>
        <p className="mt-2 text-sm text-gray-500">{caregiver.description}</p>
      </div>
      <div className="mt-6">
        <button
          onClick={() => handleContactCaregiver(caregiver)}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Contact Caregiver
        </button>
      </div>
    </div>
  );
};

export default function Caregivers() {
  const [filters, setFilters] = useState({
    service_type: '',
    experience_level: '',
    location: '',
    search: '',
    availability_status: '',
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  // Determine which view to show based on the path
  const isOfferView = location.pathname.includes('/offer');
  const isFindView = location.pathname.includes('/find');

  // Check authentication when offering services
  useEffect(() => {
    // Only show auth warning for offer view when not authenticated
    if (isOfferView && !isAuthenticated) {
      setShowAuthWarning(true);
    } else {
      setShowAuthWarning(false);
    }
  }, [isOfferView, isAuthenticated]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['caregivers', filters],
    queryFn: () => caregiversApi.getAll(filters),
    enabled: !showAuthWarning,
    retry: 1,
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleContactCaregiver = (caregiver: CaregiverListing) => {
    if (caregiver.contact_info) {
      window.location.href = `tel:${caregiver.contact_info}`;
    } else {
      toast.error('Contact information not available');
    }
  };

  const handleCreateCaregiver = () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to offer caregiving services');
      navigate('/login');
    } else {
      navigate('/create-caregiver');
    }
  };

  // Authentication warning screen
  if (showAuthWarning) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ backgroundImage: `url(${bgPattern})` }}>
        <div className="max-w-md w-full bg-white shadow rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to offer caregiving services.
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">Loading caregivers...</h3>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${bgPattern})` }}>
        <div className="text-center">
          <img src={errorIllustration} alt="Error" className="w-48 h-48 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Failed to load caregivers</h3>
          <p className="mt-2 text-sm text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundImage: `url(${bgPattern})` }}>
      {/* Header section */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {isOfferView ? 'Offer Caregiving Services' : isFindView ? 'Find Caregivers' : 'Caregivers'}
            </h1>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              {isOfferView
                ? 'Register as a caregiver to offer your services to those in need'
                : isFindView
                ? 'Find caregivers that match your requirements'
                : 'Connect with caregivers in your area or offer your services to help others in need.'}
            </p>
            
            {/* Navigation buttons if we're on the main caregivers page */}
            {!isOfferView && !isFindView && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => navigate('/caregivers/offer')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Offer Care
                </button>
                <button
                  onClick={() => navigate('/caregivers/find')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Find Caregivers
                </button>
              </div>
            )}

            {/* Header with Create button */}
            {isOfferView && (
              <div className="mt-6">
                <button
                  onClick={handleCreateCaregiver}
                  className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Create Caregiver Profile
                </button>
                
                {!isAuthenticated && (
                  <p className="mt-2 text-sm text-gray-500">
                    You must be logged in to offer caregiving services
                  </p>
                )}
              </div>
            )}

            {/* Filters */}
            {(isFindView || !isOfferView) && (
              <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Filter Caregivers</h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Service Type Filter */}
                    <div>
                      <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">
                        Service Type
                      </label>
                      <select
                        id="service_type"
                        name="service_type"
                        value={filters.service_type}
                        onChange={(e) => handleFilterChange('service_type', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="">All Service Types</option>
                        {serviceTypes.map((type) => (
                          <option key={type.id} value={type.name}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Experience Level Filter */}
                    <div>
                      <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">
                        Experience Level
                      </label>
                      <select
                        id="experience_level"
                        name="experience_level"
                        value={filters.experience_level}
                        onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="">All Experience Levels</option>
                        {experienceLevels.map((level) => (
                          <option key={level.id} value={level.name}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          name="location"
                          id="location"
                          value={filters.location}
                          onChange={(e) => handleFilterChange('location', e.target.value)}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="Any location"
                        />
                      </div>
                    </div>

                    {/* Search Filter */}
                    <div>
                      <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                        Search
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          name="search"
                          id="search"
                          value={filters.search}
                          onChange={(e) => handleFilterChange('search', e.target.value)}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="Search caregivers..."
                        />
                      </div>
                    </div>

                    {/* Availability Status Filter */}
                    <div>
                      <label htmlFor="availability_status" className="block text-sm font-medium text-gray-700">
                        Availability
                      </label>
                      <select
                        id="availability_status"
                        name="availability_status"
                        value={filters.availability_status}
                        onChange={(e) => handleFilterChange('availability_status', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="">All Statuses</option>
                        <option value="available">Available Only</option>
                        <option value="busy">Busy Only</option>
                        <option value="unavailable">Unavailable Only</option>
                        <option value="temporarily_unavailable">Temporarily Unavailable Only</option>
                        <option value="on_vacation">On Vacation Only</option>
                        <option value="limited_availability">Limited Availability Only</option>
                        <option value="booked">Booked Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results grid - show ONLY on find view, NOT on home page */}
      {isFindView && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {!data?.data?.items?.length ? (
            <div className="text-center py-12">
              <img src={emptyStateIllustration} alt="No caregivers found" className="w-48 h-48 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No caregivers found</h3>
              <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data?.data?.items?.map((caregiver: CaregiverListing, index: number) => (
                <CaregiverCard key={caregiver.id} caregiver={caregiver} />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Show welcome message on home page when not in find or offer view */}
      {!isFindView && !isOfferView && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-4">Welcome to Caregivers</h3>
          <p className="text-gray-600 mb-6">
            Select "Find Caregiver" to view available caregivers or "Offer Care" to offer your services.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => navigate('/caregivers/find')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View Caregiver Listings
            </button>
          </div>
        </div>
      )}

      {/* Form section for offering care */}
      {isOfferView && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Register as a Caregiver</h2>
            <p className="mb-8 text-gray-600">
              To offer your caregiving services, please click the "Create Caregiver Profile" 
              button above to set up your detailed profile with your skills, experience, 
              and availability.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-primary-700 mb-3">Benefits of being a caregiver</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Flexible working hours based on your availability</li>
                  <li>• Competitive hourly rates</li>
                  <li>• Meaningful work helping those in need</li>
                  <li>• Build professional experience</li>
                  <li>• Connect with people in your community</li>
                </ul>
              </div>
              
              <div className="bg-secondary-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-secondary-700 mb-3">Requirements</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Must be 18 years or older</li>
                  <li>• Relevant skills or qualifications (varies by service type)</li>
                  <li>• Background check may be required</li>
                  <li>• Reliable transportation</li>
                  <li>• Good communication skills</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}