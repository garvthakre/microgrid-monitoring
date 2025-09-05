export const dynamic = "force-dynamic"

function solarAt(hourFrac: number) {
  // hourFrac: 0..24
  if (hourFrac < 6 || hourFrac > 18) return 0
  const t = (hourFrac - 6) / 12 // 0..1
  return Math.sin(Math.PI * t) * 90
}

function loadAt(hourFrac: number) {
  // Morning and evening peaks with a base
  const base = 40
  const m = Math.exp(-0.5 * Math.pow((hourFrac - 8) / 2.2, 2)) * 14
  const e = Math.exp(-0.5 * Math.pow((hourFrac - 19) / 2.2, 2)) * 18
  return base + m + e
}

export async function GET() {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    start(controller) {
      // Initialize near current baseline
      const now = new Date()
      // Convert to IST ~ UTC+5:30 for local realism
      const istMs = now.getTime() + 5.5 * 60 * 60 * 1000
      const ist = new Date(istMs)
      const hourFrac0 = ist.getUTCHours() + ist.getUTCMinutes() / 60
      let gen = solarAt(hourFrac0) + (Math.random() * 6 - 3)
      let load = loadAt(hourFrac0) + (Math.random() * 6 - 3)
      let soc = 65 + Math.random() * 10
      
      let isActive = true

      function push() {
        // Check if controller is still active
        if (!isActive) {
          return
        }

        try {
          const tNow = new Date()
          const istNow = new Date(tNow.getTime() + 5.5 * 60 * 60 * 1000)
          const hourFrac = istNow.getUTCHours() + istNow.getUTCMinutes() / 60 + istNow.getUTCSeconds() / 3600

          const gBase = solarAt(hourFrac)
          const lBase = loadAt(hourFrac)

          gen = Math.max(0, Math.min(100, gBase + (Math.random() * 6 - 3)))
          load = Math.max(0, Math.min(100, lBase + (Math.random() * 6 - 3)))
          soc = Math.max(10, Math.min(100, soc + (gen - load) * 0.02 + (Math.random() * 0.6 - 0.3)))

          const payload = JSON.stringify({
            ts: Date.now(),
            generation: +gen.toFixed(1),
            load: +load.toFixed(1),
            soc: +soc.toFixed(1),
          })

          controller.enqueue(encoder.encode(`data: ${payload}\n\n`))
        } catch (error) {
          // Controller is closed, stop the interval
          isActive = false
          clearInterval(interval)
        }
      }

      const interval = setInterval(push, 2000)
      
      // Initial push
      push()
      
      // Cleanup when stream is closed
      const cleanup = () => {
        isActive = false
        clearInterval(interval)
      }

      // Handle different ways the stream can be closed
      if (controller.signal) {
        controller.signal.addEventListener('abort', cleanup)
      }
      
      // Also handle when the controller is closed
      const originalClose = controller.close
      controller.close = function() {
        cleanup()
        return originalClose.call(this)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control"
    },
  })
}