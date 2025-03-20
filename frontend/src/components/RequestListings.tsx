import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

type ServiceType = 'blood' | 'device' | 'caregiver';

interface Request {
  id: number;
  requester_id: number;
  title?: string;
  device_name?: string;
  service_title?: string;
  blood_type?: string;
  device_type?: string;
  service_type?: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  location: string;
  contact_info?: string;
  contact_number?: string;
  status: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    email: string;
    full_name?: string;
  };
}

interface RequestListingsProps {
  serviceType: ServiceType;
  fetchRequests: (filters: any) => Promise<Request[]>;
  onRespond?: (request: Request) => void;
  isMyRequests?: boolean;
}

const RequestListings = ({ 
  serviceType, 
  fetchRequests,
  onRespond,
  isMyRequests = false
}: RequestListingsProps) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    urgency: '',
    status: '',
    is_mine: isMyRequests ? 'true' : '',
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const { data: requests, isLoading, isError } = useQuery({
    queryKey: [`${serviceType}-requests`, filters],
    queryFn: () => fetchRequests(filters),
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRespond = (request: Request) => {
    if (onRespond) {
      onRespond(request);
    } else {
      toast.error('Response functionality not implemented yet');
    }
  };

  const getTitle = (request: Request): string => {
    if (serviceType === 'blood' && request.blood_type) {
      return `Blood Type ${request.blood_type}`;
    } else if (serviceType === 'device' && request.device_name) {
      return request.device_name;
    } else if (serviceType === 'caregiver' && request.service_title) {
      return request.service_title;
    } else {
      return `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Request`;
    }
  };

  const getType = (request: Request): string => {
    if (serviceType === 'blood' && request.blood_type) {
      return request.blood_type;
    } else if (serviceType === 'device' && request.device_type) {
      return request.device_type;
    } else if (serviceType === 'caregiver' && request.service_type) {
      return request.service_type;
    } else {
      return 'Unknown';
    }
  };

  const getContact = (request: Request): string => {
    return request.contact_info || request.contact_number || 'Contact not provided';
  };
  
  const getUrgencyClass = (urgency: string): string => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled':
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormattedDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const filteredRequests = requests?.filter(request => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const title = getTitle(request).toLowerCase();
    const type = getType(request).toLowerCase();
    const location = request.location.toLowerCase();
    const description = request.description.toLowerCase();
    
    return (
      title.includes(searchLower) ||
      type.includes(searchLower) ||
      location.includes(searchLower) ||
      description.includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Failed to load requests. Please try again later.</p>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isMyRequests ? 'My' : 'Available'} {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Requests
      </h2>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {serviceType === 'blood' && (
                <>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </>
              )}
              {serviceType === 'device' && (
                <>
                  <option value="mobility">Mobility Aid</option>
                  <option value="hearing">Hearing Aid</option>
                  <option value="visual">Visual Aid</option>
                  <option value="medical">Medical Equipment</option>
                  <option value="other">Other</option>
                </>
              )}
              {serviceType === 'caregiver' && (
                <>
                  <option value="personal_care">Personal Care</option>
                  <option value="medical_care">Medical Care</option>
                  <option value="emotional_support">Emotional Support</option>
                  <option value="transportation">Transportation</option>
                  <option value="companionship">Companionship</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="skilled_nursing">Skilled Nursing</option>
                  <option value="therapy">Therapy</option>
                  <option value="other">Other</option>
                </>
              )}
            </select>
          </div>
          
          <div>
            <select
              name="urgency"
              value={filters.urgency}
              onChange={handleFilterChange}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Urgency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredRequests && filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map(request => (
            <div key={request.id} className="border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{getTitle(request)}</h3>
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyClass(request.urgency)}`}>
                      {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-2">Type: {getType(request)}</p>
                <p className="text-sm text-gray-500 mb-2">Location: {request.location}</p>
                <p className="text-sm text-gray-500 mb-4">Posted: {getFormattedDate(request.created_at)}</p>
                
                <div className="border-t border-gray-200 my-3"></div>
                
                <p className="text-sm text-gray-700 mb-4">{request.description}</p>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Contact: {getContact(request)}
                  </div>
                  
                  {!isMyRequests && request.status.toLowerCase() === 'open' && request.requester_id !== user?.id && (
                    <button
                      onClick={() => handleRespond(request)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Respond
                    </button>
                  )}
                  
                  {isMyRequests && (
                    <Link
                      to={`/${serviceType === 'blood' ? 'blood-donation' : serviceType === 'device' ? 'devices' : 'caregivers'}/requests/${request.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No requests found.</p>
          <Link
            to={`/${serviceType === 'blood' ? 'blood-donation' : serviceType === 'device' ? 'devices' : 'caregivers'}/make-request`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Make a Request
          </Link>
        </div>
      )}
    </div>
  );
};

export default RequestListings; 