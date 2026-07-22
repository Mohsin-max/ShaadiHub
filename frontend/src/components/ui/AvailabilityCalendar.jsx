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

function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
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
  'available-selectable':
    'bg-white border border-outline-variant text-on-surface hover:border-antique-gold hover:bg-antique-gold/10 hover:text-primary cursor-pointer transition-colors',
  selected: 'bg-antique-gold border-antique-gold text-primary font-bold ring-2 ring-antique-gold/40',
  booked: 'bg-primary border border-primary text-on-primary font-semibold',
  'booked-editable':
    'bg-primary border border-primary text-on-primary font-semibold hover:brightness-110 cursor-pointer transition-all',
  past: 'bg-surface-container-low border border-outline-variant/30 text-on-surface-variant/40',
  outside: 'bg-transparent text-on-surface-variant/20',
}

function AvailabilityCalendar({
  bookedDates = [],
  selectable = false,
  selectedDate = null,
  onSelectDate,
  editable = false,
  onToggleBlock,
  togglingDate = null,
}) {
  const today = startOfDay(new Date())
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const [viewDate, setViewDate] = useState(currentMonthStart)

  const isAtCurrentMonth = viewDate.getTime() === currentMonthStart.getTime()

  const cells = buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth())

  const goPrev = () => {
    if (isAtCurrentMonth) return
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }
  const goNext = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const findBooking = (iso) => bookedDates.find((b) => b.date === iso)

  const cellState = (cell) => {
    if (!cell.inMonth) return 'outside'
    if (cell.date < today) return 'past'
    const iso = toISODate(cell.date)
    const booking = findBooking(iso)
    if (booking) {
      return editable && booking.source === 'Manual' ? 'booked-editable' : 'booked'
    }
    if (selectedDate === iso) return 'selected'
    if (editable) return 'available-selectable'
    return selectable ? 'available-selectable' : 'available'
  }

  const handleCellClick = (cell) => {
    const iso = toISODate(cell.date)
    if (editable) {
      const booking = findBooking(iso)
      if (booking && booking.source === 'Manual') {
        onToggleBlock?.(iso, true)
      } else if (!booking) {
        onToggleBlock?.(iso, false)
      }
      return
    }
    onSelectDate?.(iso)
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

      {editable && (
        <p className="text-[11px] text-on-surface-variant -mt-2 mb-4 flex items-center gap-1.5">
          <Icon name="info" className="text-[14px]" />
          Click an available date to block it for offline bookings. Click a gold-outlined booked date to unblock it.
        </p>
      )}

      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-[10px] font-semibold text-on-surface-variant py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 mb-5">
          {cells.map((cell, i) => {
            const state = cellState(cell)
            const iso = cell.inMonth ? toISODate(cell.date) : null
            const isLoading = editable && togglingDate === iso
            const className = `h-9 rounded-md flex items-center justify-center text-[12px] ${CELL_STYLES[state]} ${
              isLoading ? 'opacity-50 pointer-events-none' : ''
            } ${state === 'booked-editable' ? 'ring-2 ring-antique-gold' : ''}`
            if (state === 'available-selectable' || state === 'booked-editable') {
              return (
                <button key={i} type="button" onClick={() => handleCellClick(cell)} className={className}>
                  {cell.day}
                </button>
              )
            }
            return (
              <div key={i} className={className}>
                {cell.day}
              </div>
            )
          })}
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
        {selectable && !editable && (
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-antique-gold" />
            <span className="text-[12px] text-on-surface-variant">Selected</span>
          </div>
        )}
        {editable && (
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-primary ring-2 ring-antique-gold" />
            <span className="text-[12px] text-on-surface-variant">Manually blocked (click to unblock)</span>
          </div>
        )}
      </div>
    </section>
  )
}

export default AvailabilityCalendar
