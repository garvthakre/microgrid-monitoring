"use client"

import type * as React from "react"
import { useRole } from "./role-provider"
import { NotAuthorized } from "./not-authorized"
import type { Role } from "@/lib/roles"

export function RoleGuard({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const { role } = useRole()
  if (!allow.includes(role)) return <NotAuthorized />
  return <>{children}</>
}
