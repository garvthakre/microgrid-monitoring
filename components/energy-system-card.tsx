"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Wind, Battery, Zap } from "lucide-react"

type EnergySystemType = "solar" | "wind" | "battery" | "grid"

const systemIcons = {
  solar: Sun,
  wind: Wind,
  battery: Battery,
  grid: Zap,
} as const

const systemColors = {
  solar: "text-amber-500",
  wind: "text-sky-500", 
  battery: "text-green-500",
  grid: "text-purple-500",
} as const

const systemBgColors = {
  solar: "bg-amber-50 dark:bg-amber-950/20",
  wind: "bg-sky-50 dark:bg-sky-950/20",
  battery: "bg-green-50 dark:bg-green-950/20", 
  grid: "bg-purple-50 dark:bg-purple-950/20",
} as const

export function EnergySystemCard({
  type,
  title,
  voltage,
  current,
  voltageUnit = "V",
  currentUnit = "A",
}: {
  type: EnergySystemType
  title: string
  voltage: number
  current: number
  voltageUnit?: string
  currentUnit?: string
}) {
  const Icon = systemIcons[type]
  const iconColor = systemColors[type]
  const bgColor = systemBgColors[type]
  
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className={`size-5 ${iconColor}`} aria-hidden />
          </div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              Voltage
            </div>
            <div className="text-xl font-semibold" aria-label={`${title} voltage`}>
              {fmt.format(voltage)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {voltageUnit}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              Current
            </div>
            <div className="text-xl font-semibold" aria-label={`${title} current`}>
              {fmt.format(current)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {currentUnit}
              </span>
            </div>
          </div>
        </div>
        
        {/* Power calculation display */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Power Output</span>
            <span className="font-medium">
              {fmt.format(voltage * current)} W
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}