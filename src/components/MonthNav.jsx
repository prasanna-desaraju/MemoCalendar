function MonthNav({ label, onPrev, onNext }) {
  return (
    <header className="month-nav">
      <button onClick={onPrev} aria-label="Previous month">
        ←
      </button>
      <h2>{label}</h2>
      <button onClick={onNext} aria-label="Next month">
        →
      </button>
    </header>
  );
}

export default MonthNav;
