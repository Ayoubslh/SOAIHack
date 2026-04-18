import { useState, useMemo } from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '../lib/i18n';

import { useAppointmentStore, type Appointment } from '../store/appointmentStore';
import { updateAppointment } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { AppointmentSummaryCard } from '../components/scheduling/AppointmentSummaryCard';
import { CalendarPicker } from '../components/scheduling/CalendarPicker';
import { TimeDropdown } from '../components/scheduling/TimeDropdown';
import {
  WEEKDAYS,
  buildCalendar,
  getAvailableTimes,
  type CalendarDay,
} from '../components/scheduling/data';

export default function RebookRoute() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.personalData?.userId);

  const { appointmentId } = useLocalSearchParams<{ appointmentId?: string }>();

  // Attempt to find the appointment from the react-query cache
  const appointment = useMemo(() => {
    if (!userId || !appointmentId) return undefined;
    const cache = queryClient.getQueryData<any[]>(['appointments', userId]);
    if (!cache) return undefined;
    
    const rawApp = cache.find((app) => (app.appointment_id || app._id) === appointmentId);
    if (!rawApp) return undefined;

    return {
      id: rawApp.appointment_id || rawApp._id,
      specialist: rawApp.doctor_name || 'Dr. Specialist',
      specialty: rawApp.specialty || 'General',
      date: rawApp.appointment_date,
      time: rawApp.appointment_hour,
      status: rawApp.status || 'upcoming',
      riskScore: 15,
      visitType: 'Consultation',
      patientNotes: rawApp.patient_notes || '',
    } as Appointment;
  }, [userId, appointmentId, queryClient]);

  const [selectedDate, setSelectedDate] = useState<CalendarDay | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [timeMenuOpen, setTimeMenuOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const canConfirm =  !!selectedDate && !!selectedTime;

  if (!appointment) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Stack.Screen options={{ title: 'Rebook' }} />
        <Text className="text-lg font-bold text-dark">{t('appointmentNotFound')}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 rounded-[16px] bg-primary px-5 py-3">
          <Text className="font-bold text-white">{t('goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleConfirm = async () => {
    if (!canConfirm || !selectedDate || !userId) return;

    try {
      setIsRescheduling(true);
      const isPM = selectedTime.toLowerCase().includes('pm');
      let hourNum = parseInt(selectedTime.split(':')[0], 10);
      if (isPM && hourNum !== 12) hourNum += 12;
      if (!isPM && hourNum === 12) hourNum = 0;

      // Update via userId as per backend /:id route implementation for patients
      await updateAppointment(userId, {
        appointment_date: selectedDate.dateString,
        appointment_hour: hourNum,
      });

      queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
      router.replace('/(tabs)/appointments');
    } catch (error: any) {
      console.error('Failed to reschedule:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to reschedule appointment.');
    } finally {
      setIsRescheduling(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background px-5 pt-4">
      <Stack.Screen options={{ title: 'Rebook Visit' }} />

      <Text className="mb-4 mt-2 text-lg font-bold text-dark">{t('reviewAppointment')}</Text>
      <AppointmentSummaryCard appointment={appointment} />

      <Text className="mb-4 text-lg font-bold text-dark">{t('selectNewDate')}</Text>
      <CalendarPicker
        monthLabel="April 2026"
        weekdays={WEEKDAYS}
        calendar={buildCalendar()}
        selectedDay={selectedDate?.day ?? null}
        onSelect={(item) => {
          setSelectedDate(item);
          setSelectedTime('');
          setTimeMenuOpen(false);
        }}
      />

      {selectedDate && !selectedDate.full && (
        <View className="mb-8">
          <Text className="mb-2 text-base font-bold text-dark">
            Available times for Apr {selectedDate.day}
          </Text>
          <Text className="mb-4 text-sm text-muted">
            Select one of the open slots for the chosen date.
          </Text>
          <TimeDropdown
            times={getAvailableTimes(selectedDate.day)}
            selected={selectedTime}
            open={timeMenuOpen}
            onToggle={() => setTimeMenuOpen((open) => !open)}
            onSelect={(time) => {
              setSelectedTime(time);
              setTimeMenuOpen(false);
            }}
          />
        </View>
      )}

      {selectedDate && selectedDate.full && (
        <View className="mb-8 rounded-[18px] border border-border bg-card px-4 py-3">
          <Text className="text-sm font-bold text-amber-900">This date is fully booked.</Text>
          <Text className="mt-1 text-sm text-amber-800">Please choose another available day.</Text>
        </View>
      )}

      <View className="pb-12 pt-2">
        <TouchableOpacity
          disabled={!canConfirm || isRescheduling}
          onPress={handleConfirm}
          className={`items-center rounded-[16px] bg-[#0ea5e9] py-4 shadow-lg shadow-sky-200 ${
            !canConfirm || isRescheduling ? 'opacity-50' : ''
          }`}>
          <Text className="text-lg font-bold text-white">
            {isRescheduling ? 'Updating...' : 'Confirm Rebooking'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}