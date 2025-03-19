import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bloodApi, devicesApi, caregiversApi } from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

type DonationType = 'blood' | 'device' | 'caregiver';

interface MyDonationsProps {
  type?: DonationType;
}

const MyDonations = ({ type = 'blood' }: MyDonationsProps) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<DonationType>(type);

  // Blood donation query
  const {
    data: bloodDonations,
    isLoading: isLoadingBlood,
    isError: isErrorBlood,
  } = useQuery({
    queryKey: ['my-blood-donations'],
    queryFn: () => bloodApi.getBloodDonations({ is_mine: true }),
    enabled: isAuthenticated && (activeTab === 'blood' || !activeTab),
  });

  // Assistive device query
  const {
    data: deviceData,
    isLoading: isLoadingDevices,
    isError: isErrorDevices,
  } = useQuery({
    queryKey: ['devices', 'my'],
    queryFn: () => devicesApi.getDevices({ is_mine: 'true' }),
    enabled: isAuthenticated && (activeTab === 'device' || !activeTab),
  });

  // Caregiver query
  const {
    data: caregiverData,
    isLoading: isLoadingCaregivers,
    isError: isErrorCaregivers,
  } = useQuery({
    queryKey: ['caregivers', 'my'],
    queryFn: () => caregiversApi.getAll({ is_mine: 'true' }),
    enabled: isAuthenticated && (activeTab === 'caregiver' || !activeTab),
  });

  // Blood donation status mutation
  const updateBloodStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => bloodApi.updateBloodDonationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-blood-donations'] });
      toast.success('Blood donation status updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating blood donation status:', error);
      toast.error('Failed to update blood donation status');
    },
  });

  // Device status mutation
  const updateDeviceStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      devicesApi.updateDevice(id, { available: status as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices', 'my'] });
      toast.success('Device status updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating device status:', error);
      toast.error('Failed to update device status');
    },
  });

  // Caregiver status mutation
  const updateCaregiverStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      caregiversApi.updateCaregiver(id, { availability_status: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caregivers', 'my'] });
      toast.success('Caregiver status updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating caregiver status:', error);
      toast.error('Failed to update caregiver status');
    },
  });

  // Handler for blood donation status update
  const handleBloodStatusChange = (id: number, status: string) => {
    updateBloodStatusMutation.mutate({ id, status });
  };

  // Handler for device status update
  const handleDeviceStatusChange = (id: number, status: string) => {
    updateDeviceStatusMutation.mutate({ id, status });
  };

  // Handler for caregiver status update
  const handleCaregiverStatusChange = (id: number, status: string) => {
    updateCaregiverStatusMutation.mutate({ id, status });
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 text-center">
        <p className="text-gray-500">Please log in to manage your donations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('blood')}
            className={`${
              activeTab === 'blood'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Blood Donations
          </button>
          <button
            onClick={() => setActiveTab('device')}
            className={`${
              activeTab === 'device'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Assistive Devices
          </button>
          <button
            onClick={() => setActiveTab('caregiver')}
            className={`${
              activeTab === 'caregiver'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Caregiver Services
          </button>
        </nav>
      </div>

      <div className="px-4 py-5 sm:p-6">
        {/* Blood Donations Tab */}
        {activeTab === 'blood' && (
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">My Blood Donations</h3>
            {isLoadingBlood ? (
              <p className="text-gray-500">Loading...</p>
            ) : isErrorBlood ? (
              <p className="text-red-500">Error loading your blood donations.</p>
            ) : bloodDonations?.data?.items?.length === 0 ? (
              <p className="text-gray-500">You haven't made any blood donations yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Blood Type</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Urgency</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bloodDonations?.data?.items?.map((donation: any) => (
                      <tr key={donation.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{donation.blood_type}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{donation.location}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{donation.urgency}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            donation.status === 'available' ? 'bg-green-100 text-green-800' : 
                            donation.status === 'unavailable' ? 'bg-red-100 text-red-800' :
                            donation.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-800' :
                            donation.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                            donation.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {donation.status || 'available'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <select
                            value={donation.status || 'available'}
                            onChange={(e) => handleBloodStatusChange(donation.id, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                          >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                            <option value="pending_verification">Pending Verification</option>
                            <option value="reserved">Reserved</option>
                            <option value="expired">Expired</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Assistive Devices Tab */}
        {activeTab === 'device' && (
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">My Assistive Device Listings</h3>
            {isLoadingDevices ? (
              <p className="text-gray-500">Loading...</p>
            ) : isErrorDevices ? (
              <p className="text-red-500">Error loading your device listings.</p>
            ) : deviceData?.data?.items?.length === 0 ? (
              <p className="text-gray-500">You haven't listed any assistive devices yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Device Name</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Condition</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deviceData?.data?.items?.map((device: any) => (
                      <tr key={device.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{device.device_name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{device.device_type}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{device.condition}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            device.available === 'available' ? 'bg-green-100 text-green-800' : 
                            device.available === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            device.available === 'reserved' ? 'bg-blue-100 text-blue-800' :
                            device.available === 'on_hold' ? 'bg-purple-100 text-purple-800' :
                            device.available === 'taken' ? 'bg-red-100 text-red-800' :
                            device.available === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                            device.available === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {device.available}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <select
                            value={device.available}
                            onChange={(e) => handleDeviceStatusChange(device.id, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                          >
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="reserved">Reserved</option>
                            <option value="on_hold">On Hold</option>
                            <option value="taken">Taken</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Caregiver Services Tab */}
        {activeTab === 'caregiver' && (
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">My Caregiver Services</h3>
            {isLoadingCaregivers ? (
              <p className="text-gray-500">Loading...</p>
            ) : isErrorCaregivers ? (
              <p className="text-red-500">Error loading your caregiver services.</p>
            ) : caregiverData?.data?.items?.length === 0 ? (
              <p className="text-gray-500">You haven't offered any caregiver services yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Service Type</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Experience</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {caregiverData?.data?.items?.map((caregiver: any) => (
                      <tr key={caregiver.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{caregiver.service_type}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{caregiver.experience_level}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{caregiver.location}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            caregiver.availability_status === 'available' ? 'bg-green-100 text-green-800' : 
                            caregiver.availability_status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                            caregiver.availability_status === 'unavailable' ? 'bg-red-100 text-red-800' :
                            caregiver.availability_status === 'temporarily_unavailable' ? 'bg-orange-100 text-orange-800' :
                            caregiver.availability_status === 'on_vacation' ? 'bg-blue-100 text-blue-800' :
                            caregiver.availability_status === 'limited_availability' ? 'bg-purple-100 text-purple-800' :
                            caregiver.availability_status === 'booked' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {caregiver.availability_status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <select
                            value={caregiver.availability_status}
                            onChange={(e) => handleCaregiverStatusChange(caregiver.id, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                          >
                            <option value="available">Available</option>
                            <option value="busy">Busy</option>
                            <option value="unavailable">Unavailable</option>
                            <option value="temporarily_unavailable">Temporarily Unavailable</option>
                            <option value="on_vacation">On Vacation</option>
                            <option value="limited_availability">Limited Availability</option>
                            <option value="booked">Booked</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDonations; 