import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Add request interceptor to ensure headers are properly set
axios.interceptors.request.use(
  config => {
    // Add X-User-Email header for authenticated requests
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail && config.headers) {
      config.headers['X-User-Email'] = userEmail;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common response patterns and errors
axios.interceptors.response.use(
  response => {
    // Successful responses
    return response;
  },
  error => {
    // Handle common error responses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      // Handle authentication errors
      if (error.response.status === 401) {
        // Optionally clear auth state on unauthorized
        // localStorage.removeItem('userEmail');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Setup:', error.message);
    }

    return Promise.reject(error);
  }
);

// Types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

interface User {
  id: number;
  email: string;
  username: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

interface BloodDonation {
  id: number;
  blood_type: string;
  location: string;
  contact_number: string;
  available_until: string;
  notes?: string;
}

interface CreateBloodRequestRequest {
  blood_type: string;
  location: string;
  contact_number: string;
  available_until: string;
  notes?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface DeviceListing {
  id: number;
  device_type: string;
  location: string;
  contact_number: string;
  available_until: string;
  notes?: string;
}

interface CreateDeviceListingRequest {
  device_type: string;
  location: string;
  contact_number: string;
  available_until: string;
  notes?: string;
}

interface CaregiverListing {
  id: number;
  service_type: string;
  experience_level: string;
  location: string;
  hourly_rate: number;
  description: string;
  contact_info: string;
}

interface CaregiverFilters {
  service_type?: string;
  experience_level?: string;
  location?: string;
  availability_status?: string;
  min_hourly_rate?: number;
  max_hourly_rate?: number;
}

// Auth API
export const authApi = {
  login: async (data: LoginData): Promise<User> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      
      // Ensure we handle the response correctly
      if (response.data && response.data.id && response.data.email) {
        localStorage.setItem('userEmail', response.data.email);
        return response.data;
      } else {
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Unexpected response from server');
      }
    } catch (error: any) {
      console.error('Login API error:', error);
      
      // Handle specific API error responses
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Incorrect password');
        } else if (error.response.status === 404) {
          throw new Error('User not found. Please register first.');
        } else if (error.response.data?.detail) {
          throw new Error(error.response.data.detail);
        }
      }
      
      // Generic error if nothing specific was caught
      throw new Error('Login failed. Please try again.');
    }
  },

  register: async (data: RegisterData): Promise<User> => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      
      // Ensure we handle the response correctly
      if (response.data && response.data.id && response.data.email) {
        localStorage.setItem('userEmail', response.data.email);
        return response.data;
      } else {
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Unexpected response from server');
      }
    } catch (error: any) {
      console.error('Register API error:', error);
      
      // Handle specific API error responses
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data?.detail?.includes('Email already registered')) {
            throw new Error('Email already registered. Please use a different email or login.');
          } else if (error.response.data?.detail?.includes('Username already taken')) {
            throw new Error('Username already taken. Please choose a different username.');
          } else if (error.response.data?.detail) {
            throw new Error(error.response.data.detail);
          }
        }
      }
      
      // Generic error if nothing specific was caught
      throw new Error('Registration failed. Please try again.');
    }
  },

  logout: () => {
    localStorage.removeItem('userEmail');
  },

  me: async (): Promise<User> => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      throw new Error('Not authenticated');
    }
    try {
      // Add the email to the headers for the backend to identify the user
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          'X-User-Email': userEmail
        }
      });
      
      // Ensure we handle the response correctly
      if (response.data && response.data.id && response.data.email) {
        return response.data;
      } else {
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Invalid user data received from server');
      }
    } catch (error: any) {
      console.error('Me API error:', error);
      
      // Handle specific API error responses
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 404) {
          localStorage.removeItem('userEmail');
          throw new Error('Authentication failed. Please login again.');
        } else if (error.response.data?.detail) {
          throw new Error(error.response.data.detail);
        }
      }
      
      // Generic error if nothing specific was caught
      throw new Error('Failed to fetch user data. Please try again.');
    }
  }
};

