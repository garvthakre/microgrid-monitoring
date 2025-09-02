export type Site = {
  id: string
  name: string
  health: "good" | "warning" | "critical"
  coords: { x: number; y: number }
}

export const SITES: Site[] = [
  { id: "IN-001", name: "Odisha Village A", health: "good", coords: { x: 62, y: 58 } },
  { id: "IN-002", name: "Odisha Village B", health: "warning", coords: { x: 68, y: 46 } },
  { id: "IN-003", name: "Odisha Village C", health: "good", coords: { x: 55, y: 52 } },
  { id: "IN-004", name: "Rajasthan Hamlet", health: "critical", coords: { x: 32, y: 28 } },
]

export function randomWalk(prev: number, step = 2, min = 0, max = 100) {
  const next = prev + (Math.random() * step * 2 - step)
  return Math.max(min, Math.min(max, next))
}

export function makeSeries(n = 24, start = 50, min = 0, max = 100) {
  const out: { x: string; y: number }[] = []
  let v = start
  for (let i = 0; i < n; i++) {
    v = randomWalk(v, 8, min, max)
    out.push({ x: `${i}`, y: Math.round(v * 10) / 10 })
  }
  return out
}

export function mockSiteDetail(id: string) {
  const base = SITES.find((s) => s.id === id) || SITES[0]
  return {
    id,
    name: base.name,
    health: base.health,
    kpis: {
      gen: +(40 + Math.random() * 20).toFixed(1),
      load: +(30 + Math.random() * 20).toFixed(1),
      soc: +(50 + Math.random() * 40).toFixed(0),
      soh: +(80 + Math.random() * 10).toFixed(0),
      cycles: +(900 + Math.random() * 200).toFixed(0),
      carbon: +(2 + Math.random() * 1.5).toFixed(2),
      dieselOffset: +(5 + Math.random() * 3).toFixed(1),
    },
    series: {
      generation: makeSeries(24, 60),
      consumption: makeSeries(24, 55),
      soc: makeSeries(24, 70),
    },
  }
}

export function mockFleetSummary() {
  const totalSites = SITES.length
  const good = SITES.filter((s) => s.health === "good").length
  const warning = SITES.filter((s) => s.health === "warning").length
  const critical = SITES.filter((s) => s.health === "critical").length
  return { totalSites, good, warning, critical }
}

export function expectedVsActual() {
  const a = makeSeries(24, 60)
  const b = a.map((p) => ({ x: p.x, y: Math.max(0, Math.min(100, p.y + (Math.random() * 10 - 5))) }))
  return { expected: a, actual: b }
}
