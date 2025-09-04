"use client"

import * as React from "react"
import { ROLE_COOKIE, type Role } from "@/lib/roles"

type Ctx = { role: Role; setRole: (r: Role) => void }
const RoleContext = React.createContext<Ctx | null>(null)

export function useRole() {
  const ctx = React.useContext(RoleContext)
  if (!ctx) throw new Error("useRole must be used within RoleProvider")
  return ctx
}

export function RoleProvider({ initialRole, children }: { initialRole: Role; children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<Role>(initialRole)

  const setRole = React.useCallback((r: Role) => {
    setRoleState(r)
    // persist for server components via cookie
    document.cookie = `${ROLE_COOKIE}=${r}; path=/; max-age=${60 * 60 * 24 * 365}`
    // reload so RSC pages and navigation reflect permissions
    window.location.reload()
  }, [])

  const value = React.useMemo(() => ({ role, setRole }), [role, setRole])

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}
