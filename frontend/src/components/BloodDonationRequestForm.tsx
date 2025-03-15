import React from 'react';
import { useForm } from 'react-hook-form';
import { bloodDonationApi } from '../lib/api';

interface BloodDonationRequestFormData {
  blood_type: string;
  units_needed: number;
  urgency_level: string;
  location: string;
  description?: string;
}

export const BloodDonationRequestForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BloodDonationRequestFormData>();

  const onSubmit = async (data: BloodDonationRequestFormData) => {
    try {
      await bloodDonationApi.createRequest(data);
      reset();
      alert('Blood donation request created successfully!');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create blood donation request');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Blood Type</label>
        <select
          {...register('blood_type', { required: 'Blood type is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
        {errors.blood_type && <p className="text-red-500 text-sm">{errors.blood_type.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Units Needed</label>
        <input
          type="number"
          {...register('units_needed', { required: 'Units needed is required', min: 1 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.units_needed && <p className="text-red-500 text-sm">{errors.units_needed.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Urgency Level</label>
        <select
          {...register('urgency_level', { required: 'Urgency level is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select urgency level</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        {errors.urgency_level && <p className="text-red-500 text-sm">{errors.urgency_level.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          {...register('location', { required: 'Location is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Request
      </button>
    </form>
  );
}; 