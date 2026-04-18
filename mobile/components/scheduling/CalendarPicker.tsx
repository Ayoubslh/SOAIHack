import { Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTranslation } from '../../lib/i18n';

import type { CalendarDay } from './data';

interface CalendarPickerProps {
  monthLabel: string;
  weekdays: string[];
  calendar: (CalendarDay | null)[];
  selectedDay: number | null;
  onSelect: (day: CalendarDay) => void;
}

export function CalendarPicker({
  monthLabel,
  weekdays,
  calendar,
  selectedDay,
  onSelect,
}: CalendarPickerProps) {
  const { t } = useTranslation();

  const markedDates: any = {};
  calendar.forEach((item) => {
    if (item && item.dateString) {
      if (item.full) {
        markedDates[item.dateString] = { disabled: true, disableTouchEvent: true ,disabledColor:'#slate-200' };
      } else if (selectedDay === item.day) {
        markedDates[item.dateString] = { selected: true, selectedColor: '#0ea5e9' };
      } else {
        markedDates[item.dateString] = { marked: false };
      }
    }
  });

  return (
    <View className="mb-6 rounded-[24px] border border-[#f1f5f9] bg-card/50 p-4">
      <Calendar
        current="2026-04-17"
        markedDates={markedDates}
        onDayPress={(day: any) => {
          const selectedItem = calendar.find((c) => c?.dateString === day.dateString);
          if (selectedItem && !selectedItem.full) {
            onSelect(selectedItem);
          }
        }}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: '#64748b',
          selectedDayBackgroundColor: '#0ea5e9',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#0ea5e9',
          dayTextColor: '#0f172a',
          textDisabledColor: '#slate-200',
          arrowColor: '#0ea5e9',
          monthTextColor: '#0f172a',
          textDayFontWeight: 'bold',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
        }}
        hideExtraDays={true}
        firstDay={1}
      />
      <View className="mt-6 flex-row justify-center gap-4 border-t border-border/60 pt-4">
        <View className="flex-row items-center">
          <View className="mr-2 h-2 w-2 rounded-full border border-border bg-background" />
          <Text className="text-[10px] font-bold uppercase text-muted">{t('available')}</Text>
        </View>
        <View className="flex-row items-center">
          <View className="mr-2 h-2 w-2 rounded-full bg-slate-300" />
          <Text className="text-[10px] font-bold uppercase text-muted">{t('fullyBooked')}</Text>
        </View>
      </View>
    </View>
  );
}
