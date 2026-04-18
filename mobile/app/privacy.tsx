import { Stack } from 'expo-router';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from '../lib/i18n';

import { Ionicons } from '@expo/vector-icons';

const ITEMS = [
  'Protect your account with a strong passcode.',
  'Review your shared appointment details regularly.',
  'Keep device notifications enabled for timely reminders.',
];

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <ScrollView className="flex-1 bg-background px-5 pt-6">
      <Stack.Screen options={{ title: 'Privacy & Security' }} />
      <View className="mb-6 rounded-[24px] bg-primary p-5">
        <Text className="text-xl font-extrabold text-white">{t('privacyControls')}</Text>
        <Text className="mt-1 text-sm text-slate-300">
          Review the basic safeguards for your health data.
        </Text>
      </View>

      <View className="gap-3">
        {ITEMS.map((item) => (
          <View
            key={item}
            className="flex-row items-start rounded-[18px] border border-border bg-background p-4">
            <Ionicons name="shield-checkmark-outline" size={18} color="#0ea5e9" />
            <Text className="ml-3 flex-1 text-sm font-medium leading-relaxed text-foreground">
              {item}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity className="mt-8 items-center rounded-[16px] bg-primary py-4">
        <Text className="font-bold text-white">{t('updateSecuritySettings')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
