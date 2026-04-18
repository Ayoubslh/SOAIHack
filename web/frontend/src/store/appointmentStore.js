import { create } from "zustand";

export const useAppointmentStore = create((set) => ({
  appointments: [],
  selectedAppointment: null,
  setAppointments: (appointments) => set({ appointments }),
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),
  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment._id === id ? { ...appointment, ...updates } : appointment
      ),
    })),
  setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),
  clearSelectedAppointment: () => set({ selectedAppointment: null }),
}));
