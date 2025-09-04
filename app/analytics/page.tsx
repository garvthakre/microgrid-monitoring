"use client"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { AppHeader } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartCard } from "@/components/chart-card"
import { expectedVsActual } from "@/lib/mock"
import { ExportMenu } from "@/components/export-menu"
import { RoleGuard } from "@/components/role-guard"

function AnalyticsInner() {
  const { t } = useI18n()
  const eva = expectedVsActual()
  const rows = eva.actual.map((p, i) => ({ time: p.x, expected: eva.expected[i].y, actual: p.y }))

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("analytics")}</h1>
        <ExportMenu filename="analysis" rows={rows} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title={t("expectedVsActual")} data={eva.actual} type="line" />
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">AI Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Placeholder for anomaly detection and predictive maintenance explanations.
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
      <RoleGuard allow={["admin", "govt"]}>
        <AnalyticsInner />
      </RoleGuard>
    </I18nProvider>
  )
}
