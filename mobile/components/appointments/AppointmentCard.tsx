import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../lib/i18n';

import { Ionicons } from '@expo/vector-icons';
import type { Appointment } from '../../store/appointmentStore';

interface AppointmentCardProps {
  appointment: Appointment;
  expanded: boolean;
  onToggleDetails: () => void;
  onCancel: () => void;
  onReschedule: () => void;
}

function renderBadge(status: Appointment['status']) {
  switch (status) {
    case 'upcoming':
      return (
        <View className="rounded-full border border-sky-200 bg-sky-100 px-2 py-1">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-[#0ea5e9]">
            Upcoming
          </Text>
        </View>
      );
    case 'cancelled':
      return (
        <View className="rounded-full border border-red-200 bg-red-50 px-2 py-1">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-red-600">
            Cancelled
          </Text>
        </View>
      );
    default:
      return (
        <View className="rounded-full border border-border bg-subtle px-2 py-1">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Completed
          </Text>
        </View>
      );
  }
}

export function AppointmentCard({
  appointment,
  expanded,
  onToggleDetails,
  onCancel,
  onReschedule,
}: AppointmentCardProps) {
  const { t } = useTranslation();

  return (
    <View className="overflow-hidden rounded-[24px] border border-border bg-background shadow-sm shadow-slate-200/50">
      <View className="p-5">
        <View className="mb-4 flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            {appointment.visitType && (
              <View className="mb-2 self-start rounded-md bg-subtle px-2 py-1">
                <Text className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  {appointment.visitType}
                </Text>
              </View>
            )}
            <Text className="text-lg font-extrabold text-dark">{appointment.specialist}</Text>
            <Text className="text-sm font-medium text-sky-600">{appointment.specialty}</Text>
          </View>
          {renderBadge(appointment.status)}
        </View>

        <View className="mb-4 flex-row items-center rounded-xl border border-border bg-card p-3">
          <View className="flex-1 flex-row items-center justify-center border-r border-border">
            <Ionicons name="calendar-outline" size={16} color="#64748b" />
            <Text className="ml-2 text-sm font-bold text-foreground">{appointment.date}</Text>
          </View>
          <View className="flex-1 flex-row items-center justify-center">
            <Ionicons name="time-outline" size={16} color="#64748b" />
            <Text className="ml-2 text-sm font-bold text-foreground">{appointment.time}</Text>
          </View>
        </View>

        {expanded && appointment.patientNotes && (
          <View className="mb-4 rounded-xl border border-border/50 bg-card/50 p-4">
            <Text className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-900">
              Reason for visit
            </Text>
            <Text className="text-sm font-medium leading-relaxed text-amber-800/80">
              {appointment.patientNotes}
            </Text>
          </View>
        )}

        <View className="flex-row gap-3">
          {appointment.status === 'upcoming' && (
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 items-center justify-center rounded-[14px] border border-red-100 bg-red-50 py-3">
              <Text className="text-sm font-bold text-red-600">{t('cancel')}</Text>
            </TouchableOpacity>
          )}
          {appointment.status === 'upcoming' && (
            <TouchableOpacity
              onPress={onReschedule}
              className="flex-1 items-center justify-center  rounded-[14px] border border-sky-100 bg-sky-50 py-3">
              <Text className="text-sm font-bold text-[#0ea5e9] text-center">{t('rescheduleAppointment')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onToggleDetails}
            className={`flex-1 items-center justify-center rounded-[14px] py-3 ${appointment.status !== 'upcoming' ? 'bg-subtle' : 'bg-slate-800'}`}>
            <Text
              className={`text-sm font-bold ${appointment.status !== 'upcoming' ? 'text-foreground' : 'text-white'}`}>
              {expanded ? 'Hide Details' : 'View Details'}
            </Text>
          </TouchableOpacity>
        </View>

        {appointment.status === 'upcoming' && appointment.riskScore > 30 && (
          <View className="mt-4 flex-row items-center rounded-[14px] border border-border bg-card p-3">
            <Ionicons name="shield-checkmark" size={18} color="#f59e0b" />
            <Text className="ml-2 flex-1 text-[11px] font-bold leading-tight text-amber-800">
              Priority Match: Confirming your slot early helps others in need.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