// Blood Donation API
export const bloodApi = {
  getBloodDonations: async (params?: { blood_type?: string; location?: string }): Promise<ApiResponse<PaginatedResponse<BloodDonation>>> => {
    const response = await axios.get(`${API_URL}/blood/requests`, {
      params,
    });
    return response.data;
  },

  createBloodDonation: async (data: CreateBloodRequestRequest): Promise<ApiResponse<BloodDonation>> => {
    const response = await axios.post(`${API_URL}/blood/requests`, data);
    return response.data;
  },

  respondToBloodDonation: async (data: { request_id: number; message?: string }): Promise<ApiResponse<void>> => {
    const response = await axios.post(`${API_URL}/blood/responses`, data);
    return response.data;
  },

  getBloodDonation: async (id: number): Promise<ApiResponse<BloodDonation>> => {
    const response = await axios.get(`${API_URL}/blood/requests/${id}`);
    return response.data;
  },

  updateBloodDonation: async (id: number, data: Partial<CreateBloodRequestRequest>): Promise<ApiResponse<BloodDonation>> => {
    const response = await axios.patch(`${API_URL}/blood/requests/${id}`, data);
    return response.data;
  },

  deleteBloodDonation: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${API_URL}/blood/requests/${id}`);
    return response.data;
  },
};

// Assistive Devices API
export const devicesApi = {
  getDevices: async (params?: { device_type?: string; location?: string }): Promise<ApiResponse<PaginatedResponse<DeviceListing>>> => {
    const response = await axios.get(`${API_URL}/assistive-devices/listings`, {
      params,
    });
    return response.data;
  },

  getDevice: async (id: number): Promise<ApiResponse<DeviceListing>> => {
    const response = await axios.get(`${API_URL}/devices/${id}`);
    return response.data;
  },

  createDevice: async (data: CreateDeviceListingRequest): Promise<ApiResponse<DeviceListing>> => {
    const response = await axios.post(`${API_URL}/assistive-devices/listings`, data);
    return response.data;
  },

  updateDevice: async (id: number, data: Partial<CreateDeviceListingRequest>): Promise<ApiResponse<DeviceListing>> => {
    const response = await axios.patch(`${API_URL}/assistive-devices/listings/${id}`, data);
    return response.data;
  },

  deleteDevice: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${API_URL}/assistive-devices/listings/${id}`);
    return response.data;
  },
};

// Caregivers API
export const caregiversApi = {
  getAll: async (filters?: CaregiverFilters): Promise<ApiResponse<PaginatedResponse<CaregiverListing>>> => {
    const response = await axios.get(`${API_URL}/caregivers`, {
      params: filters
    });
    return response.data;
  },

  getCaregiver: async (id: number): Promise<ApiResponse<CaregiverListing>> => {
    const response = await axios.get(`${API_URL}/caregivers/${id}`);
    return response.data;
  },

  createCaregiver: async (data: {
    service_type: string;
    experience_level: string;
    location: string;
    hourly_rate: number;
    description: string;
    contact_info: string;
  }): Promise<ApiResponse<CaregiverListing>> => {
    const response = await axios.post(`${API_URL}/caregivers`, data);
    return response.data;
  },

  updateCaregiver: async (id: number, data: Partial<CaregiverListing>): Promise<ApiResponse<CaregiverListing>> => {
    const response = await axios.put(`${API_URL}/caregivers/${id}`, data);
    return response.data;
  },

  deleteCaregiver: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${API_URL}/caregivers/${id}`);
    return response.data;
  },

  // Contact caregiver
  contactCaregiver: async (caregiverId: number, message: string): Promise<ApiResponse<void>> => {
    const response = await axios.post(`${API_URL}/caregivers/${caregiverId}/contact`, { message });
    return response.data;
  }
};