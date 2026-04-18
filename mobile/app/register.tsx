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

import { useTranslation } from '../lib/i18n';
import { DEMO_REGISTER_CREDENTIALS, useAuthStore } from '../store/authStore';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const register = useAuthStore((state) => state.register);
  const [username, setUsername] = useState(DEMO_REGISTER_CREDENTIALS.username);
  const [password, setPassword] = useState(DEMO_REGISTER_CREDENTIALS.password);
  const [confirmPassword, setConfirmPassword] = useState(DEMO_REGISTER_CREDENTIALS.password);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(t('createAccount'), t('invalidRegistration'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('createAccount'), t('passwordsDoNotMatch'));
      return;
    }

    const success = await register(username, password);
    if (!success) return;
    router.replace('/onboarding');
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
          <Text className="text-3xl font-extrabold tracking-tight text-dark">
            {t('registerTitle')}
          </Text>
          <Text className="mt-2 text-center text-sm leading-relaxed text-muted">
            {t('registerSubtitle')}
          </Text>
        </View>

        <View className="rounded-[28px] border border-border bg-card p-5">
          <Text className="mb-2 text-sm font-bold text-foreground">Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            className="rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
            placeholder="Username"
            placeholderTextColor="#94a3b8"
          />

          <Text className="mb-2 mt-4 text-sm font-bold text-foreground">{t('password')}</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
          />

          <Text className="mb-2 mt-4 text-sm font-bold text-foreground">
            {t('confirmPassword')}
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            className="rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
          />

          <TouchableOpacity
            onPress={handleRegister}
            className="mt-6 items-center rounded-[16px] bg-primary py-4 shadow-lg shadow-slate-900/10">
            <Text className="font-bold text-white">{t('createAccount')}</Text>
          </TouchableOpacity>

          <View className="mt-6 rounded-[20px] bg-background p-4">
            <Text className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              {t('demoAccount')}
            </Text>
            <Text className="mt-2 text-sm text-foreground">
              Username: {DEMO_REGISTER_CREDENTIALS.username}
            </Text>
            <Text className="text-sm text-foreground">
              {t('demoPassword')}: {DEMO_REGISTER_CREDENTIALS.password}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setUsername(DEMO_REGISTER_CREDENTIALS.username);
                setPassword(DEMO_REGISTER_CREDENTIALS.password);
                setConfirmPassword(DEMO_REGISTER_CREDENTIALS.password);
              }}
              className="mt-4 items-center rounded-full border border-border bg-card px-4 py-3">
              <Text className="text-sm font-bold text-foreground">{t('useDemoCredentials')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.replace('/login')}
            className="mt-4 items-center rounded-[16px] border border-border bg-background py-4">
            <Text className="font-bold text-foreground">{t('signIn')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
