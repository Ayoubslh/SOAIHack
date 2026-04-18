import { Stack } from 'expo-router';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from '../lib/i18n';

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const OPTIONS = [
  { key: 'appointments', label: 'Appointment reminders', desc: 'Upcoming visits and changes' },
  { key: 'nudge', label: 'Predictive nudges', desc: 'Reschedule suggestions when needed' },
  { key: 'updates', label: 'Product updates', desc: 'Tips and feature announcements' },
];

export default function NotificationsPage() {
  const { t } = useTranslation();

  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    appointments: true,
    nudge: true,
    updates: false,
  });

  return (
    <ScrollView className="flex-1 bg-background px-5 pt-6">
      <Stack.Screen options={{ title: 'Notification Settings' }} />
      <View className="mb-6 rounded-[24px] bg-sky-50 p-5">
        <Text className="text-xl font-extrabold text-dark">{t('notificationControls')}</Text>
        <Text className="mt-1 text-sm text-foreground">
          Choose what updates you want to receive.
        </Text>
      </View>

      <View className="gap-3">
        {OPTIONS.map((item) => {
          const on = enabled[item.key];
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => setEnabled((curr) => ({ ...curr, [item.key]: !curr[item.key] }))}
              className="flex-row items-center justify-between rounded-[18px] border border-border bg-background px-4 py-4">
              <View className="flex-1 pr-4">
                <Text className="text-base font-bold text-dark">{item.label}</Text>
                <Text className="mt-1 text-sm text-muted">{item.desc}</Text>
              </View>
              <View className={`h-8 w-14 rounded-full p-1 ${on ? 'bg-sky-500' : 'bg-slate-300'}`}>
                <View className={`h-6 w-6 rounded-full bg-background ${on ? 'ml-6' : 'ml-0'}`} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="mt-8 rounded-[18px] border border-border bg-card p-4">
        <View className="flex-row items-center">
          <Ionicons name="information-circle-outline" size={18} color="#b45309" />
          <Text className="ml-2 text-sm font-medium text-amber-900">
            Push notifications still require a supported device environment.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
