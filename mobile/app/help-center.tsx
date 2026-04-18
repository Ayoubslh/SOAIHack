import { Stack } from 'expo-router';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from '../lib/i18n';

import { Ionicons } from '@expo/vector-icons';

const FAQ = [
  {
    q: 'How do I reschedule?',
    a: 'Open the nudge sheet or the appointment card and choose a new slot.',
  },
  { q: 'Why are some dates disabled?', a: 'They are fully booked or earlier than today.' },
  { q: 'Where are notifications?', a: 'They are configured from the Notification Settings page.' },
];

export default function HelpCenterPage() {
  const { t } = useTranslation();

  return (
    <ScrollView className="flex-1 bg-background px-5 pt-6">
      <Stack.Screen options={{ title: 'Help Center' }} />
      <View className="mb-6 rounded-[24px] bg-emerald-50 p-5">
        <Text className="text-xl font-extrabold text-dark">{t('needHelp')}</Text>
        <Text className="mt-1 text-sm text-foreground">
          Quick answers and support shortcuts are below.
        </Text>
      </View>

      <View className="gap-3">
        {FAQ.map((item) => (
          <View key={item.q} className="rounded-[18px] border border-border bg-background p-4">
            <Text className="text-base font-bold text-dark">{item.q}</Text>
            <Text className="mt-2 text-sm leading-relaxed text-muted">{item.a}</Text>
          </View>
        ))}
      </View>

      <View className="mt-8 gap-3">
        <TouchableOpacity className="flex-row items-center justify-center rounded-[16px] bg-primary py-4">
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="white" />
          <Text className="ml-2 font-bold text-white">{t('contactSupport')}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-center rounded-[16px] border border-border bg-background py-4">
          <Ionicons name="mail-outline" size={18} color="#0f172a" />
          <Text className="ml-2 font-bold text-dark">{t('sendEmail')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
