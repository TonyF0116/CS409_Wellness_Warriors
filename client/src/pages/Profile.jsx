import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import './Profile.css'

function Profile() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')

  const stats = [
    { label: 'Days Active', value: 47 },
    { label: 'Current Streak', value: 7 },
    { label: 'Habits Completed', value: 312 },
  ]

  const handleSave = () => {
    if (name.trim()) {
      updateUser({ name: name.trim() })
      showToast('Profile updated successfully!', 'success')
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setName(user?.name || '')
    setEditing(false)
  }

  return (
    <div className="profile-page page-enter">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="profile-info">
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="name-input"
                autoFocus
              />
            ) : (
              <h1>{user?.name || 'Username'}</h1>
            )}
            <p>{user?.email || 'user@example.com'}</p>
          </div>
          <div className="profile-actions">
            {editing ? (
              <>
                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              </>
            ) : (
              <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit</button>
            )}
          </div>
        </div>

        <div className="stats-grid">
          {stats.map(stat => (
            <div key={stat.label} className="stat-card">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile
