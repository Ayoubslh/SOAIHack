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
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTranslation } from '../lib/i18n';
import { DEMO_CREDENTIALS, useAuthStore } from '../store/authStore';

export default function LoginScreen() {
  const { t } = useTranslation();
  const login = useAuthStore((state) => state.login);
  const persistedUsername = useAuthStore((state) => state.username);
  const [username, setUsername] = useState(persistedUsername || DEMO_CREDENTIALS.username);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);

  const handleLogin = async () => {
    const success = await login(username, password);
    console.log('Login success:', success);
    if (!success) {
      Alert.alert(t('signIn'), t('invalidCredentials'));
      return;
    }

    const state = useAuthStore.getState();
    if (state.onboardingComplete) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1 px-5 pt-16"
        contentContainerClassName="flex-grow justify-center">
        <View className="mb-8 items-center">
          <View className="mb-5 h-20 w-20 items-center justify-center rounded-[28px] bg-sky-50">
            <Ionicons name="medical" size={38} color="#0ea5e9" />
          </View>
          <Text className="text-3xl font-extrabold tracking-tight text-dark">
            {t('loginTitle')}
          </Text>
          <Text className="mt-2 text-center text-sm leading-relaxed text-muted">
            {t('loginSubtitle')}
          </Text>
        </View>

        <View className="rounded-[28px] border border-border bg-card p-5">
          <Text className="text-2xl font-extrabold tracking-tight text-dark">
            {t('loginTitle')}
          </Text>
          <Text className="mt-2 text-sm leading-relaxed text-muted">{t('loginSubtitle')}</Text>

          <Text className="mb-2 mt-6 text-sm font-bold text-foreground">Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            className="rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
            placeholder={DEMO_CREDENTIALS.username}
            placeholderTextColor="#94a3b8"
          />

          <Text className="mb-2 mt-4 text-sm font-bold text-foreground">{t('password')}</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
            placeholder={DEMO_CREDENTIALS.password}
            placeholderTextColor="#94a3b8"
          />

          <TouchableOpacity
            onPress={handleLogin}
            className="mt-6 items-center rounded-[16px] bg-primary py-4 shadow-lg shadow-slate-900/10">
            <Text className="font-bold text-white">{t('signIn')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/register')}
            className="mt-4 items-center rounded-[16px] border border-border bg-background py-4">
            <Text className="font-bold text-foreground">{t('createAccount')}</Text>
          </TouchableOpacity>

          <View className="mt-6 rounded-[20px] bg-background p-4">
            <Text className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              {t('demoAccount')}
            </Text>
            <Text className="mt-2 text-sm text-foreground">
              Username: {DEMO_CREDENTIALS.username}
            </Text>
            <Text className="text-sm text-foreground">
              {t('demoPassword')}: {DEMO_CREDENTIALS.password}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setUsername(DEMO_CREDENTIALS.username);
                setPassword(DEMO_CREDENTIALS.password);
              }}
              className="mt-4 items-center rounded-full border border-border bg-card px-4 py-3">
              <Text className="text-sm font-bold text-foreground">{t('useDemoCredentials')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
