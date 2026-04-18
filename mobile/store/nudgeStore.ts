import { create } from 'zustand';

interface NudgeState {
  activeAppointmentId: string | null;
  openNudge: (appointmentId: string) => void;
  closeNudge: () => void;
}

export const useNudgeStore = create<NudgeState>((set) => ({
  activeAppointmentId: null,
  openNudge: (appointmentId) => set({ activeAppointmentId: appointmentId }),
  closeNudge: () => set({ activeAppointmentId: null }),
}));
