"use client"
import { I18nProvider } from "@/lib/i18n"
import { AppHeader } from "@/components/header"
import { RoleGuard } from "@/components/role-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertsPanel } from "@/components/alerts-panel"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ChartCard } from "@/components/chart-card"

export default function TechnicianHome() {
  return (
    <I18nProvider>
      <AppHeader />
      <RoleGuard allow={["technician"]}>
        <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
          <h1 className="text-xl font-semibold text-balance">Technician Dashboard</h1>

          {/* Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Maintenance Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "T-1012", site: "Korba", sev: "Critical", status: "Open" },
                    { id: "T-1004", site: "Bilaspur", sev: "Warning", status: "Assigned" },
                  ].map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.site}</TableCell>
                      <TableCell>{t.sev}</TableCell>
                      <TableCell>{t.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Device metrics + diagnostics */}
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Inverter Temperature (°C)" data={expectedTemp()} type="line" />
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Guided Diagnostics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Review anomaly logs and follow recommended steps. This is a demo stub.</p>
                <ul className="list-disc pl-5">
                  <li>Check PV input voltage and DC bus ripple</li>
                  <li>Verify fan operation and heatsink clearance</li>
                  <li>Run self-test and record any error codes</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Work orders and upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Work Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Assign</Button>
                <Button size="sm" variant="secondary">
                  Update
                </Button>
                <Button size="sm" variant="outline">
                  Close
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <label className="text-sm">Repair Notes</label>
                  <Textarea rows={4} placeholder="Describe issue and resolution..." />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">Upload Photos</label>
                  <Input type="file" accept="image/*" multiple />
                </div>
              </div>
            </CardContent>
          </Card>

          <AlertsPanel />
        </main>
      </RoleGuard>
    </I18nProvider>
  )
}

// Mock device temperature series
function expectedTemp() {
  const now = Date.now()
  return Array.from({ length: 24 }).map((_, i) => ({
    x: `${i}:00`,
    y: 25 + Math.sin((i / 24) * Math.PI) * 15 + (i % 3) - 1, // diurnal-ish
  }))
}
