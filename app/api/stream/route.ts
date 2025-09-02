export const dynamic = "force-dynamic"

export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      let gen = 50
      let load = 45
      let soc = 70
      function push() {
        gen = Math.max(0, Math.min(100, gen + (Math.random() * 6 - 3)))
        load = Math.max(0, Math.min(100, load + (Math.random() * 6 - 3)))
        soc = Math.max(10, Math.min(100, soc + (Math.random() * 2 - 1)))
        const payload = JSON.stringify({
          ts: Date.now(),
          generation: +gen.toFixed(1),
          load: +load.toFixed(1),
          soc: +soc.toFixed(1),
        })
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`))
      }
      const interval = setInterval(push, 2000)
      push()
      // @ts-ignore
      controller.signal?.addEventListener?.("abort", () => clearInterval(interval))
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
