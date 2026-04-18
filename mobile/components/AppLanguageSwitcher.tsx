import { Text, TouchableOpacity, View } from 'react-native';

import { languageLabels, type Language, useTranslation } from '../lib/i18n';

const OPTIONS: Language[] = ['en', 'fr', 'ar'];

export function AppLanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <View className="rounded-full border border-border bg-background/95 p-1 shadow-sm">
      <View className="flex-row gap-1">
        {OPTIONS.map((option) => {
          const selected = option === language;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => setLanguage(option)}
              className={`rounded-full px-3 py-2 ${selected ? 'bg-primary' : 'bg-transparent'}`}>
              <Text className={`text-xs font-bold ${selected ? 'text-white' : 'text-foreground'}`}>
                {languageLabels[option]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
