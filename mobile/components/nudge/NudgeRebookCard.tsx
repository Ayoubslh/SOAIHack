import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from './../../lib/i18n';

import { Ionicons } from '@expo/vector-icons';

import { AppointmentSummaryCard } from '../scheduling/AppointmentSummaryCard';
import { CalendarPicker } from '../scheduling/CalendarPicker';
import { TimeDropdown } from '../scheduling/TimeDropdown';
import { buildCalendar, getAvailableTimes, WEEKDAYS, type CalendarDay } from '../scheduling/data';
import type { Appointment } from '../../store/appointmentStore';

interface NudgeRebookCardProps {
  appointment: Appointment;
  selectedDate: CalendarDay | null;
  selectedTime: string;
  timeMenuOpen: boolean;
  onSelectDate: (item: CalendarDay) => void;
  onToggleTimeMenu: () => void;
  onSelectTime: (time: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function NudgeRebookCard({
  appointment,
  selectedDate,
  selectedTime,
  timeMenuOpen,
  onSelectDate,
  onToggleTimeMenu,
  onSelectTime,
  onBack,
  onConfirm,
}: NudgeRebookCardProps) {
  const { t } = useTranslation();

  const calendar = buildCalendar();
  const availableTimes = selectedDate ? getAvailableTimes(selectedDate.day) : [];
  const canConfirm = !!selectedDate && !!selectedTime;

  return (
    <View className="overflow-hidden rounded-[28px] border border-border bg-background shadow-2xl">
      <View className="px-6 pt-3">
        <View className="mb-6 h-1.5 w-12 self-center rounded-full bg-slate-200" />
      </View>

      <View className="px-6 pb-6">
        <View className="mb-4 flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <View className="mb-3 self-start rounded-full bg-sky-50 px-3 py-1.5">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={12} color="#0ea5e9" />
                <Text className="ml-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#0ea5e9]">
                  Rebooking
                </Text>
              </View>
            </View>
            <Text className="text-2xl font-extrabold tracking-tight text-dark">
              Choose a safer slot
            </Text>
            <Text className="mt-2 text-sm font-medium leading-relaxed text-muted">
              Keep all current appointment details and only change the date and time.
            </Text>
          </View>
          <View className="rounded-2xl bg-primary p-3">
            <Ionicons name="time-outline" size={22} color="white" />
          </View>
        </View>

        <AppointmentSummaryCard appointment={appointment} />

        <Text className="mb-4 text-lg font-bold text-dark">1. Select New Date</Text>
        <CalendarPicker
          monthLabel="April 2026"
          weekdays={WEEKDAYS}
          calendar={calendar}
          selectedDay={selectedDate?.day ?? null}
          onSelect={onSelectDate}
        />

        {selectedDate && !selectedDate.full && (
          <View className="mb-6">
            <Text className="mb-2 text-base font-bold text-dark">
              2. Available Slots on Apr {selectedDate.day}
            </Text>
            <Text className="mb-4 text-sm text-muted">
              Select one of the available times for the chosen day.
            </Text>
            <TimeDropdown
              times={availableTimes}
              selected={selectedTime}
              open={timeMenuOpen}
              onToggle={onToggleTimeMenu}
              onSelect={onSelectTime}
            />
          </View>
        )}

        {selectedDate && selectedDate.full && (
          <View className="mb-6 rounded-[18px] border border-border bg-card px-4 py-3">
            <Text className="text-sm font-bold text-amber-900">This date is not available.</Text>
            <Text className="mt-1 text-sm text-amber-800">Please select another open day.</Text>
          </View>
        )}

        <View className="gap-3">
          <TouchableOpacity
            disabled={!canConfirm}
            onPress={onConfirm}
            className={`items-center rounded-[16px] py-4 shadow-lg ${
              canConfirm ? 'bg-primary shadow-slate-900/20' : 'bg-slate-300'
            }`}>
            <Text className="text-base font-bold text-white">{t('confirmNewSlot')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onBack}
            className="items-center rounded-[16px] border border-border bg-background py-4">
            <Text className="font-bold text-foreground">{t('back')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
