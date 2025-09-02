"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

type Alert = {
  id: string
  siteId: string
  level: "critical" | "warning" | "info"
  message: string
  ts: number
  acknowledged?: boolean
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function LevelBadge({ level }: { level: Alert["level"] }) {
  const variant = level === "critical" ? "destructive" : level === "warning" ? "default" : "outline"
  return <Badge variant={variant}>{level}</Badge>
}

export function AlertsPanel() {
  const { t } = useI18n()
  const { data, mutate } = useSWR<Alert[]>("/api/alerts", fetcher, { refreshInterval: 4000 })

  async function ack(id: string) {
    await fetch("/api/alerts", { method: "POST", body: JSON.stringify({ id, action: "ack" }) })
    mutate()
  }
  async function escalate(id: string) {
    await fetch("/api/alerts", { method: "POST", body: JSON.stringify({ id, action: "escalate" }) })
    mutate()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{t("alerts")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {data?.length ? (
          data.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <LevelBadge level={a.level} />
                <div className="text-sm">
                  <div className="font-medium">{a.message}</div>
                  <div className="text-muted-foreground text-xs">
                    {new Date(a.ts).toLocaleString()} • {t("site")} {a.siteId}
                    {a.acknowledged ? ` • ${t("acknowledged")}` : ""}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => ack(a.id)}
                  disabled={a.acknowledged}
                  aria-label={t("acknowledge")}
                >
                  {t("acknowledge")}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => escalate(a.id)} aria-label={t("escalate")}>
                  {t("escalate")}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">{t("info")}</div>
        )}
      </CardContent>
    </Card>
  )
}
