import React from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
  return (
    <div className="landing page-enter">
      <header className="landing-header">
        <div className="landing-header-inner">
          <span className="logo">Wellness Warriors</span>
          <nav className="landing-nav">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-white">Get Started</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <h1>Build Better Habits, Transform Your Life</h1>
            <p>Track your daily habits, maintain streaks, and achieve your wellness goals.</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">Start Free Today</Link>
              <Link to="/login" className="btn btn-outline btn-lg">I Have an Account</Link>
            </div>
          </div>
          <div className="hero-visual">
            <svg viewBox="0 0 200 200" className="hero-rings">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#FFEBEE" strokeWidth="12"/>
              <circle cx="100" cy="100" r="85" fill="none" stroke="#E91E63" strokeWidth="12" strokeLinecap="round" strokeDasharray="534" strokeDashoffset="107" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="65" fill="none" stroke="#E0F7FA" strokeWidth="12"/>
              <circle cx="100" cy="100" r="65" fill="none" stroke="#00BCD4" strokeWidth="12" strokeLinecap="round" strokeDasharray="408" strokeDashoffset="82" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="45" fill="none" stroke="#E8F5E9" strokeWidth="12"/>
              <circle cx="100" cy="100" r="45" fill="none" stroke="#4CAF50" strokeWidth="12" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="28" transform="rotate(-90 100 100)"/>
            </svg>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2025 Wellness Warriors | Stay Healthy, Stay Consistent</p>
      </footer>
    </div>
  )
}

export default Landing
