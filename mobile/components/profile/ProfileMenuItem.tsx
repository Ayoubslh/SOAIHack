import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../lib/i18n';

import { Ionicons } from '@expo/vector-icons';

interface ProfileMenuItemProps {
  icon: any;
  label: string;
  color?: string;
  iconColor?: string;
  backgroundColor?: string;
  onPress?: () => void;
}

export function ProfileMenuItem({
  icon,
  label,
  color = 'text-foreground',
  iconColor = '#64748b',
  backgroundColor = 'bg-background',
  onPress,
}: ProfileMenuItemProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between rounded-[16px] border border-slate-50 ${backgroundColor} p-4`}>
      <View className="flex-row items-center">
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text className={`ml-3 font-medium ${color}`}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
    </TouchableOpacity>
  );
}
