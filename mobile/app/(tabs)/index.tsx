import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../store/authStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useTranslation } from '../../lib/i18n';
import { getPatientAppointments, getDoctors } from '../../lib/api';

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const userFullName = useAuthStore((state) => state.personalData?.fullName);
  const userId = useAuthStore((state) => state.personalData?.userId);
  const [greeting, setGreeting] = useState('');

  const { data: rawAppointments = [], refetch: refetchApps, isRefetching: isAppsRefetching } = useQuery({
    queryKey: ['appointments', userId],
    queryFn: () => getPatientAppointments(userId!),
    enabled: !!userId,
  });

  const { data: doctorsData, refetch: refetchDocs, isRefetching: isDocsRefetching } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => getDoctors(),
  });

  const isRefetching = isAppsRefetching || isDocsRefetching;
  const handleRefresh = () => {
    refetchApps();
    refetchDocs();
  };

  const nextAppointment = useMemo(() => {
    if (!rawAppointments || rawAppointments.length === 0) {
      return useAppointmentStore.getState().appointments.find((a) => a.status === 'upcoming');
    }
    
    const upcoming = rawAppointments.filter((a: any) => a.status === 'scheduled' || a.status === 'upcoming');
    if (upcoming.length === 0) return undefined;
    
    // Sort to find the closest one
    upcoming.sort((a: any, b: any) => {
      const dateA = new Date(`${a.appointment_date}T${a.appointment_hour || '00:00'}`);
      const dateB = new Date(`${b.appointment_date}T${b.appointment_hour || '00:00'}`);
      return dateA.getTime() - dateB.getTime();
    });
    
    const closest = upcoming[0];
    const doctor = doctorsData?.find((d: any) => d.id === closest.doctor_id || d._id === closest.doctor_id);
    
    return {
      id: closest.appointment_id || closest._id,
      specialist: doctor?.name || doctor?.doctor_name || closest.doctor_name || 'Dr. Specialist',
      specialty: closest.specialty || doctor?.specialty || 'General',
      date: closest.appointment_date,
      time: closest.appointment_hour,
      visitType: 'Consultation'
    };
  }, [rawAppointments, doctorsData]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('dashboardGreetingMorning'));
    else if (hour < 18) setGreeting(t('dashboardGreetingAfternoon'));
    else setGreeting(t('dashboardGreetingEvening'));
  }, [t]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        className="flex-1 bg-background px-5 pt-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor="#0ea5e9" colors={['#0ea5e9']} />
        }
      >
        <Stack.Screen options={{ title: t('dashboard'), headerShown: false }} />

        {/* Custom Header */}
        <View className="mb-8 mt-10 flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-muted">{greeting}</Text>
            <Text className="text-3xl font-extrabold tracking-tight text-dark">{userFullName || 'User'}</Text>
          </View>
          <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-subtle shadow-sm">
            {/* Fallback to icon since we don't have an actual user image uploaded */}
            <Ionicons name="person" size={28} color="#0ea5e9" />
          </View>
        </View>

        {/* Next Appointment Card - Using a soft gradient style via NativeWind */}
        <Text className="mb-3 text-lg font-bold text-dark">{t('nextAppointment')}</Text>
        {nextAppointment ? (
          <View className="mb-8 overflow-hidden rounded-[24px] bg-[#0ea5e9] shadow-lg shadow-sky-200">
            {/* Background decorative elements */}
            <View className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-background opacity-10" />
            <View className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-background opacity-10" />

            <View className="p-6">
              <View className="mb-5 flex-row items-start justify-between">
                <View>
                  <View className="mb-2 self-start rounded-md bg-background/20 px-2 py-1">
                    <Text className="text-[10px] font-bold uppercase tracking-widest text-white">
                      {nextAppointment.visitType || t('visitLabel')}
                    </Text>
                  </View>
                  <Text className="text-2xl font-bold text-white">
                    {nextAppointment.specialist}
                  </Text>
                  <Text className="mt-1 text-sm font-medium text-sky-100">
                    {nextAppointment.specialty}
                  </Text>
                </View>
                <View className="rounded-full bg-background/20 p-3">
                  <Ionicons name="medical" size={20} color="white" />
                </View>
              </View>

              <View className="mb-6 flex-row items-center rounded-2xl bg-black/10 p-3">
                <View className="flex-1 flex-row items-center justify-center border-r border-white/20">
                  <Ionicons name="calendar" size={18} color="white" />
                  <Text className="ml-2 font-semibold text-white">{nextAppointment.date}</Text>
                </View>
                <View className="flex-1 flex-row items-center justify-center">
                  <Ionicons name="time" size={18} color="white" />
                  <Text className="ml-2 font-semibold text-white">{nextAppointment.time}</Text>
                </View>
              </View>

              <TouchableOpacity
                className="items-center rounded-xl bg-background py-4 shadow-sm active:opacity-80"
                onPress={() => router.push('/appointments')}>
                <Text className="font-bold text-[#0ea5e9]">{t('viewDetails')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="mb-8 items-center rounded-[24px] border-2 border-dashed border-border bg-card p-8">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-slate-200">
              <Ionicons name="calendar" size={28} color="#94a3b8" />
            </View>
            <Text className="mb-1 text-lg font-bold text-dark">{t('youreAllClear')}</Text>
            <Text className="mb-6 text-center font-medium text-muted">
              {t('noUpcomingAppointments')}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/book')}
              className="rounded-full bg-[#0ea5e9] px-6 py-3 shadow-sm">
              <Text className="font-bold text-white">{t('bookAVisit')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Insights */}
        <Text className="mb-4 text-lg font-bold text-dark">{t('yourHealthInsights')}</Text>
        <View className="mb-8 flex-row gap-4">
          <View className="flex-1 rounded-[24px] border border-emerald-100 bg-emerald-50 p-5 shadow-sm shadow-emerald-100/50">
            <View className="mb-3 h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Ionicons name="shield-checkmark" size={20} color="#10b981" />
            </View>
            <Text className="text-2xl font-extrabold text-emerald-900">100%</Text>
            <Text className="mt-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
              {t('attendance')}
            </Text>
          </View>
          <View className="flex-1 rounded-[24px] border border-border bg-card p-5 shadow-sm shadow-amber-100/50">
            <View className="mb-3 h-10 w-10 items-center justify-center rounded-full bg-subtle">
              <Ionicons name="analytics" size={20} color="#f59e0b" />
            </View>
            <Text className="text-2xl font-extrabold text-amber-900">{t('active')}</Text>
            <Text className="mt-1 text-xs font-bold uppercase tracking-wider text-amber-600">
              tracking
            </Text>
          </View>
        </View>

        {/* Daily Tip */}
        <View className="mb-12 overflow-hidden rounded-[24px] bg-primary shadow-lg shadow-slate-900/20">
          <View className="absolute -right-4 -top-4 opacity-10">
            <Ionicons name="bulb" size={100} color="white" />
          </View>
          <View className="p-6">
            <View className="mb-2 flex-row items-center">
              <View className="mr-3 rounded-md bg-background/20 p-1.5">
                <Ionicons name="bulb" size={16} color="#fbbf24" />
              </View>
              <Text className="text-xs font-bold uppercase tracking-widest text-white">
                {t('healthTip')}
              </Text>
            </View>
            <Text className="mt-2 pr-4 text-base font-medium leading-relaxed text-slate-300">
              {t('healthTipMessage')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
