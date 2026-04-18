import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../lib/i18n';

interface VisitTypeChipsProps {
  types: string[];
  selected: string;
  onSelect: (type: string) => void;
}

export function VisitTypeChips({ types, selected, onSelect }: VisitTypeChipsProps) {
  const { t } = useTranslation();

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 mb-5 px-5">
        <View className="flex-row gap-2 pr-10">
          {types.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => onSelect(type)}
              className={`rounded-full border px-4 py-2 ${
                selected === type ? 'border-slate-800 bg-slate-800' : 'border-border bg-background'
              }`}>
              <Text
                className={`text-xs font-bold ${selected === type ? 'text-white' : 'text-foreground'}`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
