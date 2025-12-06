import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './MainLayout.css'

function MainLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <span className="logo">Wellness Warriors</span>
          
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
          
          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
              Dashboard
            </NavLink>
            <NavLink to="/add-habit" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
              Add Habit
            </NavLink>
            <NavLink to="/calendar" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
              Calendar View
            </NavLink>
            <NavLink to="/profile" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
              Profile
            </NavLink>
            <button className="nav-link" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2025 Wellness Warriors | Stay Healthy, Stay Consistent</p>
      </footer>
    </div>
  )
}

export default MainLayout
