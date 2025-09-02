"use client"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { AppHeader } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function AdminInner() {
  const { t } = useI18n()
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <h1 className="text-xl font-semibold">{t("admin")}</h1>

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
    </main>
  )
}

export default function Page() {
  return (
    <I18nProvider>
      <AppHeader />
      <AdminInner />
    </I18nProvider>
  )
}
