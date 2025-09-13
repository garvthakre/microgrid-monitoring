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
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t("fleet")}</h1>
        <p className="text-sm text-muted-foreground">Odisha microgrid fleet overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("sites")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{summary.totalSites}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-emerald-600">{summary.good}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attention</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-amber-600">{summary.warning + summary.critical}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t("sites")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-2 px-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">{t("site")}</TableHead>
                  <TableHead className="min-w-[100px]">{t("health")}</TableHead>
                  <TableHead className="text-right min-w-[80px]">{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SITES.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Link href={`/sites/${s.id}`} className="text-primary hover:underline font-medium">
                        {s.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block size-2 rounded-full ${dot(s.health)}`} />
                        <span className="capitalize">{s.health}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-xs">
                        Online
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
