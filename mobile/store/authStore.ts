import { Alert } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authLogin, authSignup, updatePatient, getMe } from '../lib/api';

export const DEMO_CREDENTIALS = {
  username: 'demo_user',
  password: 'demo1234',
};

export const DEMO_REGISTER_CREDENTIALS = {
  username: 'new_user',
  password: 'newuser1234',
};

export type Gender = 'male' | 'female' | 'other' | 'preferNotToSay';

export interface PersonalData {
  fullName: string;
  age: string;
  gender: Gender | '';
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  height: string;
  weight: string;
  wilaya?: string;
  phone?: string;
  userId?: string;
  patientId?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  username: string;
  token: string | null;
  personalData: PersonalData | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  completeOnboarding: (personalData: PersonalData) => Promise<void>;
  updatePersonalData: (data: Partial<PersonalData>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      onboardingComplete: false,
      username: '',
      token: null,
      personalData: null,

      login: async (username, password) => {
        try {
          const data = await authLogin({ username: username.trim().toLowerCase(), password });
          
          const userObj = data.user || data; // handle both \{user: ...\} and flattened response structures

          const pData: PersonalData = {
            fullName: userObj.full_name || userObj.name || '',
            age: userObj.age ? String(userObj.age) : '',
            gender: userObj.gender || '',
            bloodType: userObj.blood_type || '',
            allergies: userObj.allergies || '',
            medicalConditions: userObj.medical_conditions || '',
            height: userObj.height_cm ? String(userObj.height_cm) : '',
            weight: userObj.weight_kg ? String(userObj.weight_kg) : '',
            wilaya: userObj.wilaya || '',
            phone: userObj.phone || userObj.patient_phone || '',
            userId: userObj.user_id || userObj._id || userObj.id,
            patientId: userObj.patient_id || userObj.user_id || userObj._id || userObj.id,
          };

          set({
            isAuthenticated: true,
            onboardingComplete: !!userObj.full_name,
            username: username.trim().toLowerCase(),
            token: data.token || userObj.token,
            personalData: pData,
          });
          return true;
        } catch (err: any) {
      console.error('Login error', err.response?.data || err.message);
      Alert.alert('Login Failed', err.response?.data?.message || err.message || 'Network error');
      return false;
    }
  },

  register: async (username, password) => {
    try {
      const data = await authSignup({
        username: username.trim().toLowerCase(),
        password,
        type: 'patient',
      });
      set({
        isAuthenticated: true,
        onboardingComplete: false,
        username: username.trim().toLowerCase(),
        token: data.token || data.user?.token,
        personalData: {
          fullName: data.user?.full_name || data.user?.name || '',
          age: '',
          gender: '',
          bloodType: '',
          allergies: '',
          medicalConditions: '',
          height: '',
          weight: '',
          wilaya: '',
          phone: '',
          userId: data.user?.user_id || data.user?._id || data.user?.id,
          patientId: data.user?.patient_id || data.user?.user_id || data.user?._id || data.user?.id,
        },
      });
      return true;
    } catch (err: any) {
      console.error('Register error', err.response?.data || err.message);
      Alert.alert(
        'Registration Failed',
        err.response?.data?.message || err.message || 'Network error'
      );
      return false;
    }
  },

  updatePersonalData: async (data) => {
    try {
      const state = get();
      const patientId = state.personalData?.patientId || state.personalData?.userId;
      if (patientId && state.token) {
        await updatePatient(patientId, {
          full_name: data.fullName,
          age: data.age ? Number(data.age) : undefined,
          gender: data.gender,
          blood_type: data.bloodType,
          allergies: data.allergies,
          medical_conditions: data.medicalConditions,
          height_cm: data.height ? Number(data.height) : undefined,
          weight_kg: data.weight ? Number(data.weight) : undefined,
          wilaya: data.wilaya,
          phone: data.phone,
          patient_phone: data.phone,
        });
      }
      set((state) => ({
        personalData: state.personalData ? { ...state.personalData, ...data } : null,
      }));
    } catch (err) {
      console.error('Update profile error', err);
      // Optimistically update anyway
      set((state) => ({
        personalData: state.personalData ? { ...state.personalData, ...data } : null,
      }));
    }
  },

  completeOnboarding: async (personalData) => {
    try {
      const state = get();
      const patientId = state.personalData?.patientId || state.personalData?.userId;
      if (patientId && state.token) {
        await updatePatient(patientId, {
          full_name: personalData.fullName,
          age: Number(personalData.age) || undefined,
          gender: personalData.gender,
          blood_type: personalData.bloodType,
          allergies: personalData.allergies,
          medical_conditions: personalData.medicalConditions,
          height_cm: Number(personalData.height) || undefined,
          weight_kg: Number(personalData.weight) || undefined,
          wilaya: personalData.wilaya,
          phone: personalData.phone,
          patient_phone: personalData.phone,
        });
      }
      set({
        onboardingComplete: true,
        personalData,
      });
    } catch (err) {
      console.error('Onboarding error', err);
      set({
        onboardingComplete: true,
        personalData,
      });
    }
  },

  refreshProfile: async () => {
    try {
      const data = await getMe();
      if (data && data.user) {
        const userObj = data.user;
        const pData: PersonalData = {
          fullName: userObj.full_name || userObj.name || '',
          age: userObj.age ? String(userObj.age) : '',
          gender: userObj.gender || '',
          bloodType: userObj.blood_type || '',
          allergies: userObj.allergies || '',
          medicalConditions: userObj.medical_conditions || '',
          height: userObj.height_cm ? String(userObj.height_cm) : '',
          weight: userObj.weight_kg ? String(userObj.weight_kg) : '',
          wilaya: userObj.wilaya || '',
          phone: userObj.phone || userObj.patient_phone || '',
          userId: userObj.user_id || userObj._id || userObj.id,
          patientId: userObj.patient_id || userObj.user_id || userObj._id || userObj.id,
        };
        set({ personalData: pData });
      }
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  },

      logout: () =>
        set({
          isAuthenticated: false,
          onboardingComplete: false,
          username: '',
          token: null,
          personalData: null,
        }),
    }),
    {
      name: 'auth-storage', // name of the item in local storage
      storage: createJSONStorage(() => AsyncStorage), // use react-native-async-storage
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        isAuthenticated: false,
      }),
      partialize: (state) => ({
        ...state,
        isAuthenticated: false, // Ensure they must log in EVERY TIME they open the app cold
      }),
    }
  )
);
