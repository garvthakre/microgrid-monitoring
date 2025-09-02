let alerts = [
  {
    id: "a1",
    siteId: "IN-004",
    level: "critical",
    message: "Battery temperature high",
    ts: Date.now() - 120000,
    acknowledged: false,
  },
  {
    id: "a2",
    siteId: "IN-002",
    level: "warning",
    message: "Inverter derating due to heat",
    ts: Date.now() - 900000,
    acknowledged: false,
  },
  {
    id: "a3",
    siteId: "IN-001",
    level: "info",
    message: "Forecast: cloudy afternoon",
    ts: Date.now() - 1800000,
    acknowledged: true,
  },
]

export async function GET() {
  return Response.json(alerts)
}

export async function POST(req: Request) {
  const body = await req.text()
  try {
    const { id, action } = JSON.parse(body)
    alerts = alerts.map((a) => (a.id === id ? { ...a, acknowledged: action === "ack" ? true : a.acknowledged } : a))
    return Response.json({ ok: true })
  } catch {
    return new Response("Bad Request", { status: 400 })
  }
}
