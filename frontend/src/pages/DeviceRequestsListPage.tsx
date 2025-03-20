import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { devicesApi } from '../services/api';
import RequestListings from '../components/RequestListings';
import { toast } from 'react-hot-toast';

const DeviceRequestsListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  // Check if viewing my requests or all requests
  const isMyRequests = location.pathname.includes('/my-requests');
  
  const fetchDeviceRequests = async (filters: any) => {
    try {
      // Transform filters if needed
      const apiFilters = {
        ...filters,
        device_type: filters.type || undefined,
      };
      
      return await devicesApi.getDeviceRequests(apiFilters);
    } catch (error) {
      console.error('Error fetching device requests:', error);
      toast.error('Failed to load device requests. Please try again.');
      return [];
    }
  };
  
  const handleRespond = (request: any) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };
  
  const handleCreateRequest = () => {
    navigate('/devices/make-request');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isMyRequests ? 'My Device Requests' : 'Device Requests'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isMyRequests 
              ? 'View and manage your device requests' 
              : 'Browse device requests from people in need'}
          </p>
        </div>
        
        <div className="flex space-x-4">
          {!isMyRequests && (
            <button
              onClick={() => navigate('/devices/my-requests')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View My Requests
            </button>
          )}
          
          <button
            onClick={handleCreateRequest}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Request
          </button>
        </div>
      </div>
      
      <RequestListings
        serviceType="device"
        fetchRequests={fetchDeviceRequests}
        onRespond={handleRespond}
        isMyRequests={isMyRequests}
      />
      
      {/* Response Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Respond to Request</h2>
            <p className="mb-2 text-gray-700">
              <span className="font-medium">Device:</span> {selectedRequest.device_name}
            </p>
            <p className="mb-4 text-gray-700">
              <span className="font-medium">Type:</span> {selectedRequest.device_type}
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission
              setIsModalOpen(false);
              toast.success('Response submitted successfully!');
            }}>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Explain how you can help with this request..."
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceRequestsListPage; 