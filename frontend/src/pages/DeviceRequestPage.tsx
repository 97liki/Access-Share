import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import RequestForm from '../components/RequestForm';
import { devicesApi } from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const DeviceRequestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isResponding, setIsResponding] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  // Determine if we're in edit/view mode or create mode
  const isViewMode = !!id;

  // Fetch device request if in view mode
  const { data: deviceRequest, isLoading: isLoadingRequest } = useQuery({
    queryKey: ['device-request', id],
    queryFn: () => devicesApi.getDeviceRequest(Number(id)),
    enabled: isViewMode,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => devicesApi.createDeviceRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-requests'] });
      toast.success('Device request created successfully!');
      navigate('/devices/view-requests');
    },
    onError: (error: any) => {
      console.error('Error creating device request:', error);
      toast.error('Failed to create device request. Please try again.');
    },
  });

  // Respond mutation
  const respondMutation = useMutation({
    mutationFn: (data: { requestId: number, message: string, status: string }) => 
      devicesApi.respondToDeviceRequest(data.requestId, { message: data.message, status: data.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-request', id] });
      toast.success('Response submitted successfully!');
      setIsResponding(false);
      setResponseMessage('');
    },
    onError: (error: any) => {
      console.error('Error responding to request:', error);
      toast.error('Failed to submit response. Please try again.');
    },
  });

  const handleCreateSubmit = async (data: any) => {
    createMutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmitResponse = () => {
    if (!responseMessage.trim()) {
      toast.error('Please enter a response message');
      return;
    }

    respondMutation.mutate({
      requestId: Number(id),
      message: responseMessage,
      status: 'pending'
    });
  };

  // Check if user is the owner of the request
  const isRequestOwner = deviceRequest && user?.id === deviceRequest.requester_id;

  if (isViewMode && isLoadingRequest) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isViewMode ? 'Device Request Details' : 'Make a Device Request'}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {isViewMode
            ? 'View and manage your device request.'
            : 'Submit a request for assistive devices based on your needs.'}
        </p>
      </div>

      {isViewMode ? (
        deviceRequest ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {deviceRequest.device_name}
                </h2>
                <p className="text-sm text-gray-500">Type: {deviceRequest.device_type}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  deviceRequest.urgency === 'high' ? 'bg-red-100 text-red-800' :
                  deviceRequest.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {deviceRequest.urgency.charAt(0).toUpperCase() + deviceRequest.urgency.slice(1)} Urgency
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  deviceRequest.status === 'open' ? 'bg-green-100 text-green-800' :
                  deviceRequest.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  deviceRequest.status === 'fulfilled' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {deviceRequest.status.charAt(0).toUpperCase() + deviceRequest.status.slice(1).replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{deviceRequest.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Details</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Location: {deviceRequest.location}</p>
                  <p className="text-sm text-gray-500">Contact: {deviceRequest.contact_info}</p>
                  <p className="text-sm text-gray-500">
                    Posted: {new Date(deviceRequest.created_at).toLocaleDateString()}
                  </p>
                  {deviceRequest.updated_at !== deviceRequest.created_at && (
                    <p className="text-sm text-gray-500">
                      Last Updated: {new Date(deviceRequest.updated_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {isRequestOwner && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Actions</h3>
                  <div className="space-y-3">
                    <button
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => navigate(`/devices/edit-request/${id}`)}
                    >
                      Edit Request
                    </button>
                    {deviceRequest.status === 'open' && (
                      <button
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to close this request?')) {
                            // Implement close request logic
                            toast.success('Request closed successfully');
                          }
                        }}
                      >
                        Close Request
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!isRequestOwner && deviceRequest.status === 'open' && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Respond to this Request</h3>
                {isResponding ? (
                  <div>
                    <textarea
                      rows={4}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your response message..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsResponding(false)}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitResponse}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={respondMutation.isLoading}
                      >
                        {respondMutation.isLoading ? 'Submitting...' : 'Submit Response'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsResponding(true)}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    I Can Help
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-red-500">Request not found or you don't have permission to view it.</p>
            <button
              className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate('/devices/view-requests')}
            >
              Back to Requests
            </button>
          </div>
        )
      ) : (
        <RequestForm
          serviceType="device"
          onSubmit={handleCreateSubmit}
          onCancel={handleCancel}
          isLoading={createMutation.isLoading}
        />
      )}
    </div>
  );
};

export default DeviceRequestPage;
