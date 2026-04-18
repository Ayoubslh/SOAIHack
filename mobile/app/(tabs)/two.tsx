import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable, Alert, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ProfileMenuItem } from '../../components/profile/ProfileMenuItem';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { useTranslation, convertToArabicName } from '../../lib/i18n';

export default function Profile() {
  const router = useRouter();
  const { t, getGenderLabel, isRTL } = useTranslation();
  const { personalData, logout, refreshProfile } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  };

  const { language, setLanguage } = useLanguageStore();

  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  const handleLanguageChange = () => {
    setLanguageModalVisible(true);
  };

  const fullName = isRTL
    ? convertToArabicName(personalData?.fullName || 'User')
    : personalData?.fullName || 'User';

  return (
    <ScrollView 
      className="flex-1 bg-background px-5 pt-8"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0ea5e9" colors={['#0ea5e9']} />
      }
    >
      <Stack.Screen options={{ title: t('profile') }} />

      {/* Profile Header */}
      <View className="mb-8 items-center">
        <View className="mb-4 h-24 w-24 items-center justify-center rounded-full border-4 border-sky-50 bg-subtle">
          <Ionicons name="person" size={48} color="#0ea5e9" />
        </View>
        <Text className="text-xl font-bold text-dark">{fullName}</Text>
       
        <TouchableOpacity
          onPress={() => router.push('/edit-profile')}
          className="mt-4 rounded-full bg-blue-100 px-4 py-2">
          <Text className="text-xs font-bold text-primary">{t('editProfile')}</Text>
        </TouchableOpacity>
      </View>

      <View className="border-light mb-10 rounded-[24px] border bg-card p-5">
        <Text className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-muted">
          {t('personalData')}
        </Text>
        <Text className="text-main text-sm">
          {t('age')}: {personalData?.age || '--'}
        </Text>
        <Text className="text-main mt-2 text-sm">
          {t('gender')}: {personalData?.gender ? getGenderLabel(personalData.gender) : '--'}
        </Text>
        <Text className="text-main mt-2 text-sm">
          {t('bloodType')}: {personalData?.bloodType || '--'}
        </Text>
        <Text className="text-main mt-2 text-sm">
          {t('allergies')}: {personalData?.allergies || '--'}
        </Text>
        <Text className="text-main mt-2 text-sm">
          {t('medicalConditions')}: {personalData?.medicalConditions || '--'}
        </Text>
      </View>

      {/* Stats */}
      <View className="mb-10 flex-row justify-between rounded-[24px] bg-card p-6">
        <View className="items-center">
          <Text className="text-lg font-bold text-dark">12</Text>
          <Text className="text-[10px] font-bold uppercase text-muted">{t('visits')}</Text>
        </View>
        <View className="h-10 w-[1px] bg-slate-200" />
        <View className="items-center">
          <Text className="text-lg font-bold text-emerald-500">100%</Text>
          <Text className="text-[10px] font-bold uppercase text-muted">{t('reliability')}</Text>
        </View>
        <View className="h-10 w-[1px] bg-slate-200" />
        <View className="items-center">
          <Text className="text-lg font-bold text-dark">4</Text>
          <Text className="text-[10px] font-bold uppercase text-muted">{t('clinics')}</Text>
        </View>
      </View>

      {/* Settings Sections */}
      <View className="mb-10 gap-2">
        <ProfileMenuItem
          icon="globe-outline"
          label={
            t('language') +
            ': ' +
            (language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'العربية')
          }
          onPress={handleLanguageChange}
        />
        <ProfileMenuItem
          icon="notifications-outline"
          label={t('notificationSettings')}
          onPress={() => router.push('/notifications')}
        />
        <ProfileMenuItem
          icon="shield-checkmark-outline"
          label={t('privacySecurity')}
          onPress={() => router.push('/privacy')}
        />
        <ProfileMenuItem
          icon="help-circle-outline"
          label={t('helpCenter')}
          onPress={() => router.push('/help-center')}
        />
        <ProfileMenuItem
          icon="log-out-outline"
          label={t('logout')}
          color="text-white"
          iconColor="#ffffff"
          backgroundColor="bg-red-500"
          onPress={() => {
            logout();
            router.replace('/login');
          }}
        />
      </View>

      {/* Language Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}>
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setLanguageModalVisible(false)}>
          <Pressable className="rounded-t-3xl bg-background p-6 shadow-lg">
            <Text className="mb-4 text-center text-lg font-bold text-dark">{t('language')}</Text>
            {['en', 'fr', 'ar'].map((lang) => (
              <TouchableOpacity
                key={lang}
                className="mb-2 w-full items-center rounded-2xl bg-card p-4"
                onPress={() => {
                  setLanguage(lang as any);
                  setLanguageModalVisible(false);
                }}>
                <Text className="text-base font-medium text-dark">
                  {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية'}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="mt-2 w-full items-center rounded-2xl bg-red-50 p-4"
              onPress={() => setLanguageModalVisible(false)}>
              <Text className="text-base font-bold text-red-500">{t('goBack') || 'Cancel'}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
