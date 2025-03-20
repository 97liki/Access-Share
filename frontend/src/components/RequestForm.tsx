import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface FormValues {
  title: string;
  type: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  location: string;
  contact_info: string;
}

type ServiceType = 'blood' | 'device' | 'caregiver';

interface RequestFormProps {
  serviceType: ServiceType;
  onSubmit: (data: any) => Promise<any>;
  onSuccess?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const RequestForm = ({ 
  serviceType, 
  onSubmit, 
  onSuccess, 
  onCancel,
  isLoading = false 
}: RequestFormProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormValues>({
    title: '',
    type: '',
    description: '',
    urgency: 'medium',
    location: '',
    contact_info: ''
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});

  const typeOptions = {
    blood: [
      { value: 'A+', label: 'A+' },
      { value: 'A-', label: 'A-' },
      { value: 'B+', label: 'B+' },
      { value: 'B-', label: 'B-' },
      { value: 'AB+', label: 'AB+' },
      { value: 'AB-', label: 'AB-' },
      { value: 'O+', label: 'O+' },
      { value: 'O-', label: 'O-' },
    ],
    device: [
      { value: 'mobility', label: 'Mobility Aid' },
      { value: 'hearing', label: 'Hearing Aid' },
      { value: 'visual', label: 'Visual Aid' },
      { value: 'medical', label: 'Medical Equipment' },
      { value: 'other', label: 'Other' },
    ],
    caregiver: [
      { value: 'personal_care', label: 'Personal Care' },
      { value: 'medical_care', label: 'Medical Care' },
      { value: 'emotional_support', label: 'Emotional Support' },
      { value: 'transportation', label: 'Transportation' },
      { value: 'companionship', label: 'Companionship' },
      { value: 'housekeeping', label: 'Housekeeping' },
      { value: 'skilled_nursing', label: 'Skilled Nursing' },
      { value: 'therapy', label: 'Therapy' },
      { value: 'other', label: 'Other' },
    ]
  };

  const titleLabel = {
    blood: 'Blood Type',
    device: 'Device Name',
    caregiver: 'Service Title'
  };

  const typeLabel = {
    blood: 'Blood Type',
    device: 'Device Type',
    caregiver: 'Service Type'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormValues]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormValues> = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = 'This field is required';
      isValid = false;
    }

    if (!formData.type.trim()) {
      newErrors.type = 'This field is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'This field is required';
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = 'This field is required';
      isValid = false;
    }

    if (!formData.contact_info.trim()) {
      newErrors.contact_info = 'This field is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Transform the data based on service type
      let requestData = {};
      
      if (serviceType === 'blood') {
        requestData = {
          blood_type: formData.type,
          location: formData.location,
          urgency: formData.urgency,
          contact_number: formData.contact_info,
          notes: formData.description
        };
      } else if (serviceType === 'device') {
        requestData = {
          device_name: formData.title,
          device_type: formData.type,
          description: formData.description,
          urgency: formData.urgency,
          location: formData.location,
          contact_info: formData.contact_info
        };
      } else if (serviceType === 'caregiver') {
        requestData = {
          service_title: formData.title,
          service_type: formData.type,
          description: formData.description,
          urgency: formData.urgency,
          location: formData.location,
          contact_info: formData.contact_info
        };
      }
      
      await onSubmit(requestData);
      toast.success(`${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} request submitted successfully!`);
      
      // Reset form
      setFormData({
        title: '',
        type: '',
        description: '',
        urgency: 'medium',
        location: '',
        contact_info: ''
      });
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`${serviceType}-requests`] });
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(`Error submitting ${serviceType} request:`, error);
      toast.error(`Failed to submit request. Please try again.`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Request {serviceType === 'blood' ? 'Blood Donation' : serviceType === 'device' ? 'Assistive Device' : 'Caregiver Service'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            {titleLabel[serviceType]}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.title ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            {typeLabel[serviceType]}
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.type ? 'border-red-500' : ''}`}
            disabled={isLoading}
          >
            <option value="">Select {typeLabel[serviceType]}</option>
            {typeOptions[serviceType].map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.description ? 'border-red-500' : ''}`}
            disabled={isLoading}
            placeholder="Please describe your request in detail..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
            Urgency
          </label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isLoading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.location ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">
            Contact Information
          </label>
          <input
            type="text"
            id="contact_info"
            name="contact_info"
            value={formData.contact_info}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.contact_info ? 'border-red-500' : ''}`}
            disabled={isLoading}
            placeholder="Phone number or email"
          />
          {errors.contact_info && <p className="mt-1 text-sm text-red-600">{errors.contact_info}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm; 