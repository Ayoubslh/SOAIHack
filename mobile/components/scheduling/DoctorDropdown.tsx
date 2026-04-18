import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../lib/i18n';

import { Ionicons } from '@expo/vector-icons';

import { DropdownField } from './DropdownField';
import type { Specialist } from './data';

interface DoctorDropdownProps {
  specialists: Specialist[];
  selected: Specialist | null;
  open: boolean;
  onToggle: () => void;
  onSelect: (specialist: Specialist) => void;
}

export function DoctorDropdown({
  specialists,
  selected,
  open,
  onToggle,
  onSelect,
}: DoctorDropdownProps) {
  const { t } = useTranslation();

  return (
    <DropdownField
      label="Doctor"
      value={selected ? selected.name : 'Select a doctor'}
      open={open}
      onToggle={onToggle}>
      {specialists.map((spec) => {
        const isSelected = selected?.id === spec.id;

        return (
          <TouchableOpacity
            key={spec.id}
            onPress={() => spec.available && onSelect(spec)}
            disabled={!spec.available}
            className={`mb-2 rounded-[18px] border px-4 py-3 ${
              isSelected
                ? 'border-[#0ea5e9] bg-sky-50'
                : spec.available
                  ? 'border-border bg-background'
                  : 'border-border bg-card opacity-60'
            }`}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-base font-bold text-dark">{spec.name}</Text>
                <Text className="text-xs font-medium text-muted">
                  {spec.specialty} • {spec.wilaya}
                </Text>
              </View>
              <View className="items-end">
                <View className="mb-1 rounded-full bg-card px-2 py-1">
                 
                </View>
                <Text
                  className={`text-[10px] font-bold ${spec.available ? 'text-emerald-600' : 'text-muted'}`}>
                  {spec.available ? 'Available' : 'Unavailable'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </DropdownField>
  );
}
