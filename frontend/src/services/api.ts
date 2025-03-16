import axios, { AxiosRequestHeaders } from 'axios';
import { User as UserType, RegisterRequest } from '../types/api';

// Type definitions
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

// API response types
interface User extends UserType {
  username: string;
}

// Ensure API URL is correct - check if you're running in development or production
const API_URL = 'http://localhost:8000/api/v1';

console.log('API: Using base URL:', API_URL);

// Configure axios defaults
axios.defaults.withCredentials = true;

// Add more detailed logging for debugging
axios.interceptors.request.use(
  config => {
    console.log(`API: Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    
    // Add X-User-Email header for authenticated requests
    const userEmail = localStorage.getItem('userEmail');
    console.log('API: Current userEmail in localStorage:', userEmail);
    
    // Ensure headers object exists and is the correct type
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }
    
    if (userEmail) {
      config.headers['X-User-Email'] = userEmail;
      console.log('API: Added X-User-Email header:', userEmail);
    } else {
      console.log('API: No userEmail found in localStorage, skipping header');
    }
    
    // Log final headers for debugging
    console.log('API: Final request headers:', config.headers);
    
    if (config.data) {
      console.log('API: Request payload:', config.data);
    }
    
    return config;
  },
  error => {
    console.error('API: Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common response patterns and errors
axios.interceptors.response.use(
  response => {
    // Log successful response
    console.log(`API: Successful response from ${response.config.url}:`, response.status);
    
    // For login/auth endpoints, don't transform the response at all
    if (response.config.url?.includes('/auth/')) {
      console.log('API: Auth endpoint detected, preserving original response format');
      return response;
    }
    
    // For successful responses, transform if needed
    if (response.data && typeof response.data === 'object') {
      // If the API doesn't follow our standard response format, normalize it
      if (response.data.success === undefined) {
        console.log('API: Normalizing response to standard format');
        const originalData = response.data;
        response.data = {
          success: true,
          message: 'Success',
          data: originalData
        };
      }
    }
    return response;
  },
  error => {
    // Handle common error responses
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url
      });

      // Handle authentication errors - but don't redirect automatically
      // Let the components handle redirection
      if (error.response.status === 401) {
        console.error('Authentication error');
        // Don't clear userEmail here - let the components handle auth state
        // Don't redirect here - let the components handle redirection
      } else if (error.response.status === 422) {
        console.error('Validation error:', error.response.data);
        // Log specific validation errors if available
        if (error.response.data && error.response.data.detail) {
          console.error('Validation details:', error.response.data.detail);
        }
      } else if (error.response.status === 404) {
        console.error('Resource not found:', error.response.data);
      } else if (error.response.status >= 500) {
        console.error('Server error:', error.response.data);
        
        // Return a more user-friendly error object for 500 errors
        return Promise.reject({
          message: 'A server error occurred. This might be due to recent changes in the database. Please try again later or contact support.',
          originalError: error,
          isServerError: true
        });
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request (no response):', error.request);
      // Network errors should be handled by the components
      
      // Return a more user-friendly error object for network errors
      return Promise.reject({
        message: 'Network error. Please check your internet connection and try again.',
        originalError: error,
        isNetworkError: true
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Setup:', error.message);
      
      // Return a more user-friendly error for setup errors
      return Promise.reject({
        message: 'An error occurred while preparing your request. Please try again.',
        originalError: error
      });
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

interface BloodDonation {
  id: number;
  blood_type: string;
  location: string;
  urgency: string;
  contact_number: string;
  notes?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface CreateBloodRequestRequest {
  blood_type: string;
  location: string;
  urgency: 'high' | 'medium' | 'low';
  contact_number: string;
  notes?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  items: T[];
}

interface DeviceListing {
  id: number;
  device_name: string;
  device_type: string;
  condition: string;
  description: string;
  location: string;
  contact_info: string;
  available: string;
  donor_id: number;
  created_at: string;
  updated_at: string;
}

interface CreateDeviceListingRequest {
  device_name: string;
  device_type: string;
  condition: string;
  description: string;
  location: string;
  contact_info: string;
}

interface CaregiverListing {
  id: number;
  service_type: string;
  experience_level: string;
  location: string;
  hourly_rate: number;
  description: string;
  contact_info: string;
  availability_status: string;
  caregiver_id: number;
  rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
  caregiver?: {
    id: number;
    email: string;
    full_name: string;
    role: string;
    phone_number?: string;
    location?: string;
    profile_picture?: string;
    bio?: string;
  };
}

interface CaregiverFilters {
  service_type?: string;
  experience_level?: string;
  location?: string;
  availability_status?: string;
  min_hourly_rate?: number;
  max_hourly_rate?: number;
  search?: string;
  skip?: number;
  limit?: number;
}

// Auth API
export const authApi = {
  login: async (data: LoginData): Promise<User> => {
    try {
      console.log('API: Attempting login API call to', `${API_URL}/auth/login`);
      console.log('API: Login request payload:', JSON.stringify(data));
      
      const response = await axios.post(`${API_URL}/auth/login`, data);
      console.log('API: Login HTTP status:', response.status);
      console.log('API: Login raw response:', response);
      
      // The API is returning the user data directly without wrapping it in a data property
      const userData = response.data;
      console.log('API: Login user data:', userData);
      
      // Ensure we handle the response correctly - check for direct user properties
      if (userData && userData.email) {
        // Clear any existing values first
        localStorage.removeItem('userEmail');
        // Save auth state to localStorage
        localStorage.setItem('userEmail', userData.email);
        console.log('API: User email saved to localStorage:', userData.email);
        console.log('API: Verifying localStorage value:', localStorage.getItem('userEmail'));
        return userData; // Return the unwrapped user data directly
      } else {
        console.error('API: Unexpected API response structure:', userData);
        throw new Error('Unexpected response from server');
      }
    } catch (error: any) {
      console.error('API: Login API error details:', error);
      
      if (error.request && !error.response) {
        console.error('API: Network error - no response received');
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      // Handle specific API error responses
      if (error.response) {
        console.error('API: Error response status:', error.response.status);
        console.error('API: Error response data:', error.response.data);
        
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
      console.log('API: Attempting registration:', JSON.stringify(data));
      
      // Ensure data has username field (default to email username part if not provided)
      if (!data.username && data.email) {
        data.username = data.email.split('@')[0];
        console.log('API: Generated username from email:', data.username);
      }
      
      const response = await axios.post(`${API_URL}/auth/register`, data);
      console.log('API: Registration response:', response.data);
      
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
        console.error('API: Error response status:', error.response.status);
        console.error('API: Error response data:', error.response.data);
        
        if (error.response.status === 400) {
          if (error.response.data?.detail?.includes('Email already registered')) {
            throw new Error('Email already registered. Please use a different email or login.');
          } else if (error.response.data?.detail?.includes('Username already taken')) {
            throw new Error('Username already taken. Please choose a different username.');
          } else if (error.response.data?.detail) {
            throw new Error(error.response.data.detail);
          }
        } else if (error.response.data?.detail) {
          throw new Error(error.response.data.detail);
        }
      }
      
      // Generic error if nothing specific was caught
      throw new Error('Registration failed. Please try again.');
    }
  },

  logout: () => {
    localStorage.removeItem('userEmail');
  },

  deleteAccount: async (): Promise<{ success: boolean; message: string }> => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      throw new Error('Not authenticated');
    }
    
    try {
      const response = await axios.delete(`${API_URL}/auth/delete-account`, {
        headers: {
          'X-User-Email': userEmail
        }
      });
      
      // Clear user data from localStorage after successful deletion
      localStorage.removeItem('userEmail');
      
      return {
        success: true,
        message: response.data?.message || 'Account successfully deleted'
      };
    } catch (error: any) {
      console.error('Delete account error:', error);
      
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      
      throw new Error('Failed to delete account. Please try again.');
    }
  },

  me: async (): Promise<User> => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error('API: No userEmail found in localStorage');
      throw new Error('Not authenticated');
    }
    
    try {
      console.log('API: Checking authentication with backend using email:', userEmail);
      
      // Make the request with explicit headers
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          'X-User-Email': userEmail
        }
      });
      
      console.log('API: Auth check response:', response.data);
      
      // Ensure we handle the response correctly
      if (response.data && response.data.email) {
        console.log('API: Successfully authenticated user:', response.data.email);
        return response.data;
      } else {
        console.error('API: Unexpected API response structure:', response.data);
        throw new Error('Invalid user data received from server');
      }
    } catch (error: any) {
      console.error('API: Me API error:', error);
      
      if (error.request && !error.response) {
        console.error('API: Network error during auth check - no response received');
        throw new Error('Network error during authentication check');
      }
      
      // Handle specific API error responses
      if (error.response) {
        console.error('API: Auth check error status:', error.response.status);
        console.error('API: Auth check error data:', error.response.data);
        
        if (error.response.status === 422) {
          console.error('API: Unprocessable Entity - likely missing required authentication data');
          localStorage.removeItem('userEmail');
          throw new Error('Authentication format not accepted. Please login again.');
        } else if (error.response.status === 401 || error.response.status === 404) {
          localStorage.removeItem('userEmail');
          throw new Error('Authentication failed. Please login again.');
        } else if (error.response.data?.detail) {
          throw new Error(error.response.data.detail);
        }
      }
      
      // Generic error if nothing specific was caught
      localStorage.removeItem('userEmail'); // Clear invalid auth data
      throw new Error('Failed to fetch user data. Please login again.');
    }
  }
};

// Blood Donation API
export const bloodApi = {
  getBloodDonations: async (params?: { blood_type?: string; location?: string }): Promise<ApiResponse<PaginatedResponse<BloodDonation>>> => {
    try {
      // Add default pagination parameters
      const queryParams = {
        skip: 0,
        limit: 100,
        ...params
      };
      
      const response = await axios.get(`${API_URL}/blood-donation/requests`, {
        params: queryParams,
        headers: {
          'X-User-Email': localStorage.getItem('userEmail') || ''
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blood donations:', error);
      return {
        success: false,
        message: 'Failed to fetch blood donations',
        data: null
      };
    }
  },

  createBloodDonation: async (data: CreateBloodRequestRequest): Promise<ApiResponse<BloodDonation>> => {
    const response = await axios.post(`${API_URL}/blood-donation/requests`, {
      ...data,
      urgency: data.urgency || 'medium'
    }, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },

  respondToBloodDonation: async (data: { request_id: number; message?: string }): Promise<ApiResponse<void>> => {
    const response = await axios.post(`${API_URL}/blood-donation/responses`, data, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },

  getBloodDonation: async (id: number): Promise<ApiResponse<BloodDonation>> => {
    const response = await axios.get(`${API_URL}/blood-donation/requests/${id}`, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },

  updateBloodDonation: async (id: number, data: Partial<CreateBloodRequestRequest>): Promise<ApiResponse<BloodDonation>> => {
    const response = await axios.patch(`${API_URL}/blood-donation/requests/${id}`, data, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },

  deleteBloodDonation: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${API_URL}/blood-donation/requests/${id}`, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },
};

// Assistive Devices API
export const devicesApi = {
  getDevices: async (params?: { device_type?: string; location?: string }): Promise<ApiResponse<PaginatedResponse<DeviceListing>>> => {
    try {
      // Add default pagination parameters
      const queryParams = {
        skip: 0,
        limit: 100,
        ...params
      };
      
      const response = await axios.get(`${API_URL}/devices/listings`, {
        params: queryParams,
        headers: {
          'X-User-Email': localStorage.getItem('userEmail') || ''
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching devices:', error);
      return {
        success: false,
        message: 'Failed to fetch devices',
        data: null
      };
    }
  },

  getDevice: async (id: number): Promise<ApiResponse<DeviceListing>> => {
    const response = await axios.get(`${API_URL}/devices/listings/${id}`, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },

  createDevice: async (data: CreateDeviceListingRequest): Promise<ApiResponse<DeviceListing>> => {
    const response = await axios.post(`${API_URL}/devices/listings`, data, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },

  updateDevice: async (id: number, data: Partial<CreateDeviceListingRequest>): Promise<ApiResponse<DeviceListing>> => {
    const response = await axios.patch(`${API_URL}/devices/listings/${id}`, data, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },

  deleteDevice: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${API_URL}/devices/listings/${id}`, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },
};

// Caregivers API
export const caregiversApi = {
  getAll: async (filters?: CaregiverFilters): Promise<ApiResponse<PaginatedResponse<CaregiverListing>>> => {
    try {
      // Add default pagination parameters
      const queryParams = {
        skip: 0,
        limit: 100,
        ...filters
      };
      
      const response = await axios.get(`${API_URL}/caregivers/listings`, {
        params: queryParams,
        headers: {
          'X-User-Email': localStorage.getItem('userEmail') || ''
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching caregivers:', error);
      return {
        success: false,
        message: 'Failed to fetch caregivers',
        data: null
      };
    }
  },

  getCaregiver: async (id: number): Promise<ApiResponse<CaregiverListing>> => {
    const response = await axios.get(`${API_URL}/caregivers/listings/${id}`, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },

  createCaregiver: async (data: {
    service_type: string;
    experience_level: string;
    location: string;
    hourly_rate: number;
    description: string;
    contact_info: string;
    availability_status?: string;
  }): Promise<ApiResponse<CaregiverListing>> => {
    const response = await axios.post(`${API_URL}/caregivers/listings`, data, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },

  updateCaregiver: async (id: number, data: Partial<CaregiverListing>): Promise<ApiResponse<CaregiverListing>> => {
    const response = await axios.put(`${API_URL}/caregivers/listings/${id}`, data, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },

  deleteCaregiver: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${API_URL}/caregivers/listings/${id}`, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  },

  // Contact caregiver
  contactCaregiver: async (caregiverId: number, message: string): Promise<ApiResponse<void>> => {
    const response = await axios.post(`${API_URL}/caregivers/listings/${caregiverId}/contact`, { message }, {
      headers: {
        'X-User-Email': localStorage.getItem('userEmail') || ''
      }
    });
    return response.data;
  }
};