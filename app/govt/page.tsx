"use client"
import { I18nProvider } from "@/lib/i18n"
import { AppHeader } from "@/components/header"
import { RoleGuard } from "@/components/role-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartCard } from "@/components/chart-card"
import { ExportMenu } from "@/components/export-menu"
import { mockFleetSummary, expectedVsActual } from "@/lib/mock"
import { SitesMap } from "@/components/map"
import { KpiCard } from "@/components/kpi-card"

export default function GovernmentHome() {
  return (
    <I18nProvider>
      <AppHeader />
      <RoleGuard allow={["govt"]}>
        <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
          <h1 className="text-xl font-semibold text-balance">Government Oversight</h1>

          {/* Policy metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="Renewables (MWh)" value={42.3} unit="MWh" delta={+6.1} intent="success" />
            <KpiCard title="Diesel Offset" value={18.6} unit="L" delta={+1.7} intent="success" />
            <KpiCard title="Carbon Savings" value={24.8} unit="tCO₂e" delta={+0.9} intent="success" />
            <KpiCard title="Households Served" value={1520} unit="" delta={+25} intent="neutral" />
          </div>

          {/* Map of all microgrids */}
          <SitesMap
            title="Fleet-wide Map (Chhattisgarh)"
            sites={
              [
                { id: "RPR", name: "Raipur", x: 56, y: 54, health: "good" },
                { id: "BSP", name: "Bilaspur", x: 58, y: 46, health: "warning" },
                { id: "DBG", name: "Durg-Bhilai", x: 52, y: 56, health: "good" },
                { id: "KRB", name: "Korba", x: 63, y: 43, health: "critical" },
                { id: "RGB", name: "Raigarh", x: 68, y: 45, health: "good" },
              ] as any
            }
          />

          <div className="grid gap-4 md:grid-cols-2">
            {(() => {
              const s = mockFleetSummary()
              return (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Sites</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">{s.totalSites}</CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Healthy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">{s.good}</CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Attention</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">{s.warning + s.critical}</CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Export KPIs</p>
                      <ExportMenu filename="govt-report" rows={expectedVsActual().actual} />
                    </CardContent>
                  </Card>
                </>
              )
            })()}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Renewable Generation (Statewide)" data={expectedVsActual().actual} type="line" />
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Compliance & Uptime</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Read-only snapshot of compliance and uptime benchmarks across districts. Device-level details and
                personal consumption are restricted.
              </CardContent>
            </Card>
          </div>
        </main>
      </RoleGuard>
    </I18nProvider>
  )
}
