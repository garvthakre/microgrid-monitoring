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
    <Card className="h-full">
      <CardHeader className="pb-2 sm:pb-3 space-y-0">
        <CardTitle className="text-xs sm:text-sm font-medium text-pretty leading-tight line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline justify-between gap-2">
          <div
            className="text-xl sm:text-2xl lg:text-3xl font-bold leading-none min-w-0 flex-1"
            aria-label={`${title} value`}
          >
            <span className="block truncate">{typeof value === "number" ? fmt.format(value) : value}</span>
            {unit ? (
              <span className="text-sm sm:text-lg lg:text-xl font-normal text-muted-foreground ml-1">{unit}</span>
            ) : (
              ""
            )}
          </div>
          {typeof delta === "number" && (
            <div
              className={`text-xs sm:text-sm font-medium ${intentColor} flex-shrink-0 whitespace-nowrap`}
              aria-label={`${title} delta`}
            >
              {delta > 0 ? `+${delta}%` : `${delta}%`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
