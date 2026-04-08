import { isDayInRange, isSameDay, isToday, weekDays } from "../utils/calendar";

function CalendarGrid({ days, rangeStart, rangeEnd, onDayClick, hasDateNote }) {
  return (
    <div className="calendar-grid-wrap">
      <div className="calendar-weekdays">
        {weekDays.map((weekDay) => (
          <span key={weekDay}>{weekDay}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((item) => {
          const day = item.date;
          const isCurrentMonth = item.isCurrentMonth;
          const isStart = isSameDay(day, rangeStart);
          const isEnd = isSameDay(day, rangeEnd);
          const isBetween = isDayInRange(day, rangeStart, rangeEnd);
          const showNoteDot = isCurrentMonth && hasDateNote && hasDateNote(day);
          const className = [
            "day-cell",
            !isCurrentMonth ? "adjacent-month" : "",
            isStart ? "start" : "",
            isEnd ? "end" : "",
            isBetween ? "between" : "",
            isToday(day) ? "today" : ""
          ]
            .join(" ")
            .trim();

          return (
            <button
              key={day.toISOString()}
              className={className}
              onClick={() => onDayClick(day, isCurrentMonth)}
              aria-label={`Select ${day.toDateString()}`}
            >
              <span>{day.getDate()}</span>
              {showNoteDot ? <span className="day-note-dot" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarGrid;
