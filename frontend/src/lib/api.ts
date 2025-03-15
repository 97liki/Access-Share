import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Blood Donation API endpoints
export const bloodDonationApi = {
  // Requests
  createRequest: async (data: any) => {
    const response = await api.post('/blood-donation/requests', data);
    return response.data;
  },
  getRequests: async () => {
    const response = await api.get('/blood-donation/requests');
    return response.data;
  },
  
  // Responses
  createResponse: async (data: any) => {
    const response = await api.post('/blood-donation/responses', data);
    return response.data;
  },
  getResponses: async () => {
    const response = await api.get('/blood-donation/responses');
    return response.data;
  },
}; 