import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import './Dashboard.css'

const initialHabits = [
  { id: 1, name: 'Drink 8 glasses of water', completed: false },
  { id: 2, name: 'Exercise for 30 minutes', completed: false },
  { id: 3, name: 'Read for 20 minutes', completed: false },
  { id: 4, name: 'Meditate for 10 minutes', completed: false },
  { id: 5, name: 'Get 8 hours of sleep', completed: false },
  { id: 6, name: 'Eat healthy breakfast', completed: true },
  { id: 7, name: 'Take vitamins', completed: true },
  { id: 8, name: 'Walk 10,000 steps', completed: true },
  { id: 9, name: 'Practice gratitude', completed: true },
  { id: 10, name: 'Limit screen time', completed: true },
]

function Dashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const streak = 7

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setHabits(initialHabits)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const toggleHabit = (id) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const newCompleted = !h.completed
        showToast(
          newCompleted ? 'Habit completed! 🎉' : 'Habit unchecked',
          'success'
        )
        return { ...h, completed: newCompleted }
      }
      return h
    }))
  }

  const ringData = [
    { color: '#E91E63', progress: 80 },
    { color: '#FF5722', progress: 70 },
    { color: '#00BCD4', progress: 90 },
    { color: '#4CAF50', progress: 60 },
    { color: '#8BC34A', progress: 75 },
  ]

  if (loading) {
    return (
      <div className="dashboard page-enter">
        <div className="dashboard-card">
          <div className="skeleton" style={{ height: '2rem', width: '200px', marginBottom: '2rem' }}></div>
          <div className="dashboard-content">
            <div className="progress-section">
              <div className="skeleton" style={{ width: '280px', height: '280px', borderRadius: '50%' }}></div>
            </div>
            <div className="checklist-section">
              <div className="checklist-card">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="skeleton" style={{ height: '40px', marginBottom: '0.5rem' }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard page-enter">
      <div className="dashboard-card">
        <h1 className="greeting">Howdy, {user?.name || 'Username'}!</h1>
        
        <div className="dashboard-content">
          <div className="progress-section">
            <div className="rings-container">
              <svg viewBox="0 0 200 200" className="progress-rings">
                {ringData.map((ring, i) => {
                  const radius = 90 - i * 16
                  const circumference = 2 * Math.PI * radius
                  const offset = circumference - (ring.progress / 100) * circumference
                  return (
                    <g key={i}>
                      <circle cx="100" cy="100" r={radius} fill="none" stroke="#F5F5F5" strokeWidth="12" />
                      <circle
                        cx="100" cy="100" r={radius}
                        fill="none" stroke={ring.color} strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 100 100)"
                      />
                    </g>
                  )
                })}
              </svg>
            </div>
            <p className="streak-text">Maintained habits for <strong>{streak}</strong> days!</p>
          </div>

          <div className="checklist-section">
            <div className="checklist-card">
              <ul className="habit-list">
                {habits.map(habit => (
                  <li key={habit.id} className="habit-item">
                    <label className={`habit-label ${habit.completed ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={habit.completed}
                        onChange={() => toggleHabit(habit.id)}
                      />
                      <span className="checkbox">
                        {habit.completed && <span className="checkmark">✓</span>}
                      </span>
                      <span className="habit-name">{habit.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
