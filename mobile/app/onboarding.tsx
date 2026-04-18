import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, Redirect, router } from 'expo-router';

import { useTranslation } from '../lib/i18n';
import { type Gender, useAuthStore } from '../store/authStore';
import WILAYAS from '../lib/wilayas.json';
import { DropdownField } from '../components/scheduling/DropdownField';

const GENDERS: { key: Gender; labelKey: 'male' | 'female' | 'other' | 'preferNotToSay' }[] = [
  { key: 'male', labelKey: 'male' },
  { key: 'female', labelKey: 'female' },
  { key: 'other', labelKey: 'other' },
];

export default function OnboardingScreen() {
  const { t, getGenderLabel } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const onboardingComplete = useAuthStore((state) => state.onboardingComplete);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [wilaya, setWilaya] = useState('');

  const [wilayaMenuOpen, setWilayaMenuOpen] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (onboardingComplete) {
    return <Redirect href="/(tabs)" />;
  }

  const handleComplete = async () => {
    if (!fullName.trim() || !age.trim() || !gender) {
      Alert.alert(t('completeProfile'), t('invalidRegistration'));
      return;
    }

    await completeOnboarding({
      fullName: fullName.trim(),
      age: age.trim(),
      gender,
      bloodType: bloodType.trim(),
      allergies: allergies.trim(),
      medicalConditions: medicalConditions.trim(),
      height: height.trim(),
      weight: weight.trim(),
      wilaya: wilaya.trim(),
      phone: phone.trim(),
    });

    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1 px-5 pt-16" contentContainerClassName="pb-12">
        <View className="mb-8">
          <Text className="text-3xl font-extrabold text-dark">{t('onboardingTitle')}</Text>
          <Text className="mt-2 text-sm leading-relaxed text-muted">{t('onboardingSubtitle')}</Text>
        </View>

        <View className="rounded-[28px] border border-border bg-card p-5">
          <Text className="mb-2 mt-6 text-sm font-bold text-foreground">{t('personalData')}</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder={t('fullName')}
            placeholderTextColor="#94a3b8"
            className="rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
          />

          <Text className="mb-2 mt-4 text-sm font-bold text-foreground">Phone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Phone number"
            placeholderTextColor="#94a3b8"
            className="rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
          />

          <View className="mt-4 flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-2 text-sm font-bold text-foreground">{t('age')}</Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder={t('age')}
                placeholderTextColor="#94a3b8"
                className="rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
              />
            </View>
            <View className="flex-1">
              <Text className="mb-2 text-sm font-bold text-foreground">{t('gender')}</Text>
              <TextInput
                value={gender ? getGenderLabel(gender) : ''}
                editable={false}
                placeholder={t('gender')}
                placeholderTextColor="#94a3b8"
                className="rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
              />
            </View>
          </View>

          <View className="mt-4 flex-row flex-wrap gap-2">
            {GENDERS.map((item) => {
              const selected = gender === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setGender(item.key)}
                  className={`rounded-full border px-4 py-3 ${selected ? 'border-slate-900 bg-primary' : 'border-border bg-background'}`}>
                  <Text
                    className={`text-sm font-bold ${selected ? 'text-white' : 'text-foreground'}`}>
                    {t(item.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="mt-4">
            <DropdownField
              label="Wilaya"
              value={wilaya || 'Select Wilaya'}
              open={wilayaMenuOpen}
              onToggle={() => setWilayaMenuOpen(!wilayaMenuOpen)}>
              <ScrollView nestedScrollEnabled className="max-h-[200px]">
                {WILAYAS.map((w) => (
                  <TouchableOpacity
                    key={w.id}
                    onPress={() => {
                      setWilaya(w.name);
                      setWilayaMenuOpen(false);
                    }}
                    className={`mb-2 rounded-[18px] border px-4 py-3 ${
                      wilaya === w.name
                        ? 'border-[#0ea5e9] bg-sky-50'
                        : 'border-border bg-background'
                    }`}>
                    <Text
                      className={`text-base font-bold ${wilaya === w.name ? 'text-dark' : 'text-foreground'}`}>
                      {w.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </DropdownField>
          </View>

          <Text className="mb-2 mt-6 text-sm font-bold text-foreground">{t('medicalData')}</Text>

          <Text className="mb-2 text-sm font-bold text-foreground">{t('bloodType')}</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => {
              const selected = bloodType === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setBloodType(type)}
                  className={`rounded-full border px-4 py-3 ${selected ? 'border-slate-900 bg-primary' : 'border-border bg-background'}`}>
                  <Text
                    className={`text-sm font-bold ${selected ? 'text-white' : 'text-foreground'}`}>
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            value={allergies}
            onChangeText={setAllergies}
            placeholder={t('allergies')}
            placeholderTextColor="#94a3b8"
            className="mt-4 rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
          />
          <TextInput
            value={medicalConditions}
            onChangeText={setMedicalConditions}
            placeholder={t('medicalConditions')}
            placeholderTextColor="#94a3b8"
            className="mt-4 rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
          />

          <View className="mt-4 flex-row gap-3">
            <View className="flex-1">
              <TextInput
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder={t('height')}
                placeholderTextColor="#94a3b8"
                className="rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
              />
            </View>
            <View className="flex-1">
              <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder={t('weight')}
                placeholderTextColor="#94a3b8"
                className="rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleComplete}
            className="mt-6 items-center rounded-[16px] bg-primary py-4 shadow-lg shadow-slate-900/10 mb-10">
            <Text className="font-bold text-white">{t('completeProfile')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
