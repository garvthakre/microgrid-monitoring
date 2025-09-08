"use client"

import type * as React from "react"
import { useRole } from "./role-provider"
import { NotAuthorized } from "./not-authorized"
import type { Role } from "@/lib/roles"

export function RoleGuard({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
 
  return <>{children}</>
}
