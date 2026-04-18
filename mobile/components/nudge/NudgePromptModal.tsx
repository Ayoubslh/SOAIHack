import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../lib/i18n';

import { Ionicons } from '@expo/vector-icons';
import type { Appointment } from '../../store/appointmentStore';

interface NudgePromptModalProps {
  appointment: Appointment;
  onKeep: () => void;
  onReschedule: () => void;
}

export function NudgePromptModal({ appointment, onKeep, onReschedule }: NudgePromptModalProps) {
  const { t } = useTranslation();

  return (
    <View className="overflow-hidden rounded-[28px] border border-border bg-background shadow-2xl">
      <View className="bg-gradient-to-br from-amber-50 to-white px-6 py-6">
        <View className="mb-5 flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <View className="mb-3 self-start rounded-full bg-subtle px-3 py-1.5">
              <View className="flex-row items-center">
                <Ionicons name="sparkles" size={12} color="#b45309" />
                <Text className="ml-1 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-800">
                  Predictive Nudge
                </Text>
              </View>
            </View>
            <Text className="text-2xl font-extrabold tracking-tight text-dark">
              A better time may be available
            </Text>
            <Text className="mt-2 text-sm font-medium leading-relaxed text-muted">
              We detected a higher chance of disruption for your upcoming visit. You can keep the
              current appointment or rebook to a safer slot.
            </Text>
          </View>
          <View className="rounded-2xl bg-primary p-3">
            <Ionicons name="shield-checkmark" size={22} color="white" />
          </View>
        </View>

        <View className="rounded-[22px] border border-border bg-background p-4">
          <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            Current Appointment
          </Text>
          <Text className="mt-2 text-lg font-bold text-dark">{appointment.specialist}</Text>
          <Text className="text-sm font-medium text-foreground">{appointment.specialty}</Text>

          <View className="mt-4 flex-row items-center rounded-2xl bg-card p-3">
            <View className="flex-1 flex-row items-center justify-center border-r border-border">
              <Ionicons name="calendar-outline" size={16} color="#64748b" />
              <Text className="ml-2 text-sm font-bold text-foreground">{appointment.date}</Text>
            </View>
            <View className="flex-1 flex-row items-center justify-center">
              <Ionicons name="time-outline" size={16} color="#64748b" />
              <Text className="ml-2 text-sm font-bold text-foreground">{appointment.time}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="gap-3 bg-card px-6 py-5">
        <TouchableOpacity
          onPress={onReschedule}
          className="items-center rounded-[16px] bg-primary py-4 shadow-lg shadow-slate-900/20">
          <Text className="text-base font-bold text-white">Reschedule appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onKeep}
          className="items-center rounded-[16px] border border-border bg-background py-4">
          <Text className="font-bold text-foreground">{t('keepCurrentTime')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
