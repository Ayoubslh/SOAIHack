import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../lib/i18n';

import { Ionicons } from '@expo/vector-icons';

import { DropdownField } from './DropdownField';

interface TimeDropdownProps {
  times: string[];
  selected: string;
  open: boolean;
  onToggle: () => void;
  onSelect: (time: string) => void;
}

export function TimeDropdown({ times, selected, open, onToggle, onSelect }: TimeDropdownProps) {
  const { t } = useTranslation();

  return (
    <DropdownField label="Time" value={selected || 'Select a time'} open={open} onToggle={onToggle}>
      {times.map((time) => {
        const isSelected = selected === time;
        return (
          <TouchableOpacity
            key={time}
            onPress={() => onSelect(time)}
            className={`mb-2 rounded-[16px] border px-4 py-3 ${
              isSelected ? 'border-[#0ea5e9] bg-sky-50' : 'border-border bg-background'
            }`}>
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-dark">{time}</Text>
              {isSelected && <Ionicons name="checkmark-circle" size={20} color="#0ea5e9" />}
            </View>
          </TouchableOpacity>
        );
      })}
    </DropdownField>
  );
}
