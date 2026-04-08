export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PUBLIC_HOLIDAYS = [
  { month: 0, day: 1, name: "New Year's Day" },
  { month: 0, day: 26, name: "Republic Day" },
  { month: 1, day: 4, name: "World Cancer Day" },
  { month: 2, day: 8, name: "International Women's Day" },
  { month: 3, day: 14, name: "Ambedkar Jayanti" },
  { month: 4, day: 8, name: "World Red Cross Day" },
  { month: 4, day: 1, name: "Labour Day" },
  { month: 5, day: 5, name: "World Environment Day" },
  { month: 5, day: 8, name: "World Oceans Day" },
  { month: 5, day: 20, name: "World Refugee Day" },
  { month: 5, day: 21, name: "International Yoga Day" },
  { month: 6, day: 11, name: "World Population Day" },
  { month: 6, day: 30, name: "International Friendship Day" },
  { month: 7, day: 15, name: "Independence Day" },
  { month: 8, day: 5, name: "Teachers' Day" },
  { month: 9, day: 2, name: "Gandhi Jayanti" },
  { month: 9, day: 10, name: "World Mental Health Day" },
  { month: 10, day: 14, name: "World Diabetes Day" },
  { month: 10, day: 14, name: "Children's Day" },
  { month: 11, day: 1, name: "World AIDS Day" },
  { month: 11, day: 25, name: "Christmas Day" }
];

export function getMonthLabel(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function buildCalendarDays(currentMonthDate) {
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days = [];
  for (let i = startWeekDay - 1; i >= 0; i -= 1) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false
    });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      date: new Date(year, month, day),
      isCurrentMonth: true
    });
  }

  while (days.length % 7 !== 0) {
    const nextDay = days.length - (startWeekDay + daysInMonth) + 1;
    days.push({
      date: new Date(year, month + 1, nextDay),
      isCurrentMonth: false
    });
  }

  return days;
}

export function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(day) {
  if (!day) return false;
  const now = new Date();
  return (
    day.getFullYear() === now.getFullYear() &&
    day.getMonth() === now.getMonth() &&
    day.getDate() === now.getDate()
  );
}

export function isDayInRange(day, start, end) {
  if (!day || !start || !end) return false;
  const t = new Date(day).setHours(0, 0, 0, 0);
  const s = new Date(start).setHours(0, 0, 0, 0);
  const e = new Date(end).setHours(0, 0, 0, 0);
  return t >= s && t <= e;
}

export function normalizeRange(start, end) {
  if (!start || !end) return { start, end };
  if (start <= end) return { start, end };
  return { start: end, end: start };
}

export function getPublicHolidaysForMonth(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  return PUBLIC_HOLIDAYS
    .filter((item) => item.month === month)
    .map((item) => {
      const date = new Date(year, item.month, item.day);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return {
        date,
        dateKey,
        name: item.name
      };
    })
    .sort((a, b) => a.date - b.date);
}
