# MemoCalendar

A modern, interactive monthly planner built with **React + Vite**, designed to combine calendar planning, date-range workflows, and contextual note-taking in one clean experience.

## Live Demo

[View Live Demo](https://memo-calendar-one.vercel.app/)

---

## Highlights

- **Interactive date selection** with both:
  - manual two-click start/end selection
  - drag-to-select range interaction
- **Integrated Notes Hub** with three scopes:
  - monthly notes
  - date-specific notes
  - range-specific notes
- **Persistent data model** using browser `localStorage`
- **Smart note organization** with sorted saved notes and quick delete actions
- **Important day awareness** with highlighted dates and occasion details
- **Premium UX touches** including month page-turn animation and responsive layout

---

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Language:** JavaScript (ES Modules)
- **Styling:** Plain CSS (component-oriented structure)
- **Storage:** Browser `localStorage`

---

## Component Architecture

### `App.jsx`
Core orchestrator for state and behavior.

**Responsibilities**
- Manages current month, selected date/range, and drag preview state
- Coordinates month flip transitions
- Persists and retrieves notes from `localStorage`
- Maps important dates to calendar and notes panel views

### `components/CalendarGrid.jsx`
Interactive calendar surface.

**Responsibilities**
- Renders the month grid and weekday headers
- Supports click and drag range interactions
- Displays visual states (start/end/between, today, note markers, highlighted occasions)

### `components/NotesPanel.jsx`
Context-aware notes workspace.

**Responsibilities**
- Switches between Month / Date / Range note modes
- Shows selected context and occasion information
- Lists saved notes in ascending date order with delete controls

### `components/MonthNav.jsx`
Month navigation controls and label.

**Responsibilities**
- Previous/next month actions
- Temporary control lock during animated transitions

### `components/HeroPanel.jsx`
Visual top section for the planner.

**Responsibilities**
- Displays month/year in a wall-calendar inspired hero layout

### `utils/calendar.js`
Central calendar utility module.

**Responsibilities**
- Builds calendar day matrices
- Normalizes and compares date ranges
- Provides month labels and important date helpers

---

## Project Structure

```text
src/
  App.jsx
  main.jsx
  styles.css
  components/
    CalendarGrid.jsx
    HeroPanel.jsx
    MonthNav.jsx
    NotesPanel.jsx
  utils/
    calendar.js
```

---

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

### 3) Create production build

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

---

## Why This Project Stands Out

MemoCalendar is not just a static calendar UI. It is a behavior-rich planner that combines:
- smooth interaction design,
- practical note workflows,
- thoughtful date intelligence,
- and persistent personal planning data.

It is built to be both **visually polished** and **functionally useful**.
