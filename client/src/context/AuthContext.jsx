import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('wellness_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('wellness_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    if (!email || !password) {
      throw new Error('Email and password required')
    }
    const userData = {
      id: '1',
      name: email.split('@')[0],
      email
    }
    localStorage.setItem('wellness_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    if (!name || !email || !password) {
      throw new Error('All fields required')
    }
    const userData = { id: '1', name, email }
    localStorage.setItem('wellness_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('wellness_user')
    setUser(null)
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    localStorage.setItem('wellness_user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
