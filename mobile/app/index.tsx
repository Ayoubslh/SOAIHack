import { Redirect } from 'expo-router';

import { useAuthStore } from '../store/authStore';

export default function IndexRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const onboardingComplete = useAuthStore((state) => state.onboardingComplete);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href={onboardingComplete ? '/(tabs)' : '/onboarding'} />;
}
