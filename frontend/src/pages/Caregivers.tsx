import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { caregiversApi } from '../services/api';
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

export default function Caregivers() {
  const [filters, setFilters] = useState({
    service_type: '',
    experience_level: '',
    location: '',
    search: '',
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
    enabled: !showAuthWarning && (isFindView || !isOfferView),
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
                ? 'Register as a caregiver and offer your services to those in need' 
                : isFindView
                  ? 'Find experienced caregivers that match your requirements'
                  : 'Connect with experienced caregivers or offer your caregiving services'}
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

            {/* Search and filter section */}
            {isFindView && (
              <div className="mt-8">
                <div className="flex flex-col gap-6">
                  {/* Search bar */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 pl-10 pr-14 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      placeholder="Search caregivers..."
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                      <select
                        id="service-type"
                        value={filters.service_type}
                        onChange={(e) => handleFilterChange('service_type', e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">All Service Types</option>
                        {serviceTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        id="experience-level"
                        value={filters.experience_level}
                        onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">All Experience Levels</option>
                        {experienceLevels.map((level) => (
                          <option key={level.id} value={level.id}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        id="location"
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        placeholder="Enter location..."
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results grid */}
      {(isFindView || !isOfferView) && (
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
                <motion.div
                  key={caregiver.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <div className="flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(caregiver.service_type)}&background=random`}
                      alt={caregiver.service_type}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {caregiver.service_type}
                        </h3>
                        <div className="flex items-center">
                          <StarIconSolid className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                          <span className="ml-1 text-sm text-gray-600">{caregiver.rating || 'N/A'}</span>
                          <span className="ml-1 text-sm text-gray-500">({caregiver.review_count || 0} reviews)</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {caregiver.location}
                      </div>
                      <p className="mt-3 text-sm text-gray-500">{caregiver.description}</p>
                      <div className="mt-4">
                        <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/20">
                          {serviceTypes.find((type) => type.id === caregiver.service_type)?.name || caregiver.service_type}
                        </span>
                        <span className="ml-2 inline-flex items-center rounded-md bg-secondary-50 px-2 py-1 text-xs font-medium text-secondary-700 ring-1 ring-inset ring-secondary-600/20">
                          {caregiver.experience_level}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-lg font-medium text-gray-900">
                        ${caregiver.hourly_rate}
                        <span className="text-sm font-normal text-gray-500">/hour</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleContactCaregiver(caregiver)}
                        className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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