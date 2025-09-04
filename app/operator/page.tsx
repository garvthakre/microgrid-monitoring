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

function OperatorSelector() {
  const [site, setSite] = React.useState("Raipur")
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="text-sm text-muted-foreground">Assigned site</div>
      <Select value={site} onValueChange={setSite}>
        <SelectTrigger className="w-[200px] h-8">
          <SelectValue placeholder="Select site" />
        </SelectTrigger>
        <SelectContent>
          {["Raipur", "Bilaspur", "Korba", "Raigarh"].map((s) => (
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
      <CardContent className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => console.log("[v0] start inverter")}>
          Start Inverter
        </Button>
        <Button size="sm" variant="secondary" onClick={() => console.log("[v0] stop inverter")}>
          Stop Inverter
        </Button>
        <Button size="sm" variant="outline" onClick={() => console.log("[v0] shed non-critical loads")}>
          Shed Non-critical Loads
        </Button>
        <Button size="sm" variant="outline" onClick={() => console.log("[v0] switch energy source")}>
          Switch Source
        </Button>
      </CardContent>
    </Card>
  )
}

export default function OperatorHome() {
  return (
    <I18nProvider>
      <AppHeader />
      <RoleGuard allow={["operator"]}>
        <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
          <h1 className="text-xl font-semibold text-balance">Operator Console</h1>

          {/* Site selector */}
          <OperatorSelector />

          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="Generation" value={3.8} unit="MWh" delta={+2.4} intent="success" />
            <KpiCard title="Battery SoC" value={72} unit="%" delta={+1.2} intent="neutral" />
            <KpiCard title="Load (Critical)" value={1.1} unit="MW" delta={-0.3} intent="success" />
            <KpiCard title="Alerts (Open)" value={2} unit="" delta={+1.0} intent="warning" />
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
            <ChartCard title="Generation (Expected vs Actual)" data={expectedVsActual().actual} type="line" />
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
