import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { progressApi } from '../services/api'
import './CalendarView.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const formatDateKey = (date) => {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function CalendarView() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarData, setCalendarData] = useState({})
  const [loading, setLoading] = useState(true)
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  useEffect(() => {
    let isMounted = true
    async function loadCalendar() {
      if (!user) return
      setLoading(true)
      const start = new Date(year, month, 1)
      const end = new Date(year, month + 1, 0)
      try {
        const data = await progressApi.calendar(user.id, {
          start: formatDateKey(start),
          end: formatDateKey(end)
        })
        if (isMounted) {
          setCalendarData(data.dates || {})
        }
      } catch (error) {
        showToast(error.message, 'error')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadCalendar()
    return () => { isMounted = false }
  }, [user, year, month, showToast])

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, key: `empty-${i}` })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    const dateKey = `${year}-${month + 1}-${i}`
    const isoKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const hasData = calendarData[isoKey] || false
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

        {loading && <p className="subtitle">Loading calendar...</p>}

        <div className={`calendar-grid ${loading ? 'is-loading' : ''}`}>
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
