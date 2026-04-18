import { Text, View } from 'react-native';
import { useTranslation } from '../../lib/i18n';

import { Ionicons } from '@expo/vector-icons';
import type { Appointment } from '../../store/appointmentStore';

interface AppointmentSummaryCardProps {
  appointment: Appointment;
}

export function AppointmentSummaryCard({ appointment }: AppointmentSummaryCardProps) {
  const { t } = useTranslation();

  return (
    <View className="mb-5 rounded-[20px] border border-border bg-card p-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-muted">
          Current Appointment
        </Text>
        <View className="flex-row items-center rounded-full bg-subtle px-2 py-1">
          <Ionicons name="calendar" size={10} color="#b45309" />
          <Text className="ml-1 text-[10px] font-bold text-amber-800">Kept Details</Text>
        </View>
      </View>
      <Text className="text-base font-bold text-dark">{appointment.specialist}</Text>
      <Text className="text-sm text-foreground">{appointment.specialty}</Text>
      <Text className="mt-2 text-sm font-medium text-foreground">
        {appointment.date} at {appointment.time}
      </Text>
      {appointment.visitType ? (
        <Text className="mt-1 text-sm text-foreground">Visit type: {appointment.visitType}</Text>
      ) : null}
      {appointment.patientNotes ? (
        <Text className="mt-1 text-sm text-foreground" numberOfLines={2}>
          Notes: {appointment.patientNotes}
        </Text>
      ) : null}
    </View>
  );
}
