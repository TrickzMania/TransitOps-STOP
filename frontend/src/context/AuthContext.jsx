import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'transitops_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const login = useCallback((userData, token) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    if (token) sessionStorage.setItem('transitops_token', token)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem('transitops_token')
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, logout, isLoggedIn: !!user }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
