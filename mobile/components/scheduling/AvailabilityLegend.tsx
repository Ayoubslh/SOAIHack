import { Text, View } from 'react-native';
import { useTranslation } from '../../lib/i18n';

export function AvailabilityLegend() {
  const { t } = useTranslation();

  return (
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
  );
}
