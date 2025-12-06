import React, { useState } from 'react'
import './CalendarView.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Mock data for habit completion
const mockCompletionData = {
  '2025-1-5': true,
  '2025-1-6': true,
  '2025-1-7': true,
  '2025-1-10': true,
  '2025-1-11': true,
  '2025-1-12': true,
  '2025-1-15': true,
  '2025-1-16': true,
  '2025-1-20': true,
  '2025-1-21': true,
  '2025-1-22': true,
}

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, key: `empty-${i}` })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    const dateKey = `${year}-${month + 1}-${i}`
    const hasData = mockCompletionData[dateKey] || false
    days.push({ day: i, key: i, isToday, hasData })
  }

  return (
    <div className="calendar-page page-enter">
      <div className="calendar-card">
        <h1>Calendar View</h1>
        <p className="subtitle">Track your habit history</p>

        <div className="calendar-nav">
          <button onClick={prevMonth} className="nav-btn">&lt;</button>
          <span className="month-label">{MONTHS[month]} {year}</span>
          <button onClick={nextMonth} className="nav-btn">&gt;</button>
        </div>

        <div className="calendar-grid">
          {DAYS.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
          {days.map(({ day, key, isToday, hasData }) => (
            <div
              key={key}
              className={`day-cell ${!day ? 'empty' : ''} ${isToday ? 'today' : ''} ${hasData ? 'has-data' : ''}`}
            >
              {day && (
                <>
                  <span className="day-number">{day}</span>
                  {hasData && <span className="data-dot"></span>}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-dot"></span>
            <span>Habits completed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
