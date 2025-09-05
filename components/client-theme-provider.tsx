"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { useEffect, useState } from "react"

export function ClientThemeProvider({ 
  children,
  ...props 
}: React.ComponentProps<typeof ThemeProvider>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return children without theme provider during SSR
    return <div suppressHydrationWarning>{children}</div>
  }

  return (
    <ThemeProvider {...props}>
      {children}
    </ThemeProvider>
  )
}