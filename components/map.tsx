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
          style={{ height: 260 }}
          role="img"
          aria-label="Sites health map"
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
          {sites.map((s) => (
            <div
              key={s.id}
              className={`absolute size-3 rounded-full ring-2 ring-background ${color(s.health)} cursor-pointer`}
              style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%, -50%)" }}
              title={`${s.name} • ${s.health}`}
              aria-label={`${s.name} ${s.health}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
