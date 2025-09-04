import type { Role } from "./roles"

type AccessMap = { pathStartsWith: string; roles: Role[] }

export const ACCESS_RULES: AccessMap[] = [
  { pathStartsWith: "/", roles: ["admin", "operator", "technician", "community", "govt"] },
  { pathStartsWith: "/fleet", roles: ["admin", "operator", "technician", "govt"] },
  { pathStartsWith: "/sites", roles: ["admin", "operator", "technician", "govt"] },
  { pathStartsWith: "/analytics", roles: ["admin", "govt"] },
  { pathStartsWith: "/admin", roles: ["admin"] },
  { pathStartsWith: "/operator", roles: ["operator"] },
  { pathStartsWith: "/technician", roles: ["technician"] },
  { pathStartsWith: "/community", roles: ["community"] },
  { pathStartsWith: "/govt", roles: ["govt"] },
]

export function isAllowed(pathname: string, role: Role) {
  const match = ACCESS_RULES.find((r) => pathname.startsWith(r.pathStartsWith))
  return match ? match.roles.includes(role) : true
}
