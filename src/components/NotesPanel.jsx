import { useEffect, useMemo, useState } from "react";

function parseKeyToDate(dateKey) {
  if (!dateKey) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const parsed = new Date(dateKey);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeDateKey(dateKey) {
  const parsed = parseKeyToDate(dateKey);
  if (!parsed) return dateKey;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatKeyDate(dateKey) {
  const normalizedKey = normalizeDateKey(dateKey);
  const [year, month, day] = normalizedKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

function formatRangeKey(rangeKey) {
  const [start, end] = rangeKey.split("_");
  return `${formatKeyDate(start)} - ${formatKeyDate(end)}`;
}

function NotesPanel({
  monthNotes,
  dateNotes,
  rangeNotes,
  allDateNotes,
  allRangeNotes,
  onChange,
  onDeleteSavedNote,
  rangeStart,
  rangeEnd,
  selectedHolidayName
}) {
  const [scope, setScope] = useState("month");

  const hasDateSelection = Boolean(rangeStart && !rangeEnd);
  const hasRangeSelection = Boolean(rangeStart && rangeEnd);

  useEffect(() => {
    if (hasRangeSelection) {
      setScope("range");
      return;
    }
    if (hasDateSelection) {
      setScope("date");
      return;
    }
    setScope("month");
  }, [hasDateSelection, hasRangeSelection]);

  const rangeText = rangeStart && rangeEnd
    ? `${rangeStart.toDateString()} - ${rangeEnd.toDateString()}`
    : rangeStart
      ? `Start: ${rangeStart.toDateString()}`
      : "No range selected";

  const activeScope = useMemo(() => {
    if (scope === "date" && !hasDateSelection) return "month";
    if (scope === "range" && !hasRangeSelection) return "month";
    return scope;
  }, [scope, hasDateSelection, hasRangeSelection]);

  const activeValue = activeScope === "date"
    ? dateNotes
    : activeScope === "range"
      ? rangeNotes
      : monthNotes;

  const placeholder = activeScope === "date"
    ? "Add a note for this selected date..."
    : activeScope === "range"
      ? "Add a note for this selected date range..."
      : "Write monthly goals, reminders, or general notes...";

  const savedItems = useMemo(() => {
    const dateItems = Object.entries(allDateNotes ?? {})
      .filter(([, text]) => text && text.trim())
      .map(([key, text]) => ({
        key: `date:${key}`,
        noteKey: key,
        type: "Date",
        typeKey: "date",
        label: formatKeyDate(key),
        sortKey: normalizeDateKey(key),
        text: text.trim()
      }));

    const rangeItems = Object.entries(allRangeNotes ?? {})
      .filter(([, text]) => text && text.trim())
      .map(([key, text]) => {
        const [start] = key.split("_");
        return {
          key: `range:${key}`,
          noteKey: key,
          type: "Range",
          typeKey: "range",
          label: formatRangeKey(key),
          sortKey: normalizeDateKey(start),
          text: text.trim()
        };
      });

    return [...dateItems, ...rangeItems].sort((a, b) => {
      const compare = a.sortKey.localeCompare(b.sortKey);
      if (compare !== 0) return compare;
      return a.type.localeCompare(b.type);
    });
  }, [allDateNotes, allRangeNotes]);

  return (
    <aside className="notes-panel">
      <h2>Notes</h2>
      <p className="notes-subtitle">{rangeText}</p>
      {selectedHolidayName ? (
        <p className="holiday-occasion">Occasion: {selectedHolidayName}</p>
      ) : null}
      <div className="notes-scopes">
        <button
          type="button"
          className={activeScope === "month" ? "active" : ""}
          onClick={() => setScope("month")}
        >
          Month
        </button>
        <button
          type="button"
          className={activeScope === "date" ? "active" : ""}
          onClick={() => setScope("date")}
          disabled={!hasDateSelection}
          title={hasDateSelection ? "Attach note to selected date" : "Select one date to enable"}
        >
          Date
        </button>
        <button
          type="button"
          className={activeScope === "range" ? "active" : ""}
          onClick={() => setScope("range")}
          disabled={!hasRangeSelection}
          title={hasRangeSelection ? "Attach note to selected range" : "Select start and end dates to enable"}
        >
          Range
        </button>
      </div>
      <textarea
        value={activeValue}
        onChange={(e) => onChange(activeScope, e.target.value)}
        placeholder={placeholder}
      />
      <section className="saved-notes">
        <h3>Saved notes this month</h3>
        {savedItems.length === 0 ? (
          <p className="saved-notes-empty">No date/range notes yet.</p>
        ) : (
          <ul>
            {savedItems.map((item) => (
              <li key={item.key}>
                <p className="saved-note-head">
                  <span>{item.type}</span>
                  <strong>{item.label}</strong>
                </p>
                <p className="saved-note-text">{item.text}</p>
                <button
                  type="button"
                  className="saved-note-delete"
                  onClick={() => onDeleteSavedNote(item.typeKey, item.noteKey)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}

export default NotesPanel;
