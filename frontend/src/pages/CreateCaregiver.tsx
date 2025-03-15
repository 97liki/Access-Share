import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { caregiversApi } from '../services/api';
import { CaregiverListing, ServiceType, ExperienceLevel } from '../types/api';

const serviceTypes = [
  { id: ServiceType.PERSONAL_CARE, name: 'Personal Care' },
  { id: ServiceType.MEDICAL_CARE, name: 'Medical Care' },
  { id: ServiceType.EMOTIONAL_SUPPORT, name: 'Emotional Support' },
  { id: ServiceType.TRANSPORTATION, name: 'Transportation' },
  { id: ServiceType.OTHER, name: 'Other' },
];

const experienceLevels = [
  { id: ExperienceLevel.ENTRY_LEVEL, name: 'Entry Level (0-2 years)' },
  { id: ExperienceLevel.INTERMEDIATE, name: 'Intermediate (2-5 years)' },
  { id: ExperienceLevel.EXPERIENCED, name: 'Experienced (5-10 years)' },
  { id: ExperienceLevel.EXPERT, name: 'Expert (10+ years)' },
];

export default function CreateCaregiver() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<CaregiverListing>>({
    service_type: ServiceType.PERSONAL_CARE,
    experience_level: ExperienceLevel.ENTRY_LEVEL,
    location: '',
    hourly_rate: 0,
    description: '',
    contact_info: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      service_type: string;
      experience_level: string;
      location: string;
      hourly_rate: number;
      description: string;
      contact_info: string;
      availability_status?: string;
    }) => caregiversApi.createCaregiver(data),
    onSuccess: () => {
      toast.success('Caregiver profile created successfully!');
      navigate('/caregivers');
    },
    onError: (error: any) => {
      console.error('Caregiver creation error:', error);
      
      // Handle our new error format with friendly messages
      if (error.isServerError) {
        toast.error(error.message || 'A server error occurred. Please try again later.');
      } else if (error.isNetworkError) {
        toast.error(error.message || 'Network error. Please check your connection and try again.');
      } else if (error.response?.status === 401) {
        toast.error('You must be logged in to register as a caregiver. Please sign in.');
        navigate('/login');
      } else if (error.response?.status === 422) {
        toast.error('Please check your form data and try again.');
      } else {
        toast.error(error.message || 'Failed to create caregiver profile. Please try again.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contact_info) {
      toast.error('Contact information is required');
      return;
    }
    createMutation.mutate(formData as {
      service_type: string;
      experience_level: string;
      location: string;
      hourly_rate: number;
      description: string;
      contact_info: string;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourly_rate' ? parseFloat(value) : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create Caregiver Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">
                Service Type
              </label>
              <select
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select a service type</option>
                {serviceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">
                Experience Level
              </label>
              <select
                id="experience_level"
                name="experience_level"
                value={formData.experience_level}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select experience level</option>
                {experienceLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., San Francisco, CA"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">
                Contact Information
              </label>
              <input
                type="text"
                id="contact_info"
                name="contact_info"
                value={formData.contact_info || ''}
                onChange={handleInputChange}
                required
                placeholder="e.g., Phone number or email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                id="hourly_rate"
                name="hourly_rate"
                value={formData.hourly_rate || ''}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 25.00"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Describe your experience, qualifications, and the services you provide..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/caregivers')}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
