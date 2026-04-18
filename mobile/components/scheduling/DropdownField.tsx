import { ReactNode } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTranslation } from '../../lib/i18n';

import { Ionicons } from '@expo/vector-icons';

interface DropdownFieldProps {
  label: string;
  value: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function DropdownField({ label, value, open, onToggle, children }: DropdownFieldProps) {
  const { t } = useTranslation();

  return (
    <View className="rounded-[18px] border border-border bg-background">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row items-center justify-between px-4 py-4">
        <View className="flex-1 pr-3">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</Text>
          <Text className="mt-1 text-base font-bold text-dark">{value}</Text>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#64748b" />
      </TouchableOpacity>

      {open && <View className="border-t border-border p-2">{children}</View>}
    </View>
  );
}
