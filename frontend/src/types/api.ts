// User Types
export interface User {
  id: number;
  email: string;
}

export interface UserProfile {
  preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
    blood_donation_reminders: boolean;
    device_request_notifications: boolean;
    caregiver_request_notifications: boolean;
  };
  activity_history: Activity[];
}

export interface Activity {
  id: number;
  type: 'blood_donation' | 'device_request' | 'caregiver_request';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

// Caregiver Types
export interface CaregiverListing {
  id: number;
  caregiver_id: number;
  service_type: ServiceType;
  experience_level: ExperienceLevel;
  location: string;
  hourly_rate: number;
  description: string;
  contact_info: string;
  availability_status: AvailabilityStatus;
  rating?: number;
  review_count?: number;
  caregiver: User;
  created_at: string;
  updated_at: string;
}

export enum ServiceType {
  PERSONAL_CARE = 'Personal Care',
  MEDICAL_CARE = 'Medical Care',
  EMOTIONAL_SUPPORT = 'Emotional Support',
  TRANSPORTATION = 'Transportation',
  COMPANIONSHIP = 'Companionship',
  HOUSEKEEPING = 'Housekeeping',
  SKILLED_NURSING = 'Skilled Nursing',
  THERAPY = 'Therapy',
  OTHER = 'Other'
}

export enum ExperienceLevel {
  ENTRY_LEVEL = 'Entry Level (0-2 years)',
  INTERMEDIATE = 'Intermediate (2-5 years)',
  EXPERIENCED = 'Experienced (5-10 years)',
  EXPERT = 'Expert (10+ years)'
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  BUSY = 'busy'
}

export interface CaregiverRequest {
  id: number;
  requester_id: number;
  listing_id: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
}

// Blood Donation Types
export interface BloodRequest {
  id: number;
  blood_type: string;
  units_needed: number;
  urgency: 'high' | 'medium' | 'low';
  location: string;
  notes?: string;
  user: User;
  created_at: string;
  updated_at: string;
}

// Assistive Device Types
export interface DeviceListing {
  id: number;
  device_type: string;
  title: string;
  description: string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  location: string;
  availability: 'available' | 'pending' | 'unavailable';
  user: User;
  created_at: string;
  updated_at: string;
}

export interface DeviceRequest {
  id: number;
  requester_id: number;
  listing_id: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
}

// Settings Types
export interface UserSettings {
  account: {
    email: string;
    phone: string;
    language: string;
    timezone: string;
  };
  privacy: {
    profile_visibility: 'public' | 'private' | 'friends';
    show_location: boolean;
    show_contact_info: boolean;
    show_activity_history: boolean;
  };
  notifications: {
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
    marketing_emails: boolean;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface CreateBloodRequestRequest {
  blood_type: string;
  units_needed: number;
  urgency: 'high' | 'medium' | 'low';
  location: string;
  notes?: string;
}

export interface CreateDeviceListingRequest {
  device_type: string;
  title: string;
  description: string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  location: string;
  availability: 'available' | 'pending' | 'unavailable';
}

export interface BloodDonation {
  id: number;
  user_id: number;
  blood_type: string;
  location: string;
  contact_number: string;
  available_until: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface AssistiveDevice {
  id: number;
  user_id: number;
  name: string;
  description: string;
  category: string;
  condition: string;
  location: string;
  contact_number: string;
  available_until: string;
  created_at: string;
  updated_at: string;
  user?: User;
}