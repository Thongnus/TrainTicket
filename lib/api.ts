import { useRouter } from "next/navigation"

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken")
  if (!refreshToken) {
    throw new Error("NO_REFRESH_TOKEN")
  }

  try {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Refresh-Token": refreshToken,
      },
    })

    if (!response.ok) {
      throw new Error("REFRESH_TOKEN_FAILED")
    }

    const data = await response.json()
    localStorage.setItem("token", data.token)
    return data.token
  } catch (error) {
    console.error("Error refreshing token:", error)
    // Clear local storage and redirect to login
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    throw error
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")
  if (!token) {
    // Nếu không có token, chuyển hướng về trang login
    window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`
    throw new Error("NO_TOKEN")
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  try {
    console.log("Fetching with auth:", `${baseUrl}${url}`)
    const response = await fetch(`${baseUrl}${url}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      // Token expired, try to refresh
      try {
        const newToken = await refreshToken()
        headers.Authorization = `Bearer ${newToken}`
        
        // Retry the request with new token
        return fetch(`${baseUrl}${url}`, {
          ...options,
          headers,
        })
      } catch (refreshError) {
        // Nếu refresh token thất bại, chuyển hướng về trang login
        window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`
        throw refreshError
      }
    }

    return response
  } catch (error) {
    console.error("Error in fetchWithAuth:", error)
    throw error
  }
}

export async function logout(router: any) {
  try {
    const response = await fetchWithAuth("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Refresh-Token": localStorage.getItem("refreshToken") || "",
      },
    })

    if (!response.ok) {
      throw new Error("Logout failed")
    }
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    // Always clear local storage and redirect to login
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    router.push("/login")
  }
} 