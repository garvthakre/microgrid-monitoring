"use client"
import Link from "next/link"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { AppHeader } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SITES, mockFleetSummary } from "@/lib/mock"
import { RoleGuard } from "@/components/role-guard"

function FleetInner() {
  const { t } = useI18n()
  const summary = mockFleetSummary()
  const dot = (h: "good" | "warning" | "critical") =>
    h === "good" ? "bg-emerald-500" : h === "warning" ? "bg-amber-500" : "bg-red-500"

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{t("fleet")}</h1>
        <p className="text-sm text-muted-foreground">Chhattisgarh microgrid fleet overview</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("sites")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary.totalSites}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Healthy</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary.good}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Attention</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary.warning + summary.critical}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t("sites")}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("site")}</TableHead>
                <TableHead>{t("health")}</TableHead>
                <TableHead className="text-right">{t("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SITES.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Link href={`/sites/${s.id}`} className="text-primary hover:underline">
                      {s.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block size-2 rounded-full ${dot(s.health)} mr-2`} />
                    {s.health}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">Online</Badge>
                  </TableCell>
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
      <RoleGuard allow={["admin", "operator", "technician", "govt"]}>
        <FleetInner />
      </RoleGuard>
    </I18nProvider>
  )
}
