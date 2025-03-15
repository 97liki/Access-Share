import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { DeviceListing } from '../types/api';
import { devicesApi } from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

// Import assets
import bgPattern from '../assets/images/backgrounds/pattern-light.svg';
import emptyStateIllustration from '../assets/images/illustrations/empty-state.svg';
import errorIllustration from '../assets/images/illustrations/error.svg';
import loadingIllustration from '../assets/images/illustrations/loading.svg';

interface DeviceFormData {
  device_name: string;
  device_type: string;
  condition: string;
  description: string;
  location: string;
  contact_info: string;
}

const AssistiveDevices = () => {
  const [filters, setFilters] = useState({
    device_type: '',
    location: '',
  });
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Determine which view to show based on the path
  const isDonateView = location.pathname.includes('/donate');
  const isRequestView = location.pathname.includes('/request');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['devices', filters],
    queryFn: () => devicesApi.getDevices(filters),
  });

  const createMutation = useMutation({
    mutationFn: (data: DeviceFormData) => devicesApi.createDevice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device donation submitted successfully!');
      navigate('/assistive-devices');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit device donation');
    },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleContactOwner = (device: DeviceListing) => {
    if (device.contact_info) {
      window.location.href = `tel:${device.contact_info}`;
    } else {
      toast.error('Contact information not available');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createMutation.mutate({
      device_name: formData.get('device_name') as string,
      device_type: formData.get('device_type') as string,
      condition: formData.get('condition') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      contact_info: formData.get('contact_info') as string,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${bgPattern})` }}>
        <div className="text-center">
          <img src={loadingIllustration} alt="Loading" className="w-48 h-48 mx-auto animate-pulse" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Loading devices...</h3>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${bgPattern})` }}>
        <div className="text-center">
          <img src={errorIllustration} alt="Error" className="w-48 h-48 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Failed to load devices</h3>
          <p className="mt-2 text-sm text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundImage: `url(${bgPattern})` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Assistive Devices</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {isDonateView ? 'Donate Devices' : isRequestView ? 'Request Devices' : 'Assistive Devices Hub'}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            {isDonateView 
              ? 'Donate medical equipment and assistive devices to those in need' 
              : isRequestView 
                ? 'Find assistive devices and medical equipment you need'
                : 'Browse available assistive devices in your area or list your own device to help others.'}
          </p>
          
          {/* Navigation buttons if we're on the main devices page */}
          {!isDonateView && !isRequestView && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => navigate('/devices/donate')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Donate Devices
              </button>
              <button
                onClick={() => navigate('/devices/request')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Request Devices
              </button>
            </div>
          )}
        </div>

        {/* Show filters on main page or request page */}
        {(!isDonateView || isRequestView) && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="device_type" className="block text-sm font-medium text-gray-700">
                Device Type
              </label>
              <select
                id="device_type"
                name="device_type"
                value={filters.device_type}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Types</option>
                <option value="wheelchair">Wheelchair</option>
                <option value="walker">Walker</option>
                <option value="hearing_aid">Hearing Aid</option>
                <option value="crutches">Crutches</option>
                <option value="other">Other</option>
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

        {/* Show donation form if on donate view */}
        {isDonateView && (
          <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Donate a Device</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Fill out this form to donate your assistive device to someone in need.</p>
              </div>
              <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="device_name" className="block text-sm font-medium text-gray-700">
                    Device Name
                  </label>
                  <input
                    type="text"
                    name="device_name"
                    id="device_name"
                    required
                    placeholder="e.g., Wheelchair"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="device_type" className="block text-sm font-medium text-gray-700">
                    Device Type
                  </label>
                  <select
                    id="device_type"
                    name="device_type"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select device type</option>
                    <option value="wheelchair">Wheelchair</option>
                    <option value="walker">Walker</option>
                    <option value="hearing_aid">Hearing Aid</option>
                    <option value="crutches">Crutches</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="device_location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="device_location"
                    required
                    placeholder="e.g., San Francisco, CA"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">
                    Contact Information
                  </label>
                  <input
                    type="text"
                    name="contact_info"
                    id="contact_info"
                    required
                    placeholder="e.g., Phone number or email"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    placeholder="Describe the device and any additional information..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                
                <div className="col-span-2">
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createMutation.isPending ? 'Submitting...' : 'Submit Donation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Device List - show on main page or request view */}
        {(isRequestView || !isDonateView) && (
          <>
            {data?.data?.items?.length === 0 ? (
              <div className="text-center py-12">
                <img src={emptyStateIllustration} alt="No devices found" className="w-48 h-48 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No devices found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data?.data?.items?.map((device: DeviceListing) => (
                  <div
                    key={device.id}
                    className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">{device.device_name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{device.description}</p>
                      <div className="mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {device.condition}
                        </span>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {device.location}
                        </span>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => handleContactOwner(device)}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Contact Owner
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AssistiveDevices;