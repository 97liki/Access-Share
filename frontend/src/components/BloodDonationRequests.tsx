import React, { useEffect, useState } from 'react';
import { bloodDonationApi } from '../lib/api';

interface BloodDonationRequest {
  id: number;
  blood_type: string;
  units_needed: number;
  urgency_level: string;
  location: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const BloodDonationRequests: React.FC = () => {
  const [requests, setRequests] = useState<BloodDonationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await bloodDonationApi.getRequests();
        setRequests(data);
      } catch (err) {
        setError('Failed to fetch blood donation requests');
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Blood Donation Requests</h2>
      <div className="grid gap-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  Blood Type: {request.blood_type}
                </h3>
                <p className="text-gray-600">
                  Units Needed: {request.units_needed}
                </p>
                <p className="text-gray-600">
                  Urgency: <span className={`font-semibold ${
                    request.urgency_level === 'high' ? 'text-red-500' :
                    request.urgency_level === 'medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>{request.urgency_level}</span>
                </p>
                <p className="text-gray-600">Location: {request.location}</p>
                {request.description && (
                  <p className="text-gray-600 mt-2">{request.description}</p>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Posted: {new Date(request.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 