"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon, Globe, CircleUserRound, PanelsTopLeft } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useRole } from "@/components/role-provider"
import type { Role } from "@/lib/roles"

export function AppHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { t, lang, setLang } = useI18n()
  const { role, setRole } = useRole()

  const allNav = [
    { href: "/", label: t("overview"), roles: ["admin", "operator", "technician", "community", "govt"] as Role[] },
    { href: "/fleet", label: t("fleet"), roles: ["admin", "operator", "technician", "govt"] as Role[] },
    { href: "/analytics", label: t("analytics"), roles: ["admin", "govt"] as Role[] },
    { href: "/admin", label: t("admin"), roles: ["admin"] as Role[] },
  ]
  const roleDash =
    role === "operator"
      ? { href: "/operator", label: "Dashboard", roles: ["operator"] as Role[] }
      : role === "technician"
        ? { href: "/technician", label: "Dashboard", roles: ["technician"] as Role[] }
        : role === "community"
          ? { href: "/community", label: "Dashboard", roles: ["community"] as Role[] }
          : role === "govt"
            ? { href: "/govt", label: "Dashboard", roles: ["govt"] as Role[] }
            : null
  const nav = (roleDash ? [roleDash] : []).concat(allNav.filter((n) => n.roles.includes(role)))

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="hidden md:block text-xs text-muted-foreground border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-1">Government of Chhattisgarh · Microgrid Monitoring</div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <PanelsTopLeft className="size-6 text-primary" aria-hidden />
          <Link href="/" className="font-semibold">
            {t("appTitle")}
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-sm ${pathname === n.href ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
        

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="language">
                <Globe className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(["en", "hi", "or", "ar"] as const).map((l) => (
                <DropdownMenuItem key={l} onClick={() => setLang(l)}>
                  {l.toUpperCase()} {lang === l ? "•" : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="toggle theme">
                {theme === "light" ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" aria-label="role">
                <CircleUserRound className="size-4" />
                <span className="hidden sm:inline capitalize">{role}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(
                [
                  ["admin", "adminRole"],
                  ["operator", "operatorRole"],
                  ["technician", "technicianRole"],
                  ["community", "communityRole"],
                  ["govt", "govtRole"],
                ] as const
              ).map(([val, key]) => (
                <DropdownMenuItem key={val} onClick={() => setRole(val as Role)}>
                  {t(key)} {role === val ? "•" : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="md:hidden border-t">
        <nav className="mx-auto max-w-7xl px-4 py-2 flex items-center gap-4 overflow-auto">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm whitespace-nowrap ${pathname === n.href ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
