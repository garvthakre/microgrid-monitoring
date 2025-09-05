// lib/auth.ts
export interface User {
  id: number
  name: string
  phone: string
  password: string
  role: "admin" | "operator" | "technician" | "govt"
  createdAt: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  
  try {
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export function signOut(): void {
  if (typeof window === "undefined") return
  
  // Clear localStorage
  localStorage.removeItem("currentUser")
  
  // Clear role cookie
  document.cookie = "role=; path=/; max-age=0"
  
  // Redirect to signin
  window.location.href = "/signin"
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

// Initialize demo user if no users exist
export function initializeDemoData(): void {
  if (typeof window === "undefined") return
  
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  
  if (users.length === 0) {
    const demoUsers: User[] = [
      {
        id: 1,
        name: "Demo Admin",
        phone: "1234567890",
        password: "demo123",
        role: "admin",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "Demo Operator",
        phone: "0987654321",
        password: "demo123",
        role: "operator",
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: "Demo Technician",
        phone: "1122334455",
        password: "demo123",
        role: "technician",
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: "Demo Government",
        phone: "5544332211",
        password: "demo123",
        role: "govt",
        createdAt: new Date().toISOString()
      }
    ]
    
    localStorage.setItem("users", JSON.stringify(demoUsers))
  }
}