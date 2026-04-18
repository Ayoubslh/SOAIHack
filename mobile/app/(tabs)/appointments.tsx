import { View, Text, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { type Appointment } from '../../store/appointmentStore';
import { AppointmentCard } from '../../components/appointments/AppointmentCard';
import { useTranslation } from '../../lib/i18n';
import { getPatientAppointments, getDoctors, cancelAppointment } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function Appointments() {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const userId = useAuthStore((s) => s.personalData?.userId);

  const { data: rawAppointments, isLoading: isAppsLoading, refetch, isRefetching } = useQuery({
    queryKey: ['appointments', userId],
    queryFn: () => getPatientAppointments(userId!),
    enabled: !!userId,
  });

  const { data: doctorsData, isLoading: isDocLoading, refetch: refetchDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => getDoctors(),
  });

  const handleRefresh = () => {
    refetch();
    refetchDoctors();
  };

  const cancelMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      // Note: Backend currently deletes by patient_id based on latest created_at,
      // so we send userId instead of appointmentId to match the /:id backend route logic.
      return cancelAppointment(userId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
      Alert.alert('Success', 'Appointment cancelled successfully');
    },
    onError: (error: any) => {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to cancel appointment');
    },
  });

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel this appointment?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => cancelMutation.mutate(id),
      },
    ]);
  };

  const isLoading = isAppsLoading || isDocLoading;

  // Map server appointments to frontend Appointment format
  const mappedAppointments: Appointment[] = (rawAppointments || []).map((app: any) => {
    // Attempt to find the doctor info to display the name
    const doctor = doctorsData?.find((d: any) => d.id === app.doctor_id || d._id === app.doctor_id);

    return {
      id: app.appointment_id || app._id,
      specialist: doctor?.name || doctor?.doctor_name || app.doctor_name || 'Dr. Specialist',
      specialty: app.specialty || doctor?.specialty || 'General',
      date: app.appointment_date,
      time: app.appointment_hour,
      status: app.status === 'scheduled' ? 'upcoming' : (app.status || 'upcoming'),
      riskScore: typeof app.riskScore === 'number' ? app.riskScore : (app.prior_no_shows > 0 ? 50 : 15),
      visitTypeKey: 'consultation',
      visitType: 'Consultation',
      patientNotes: app.patient_notes || '',
    };
  });

  return (
    <View className="flex-1 bg-card">
      <ScrollView 
        className="flex-1 bg-card px-5 pt-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching || cancelMutation.isPending} onRefresh={handleRefresh} tintColor="#0ea5e9" colors={['#0ea5e9']} />
        }
      >
        <Stack.Screen options={{ title: t('yourSchedule') }} />

        <View className="mb-6">
          <Text className="text-xl font-bold text-dark">{t('scheduledVisits')}</Text>
          <Text className="text-sm font-medium text-muted">
            {t('manageYourUpcomingAndPastMedicalVisits')}
          </Text>
        </View>

        {isLoading ? (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="large" color="#0284c7" />
          </View>
        ) : mappedAppointments.length === 0 ? (
          <View className="py-10 items-center justify-center">
            <Text className="text-muted font-medium text-base">No appointments found.</Text>
          </View>
        ) : (
          <View className="mb-10 gap-5">
            {mappedAppointments
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((item) => {
                const isExpanded = expandedId === item.id;

                return (
                  <AppointmentCard
                    key={item.id}
                    appointment={item}
                    expanded={isExpanded}
                    onToggleDetails={() => setExpandedId(isExpanded ? null : item.id)}
                    onCancel={() => handleCancel(item.id)}
                    onReschedule={() =>
                      router.push({ pathname: '/rebook', params: { appointmentId: item.id } })
                    }
                  />
                );
              })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
