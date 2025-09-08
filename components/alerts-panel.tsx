"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { useRole } from "@/components/role-provider"

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
  const { role } = useRole()
  const canAct = role === "admin" || role === "operator" || role === "technician"
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
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-sm sm:text-base">{t("alerts")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 sm:gap-3">
        {data?.length ? (
          data.map((a) => (
            <div
              key={a.id}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 p-2 sm:p-0 rounded-md sm:rounded-none bg-muted/30 sm:bg-transparent"
            >
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <LevelBadge level={a.level} />
                <div className="text-sm min-w-0 flex-1">
                  <div className="font-medium break-words text-sm sm:text-base leading-tight">{a.message}</div>
                  <div className="text-muted-foreground text-xs sm:text-sm break-words mt-1">
                    {new Date(a.ts).toLocaleString()} • {t("site")} {a.siteId}
                    {a.acknowledged ? ` • ${t("acknowledged")}` : ""}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 self-start">
                {canAct && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => ack(a.id)}
                      disabled={a.acknowledged}
                      aria-label={t("acknowledge")}
                      className="text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
                    >
                      <span className="hidden sm:inline">{t("acknowledge")}</span>
                      <span className="sm:hidden">Ack</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => escalate(a.id)}
                      aria-label={t("escalate")}
                      className="text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
                    >
                      <span className="hidden sm:inline">{t("escalate")}</span>
                      <span className="sm:hidden">Esc</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm sm:text-base text-muted-foreground text-center py-4">{t("info")}</div>
        )}
      </CardContent>
    </Card>
  )
}
