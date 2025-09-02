"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

type Widget = { id: string; render: () => React.ReactNode }

export function WidgetsGrid({
  widgets,
  edit,
  onToggleEdit,
}: { widgets: Widget[]; edit: boolean; onToggleEdit: () => void }) {
  const [order, setOrder] = useState(widgets.map((w) => w.id))

  function move(from: number, to: number) {
    setOrder((prev) => {
      const next = [...prev]
      const [spliced] = next.splice(from, 1)
      next.splice(to, 0, spliced)
      return next
    })
  }

  const mapped = order.map((id) => widgets.find((w) => w.id === id)!).filter(Boolean)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <Button variant={edit ? "default" : "outline"} size="sm" onClick={onToggleEdit}>
          {edit ? "Done" : "Edit Layout"}
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mapped.map((w, idx) => (
          <div key={w.id} className="group relative">
            {edit && (
              <div className="absolute -top-2 right-2 z-10 flex gap-1">
                <Button size="xs" variant="secondary" onClick={() => move(idx, Math.max(0, idx - 1))}>
                  ↑
                </Button>
                <Button size="xs" variant="secondary" onClick={() => move(idx, Math.min(mapped.length - 1, idx + 1))}>
                  ↓
                </Button>
              </div>
            )}
            {w.render()}
          </div>
        ))}
      </div>
    </div>
  )
}
