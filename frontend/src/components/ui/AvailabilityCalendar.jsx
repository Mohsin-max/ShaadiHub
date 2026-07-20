import { useState } from 'react'
import Icon from './Icon'

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function buildMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = (firstOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells = []

  for (let i = 0; i < startWeekday; i++) {
    cells.push({ day: daysInPrevMonth - startWeekday + 1 + i, inMonth: false })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, inMonth: true, date: new Date(year, month, day) })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - startWeekday - daysInMonth + 1, inMonth: false })
  }

  return cells
}

const CELL_STYLES = {
  available: 'bg-white border border-outline-variant text-on-surface',
  booked: 'bg-primary border border-primary text-on-primary font-semibold',
  past: 'bg-surface-container-low border border-outline-variant/30 text-on-surface-variant/40',
  outside: 'bg-transparent text-on-surface-variant/20',
}

function AvailabilityCalendar({ bookedDays = [] }) {
  const today = startOfDay(new Date())
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const [viewDate, setViewDate] = useState(currentMonthStart)

  const isAtCurrentMonth = viewDate.getTime() === currentMonthStart.getTime()
  const isViewingActualCurrentMonth =
    viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth()

  const cells = buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth())

  const goPrev = () => {
    if (isAtCurrentMonth) return
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }
  const goNext = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const cellState = (cell) => {
    if (!cell.inMonth) return 'outside'
    if (cell.date < today) return 'past'
    if (isViewingActualCurrentMonth && bookedDays.includes(cell.day)) return 'booked'
    return 'available'
  }

  return (
    <section className="bg-white p-6 rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(75,44,94,0.08)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-headline-sm text-[18px] text-primary">Availability Calendar</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            disabled={isAtCurrentMonth}
            className="p-1.5 hover:bg-surface-container transition-colors rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous month"
          >
            <Icon name="chevron_left" className="text-[20px]" />
          </button>
          <span className="text-[13px] font-semibold text-primary w-32 text-center">
            {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
          </span>
          <button
            onClick={goNext}
            className="p-1.5 hover:bg-surface-container transition-colors rounded-full"
            aria-label="Next month"
          >
            <Icon name="chevron_right" className="text-[20px]" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-[10px] font-semibold text-on-surface-variant py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 mb-5">
          {cells.map((cell, i) => (
            <div
              key={i}
              className={`h-9 rounded-md flex items-center justify-center text-[12px] ${CELL_STYLES[cellState(cell)]}`}
            >
              {cell.day}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-5 pt-4 border-t border-outline-variant">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-white border border-outline-variant" />
          <span className="text-[12px] text-on-surface-variant">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-primary" />
          <span className="text-[12px] text-on-surface-variant">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-surface-container-low border border-outline-variant/30" />
          <span className="text-[12px] text-on-surface-variant">Past</span>
        </div>
      </div>
    </section>
  )
}

export default AvailabilityCalendar
