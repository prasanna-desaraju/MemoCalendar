function MonthNav({ label, onPrev, onNext, disabled = false }) {
  return (
    <header className="month-nav">
      <button onClick={onPrev} aria-label="Previous month" disabled={disabled}>
        ←
      </button>
      <h2>{label}</h2>
      <button onClick={onNext} aria-label="Next month" disabled={disabled}>
        →
      </button>
    </header>
  );
}

export default MonthNav;
