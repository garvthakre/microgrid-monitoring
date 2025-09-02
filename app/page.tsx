"use client"
import { useEffect, useMemo, useState } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { AppHeader } from "@/components/header"
import { KpiCard } from "@/components/kpi-card"
import { ChartCard } from "@/components/chart-card"
import { SitesMap } from "@/components/map"
import { SITES } from "@/lib/mock"
import { AlertsPanel } from "@/components/alerts-panel"
import { WidgetsGrid } from "@/components/widgets-grid"
import { ExportMenu } from "@/components/export-menu"

function Realtime() {
  const { t } = useI18n()
  const [points, setPoints] = useState<any[]>([])
  const [soc, setSoc] = useState<any[]>([])

  useEffect(() => {
    const es = new EventSource("/api/stream")
    es.onmessage = (evt) => {
      const d = JSON.parse(evt.data)
      const time = new Date(d.ts).toLocaleTimeString()
      setPoints((prev) => [...prev.slice(-30), { x: time, y: d.generation }])
      setSoc((prev) => [...prev.slice(-30), { x: time, y: d.soc }])
    }
    return () => es.close()
  }, [])

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <ChartCard title={`${t("generation")} (kW)`} data={points} type="area" />
      <ChartCard
        title={`${t("consumption")} (kW)`}
        data={points.map((p) => ({ ...p, y: Math.max(0, p.y - 5 + Math.random() * 10) }))}
        type="line"
      />
      <ChartCard title={`${t("stateOfCharge")} (%)`} data={soc} type="area" />
    </div>
  )
}

function OverviewInner() {
  const { t } = useI18n()
  const [edit, setEdit] = useState(false)

  const kpis = [
    <KpiCard key="k1" title={t("generation")} value={58.2} unit="kW" delta={4.2} intent="success" />,
    <KpiCard key="k2" title={t("consumption")} value={49.7} unit="kW" delta={-1.8} intent="neutral" />,
    <KpiCard key="k3" title={t("stateOfCharge")} value={76} unit="%" delta={2.1} intent="success" />,
  ]

  const widgets = [
    { id: "realtime", render: () => <Realtime /> },
    {
      id: "map",
      render: () => (
        <SitesMap
          title={t("siteMap")}
          sites={SITES.map((s) => ({ id: s.id, name: s.name, x: s.coords.x, y: s.coords.y, health: s.health }))}
        />
      ),
    },
    { id: "alerts", render: () => <AlertsPanel /> },
  ]

  const exportRows = useMemo(() => SITES.map((s) => ({ id: s.id, name: s.name, health: s.health })), [])

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-balance">{t("overview")}</h1>
        <ExportMenu filename="sites" rows={exportRows} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">{kpis}</div>

      <WidgetsGrid widgets={widgets} edit={edit} onToggleEdit={() => setEdit((v) => !v)} />
    </main>
  )
}

export default function Page() {
  return (
    <I18nProvider>
      <AppHeader />
      <OverviewInner />
    </I18nProvider>
  )
}
