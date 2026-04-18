import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';

const API_URL = 'https://doctomiback.onrender.com';

console.log('Using API URL:', API_URL);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = require('../store/authStore').useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      require('../store/authStore').useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// ── App APIs ──────────────────────────────────────────────────
export const authLogin = async (data: any) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const authSignup = async (data: any) => {
  const response = await api.post('/auth/signup', data);
  return response.data;
};

export const updatePatient = async (id: string, data: any) => {
  const response = await api.put(`/patients/${id}`, data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export interface BookAppointmentPayload {
  appointment_id: string;
  patient_id: string;
  patient_name: string;
  appointment_date: string;
  appointment_hour: number;
  specialty?: string;
  doctor_id?: string;
  patient_phone?: string;
  age?: number;
  distance_km?: number;
  prior_no_shows?: number;
  payment_type?: string;
  reminder_sent?: boolean;
  booked_date?: string;
}

export const bookAppointment = async (data: BookAppointmentPayload) => {
  const response = await axios.post('https://tarfkhobz.app.n8n.cloud/webhook/doctome-appointment', data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${require('../store/authStore').useAuthStore.getState().token || ''}`
    }
  });
  return response.data;
};

export const getDoctors = async (params?: Record<string, string>) => {
  const response = await api.get('/doctors', { params });
  return response.data;
};

export const getPatientAppointments = async (patientId: string) => {
  const response = await api.get('/appointments', { params: { patient_id: patientId } });
  return response.data;
};

export const getAppointmentById = async (id: string) => {
  const response = await api.get(`/appointments/${id}`);
  return response.data;
};

export const updateAppointment = async (id: string, data: any) => {
  const response = await api.put(`/appointments/${id}`, data);
  return response.data;
};

export const cancelAppointment = async (id: string) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};

export const getNotifications = async (userId: string, role?: string) => {
  const response = await api.get('/notifications', { params: { user_id: userId, role } });
  return response.data;
};

export const updateNotification = async (id: string, data: any) => {
  const response = await api.put(`/notifications/${id}`, data);
  return response.data;
};

export const clearNotifications = async (userId: string, role?: string) => {
  const response = await api.delete('/notifications', { params: { user_id: userId, role } });
  return response.data;
};
