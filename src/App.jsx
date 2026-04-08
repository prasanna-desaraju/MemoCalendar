import { useEffect, useMemo, useRef, useState } from "react";
import CalendarGrid from "./components/CalendarGrid";
import HeroPanel from "./components/HeroPanel";
import MonthNav from "./components/MonthNav";
import NotesPanel from "./components/NotesPanel";
import { buildCalendarDays, getMonthLabel, getPublicHolidaysForMonth, isSameDay, normalizeRange } from "./utils/calendar";

function getDayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseStoredDate(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(value);
}

function getRangeKey(start, end) {
  return `${getDayKey(start)}_${getDayKey(end)}`;
}

function App() {
  const [monthDate, setMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [monthState, setMonthState] = useState(() => {
    const raw = window.localStorage.getItem("tuftask-month-state");
    return raw ? JSON.parse(raw) : {};
  });
  const [dragPreview, setDragPreview] = useState(null);
  const [isMonthFlipping, setIsMonthFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState("next");
  const flipSwapTimeoutRef = useRef(null);
  const flipEndTimeoutRef = useRef(null);

  const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`;
  const monthLabel = getMonthLabel(monthDate);
  const days = useMemo(() => buildCalendarDays(monthDate), [monthDate]);
  const publicHolidays = useMemo(() => getPublicHolidaysForMonth(monthDate), [monthDate]);
  const publicHolidaysByDate = useMemo(
    () => Object.fromEntries(publicHolidays.map((item) => [item.dateKey, item.name])),
    [publicHolidays]
  );
  const currentMonthState = monthState[monthKey] ?? {};
  const rangeStart = parseStoredDate(currentMonthState.start);
  const rangeEnd = parseStoredDate(currentMonthState.end);
  const monthNotes = currentMonthState.monthNotes ?? currentMonthState.notes ?? "";
  const dateNotes = currentMonthState.dateNotes ?? {};
  const rangeNotes = currentMonthState.rangeNotes ?? {};
  const selectedDateKey = rangeStart && !rangeEnd ? getDayKey(rangeStart) : null;
  const selectedRangeKey = rangeStart && rangeEnd ? getRangeKey(rangeStart, rangeEnd) : null;
  const selectedDateNotes = selectedDateKey ? dateNotes[selectedDateKey] ?? "" : "";
  const selectedRangeNotes = selectedRangeKey ? rangeNotes[selectedRangeKey] ?? "" : "";
  const selectedHolidayName = selectedDateKey ? publicHolidaysByDate[selectedDateKey] ?? null : null;
  const visibleRange = dragPreview ? normalizeRange(dragPreview.start, dragPreview.end) : null;

  useEffect(() => {
    setDragPreview(null);
  }, [monthKey]);

  useEffect(() => () => {
    if (flipSwapTimeoutRef.current) window.clearTimeout(flipSwapTimeoutRef.current);
    if (flipEndTimeoutRef.current) window.clearTimeout(flipEndTimeoutRef.current);
  }, []);

  function runMonthFlip(monthDelta, direction) {
    if (isMonthFlipping) return;
    setFlipDirection(direction);
    setIsMonthFlipping(true);

    flipSwapTimeoutRef.current = window.setTimeout(() => {
      setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + monthDelta, 1));
      flipSwapTimeoutRef.current = null;
    }, 300);

    flipEndTimeoutRef.current = window.setTimeout(() => {
      setIsMonthFlipping(false);
      flipEndTimeoutRef.current = null;
    }, 620);
  }

  function handlePrevMonth() {
    runMonthFlip(-1, "prev");
  }

  function handleNextMonth() {
    runMonthFlip(1, "next");
  }

  function saveMonthPatch(patch) {
    setMonthState((prev) => {
      const oldMonth = prev[monthKey] ?? {};
      const updated = {
        ...prev,
        [monthKey]: {
          ...oldMonth,
          ...patch
        }
      };
      window.localStorage.setItem("tuftask-month-state", JSON.stringify(updated));
      return updated;
    });
  }

  function handleRangeSelect(startDay, endDay) {
    setDragPreview(null);
    if (!startDay || !endDay) return;

    const normalized = normalizeRange(startDay, endDay);
    if (isSameDay(normalized.start, normalized.end) && rangeStart && !rangeEnd && isSameDay(rangeStart, normalized.start)) {
      saveMonthPatch({ start: null, end: null });
      return;
    }

    if (isSameDay(normalized.start, normalized.end)) {
      saveMonthPatch({ start: getDayKey(normalized.start), end: null });
      return;
    }

    saveMonthPatch({
      start: getDayKey(normalized.start),
      end: getDayKey(normalized.end)
    });
  }

  function handleDayClick(day, isCurrentMonth) {
    if (!isCurrentMonth) return;

    if (rangeStart && !rangeEnd && isSameDay(rangeStart, day)) {
      saveMonthPatch({ start: null, end: null });
      return;
    }

    if (!rangeStart || (rangeStart && rangeEnd)) {
      saveMonthPatch({ start: getDayKey(day), end: null });
      return;
    }

    const normalized = normalizeRange(rangeStart, day);
    saveMonthPatch({
      start: getDayKey(normalized.start),
      end: getDayKey(normalized.end)
    });
  }

  function handleRangePreview(startDay, endDay) {
    if (!startDay || !endDay) {
      setDragPreview(null);
      return;
    }
    setDragPreview({ start: startDay, end: endDay });
  }

  function handleNotesChange(scope, value) {
    if (scope === "month") {
      saveMonthPatch({ monthNotes: value });
      return;
    }

    if (scope === "date" && selectedDateKey) {
      saveMonthPatch({
        dateNotes: {
          ...dateNotes,
          [selectedDateKey]: value
        }
      });
      return;
    }

    if (scope === "range" && selectedRangeKey) {
      saveMonthPatch({
        rangeNotes: {
          ...rangeNotes,
          [selectedRangeKey]: value
        }
      });
    }
  }

  function handleDeleteSavedNote(type, key) {
    if (type === "date") {
      const nextDateNotes = { ...dateNotes };
      delete nextDateNotes[key];
      saveMonthPatch({ dateNotes: nextDateNotes });
      return;
    }

    if (type === "range") {
      const nextRangeNotes = { ...rangeNotes };
      delete nextRangeNotes[key];
      saveMonthPatch({ rangeNotes: nextRangeNotes });
    }
  }

  return (
    <main className="page">
      <section className={`calendar-card ${isMonthFlipping ? `flip-page-${flipDirection}` : ""}`}>
        <HeroPanel monthLabel={monthLabel.toUpperCase()} monthIndex={monthDate.getMonth()} />

        <section className="calendar-body">
          <div className="calendar-content">
            <MonthNav
              label={monthLabel}
              onPrev={handlePrevMonth}
              onNext={handleNextMonth}
              disabled={isMonthFlipping}
            />
            <CalendarGrid
              days={days}
              rangeStart={visibleRange?.start ?? rangeStart}
              rangeEnd={visibleRange?.end ?? rangeEnd}
              onDayClick={handleDayClick}
              onRangeSelect={handleRangeSelect}
              onRangePreview={handleRangePreview}
              hasDateNote={(date) => Boolean(dateNotes[getDayKey(date)])}
              getHolidayName={(date) => publicHolidaysByDate[getDayKey(date)] ?? null}
            />
          </div>
          <NotesPanel
            monthNotes={monthNotes}
            dateNotes={selectedDateNotes}
            rangeNotes={selectedRangeNotes}
            allDateNotes={dateNotes}
            allRangeNotes={rangeNotes}
            onChange={handleNotesChange}
            onDeleteSavedNote={handleDeleteSavedNote}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            selectedHolidayName={selectedHolidayName}
          />
        </section>
      </section>
    </main>
  );
}

export default App;
