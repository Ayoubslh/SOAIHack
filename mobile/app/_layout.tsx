import { useEffect } from 'react';
import '../global.css';
import { SafeAreaView} from 'react-native-safe-area-context';

import { Stack, router } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppointmentStore } from '../store/appointmentStore';
import { useNudgeStore } from '../store/nudgeStore';
import { useNotifications } from '../hooks/useNotifications';
import { NudgePromptModal } from '../components/nudge/NudgePromptModal';
import { useAuthStore } from '../store/authStore';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/api';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'login',
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { appointments } = useAppointmentStore();
  const { activeAppointmentId, openNudge, closeNudge } = useNudgeStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      // Use setImmediate to safely ensure we are outside the render cycle 
      // if this runs immediately after hydration
      setTimeout(() => {
        router.replace('/login');
      }, 0);
    }
  }, [isAuthenticated]);

  useNotifications((appointmentId) => {
    if (!isAuthenticated) return;
    const appointment = appointments.find((item) => item.id === appointmentId);
    if (appointment) openNudge(appointment.id);
  });

  const activeAppointment = appointments.find((item) => item.id === activeAppointmentId);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View className="flex-1 bg-background">
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="rebook" options={{ presentation: 'modal', headerStyle: { backgroundColor: '#ffffff' }, headerShadowVisible: false,  }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            <Stack.Screen name="edit-profile" options={{ headerStyle: { backgroundColor: '#ffffff' }, headerShadowVisible: false,  }} />
            <Stack.Screen name="help-center" options={{ headerStyle: { backgroundColor: '#ffffff' }, headerShadowVisible: false,  }} />
            <Stack.Screen name="notifications" options={{ headerStyle: { backgroundColor: '#ffffff' }, headerShadowVisible: false,  }} />
            <Stack.Screen name="privacy" options={{ headerStyle: { backgroundColor: '#ffffff' }, headerShadowVisible: false,  }} />
          </Stack>

          <View className="absolute right-4 top-4 z-40"></View>

          {isAuthenticated && activeAppointment && (
            <View className="absolute inset-0 z-50">
              <TouchableOpacity
                activeOpacity={1}
                className="absolute inset-0 bg-black/40"
                onPress={closeNudge}
              />
              <View className="absolute inset-x-0 bottom-0 px-4 pb-4">
                <NudgePromptModal
                  appointment={activeAppointment}
                  onKeep={closeNudge}
                  onReschedule={() => {
                    closeNudge();
                    router.push({
                      pathname: '/rebook',
                      params: { appointmentId: activeAppointment.id },
                    });
                  }}
                />
              </View>
            </View>
          )}
        </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
