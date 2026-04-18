import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useTranslation } from '../../lib/i18n';
import { bookAppointment, getDoctors } from '../../lib/api';
import { CalendarPicker } from '../../components/scheduling/CalendarPicker';
import { TimeDropdown } from '../../components/scheduling/TimeDropdown';
import { VisitTypeChips } from '../../components/scheduling/VisitTypeChips';
import { DoctorDropdown } from '../../components/scheduling/DoctorDropdown';
import { DropdownField } from '../../components/scheduling/DropdownField';
import WILAYAS from '../../lib/wilayas.json';
import {
  VISIT_TYPES,
  WEEKDAYS,
  buildCalendar,
  getAvailableTimes,
  type CalendarDay,
  type Specialist,
} from '../../components/scheduling/data';

function FilterDropdown({
  label,
  items,
  selected,
  onSelect,
  placeholder,
  open,
  onToggle,
}: {
  label: string;
  items: string[];
  selected: string | null;
  onSelect: (v: string | null) => void;
  placeholder: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <DropdownField label={label} value={selected || placeholder} open={open} onToggle={onToggle}>
      <ScrollView nestedScrollEnabled className="max-h-[250px]">
        <TouchableOpacity
          key="all-placeholder"
          onPress={() => {
            onSelect(null);
            onToggle();
          }}
          className={`mb-2 rounded-[18px] border px-4 py-3 ${
            selected === null ? 'border-[#0ea5e9] bg-sky-50' : 'border-border bg-background'
          }`}>
          <Text
            className={`text-base font-bold ${selected === null ? 'text-dark' : 'text-foreground'}`}>
            {placeholder}
          </Text>
        </TouchableOpacity>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              onSelect(item);
              onToggle();
            }}
            className={`mb-2 rounded-[18px] border px-4 py-3 ${
              selected === item ? 'border-[#0ea5e9] bg-sky-50' : 'border-border bg-background'
            }`}>
            <Text
              className={`text-base font-bold ${selected === item ? 'text-dark' : 'text-foreground'}`}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </DropdownField>
  );
}

