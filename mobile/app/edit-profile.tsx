import { Stack, router } from 'expo-router';
import { ScrollView, Text, View, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useAuthStore, PersonalData } from '../store/authStore';
import { useTranslation, convertToArabicName } from '../lib/i18n';
import { useLanguageStore } from '../store/languageStore';

export default function EditProfilePage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const personalData = useAuthStore((s) => s.personalData);
  const updatePersonalData = useAuthStore((s) => s.updatePersonalData);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  };

  const pd = personalData || {
    fullName: '',
    age: '',
    gender: '',
    bloodType: '',
    allergies: '',
    medicalConditions: '',
    height: '',
    weight: '',
  };

  const [name, setName] = useState(pd.fullName);
  const [phone, setPhone] = useState(pd.phone || '');
  const [age, setAge] = useState(pd.age);
  const [gender, setGender] = useState(pd.gender || '');
  const [bloodType, setBloodType] = useState(pd.bloodType);
  const [wilaya, setWilaya] = useState(pd.wilaya || '');
  const [allergies, setAllergies] = useState(pd.allergies);
  const [medicalConditions, setMedicalConditions] = useState(pd.medicalConditions);
  const [height, setHeight] = useState(pd.height);
  const [weight, setWeight] = useState(pd.weight);

  const handleSave = async () => {
    await updatePersonalData({
      fullName: name,
      age: age,
      gender: gender as any,
      bloodType: bloodType,
      wilaya: wilaya,
      phone: phone,
      allergies: allergies,
      medicalConditions: medicalConditions,
      height: height,
      weight: weight,
    });
    router.back();
  };

  const displayName = language === 'ar' ? convertToArabicName(name) : name;

  const getLabel = (en: string, fr: string, ar: string) => {
    if (language === 'ar') return ar;
    if (language === 'fr') return fr;
    return en;
  };

  return (
    <ScrollView 
      className="flex-1 bg-background px-5 pt-6"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0ea5e9" colors={['#0ea5e9']} />
      }
    >
      <Stack.Screen
        options={{ title: getLabel('Edit Profile', 'Modifier le profil', 'تعديل الملف الشخصي') }}
      />
      <View className="mb-6 rounded-[24px] bg-subtle p-5">
        <Text className="text-xl font-extrabold text-dark">
          {t('editProfile') ||
            getLabel('Edit your profile', 'Modifier votre profil', 'تعديل ملفك الشخصي')}
        </Text>
      </View>

      <Text className="mb-2 text-sm font-bold text-foreground">
        {getLabel('Name', 'Nom', 'الاسم')} (Displayed as: {displayName})
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        className="mb-4 rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
      />

      <Text className="mb-2 text-sm font-bold text-foreground">
        {getLabel('Phone', 'Téléphone', 'الهاتف')}
      </Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        className="mb-4 rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
      />

      <Text className="mb-2 text-sm font-bold text-foreground">
        {getLabel('Age', 'Âge', 'العمر')}
      </Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        className="mb-4 rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
      />

      <Text className="mb-2 text-sm font-bold text-foreground">
        {getLabel('Gender', 'Genre', 'الجنس')}
      </Text>
      <TextInput
        value={gender}
        onChangeText={setGender}
        className="mb-4 rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
        placeholder={getLabel('male/female/other', 'homme/femme/autre', 'ذكر/أنثى/آخر')}
      />

      <Text className="mb-2 text-sm font-bold text-foreground">Wilaya</Text>
      <TextInput
        value={wilaya}
        onChangeText={setWilaya}
        className="mb-4 rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
      />

      <Text className="mb-2 text-sm font-bold text-foreground">
        {getLabel('Blood Type', 'Groupe sanguin', 'فصيلة الدم')}
      </Text>
      <View className="mb-4 flex-row flex-wrap gap-2">
        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => {
          const selected = bloodType === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setBloodType(type)}
              className={`rounded-full border px-4 py-3 ${selected ? 'border-slate-900 bg-primary' : 'border-border bg-background'}`}>
              <Text className={`text-sm font-bold ${selected ? 'text-white' : 'text-foreground'}`}>
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text className="mb-2 text-sm font-bold text-foreground">
        {getLabel('Allergies', 'Allergies', 'الحساسية')}
      </Text>
      <TextInput
        value={allergies}
        onChangeText={setAllergies}
        className="mb-4 rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
      />

      <Text className="mb-2 text-sm font-bold text-foreground">
        {getLabel('Medical Conditions', 'Conditions médicales', 'الحالات الطبية')}
      </Text>
      <TextInput
        value={medicalConditions}
        onChangeText={setMedicalConditions}
        className="mb-4 rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
      />

      <Text className="mb-2 text-sm font-bold text-foreground">
        {getLabel('Height (cm)', 'Taille (cm)', 'الطول (سم)')}
      </Text>
      <TextInput
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        className="mb-4 rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
      />

      <Text className="mb-2 text-sm font-bold text-foreground">
        {getLabel('Weight (kg)', 'Poids (kg)', 'الوزن (كجم)')}
      </Text>
      <TextInput
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        className="mb-8 rounded-[16px] border border-border bg-background px-4 py-4 text-dark"
      />

      <TouchableOpacity
        onPress={handleSave}
        className="mb-10 items-center rounded-[16px] bg-primary py-4">
        <Text className="font-bold text-white">
          {getLabel('Save Changes', 'Enregistrer', 'حفظ التغييرات')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
