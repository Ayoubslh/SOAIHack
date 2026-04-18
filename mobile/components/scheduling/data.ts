export type CalendarDay = {
  day: number;
  full: boolean;
  dateString: string;
};

export type VisitTypeKey = 'consultation' | 'followUp' | 'routineCheckup' | 'emergency';

export type Specialist = {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  available: boolean;
  wilaya: string;
};

// export const SPECIALISTS: Specialist[] = [
//   {
//     id: '1',
//     name: 'Dr. Sarah Wilson',
//     specialty: 'Cardiologist',
//     rating: '4.8',
//     available: true,
//     wilaya: 'Algiers',
//   },
//   {
//     id: '2',
//     name: 'Dr. James Miller',
//     specialty: 'Dermatologist',
//     rating: '4.9',
//     available: true,
//     wilaya: 'Oran',
//   },
//   {
//     id: '3',
//     name: 'Dr. Emily Chen',
//     specialty: 'General Practice',
//     rating: '4.7',
//     available: false,
//     wilaya: 'Algiers',
//   },
//   {
//     id: '4',
//     name: 'Dr. Michael Ross',
//     specialty: 'Neurologist',
//     rating: '4.9',
//     available: true,
//     wilaya: 'Constantine',
//   },
//   {
//     id: '5',
//     name: 'Dr. Amina Benali',
//     specialty: 'Cardiologist',
//     rating: '4.6',
//     available: true,
//     wilaya: 'Oran',
//   },
//   {
//     id: '6',
//     name: 'Dr. Karim Tazi',
//     specialty: 'General Practice',
//     rating: '4.8',
//     available: true,
//     wilaya: 'Constantine',
//   },
// ];

export const VISIT_TYPES: VisitTypeKey[] = [
  'consultation',
  'followUp',
  'routineCheckup',
  'emergency',
];
export const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const BASE_TIME_SLOTS = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

export const CURRENT_DATE = new Date('2026-04-17T00:00:00');
export const CURRENT_DAY = CURRENT_DATE.getDate();

export const buildCalendar = (): (CalendarDay | null)[] =>
  Array.from({ length: 35 }).map((_, index) => {
    const day = index - 1;
    if (index < 2 || day > 30) return null;

    
    return {
      day,
      full: day < CURRENT_DAY ,
      dateString: `2026-04-${day.toString().padStart(2, '0')}`,
    };
  });

export const AVAILABLE_TIMES_BY_DAY: Record<number, string[]> = {
  17: ['09:00 AM', '10:30 AM', '02:30 PM'],
  18: ['10:30 AM', '01:00 PM', '04:00 PM'],
  21: ['09:00 AM', '01:00 PM', '02:30 PM'],
  22: ['10:30 AM', '02:30 PM', '04:00 PM'],
  23: ['09:00 AM', '01:00 PM'],
  24: ['10:30 AM', '04:00 PM'],
  27: ['09:00 AM', '02:30 PM', '04:00 PM'],
  30: ['10:30 AM', '01:00 PM', '04:00 PM'],
};

export const getAvailableTimes = (day: number) => AVAILABLE_TIMES_BY_DAY[day] ?? BASE_TIME_SLOTS;
