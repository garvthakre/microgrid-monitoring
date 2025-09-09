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

      <div className="mx-auto max-w-7xl px-3 sm:px-6 pt-2 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0  ">
              <Image
                src="/urjanetra.png"  
                alt="URJANETRA Logo"
                width={36}
                height={40}
                className="w-15 h-12 sm:w-9 sm:h-9 md:w-10 md:h-10  "
              />
              <Link href="/" className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl truncate min-w-0 flex-shrink-0">
                <span className="block sm:hidden"><i>URJA </i>NETRA</span>
                <span className="hidden sm:block">{t("appTitle")}</span>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-6 xl:ml-8">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`text-sm xl:text-base font-medium transition-colors hover:text-primary whitespace-nowrap ${
                    pathname === n.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 sm:h-10 sm:w-10" aria-label="language">
                  <Globe className="size-4 sm:size-5" />
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
                <Button variant="ghost" size="sm" className="h-9 w-9 sm:h-10 sm:w-10" aria-label="toggle theme">
                  {theme === "light" ? <Sun className="size-4 sm:size-5" /> : <Moon className="size-4 sm:size-5" />}
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

        <div className="lg:hidden border-t mt-3 pt-3">
          <nav className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-1 scrollbar-hide">
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