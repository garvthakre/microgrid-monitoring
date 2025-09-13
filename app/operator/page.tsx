"use client"
import { I18nProvider } from "@/lib/i18n"
import { AppHeader } from "@/components/header"
import { RoleGuard } from "@/components/role-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChartCard } from "@/components/chart-card"
import { AlertsPanel } from "@/components/alerts-panel"
import { expectedVsActual } from "@/lib/mock"
import { ExportMenu } from "@/components/export-menu"
import { KpiCard } from "@/components/kpi-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as React from "react"
import { EnergySystemCard } from "@/components/energy-system-card"
function OperatorSelector() {
  const [site, setSite] = React.useState("Malegaon")
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <div className="text-sm text-muted-foreground">Assigned site</div>
      <Select value={site} onValueChange={setSite}>
        <SelectTrigger className="w-full sm:w-[200px] h-8">
          <SelectValue placeholder="Select site" />
        </SelectTrigger>
        <SelectContent>
          {["Malegaon", "RaghurajPur", "Nuapatna", "Pipili"].map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ControlsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          <Button size="sm" onClick={() => console.log("[v0] start inverter")} className="text-xs">
            Start Inverter
          </Button>
          <Button size="sm" variant="secondary" onClick={() => console.log("[v0] stop inverter")} className="text-xs">
            Stop Inverter
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => console.log("[v0] shed non-critical loads")}
            className="text-xs col-span-2 sm:col-span-1"
          >
            Shed Loads
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => console.log("[v0] switch energy source")}
            className="text-xs col-span-2 sm:col-span-1"
          >
            Switch Source
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
  const energySystems = [
    {
      type: "solar" as const,
      title: "Solar Panel Array",
      voltage: 48.2,
      current: 12.5,
    },
    {
      type: "wind" as const, 
      title: "Wind Turbine",
      voltage: 42.8,
      current: 8.3,
    },
    {
      type: "battery" as const,
      title: "Battery Storage",
      voltage: 51.4,
      current: 15.2,
    },
    {
      type: "grid" as const,
      title: "Electric Grid", 
      voltage: 230.0,
      current: 22.1,
      voltageUnit: "V AC",
      currentUnit: "A AC",
    },
  ]
export default function OperatorHome() {
  return (
    <I18nProvider>
      <AppHeader />
      <RoleGuard allow={["operator"]}>
        <main className="mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
          <h1 className="text-lg sm:text-xl font-semibold text-balance">ADMIN</h1>

          {/* Site selector */}
          <OperatorSelector />

     <div className="space-y-3">
         <h2 className="text-lg font-medium">Energy Systems Status</h2>
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
           {energySystems.map((system) => (
             <EnergySystemCard
               key={system.type}
               type={system.type}
               title={system.title}
               voltage={system.voltage}
               current={system.current}
               voltageUnit={system.voltageUnit}
               currentUnit={system.currentUnit}
             />
           ))}
         </div>
         </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Fleet</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Sites, status, and alerts</p>
                <Link href="/fleet">
                  <Button>Open</Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Realtime KPIs & controls</p>
                <Link href="/">
                  <Button variant="outline">Overview</Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Daily / Weekly exports</p>
                <ExportMenu filename="operator-report" rows={expectedVsActual().actual} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Generation trend */}
            <ChartCard title="TODAY'S GRAPH" data={expectedVsActual().actual} type="line" />
            {/* Load distribution as pie */}
            <ChartCard
              title="Load Distribution"
              data={[
                { x: "Critical", y: 42 },
                { x: "Non-critical", y: 58 },
              ]}
              type="pie"
              seriesKey="y"
              xKey="x"
            />
          </div>

          {/* Controls */}
          <ControlsCard />

          <AlertsPanel />
        </main>
      </RoleGuard>
    </I18nProvider>
  )
}
