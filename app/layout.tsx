import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { cookies } from "next/headers"
import { RoleProvider } from "@/components/role-provider"
import { ROLE_COOKIE, type Role } from "@/lib/roles"

export const metadata: Metadata = {
  title: "URJANETRA - Microgrid Monitoring Dashboard",
  description: "Government of Chhattisgarh Microgrid Monitoring System",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const initialRole = (cookieStore.get(ROLE_COOKIE)?.value as Role) || "operator"

  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div className="px-4 py-6 text-sm text-muted-foreground">Loading…</div>}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <RoleProvider initialRole={initialRole}>{children}</RoleProvider>
          </ThemeProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
