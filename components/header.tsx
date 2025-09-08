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
import { useState } from "react"
import Image from "next/image"
export function AppHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { t, lang, setLang } = useI18n()
  const { role, setRole } = useRole()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="text-xs text-muted-foreground border-b bg-muted/30">
        
      </div>

      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/urjanetra.png" // Place your logo in public/logo.png
                alt="URJANETRA Logo"
                width={24}
                height={24}
                className="sm:w-6 sm:h-6 w-5 h-5"
              />
             
              {/* <PanelsTopLeft className="size-5 sm:size-6 text-primary flex-shrink-0" aria-hidden /> */}
            </div>
            <Link href="/" className="font-semibold text-sm sm:text-base lg:text-lg truncate min-w-0 flex-shrink-0">
              <span className="block sm:hidden">URJANETRA</span>
              <span className="hidden sm:block">{t("appTitle")}</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 ml-4 xl:ml-6">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                    pathname === n.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
         

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9" aria-label="language">
                  <Globe className="size-3 sm:size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuLabel className="text-xs">{t("language")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(["en", "hi", "or", "ar"] as const).map((l) => (
                  <DropdownMenuItem key={l} onClick={() => setLang(l)} className="text-sm">
                    {l.toUpperCase()} {lang === l ? "•" : ""}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9" aria-label="toggle theme">
                  {theme === "light" ? <Sun className="size-3 sm:size-4" /> : <Moon className="size-3 sm:size-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuLabel className="text-xs">Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme("light")} className="text-sm">
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="text-sm">
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="text-sm">
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

        
          </div>
        </div>

        <div className="lg:hidden border-t mt-2 pt-2">
          <nav className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-1 scrollbar-hide">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-sm sm:text-base font-medium whitespace-nowrap transition-colors hover:text-primary flex-shrink-0 px-1 ${
                  pathname === n.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
