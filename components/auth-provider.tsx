"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, initializeDemoData } from "@/lib/auth"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Public routes that don't require authentication
  const publicRoutes = ["/signin", "/signup"]
  
  useEffect(() => {
    // Initialize demo data on first load
    initializeDemoData()
    
    // Check if current route requires authentication
    const isPublicRoute = publicRoutes.includes(pathname)
    const authenticated = isAuthenticated()
    
    if (!isPublicRoute && !authenticated) {
      router.push("/signin")
    }
    
    // If authenticated user tries to access signin/signup, redirect to home
    if (isPublicRoute && authenticated) {
      router.push("/")
    }
  }, [pathname, router])

  return <>{children}</>
}