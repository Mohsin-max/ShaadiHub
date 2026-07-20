import { createContext, useContext, useMemo, useState } from 'react'
import * as api from '../utils/api'

const STORAGE_KEY = 'shaadihub_auth'

const AuthContext = createContext(null)

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth)

  const persist = (data) => {
    setAuth(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const signupClient = async (payload) => {
    const data = await api.signupClient(payload)
    persist(data)
    return data
  }

  const signupProvider = async (payload) => {
    const data = await api.signupProvider(payload)
    persist(data)
    return data
  }

  const login = async (payload) => {
    const data = await api.login(payload)
    persist(data)
    return data
  }

  const logout = () => {
    setAuth(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({ user: auth, signupClient, signupProvider, login, logout }),
    [auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
