import type { PressureRecord } from 'types/PressureRecordType';

type DailyMeasurement = {
  date: string; // '14.11.2025'
  measurements: { pressure: string; pulse: number }[]; // просто массив всех измерений
};

export function groupByDay(records: PressureRecord[]): DailyMeasurement[] {
  const grouped: Record<string, DailyMeasurement> = {};

  for (const r of records) {
    const dateObj = new Date(r.createdAt);
    const dateStr = dateObj.toLocaleDateString('uk-UA');

    if (!grouped[dateStr])
      grouped[dateStr] = { date: dateStr, measurements: [] };

    grouped[dateStr].measurements.push({
      pressure: r.pressure,
      pulse: r.pulse,
    });
  }

  return Object.values(grouped);
}
