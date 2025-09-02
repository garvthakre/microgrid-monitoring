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
import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n"

type Role = "admin" | "operator" | "technician" | "community" | "govt"

export function AppHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { t, lang, setLang } = useI18n()
  const [role, setRole] = useState<Role>("operator")

  useEffect(() => {
    const saved = localStorage.getItem("role") as Role | null
    if (saved) setRole(saved)
  }, [])
  useEffect(() => {
    localStorage.setItem("role", role)
  }, [role])

  const nav = [
    { href: "/", label: t("overview") },
    { href: "/fleet", label: t("fleet") },
    { href: "/analytics", label: t("analytics") },
    { href: "/admin", label: t("admin") },
  ]

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <Badge variant="outline" className="hidden sm:inline-flex">
            {t("demoMode")}
          </Badge>

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
                <span className="hidden sm:inline">{t("role")}</span>
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
