import axios from 'axios';
import { ApiResponse, User } from '../types/api';

const API_URL = 'http://localhost:8000/api/v1';

export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error. Please try again.');
    }
  },

  register: async (data: {
    email: string;
    password: string;
    full_name: string;
  }): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Network error. Please try again.');
    }
  },

  updateRole: async (roleType: 'donor' | 'recipient' | 'caregiver', userEmail: string): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/update-role`,
        { role_type: roleType },
        {
          headers: {
            'X-User-Email': userEmail,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update role',
        data: null,
      };
    }
  },

  logout: () => {
    localStorage.removeItem('userEmail');
  },
};
