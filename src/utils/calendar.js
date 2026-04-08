export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
