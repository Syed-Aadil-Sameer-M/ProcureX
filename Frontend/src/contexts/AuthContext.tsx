import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

export type Role = "receiver" | "admin" | "procurement"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem("procurex_token")
    const storedUser = localStorage.getItem("procurex_user_data")
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("procurex_token")
        localStorage.removeItem("procurex_user_data")
      }
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("procurex_token", newToken)
    localStorage.setItem("procurex_user_data", JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem("procurex_token")
    localStorage.removeItem("procurex_user_data")
    setToken(null)
    setUser(null)
    navigate("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
