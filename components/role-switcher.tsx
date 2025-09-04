"use client"

import { useRole } from "./role-provider"
import { ALL_ROLES, type Role } from "@/lib/roles"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export function RoleSwitcher({ className }: { className?: string }) {
  const { role, setRole } = useRole()

  return (
    <div className={className}>
      <Label htmlFor="role" className="sr-only">
        Role
      </Label>
      <Select value={role} onValueChange={(v) => setRole(v as Role)}>
        <SelectTrigger id="role" className="h-8 w-[170px]">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent align="end" className="min-w-[170px]">
          {ALL_ROLES.map((r) => (
            <SelectItem key={r} value={r} className="capitalize">
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
