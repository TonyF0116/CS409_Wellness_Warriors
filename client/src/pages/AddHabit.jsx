import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import './AddHabit.css'

function AddHabit() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    cycle: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      showToast('Please enter a habit name', 'error')
      return
    }
    
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // TODO: Connect to backend API
    console.log('Saving habit:', formData)
    showToast('Habit saved successfully!', 'success')
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="add-habit-page page-enter">
      <h1 className="page-title">Add/Edit Habit</h1>
      
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Value"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Value"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cycle">Cycle</label>
            <select
              id="cycle"
              name="cycle"
              value={formData.cycle}
              onChange={handleChange}
            >
              <option value="">Value</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Value"
              rows={3}
            />
          </div>

          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddHabit
