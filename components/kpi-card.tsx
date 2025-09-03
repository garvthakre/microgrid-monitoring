"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 })

export function KpiCard({
  title,
  value,
  unit,
  delta,
  intent = "neutral",
}: {
  title: string
  value: string | number
  unit?: string
  delta?: number
  intent?: "success" | "warning" | "danger" | "neutral"
}) {
  const intentColor =
    intent === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : intent === "warning"
        ? "text-amber-600 dark:text-amber-400"
        : intent === "danger"
          ? "text-red-600 dark:text-red-400"
          : "text-muted-foreground"

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-pretty">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-baseline justify-between">
        <div className="text-2xl font-semibold leading-tight" aria-label={`${title} value`}>
          {typeof value === "number" ? fmt.format(value) : value}
          {unit ? ` ${unit}` : ""}
        </div>
        {typeof delta === "number" && (
          <div className={`text-sm ${intentColor}`} aria-label={`${title} delta`}>
            {delta > 0 ? `+${delta}%` : `${delta}%`}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
