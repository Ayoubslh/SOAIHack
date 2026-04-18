import { Text, TouchableOpacity, View } from 'react-native';

import { languageLabels, type Language, useTranslation } from '../lib/i18n';

const OPTIONS: Language[] = ['en', 'fr', 'ar'];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <View>
      <Text className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">
        {t('language')}
      </Text>
      <View className="flex-row gap-2">
        {OPTIONS.map((option) => {
          const selected = option === language;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => setLanguage(option)}
              className={`flex-1 rounded-full border px-4 py-3 ${
                selected ? 'border-slate-900 bg-primary' : 'border-border bg-background'
              }`}>
              <Text
                className={`text-center text-sm font-bold ${selected ? 'text-white' : 'text-foreground'}`}>
                {languageLabels[option]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