export default function Book() {
  const router = useRouter();
  const { t } = useTranslation();
  const { addAppointment } = useAppointmentStore();
  const userWilaya = useAuthStore((state) => state.personalData?.wilaya);

  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [doctorMenuOpen, setDoctorMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<CalendarDay | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [timeMenuOpen, setTimeMenuOpen] = useState(false);
  const [visitType, setVisitType] = useState('Consultation');
  const [patientNotes, setPatientNotes] = useState('');
  const [patientPhone, setPatientPhone] = useState(() => useAuthStore.getState().personalData?.phone || '');

  const [selectedWilaya, setSelectedWilaya] = useState<string | null>(null);
  const [wilayaMenuOpen, setWilayaMenuOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [specialtyMenuOpen, setSpecialtyMenuOpen] = useState(false);

  const wilayas = useMemo(() => WILAYAS.map((w) => w.name).sort(), []);

  const { data: rawDoctors, refetch, isRefetching } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => getDoctors(),
  });

  const apiSpecialists: Specialist[] = useMemo(() => {
    if (!rawDoctors || !Array.isArray(rawDoctors)) return [];
    return rawDoctors.map((d: any) => ({
      id: d._id || d.id || Math.random().toString(),
      name: d.name || `${d.first_name || 'Dr.'} ${d.last_name || d.username || ''}`,
      specialty: d.specialty || 'General',
      rating: d.rating?.toString() || '4.5',
      available: d.available !== false,
      wilaya: d.wilaya || 'Algiers',
    }));
  }, [rawDoctors]);

  const specialties = useMemo(
    () => Array.from(new Set(apiSpecialists.map((s) => s.specialty))).sort(),
    [apiSpecialists]
  );

  const filteredSpecialists = useMemo(() => {
    let list = [...apiSpecialists];
    if (selectedWilaya) {
      list = list.filter((s) => s.wilaya === selectedWilaya);
    }
    if (selectedSpecialty) {
      list = list.filter((s) => s.specialty === selectedSpecialty);
    }

    // Sort specifically to boost doctors in the user's home wilaya if not specifically filtering wilaya
    if (!selectedWilaya && userWilaya) {
      list.sort((a, b) => {
        const aIsHome = a.wilaya?.toLowerCase() === userWilaya.toLowerCase();
        const bIsHome = b.wilaya?.toLowerCase() === userWilaya.toLowerCase();
        if (aIsHome && !bIsHome) return -1;
        if (!aIsHome && bIsHome) return 1;
        return 0;
      });
    }

    return list;
  }, [apiSpecialists, selectedWilaya, selectedSpecialty, userWilaya]);

  const canBook = Boolean(selectedSpecialist) && Boolean(selectedDate) && Boolean(selectedTime);
  const availableTimes = selectedDate ? getAvailableTimes(selectedDate.day) : [];
  const calendar = buildCalendar();

  const mutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      addAppointment({
        specialist: selectedSpecialist!.name,
        specialty: selectedSpecialist!.specialty,
        date: selectedDate!.dateString,
        time: selectedTime,
        status: 'upcoming',
        riskScore: 5,
        visitType,
        patientNotes,
      });

      router.push('/appointments');
    },
    onError: (error) => {
      console.error('Failed to book appointment:', error);
      alert('Failed to book appointment. Please try again.');
    },
  });

  const handleBook = () => {
    if (!canBook) return;

    const appointment_id = `APT-${Math.floor(Date.now() / 1000)}`;
    const [timeStr, period] = selectedTime.split(' ');
    let hour = parseInt(timeStr.split(':')[0], 10);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    mutation.mutate({
      appointment_id,
      patient_id:
        useAuthStore.getState().personalData?.patientId ||
        useAuthStore.getState().personalData?.userId ||
            'guest',
      patient_name: useAuthStore.getState().personalData?.fullName || 'Guest',
      appointment_date: selectedDate!.dateString,
      appointment_hour: hour,
      specialty: selectedSpecialist!.specialty,
      doctor_id: selectedSpecialist!.id,
      patient_phone: patientPhone || undefined,
      age: parseInt(useAuthStore.getState().personalData?.age || '0', 10) || undefined,
      distance_km: 10,
      prior_no_shows: 0,
      payment_type: 'Cash',
      reminder_sent: false,
      booked_date: new Date().toISOString(),
    });
  };

  return (
    <ScrollView 
      className="flex-1 bg-background px-5 pt-4"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0ea5e9" colors={['#0ea5e9']} />
      }
    >
      <Stack.Screen options={{ title: t('scheduleVisit') }} />

      <Text className="mb-2 mt-2 text-lg font-bold text-dark">Filter By Wilaya</Text>
      <View className="mb-4">
        <FilterDropdown
          label="Wilaya"
          items={wilayas}
          selected={selectedWilaya}
          onSelect={setSelectedWilaya}
          placeholder="All Wilayas"
          open={wilayaMenuOpen}
          onToggle={() => {
            setWilayaMenuOpen(!wilayaMenuOpen);
            setSpecialtyMenuOpen(false);
            setDoctorMenuOpen(false);
          }}
        />
      </View>

      <Text className="mb-2 text-lg font-bold text-dark">Filter By Specialty</Text>
      <View className="mb-4">
        <FilterDropdown
          label="Specialty"
          items={specialties}
          selected={selectedSpecialty}
          onSelect={setSelectedSpecialty}
          placeholder="All Specialties"
          open={specialtyMenuOpen}
          onToggle={() => {
            setSpecialtyMenuOpen(!specialtyMenuOpen);
            setWilayaMenuOpen(false);
            setDoctorMenuOpen(false);
          }}
        />
      </View>

      <Text className="mb-2 mt-2 text-lg font-bold text-dark">Choose Doctor</Text>
      <DoctorDropdown
        specialists={filteredSpecialists}
        selected={selectedSpecialist}
        open={doctorMenuOpen}
        onToggle={() => {
          setDoctorMenuOpen((open) => !open);
          setWilayaMenuOpen(false);
          setSpecialtyMenuOpen(false);
        }}
        onSelect={(spec) => {
          setSelectedSpecialist(spec);
          setDoctorMenuOpen(false);
        }}
      />

      <Text className="mb-4 mt-4 text-lg font-bold text-dark">{t('selectDate')}</Text>
      <CalendarPicker
        monthLabel="April 2026"
        weekdays={WEEKDAYS}
        calendar={calendar}
        selectedDay={selectedDate?.day ?? null}
        onSelect={(item) => {
          setSelectedDate(item);
          setSelectedTime('');
          setTimeMenuOpen(false);
        }}
      />

      {selectedDate && !selectedDate.full && (
        <View className="mb-8">
          <Text className="mb-2 text-base font-bold text-dark">
            {t('availableTimesFor')} {selectedDate.day}
          </Text>
          <Text className="mb-4 text-sm text-muted">
            {t('selectOneOfTheOpenSlotsForTheChosenDate')}
          </Text>
          <TimeDropdown
            times={availableTimes}
            selected={selectedTime}
            open={timeMenuOpen}
            onToggle={() => setTimeMenuOpen((open) => !open)}
            onSelect={(time) => {
              setSelectedTime(time);
              setTimeMenuOpen(false);
            }}
          />
        </View>
      )}

      {selectedDate && selectedDate.full && (
        <View className="mb-8 rounded-[18px] border border-border bg-card px-4 py-3">
          <Text className="text-sm font-bold text-amber-900">{t('thisDateIsFullyBooked')}</Text>
          <Text className="mt-1 text-sm text-amber-800">
            {t('pleaseChooseAnotherAvailableDay')}
          </Text>
        </View>
      )}

      <Text className="mb-4 text-lg font-bold text-dark">{t('visitDetails')}</Text>

      <Text className="mb-2 mt-2 text-sm font-bold text-foreground">{t('visitType')}</Text>
      <VisitTypeChips types={VISIT_TYPES} selected={visitType} onSelect={setVisitType} />

      <Text className="mb-2 mt-4 text-sm font-bold text-foreground">Phone Number</Text>
      <TextInput
        value={patientPhone}
        onChangeText={setPatientPhone}
        placeholder="Enter your phone number"
        placeholderTextColor="#94a3b8"
        keyboardType="phone-pad"
        className="mb-4 rounded-[16px] border border-border bg-card px-4 py-3 text-dark"
      />

      <Text className="mb-2 text-sm font-bold text-foreground">{t('reasonForVisitSymptoms')}</Text>
      <TextInput
        multiline
        numberOfLines={3}
        value={patientNotes}
        onChangeText={setPatientNotes}
        placeholder={t('reasonForVisitPlaceholder')}
        placeholderTextColor="#94a3b8"
        className="mb-10 min-h-[100px] rounded-[16px] border border-border bg-card px-4 pb-4 pt-4 text-dark"
        textAlignVertical="top"
      />

      <View className="pb-12 pt-2">
        <TouchableOpacity
          disabled={!canBook || mutation.isPending}
          onPress={handleBook}
          className={`flex-row items-center justify-center rounded-[16px] bg-[#0ea5e9] py-4 shadow-lg shadow-sky-200 ${
            !canBook || mutation.isPending ? 'opacity-50' : ''
          }`}>
          <Text className="text-lg font-bold text-white">
            {mutation.isPending ? 'Booking...' : t('confirmBooking')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
