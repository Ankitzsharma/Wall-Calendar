#  Wall Calendar Component

A production-quality, highly polished interactive "Wall Calendar" component built with React, Next.js, and Framer Motion. This project mimics the aesthetic and functionality of a physical wall calendar with modern digital enhancements.

##  Features

- **Wall Calendar Aesthetic**: Realistic design with hero images, ring binder decorations, and elegant typography.
- **Intuitive Date Selection**: 
  - Select start and end dates with visual range highlighting.
  - Supports reverse selection (end date before start date).
  - Hover effects for real-time range feedback.
- **Integrated Notes Panel**:
  - Add notes for specific dates, date ranges, or the entire month.
  - Persistent storage using `localStorage`.
  - Clean, journal-like UI for viewing and managing entries.
- **Responsive & Interactive**:
  - Side-by-side layout on desktop, stacked on mobile.
  - Smooth transitions using Framer Motion.
  - Micro-interactions on date hover and click.
- **Advanced Engineering**:
  - Custom hook (`useCalendar`) for clean state management.
  - Utility-first styling with Tailwind CSS.
  - Date manipulation with `date-fns`.

##  Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Utilities**: date-fns

##  Project Structure

```text
/src
  /components
    Calendar.tsx       # Main wrapper component
    CalendarGrid.tsx   # The interactive grid
    DayCell.tsx        # Individual date cells
    NotesPanel.tsx     # Notes management sidebar
  /hooks
    useCalendar.ts     # Custom state management logic
  /utils
    dateHelpers.ts     # Date manipulation utilities
```

##  Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd wall-calendar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to see the calendar in action.

##  Design Decisions

- **Architecture**: Separated UI logic from state management using the `useCalendar` hook, making the components more reusable and easier to test.
- **User Experience**: Implemented a "predictive" range highlight that shows what the range will look like as you hover over dates before clicking the second date.
- **Aesthetic**: Used a combination of serif fonts (`Playfair Display`) and shadows to create a high-end, "physical" feel.
- **Persistence**: Used `localStorage` for notes to ensure data persists across sessions without requiring a backend.

--------------------------
##  Built by Ankit Sharma
--------------------------