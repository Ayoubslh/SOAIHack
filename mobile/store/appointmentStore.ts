import { create } from 'zustand';
import type { VisitTypeKey } from '../components/scheduling/data';

export interface Appointment {
  id: string;
  specialist: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  riskScore: number; // 0 to 100
  visitTypeKey?: VisitTypeKey;
  visitType?: string;
  patientNotes?: string;
}

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [
    {
      id: '1',
      specialist: 'Dr. Sarah Wilson',
      specialty: 'Cardiologist',
      date: '2026-04-18',
      time: '10:00 AM',
      status: 'upcoming',
      riskScore: 15,
      visitTypeKey: 'consultation',
      patientNotes: 'Experiencing mild chest pain during workouts.',
    },
    {
      id: '2',
      specialist: 'Dr. James Miller',
      specialty: 'Dermatologist',
      date: '2026-04-22',
      time: '02:30 PM',
      status: 'upcoming',
      riskScore: 45,
      visitTypeKey: 'followUp',
      patientNotes: 'Checking progress on the new eczema cream.',
    },
  ],
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [
        ...state.appointments,
        { ...appointment, id: Math.random().toString(36).substring(7) },
      ],
    })),
  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((app) => (app.id === id ? { ...app, ...updates } : app)),
    })),
  cancelAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.map((app) =>
        app.id === id ? { ...app, status: 'cancelled' } : app
      ),
    })),
  rescheduleAppointment: (id, newDate, newTime) =>
    set((state) => ({
      appointments: state.appointments.map((app) =>
        app.id === id
          ? { ...app, date: newDate, time: newTime, status: 'upcoming', riskScore: 5 }
          : app
      ),
    })),
}));
