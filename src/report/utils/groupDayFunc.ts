import type { PressureRecord } from 'types/PressureRecordType';

type DailyMeasurement = {
  date: string; // '14.11.2025'
  morning?: { pressure: string; pulse: number };
  evening?: { pressure: string; pulse: number };
};

export function groupByDay(records: PressureRecord[]): DailyMeasurement[] {
  const grouped: Record<string, DailyMeasurement> = {}; //Инициализируем пустой объект для группировки

  for (const r of records) {
    const dateObj = new Date(r.createdAt); // Создаем объект Date из createdAt
    const dateStr = dateObj.toLocaleDateString('uk-UA'); //Переводим в формат '14.11.2025'

    if (!grouped[dateStr]) grouped[dateStr] = { date: dateStr }; //Если для этой даты еще нет записи, создаем ее

    const hour = dateObj.getHours(); // Получаем час из createdAt

    const measurement = {
      // Создаем объект измерения давления и пульса
      pressure: r.pressure,
      pulse: r.pulse,
    };

    if (hour < 12) {
      grouped[dateStr].morning = measurement; // Если час меньше 12, это утреннее измерение
    } else {
      grouped[dateStr].evening = measurement; // Если час 12 или больше, это вечернее измерение
    }
  }

  return Object.values(grouped); // Возвращаем массив сгруппированных данных
}
