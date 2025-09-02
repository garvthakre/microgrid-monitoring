"use client"
import useSWR from "swr"
import { useParams } from "next/navigation"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { AppHeader } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KpiCard } from "@/components/kpi-card"
import { ChartCard } from "@/components/chart-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function Controls() {
  const { t } = useI18n()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t("controls")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary">
          {t("startInverter")}
        </Button>
        <Button size="sm" variant="outline">
          {t("stopInverter")}
        </Button>
        <Button size="sm" variant="outline">
          {t("rebootGateway")}
        </Button>
        <Button size="sm" variant="destructive">
          {t("shedNonCritical")}
        </Button>
      </CardContent>
    </Card>
  )
}

function SiteInner({ id }: { id: string }) {
  const { t } = useI18n()
  const { data } = useSWR(`/api/sites/${id}`, fetcher, { refreshInterval: 8000 })

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <h1 className="text-xl font-semibold">
        {t("siteDetails")} • {id}
      </h1>

      {data && (
        <>
          <div className="grid md:grid-cols-6 gap-4">
            <div className="md:col-span-6 grid sm:grid-cols-3 gap-4">
              <KpiCard
                title={t("generation")}
                value={data.kpis.gen}
                unit="kW"
                delta={+(Math.random() * 6 - 3).toFixed(1)}
              />
              <KpiCard title={t("consumption")} value={data.kpis.load} unit="kW" />
              <KpiCard title={t("stateOfCharge")} value={data.kpis.soc} unit="%" />
            </div>
            <div className="md:col-span-4 grid sm:grid-cols-2 gap-4">
              <ChartCard title={t("generation")} data={data.series.generation} />
              <ChartCard title={t("consumption")} data={data.series.consumption} type="line" />
              <ChartCard title={t("stateOfCharge")} data={data.series.soc} />
              <ChartCard
                title={t("expectedVsActual")}
                data={[
                  { x: "Solar", y: 60 },
                  { x: "Wind", y: 40 },
                ]}
                type="pie"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <Controls />
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t("scheduleMaintenance")}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Ticketing and schedules mock. Integrate later with backend.
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="perf" className="space-y-4">
            <TabsList>
              <TabsTrigger value="perf">{t("performance")}</TabsTrigger>
              <TabsTrigger value="forecast">{t("forecast")}</TabsTrigger>
              <TabsTrigger value="loss">{t("lossAnalysis")}</TabsTrigger>
            </TabsList>
            <TabsContent value="perf">
              <div className="grid md:grid-cols-2 gap-4">
                <ChartCard
                  title={t("carbonSavings")}
                  data={[
                    { x: "Today", y: data.kpis.carbon },
                    { x: "Avg", y: 2.5 },
                  ]}
                />
                <ChartCard
                  title={t("dieselOffset")}
                  data={[
                    { x: "Today", y: data.kpis.dieselOffset },
                    { x: "Avg", y: 6.0 },
                  ]}
                />
              </div>
            </TabsContent>
            <TabsContent value="forecast">
              <div className="grid md:grid-cols-3 gap-4">
                <ChartCard
                  title={t("batteryLifePrediction")}
                  data={[
                    { x: "t+1m", y: 92 },
                    { x: "t+6m", y: 88 },
                    { x: "t+12m", y: 83 },
                  ]}
                />
                <ChartCard
                  title={t("faultProbability")}
                  data={[
                    { x: "Inverter", y: 7 },
                    { x: "Battery", y: 4 },
                    { x: "Gateway", y: 2 },
                  ]}
                  type="pie"
                />
                <ChartCard
                  title={t("demandForecast")}
                  data={[
                    { x: "10:00", y: 50 },
                    { x: "12:00", y: 58 },
                    { x: "14:00", y: 65 },
                    { x: "16:00", y: 55 },
                  ]}
                />
              </div>
            </TabsContent>
            <TabsContent value="loss">
              <div className="grid md:grid-cols-2 gap-4">
                <ChartCard
                  title={t("technicalLoss")}
                  data={[
                    { x: "Cable", y: 3 },
                    { x: "Inverter", y: 2 },
                    { x: "Metering", y: 1 },
                  ]}
                  type="pie"
                />
                <ChartCard
                  title={t("nonTechnicalLoss")}
                  data={[
                    { x: "Theft", y: 1.5 },
                    { x: "Overloads", y: 0.8 },
                  ]}
                  type="pie"
                />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </main>
  )
}

export default function Page() {
  const params = useParams<{ id: string }>()
  return (
    <I18nProvider>
      <AppHeader />
      <SiteInner id={params.id} />
    </I18nProvider>
  )
}
