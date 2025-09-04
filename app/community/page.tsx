"use client"
import { I18nProvider } from "@/lib/i18n"
import { AppHeader } from "@/components/header"
import { RoleGuard } from "@/components/role-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartCard } from "@/components/chart-card"
import { expectedVsActual } from "@/lib/mock"
import { KpiCard } from "@/components/kpi-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

export default function CommunityHome() {
  return (
    <I18nProvider>
      <AppHeader />
      <RoleGuard allow={["community"]}>
        <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
          <h1 className="text-xl font-semibold text-balance">Public Microgrid Summary</h1>

          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="Usage Today" value={8.2} unit="kWh" delta={+0.8} intent="neutral" />
            <KpiCard title="Remaining Quota" value={6.8} unit="kWh" delta={-0.2} intent="warning" />
            <KpiCard title="Est. Savings" value={54.0} unit="₹" delta={+3.0} intent="success" />
            <KpiCard title="Reliability" value={23.5} unit="hrs" delta={+1.1} intent="success" />
          </div>

          {/* Trend */}
          <ChartCard title="Usage vs Quota (Today)" data={expectedVsActual().actual} type="area" />

          <div className="grid gap-4 md:grid-cols-2">
            {/* Billing history */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Billing / Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { d: "2025-08-01", amt: "₹120", s: "Paid" },
                      { d: "2025-07-01", amt: "₹98", s: "Paid" },
                    ].map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>{r.d}</TableCell>
                        <TableCell>{r.amt}</TableCell>
                        <TableCell>{r.s}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Impact & notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Impact & Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Carbon savings: 3.2 kg CO₂e today; Diesel offset: 1.1 L</p>
                <ul className="list-disc pl-5">
                  <li>Planned outage: 18:00–18:30 for maintenance (Raipur cluster)</li>
                  <li>New announcement: Prepaid top-up window extended till 21:00</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea rows={3} placeholder="Share your concerns or suggestions…" />
              <div>
                <Button size="sm" onClick={() => console.log("[v0] community feedback submitted")}>
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </RoleGuard>
    </I18nProvider>
  )
}
