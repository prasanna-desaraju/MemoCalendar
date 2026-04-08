import { useEffect, useRef } from "react";
import { isDayInRange, isSameDay, isToday, weekDays } from "../utils/calendar";

function CalendarGrid({
  days,
  rangeStart,
  rangeEnd,
  onDayClick,
  onRangeSelect,
  onRangePreview,
  hasDateNote,
  getHolidayName
}) {
  const dragStateRef = useRef({ active: false, start: null, last: null, moved: false });
  const suppressClickRef = useRef(false);

  useEffect(() => {
    function handleWindowMouseUp() {
      if (!dragStateRef.current.active) return;
      const { start, last, moved } = dragStateRef.current;
      if (moved) {
        onRangeSelect(start, last ?? start);
        suppressClickRef.current = true;
      } else {
        onRangePreview(null, null);
      }
      dragStateRef.current = { active: false, start: null, last: null, moved: false };
    }

    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  }, [onRangeSelect]);

  function beginDrag(day, isCurrentMonth, event) {
    if (!isCurrentMonth) return;
    event.preventDefault();
    dragStateRef.current = { active: true, start: day, last: day, moved: false };
    onRangePreview(day, day);
  }

  function moveDrag(day, isCurrentMonth) {
    if (!dragStateRef.current.active || !isCurrentMonth) return;
    if (!isSameDay(day, dragStateRef.current.start)) {
      dragStateRef.current.moved = true;
    }
    dragStateRef.current.last = day;
    onRangePreview(dragStateRef.current.start, day);
  }

  function endDrag(day, isCurrentMonth) {
    if (!dragStateRef.current.active) return;
    const { start, last, moved } = dragStateRef.current;
    if (moved) {
      const end = isCurrentMonth ? day : last ?? start;
      onRangeSelect(start, end);
      suppressClickRef.current = true;
    } else {
      onRangePreview(null, null);
    }
    dragStateRef.current = { active: false, start: null, last: null, moved: false };
  }

  function handleClick(day, isCurrentMonth) {
    if (!isCurrentMonth) return;
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onDayClick(day, isCurrentMonth);
  }

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
          const holidayName = isCurrentMonth && getHolidayName ? getHolidayName(day) : null;
          const className = [
            "day-cell",
            !isCurrentMonth ? "adjacent-month" : "",
            isStart ? "start" : "",
            isEnd ? "end" : "",
            isBetween ? "between" : "",
            holidayName ? "holiday" : "",
            isToday(day) ? "today" : ""
          ]
            .join(" ")
            .trim();

          return (
            <button
              key={day.toISOString()}
              className={className}
              onMouseDown={(event) => beginDrag(day, isCurrentMonth, event)}
              onMouseEnter={() => moveDrag(day, isCurrentMonth)}
              onMouseUp={() => endDrag(day, isCurrentMonth)}
              onClick={() => handleClick(day, isCurrentMonth)}
              aria-label={holidayName ? `${day.toDateString()} - ${holidayName}` : `Select ${day.toDateString()}`}
              title={holidayName ?? ""}
            >
              <span>{day.getDate()}</span>
              {holidayName ? <span className="holiday-dot" aria-hidden="true" /> : null}
              {showNoteDot ? <span className="day-note-dot" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarGrid;
