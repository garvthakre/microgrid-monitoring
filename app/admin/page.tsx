"use client"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { AppHeader } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RoleGuard } from "@/components/role-guard"
import { KpiCard } from "@/components/kpi-card"
import { SitesMap } from "@/components/map"
import { ExportMenu } from "@/components/export-menu"
import { EnergySystemCard } from "@/components/energy-system-card"

function AdminInner() {
  const { t } = useI18n()
  const sites = [
    { id: "RPR", name: "Raipur", x: 56, y: 54, health: "good" as const },
    { id: "BSP", name: "Bilaspur", x: 58, y: 46, health: "warning" as const },
    { id: "DBG", name: "Durg-Bhilai", x: 52, y: 56, health: "good" as const },
    { id: "KRB", name: "Korba", x: 63, y: 43, health: "critical" as const },
    { id: "RGB", name: "Raigarh", x: 68, y: 45, health: "good" as const },
  ]

  // Energy system data - in real app this would come from your API/state
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
      title: "Grid Connection", 
      voltage: 230.0,
      current: 22.1,
      voltageUnit: "V AC",
      currentUnit: "A AC",
    },
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <h1 className="text-xl font-semibold">{t("admin")}</h1>

   
      {/* Energy Systems Status */}
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

      {/* Fleet map */}
      <SitesMap title="All Sites (Chhattisgarh)" sites={sites} />

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("deviceRegistration")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="name">Device Name</Label>
              <Input id="name" placeholder="Gateway-01" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site">Site ID</Label>
              <Input id="site" placeholder="IN-001" />
            </div>
            <Button size="sm">Register</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("reportScheduler")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            Configure automated reports to email (daily/weekly/monthly). This is a stub UI.
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="ops@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cron">Frequency</Label>
                <Input id="cron" placeholder="0 7 * * 1" />
              </div>
            </div>
            <Button size="sm">Save</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t("users")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { email: "admin@example.com", role: "admin", status: "active" },
                { email: "ops@example.com", role: "operator", status: "active" },
                { email: "tech@example.com", role: "technician", status: "invited" },
              ].map((u) => (
                <TableRow key={u.email}>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Device management and audit logs */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Device Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Firmware</TableHead>
                  <TableHead>Health</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { d: "Inverter-01", s: "Raipur", f: "v1.2.3", h: "OK" },
                  { d: "Battery-02", s: "Korba", f: "v1.1.0", h: "Warning" },
                  { d: "Meter-09", s: "Raigarh", f: "v0.9.8", h: "OK" },
                ].map((r) => (
                  <TableRow key={r.d}>
                    <TableCell>{r.d}</TableCell>
                    <TableCell>{r.s}</TableCell>
                    <TableCell>{r.f}</TableCell>
                    <TableCell>{r.h}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Audit & Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Track user actions across the platform. Export for compliance.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { t: "09:41", u: "admin@example.com", a: "Changed role of tech@example.com to technician" },
                  { t: "09:15", u: "ops@example.com", a: "Acknowledged alert A-2109" },
                ].map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.t}</TableCell>
                    <TableCell>{r.u}</TableCell>
                    <TableCell>{r.a}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Export */}
            <div className="pt-2">
              <ExportMenu filename="audit-log" rows={[{ time: "09:41", user: "admin", action: "role-change" }]} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <I18nProvider>
      <AppHeader />
      <RoleGuard allow={["admin"]}>
        <AdminInner />
      </RoleGuard>
    </I18nProvider>
  )
}