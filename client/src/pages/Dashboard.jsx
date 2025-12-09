import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { habitApi, progressApi } from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  
  // State
  const [habits, setHabits] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingHabitId, setUpdatingHabitId] = useState(null)

  // 1. Load Data on Mount
  useEffect(() => {
    let isMounted = true

    async function load() {
      if (!user) return
      try {
        setLoading(true)
        const [habitData, overview] = await Promise.all([
          habitApi.list(user.id),
          progressApi.overview(user.id)
        ])
        if (isMounted) {
          setHabits(habitData)
          setSummary(overview)
        }
      } catch (error) {
        showToast(error.message, 'error')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => { isMounted = false }
  }, [user, showToast])

  // Helper: Refresh the summary stats after a change
  const refreshSummary = async () => {
    if (!user) return
    try {
      const overview = await progressApi.overview(user.id)
      setSummary(overview)
    } catch (error) {
      console.error('Failed to refresh summary:', error)
    }
  }

  // 2. Action Handlers
  const toggleHabit = async (habit) => {
    if (!habit || !user) return

    setUpdatingHabitId(habit.id)
    try {
      let updatedHabit
      if (habit.completedToday && habit.completedTodayCompletionId) {
        // Undo completion
        updatedHabit = await habitApi.removeCompletion(user.id, habit.id, habit.completedTodayCompletionId)
        showToast('Marked incomplete', 'info')
      } else {
        // Mark complete
        updatedHabit = await habitApi.logCompletion(user.id, habit.id)
        showToast('Habit completed! 🎉', 'success')
      }

      // Update local state immediately
      setHabits(prev =>
        prev.map(h => (h.id === updatedHabit.id ? updatedHabit : h))
      )
      await refreshSummary()
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setUpdatingHabitId(null)
    }
  }

  const deleteHabit = async (habitId) => {
    if (!user || !habitId) return
    setUpdatingHabitId(habitId)
    try {
      await habitApi.delete(user.id, habitId)
      setHabits(prev => prev.filter(h => h.id !== habitId))
      showToast('Habit deleted', 'info')
      await refreshSummary()
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setUpdatingHabitId(null)
    }
  }

  // 3. Ring Logic
  const completionRate = habits.length
    ? (habits.filter(h => h.completedToday).length / habits.length) * 100
    : 0

  const streak = summary?.activeStreak || 0

  // LOGIC FIX: Simplified to 1 Main Ring. 
  // This removes the confusion of the multi-ring logic.
  const ringData = [
    { 
      color: '#E91E63', // Main Pink Color
      progress: completionRate 
    }
  ]

  if (loading) {
    return (
      <div className="dashboard page-enter">
        <div className="dashboard-card">
          <div className="skeleton" style={{ height: '2rem', width: '200px', marginBottom: '2rem' }}></div>
          <div className="dashboard-content">
             {/* Simple Loading Skeleton */}
            <div className="progress-section">
              <div className="skeleton" style={{ width: '200px', height: '200px', borderRadius: '50%' }}></div>
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
          
          {/* 4. Empty State Handling */}
          {habits.length === 0 ? (
            <div className="empty-state" style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                background: '#f8f9fa', 
                borderRadius: '12px',
                border: '2px dashed #e0e0e0',
                gridColumn: '1 / -1'
              }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2E7D32' }}>No habits yet!</h3>
              <p style={{ color: '#757575', margin: 0 }}>Create your first habit to start tracking.</p >
            </div>
          ) : (
            <>
              {/* 5. Progress Ring Section */}
              <div className="progress-section">
                <div className="rings-container">
                  <svg viewBox="0 0 200 200" className="progress-rings">
                    {ringData.map((ring, i) => {
                      const radius = 90 - i * 16
                      const circumference = 2 * Math.PI * radius
                      const offset = circumference - (ring.progress / 100) * circumference
                      
                      // FIX: Visual Glitch Check
                      const isZero = ring.progress <= 0

                      return (
                        <g key={i}>
                          <circle cx="100" cy="100" r={radius} fill="none" stroke="#F5F5F5" strokeWidth="12" />
                          <circle
                            cx="100" cy="100" r={radius}
                            fill="none" stroke={ring.color} strokeWidth="12"
                            strokeLinecap={isZero ? "butt" : "round"} // Fix: Remove dots if 0
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            transform="rotate(-90 100 100)"
                            opacity={isZero ? 0 : 1}
                          />
                        </g>
                      )
                    })}
                  </svg>
                </div>
                <p className="streak-text">Maintained habits for <strong>{streak}</strong> days!</p >
              </div>

              {/* 6. Checklist Section */}
              <div className="checklist-section">
                <div className="checklist-card">
                  <ul className="habit-list">
                    {habits.map(habit => (
                      <li key={habit.id} className="habit-item">
                        <div className="habit-row">
                          <label className={`habit-label ${habit.completedToday ? 'checked' : ''}`}>
                            <input
                              type="checkbox"
                              checked={habit.completedToday}
                              disabled={updatingHabitId === habit.id}
                              onChange={() => toggleHabit(habit)}
                            />
                            <span className="checkbox">
                              {habit.completedToday && <span className="checkmark">✓</span>}
                            </span>
                            <span className="habit-name">{habit.name}</span>
                          </label>
                          
                          {habit.streak > 0 && (
                            <span className="habit-streak">{habit.streak} day streak</span>
                          )}
                          
                          <button
                            className="delete-habit-btn"
                            title="Delete habit"
                            disabled={updatingHabitId === habit.id}
                            onClick={() => deleteHabit(habit.id)}
                          >
                            &#10006;
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
