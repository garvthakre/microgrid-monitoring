"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SitePoint = { id: string; name: string; x: number; y: number; health: "good" | "warning" | "critical" }

export function SitesMap({ title, sites }: { title: string; sites: SitePoint[] }) {
  const color = (h: SitePoint["health"]) =>
    h === "good" ? "bg-emerald-500" : h === "warning" ? "bg-amber-500" : "bg-red-500"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative w-full rounded-md border bg-muted/30"
          style={{ height: "min(40vh, 300px)" }} // Made map height responsive for mobile devices
          role="img"
          aria-label="Sites health map for Chhattisgarh"
        >
          <div className="absolute inset-0">
            <svg className="w-full h-full" aria-hidden>
              <defs>
                <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path
                    d="M 24 0 L 0 0 0 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-muted-foreground/20"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="absolute top-2 right-2 px-2 py-0.5 rounded border bg-background/80 text-xs text-muted-foreground">
            Chhattisgarh
          </div>

          {/* Points */}
          {sites.map((s) => (
            <button
              key={s.id}
              className={`absolute size-3 rounded-full ring-2 ring-background ${color(s.health)} outline-none focus:ring-4 focus:ring-primary/30`}
              style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%, -50%)" }}
              title={`${s.name} • ${s.health}`}
              aria-label={`${s.name} ${s.health}`}
            />
          ))}

          <div className="absolute bottom-2 left-2 flex flex-wrap items-center gap-2 sm:gap-3 rounded border bg-background/80 px-2 py-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-emerald-500" aria-hidden />
              <span className="hidden sm:inline">Good</span>
              <span className="sm:hidden">G</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-amber-500" aria-hidden />
              <span className="hidden sm:inline">Warning</span>
              <span className="sm:hidden">W</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-red-500" aria-hidden />
              <span className="hidden sm:inline">Critical</span>
              <span className="sm:hidden">C</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
