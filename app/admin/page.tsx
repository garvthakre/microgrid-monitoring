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

function AdminInner() {
  const { t } = useI18n()
  const sites = [
    { id: "RPR", name: "Raipur", x: 56, y: 54, health: "good" as const },
    { id: "BSP", name: "Bilaspur", x: 58, y: 46, health: "warning" as const },
    { id: "DBG", name: "Durg-Bhilai", x: 52, y: 56, health: "good" as const },
    { id: "KRB", name: "Korba", x: 63, y: 43, health: "critical" as const },
    { id: "RGB", name: "Raigarh", x: 68, y: 45, health: "good" as const },
  ]
  return (
    <main className="mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <h1 className="text-base sm:text-lg lg:text-xl font-semibold">{t("admin")}</h1>

      {/* KPIs */}
      <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Generation" value={12.7} unit="MWh" delta={+4.3} intent="success" />
        <KpiCard title="Storage (SoC)" value={78} unit="%" delta={+2.1} intent="neutral" />
        <KpiCard title="Consumption" value={10.9} unit="MWh" delta={+1.2} intent="warning" />
        <KpiCard title="Active Alerts" value={3} unit="" delta={-1.0} intent="success" />
      </div>

      {/* Fleet map */}
      <SitesMap title="All Sites (Chhattisgarh)" sites={sites} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base">{t("deviceRegistration")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <div className="grid gap-1 sm:gap-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">
                Device Name
              </Label>
              <Input id="name" placeholder="Gateway-01" className="text-sm" />
            </div>
            <div className="grid gap-1 sm:gap-2">
              <Label htmlFor="site" className="text-xs sm:text-sm">
                Site ID
              </Label>
              <Input id="site" placeholder="IN-001" className="text-sm" />
            </div>
            <Button size="sm" className="text-xs sm:text-sm">
              Register
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base">{t("reportScheduler")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Configure automated reports to email (daily/weekly/monthly). This is a stub UI.
            </p>
            <div className="grid gap-2">
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">
                  Email
                </Label>
                <Input id="email" type="email" placeholder="ops@example.com" className="text-sm" />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="cron" className="text-xs sm:text-sm">
                  Frequency
                </Label>
                <Input id="cron" placeholder="0 7 * * 1" className="text-sm" />
              </div>
            </div>
            <Button size="sm" className="text-xs sm:text-sm">
              Save
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base">{t("users")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-full px-2 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Email</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Role</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { email: "admin@example.com", role: "admin", status: "active" },
                    { email: "ops@example.com", role: "operator", status: "active" },
                    { email: "tech@example.com", role: "technician", status: "invited" },
                  ].map((u) => (
                    <TableRow key={u.email}>
                      <TableCell className="whitespace-nowrap text-xs sm:text-sm max-w-32 sm:max-w-none truncate">
                        {u.email}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs sm:text-sm">{u.role}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs sm:text-sm">{u.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Device Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Device</TableHead>
                    <TableHead className="whitespace-nowrap">Site</TableHead>
                    <TableHead className="whitespace-nowrap">Firmware</TableHead>
                    <TableHead className="whitespace-nowrap">Health</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { d: "Inverter-01", s: "Raipur", f: "v1.2.3", h: "OK" },
                    { d: "Battery-02", s: "Korba", f: "v1.1.0", h: "Warning" },
                    { d: "Meter-09", s: "Raigarh", f: "v0.9.8", h: "OK" },
                  ].map((r) => (
                    <TableRow key={r.d}>
                      <TableCell className="whitespace-nowrap">{r.d}</TableCell>
                      <TableCell className="whitespace-nowrap">{r.s}</TableCell>
                      <TableCell className="whitespace-nowrap">{r.f}</TableCell>
                      <TableCell className="whitespace-nowrap">{r.h}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">When</TableHead>
                    <TableHead className="whitespace-nowrap">User</TableHead>
                    <TableHead className="whitespace-nowrap">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { t: "09:41", u: "admin@example.com", a: "Changed role of tech@example.com to technician" },
                    { t: "09:15", u: "ops@example.com", a: "Acknowledged alert A-2109" },
                  ].map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="whitespace-nowrap">{r.t}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs">{r.u}</TableCell>
                      <TableCell className="text-xs">{r.a}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
