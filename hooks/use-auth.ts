import { useState, useEffect } from "react"

interface User {
  id: number
  email: string
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return {
    user,
    logout,
  }
} 