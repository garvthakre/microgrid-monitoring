import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ClientThemeProvider } from "@/components/client-theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Suspense } from "react"
import { cookies } from "next/headers"
import { RoleProvider } from "@/components/role-provider"
import { ROLE_COOKIE, type Role } from "@/lib/roles"

export const metadata: Metadata = {
  title: "Microgrid Management Platform",
  description: "Chhattisgarh Microgrid Fleet Management System",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore =  await cookies()
  const initialRole = (cookieStore.get(ROLE_COOKIE)?.value as Role) || "operator"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ClientThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
           
        >
          <Suspense fallback={<div className="px-4 py-6 text-sm text-muted-foreground">Loading…</div>}>
            <RoleProvider initialRole={initialRole}>
              <AuthProvider>
                {children}
              </AuthProvider>
            </RoleProvider>
          </Suspense>
          <Analytics />
        </ClientThemeProvider>
      </body>
    </html>
  )
}