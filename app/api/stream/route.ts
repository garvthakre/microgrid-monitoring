export const dynamic = "force-dynamic"

function solarAt(hourFrac: number) {
  if (hourFrac < 6 || hourFrac > 18) return 0
  const t = (hourFrac - 6) / 12
  return Math.sin(Math.PI * t) * 90
}

function loadAt(hourFrac: number) {
  const base = 40
  const m = Math.exp(-0.5 * Math.pow((hourFrac - 8) / 2.2, 2)) * 14
  const e = Math.exp(-0.5 * Math.pow((hourFrac - 19) / 2.2, 2)) * 18
  return base + m + e
}

export async function GET() {
  const encoder = new TextEncoder()

  let interval: NodeJS.Timeout

  const stream = new ReadableStream({
    start(controller) {
      const now = new Date()
      const istMs = now.getTime() + 5.5 * 60 * 60 * 1000
      const ist = new Date(istMs)
      const hourFrac0 = ist.getUTCHours() + ist.getUTCMinutes() / 60

      let gen = solarAt(hourFrac0) + (Math.random() * 6 - 3)
      let load = loadAt(hourFrac0) + (Math.random() * 6 - 3)
      let soc = 65 + Math.random() * 10

      function push() {
        try {
          const tNow = new Date()
          const istNow = new Date(tNow.getTime() + 5.5 * 60 * 60 * 1000)
          const hourFrac =
            istNow.getUTCHours() +
            istNow.getUTCMinutes() / 60 +
            istNow.getUTCSeconds() / 3600

          const gBase = solarAt(hourFrac)
          const lBase = loadAt(hourFrac)

          gen = Math.max(0, Math.min(100, gBase + (Math.random() * 6 - 3)))
          load = Math.max(0, Math.min(100, lBase + (Math.random() * 6 - 3)))
          soc = Math.max(
            10,
            Math.min(
              100,
              soc + (gen - load) * 0.02 + (Math.random() * 0.6 - 0.3),
            ),
          )

          const payload = JSON.stringify({
            ts: Date.now(),
            generation: +gen.toFixed(1),
            load: +load.toFixed(1),
            soc: +soc.toFixed(1),
          })

          controller.enqueue(encoder.encode(`data: ${payload}\n\n`))
        } catch {
          clearInterval(interval) // safety: stop if controller is closed
        }
      }

      interval = setInterval(push, 2000)
      push()
    },

    cancel() {
      // cleanup when client disconnects
      clearInterval(interval)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
