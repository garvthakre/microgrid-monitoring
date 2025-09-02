"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function ExportMenu({ filename, rows }: { filename: string; rows: any[] }) {
  const { t } = useI18n()
  function toCSV() {
    if (!rows.length) return ""
    const cols = Object.keys(rows[0])
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => JSON.stringify(r[c] ?? "")).join(","))].join("\n")
    return csv
  }
  function download(blob: Blob, ext: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" aria-label={t("export")}>
          <Download className="size-4" /> {t("export")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label={t("export")}>
        <DropdownMenuLabel>{t("export")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => download(new Blob([toCSV()], { type: "text/csv" }), "csv")}>
          {t("exportCSV")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => download(new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" }), "json")}
        >
          {t("exportJSON")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
