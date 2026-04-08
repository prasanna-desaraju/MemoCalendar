import { useMemo, useState } from "react";
import CalendarGrid from "./components/CalendarGrid";
import HeroPanel from "./components/HeroPanel";
import MonthNav from "./components/MonthNav";
import NotesPanel from "./components/NotesPanel";
import { buildCalendarDays, getMonthLabel, isSameDay, normalizeRange } from "./utils/calendar";

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

  const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`;
  const monthLabel = getMonthLabel(monthDate);
  const days = useMemo(() => buildCalendarDays(monthDate), [monthDate]);
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

  function handlePrevMonth() {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function handleNextMonth() {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
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
      <section className="calendar-card">
        <HeroPanel monthLabel={monthLabel.toUpperCase()} monthIndex={monthDate.getMonth()} />

        <section className="calendar-body">
          <div className="calendar-content">
            <MonthNav label={monthLabel} onPrev={handlePrevMonth} onNext={handleNextMonth} />
            <CalendarGrid
              days={days}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              onDayClick={handleDayClick}
              hasDateNote={(date) => Boolean(dateNotes[getDayKey(date)])}
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
          />
        </section>
      </section>
    </main>
  );
}

export default App;
