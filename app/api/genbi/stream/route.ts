// app/api/genbi/stream/route.ts
import { genbiBus } from "@/lib/genbiBus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sseHeaders() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  } as Record<string, string>;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return new Response("Missing sessionId", { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // initial ping
      send("open", { ok: true, sessionId });

      const off = genbiBus.onDone(sessionId, (payload) => {
        send("done", payload);
        // close stream after done
        try {
          controller.close();
        } catch {}
        off();
      });

      // keep-alive ping each 20s (optional)
      const ping = setInterval(() => {
        try {
          send("ping", { t: Date.now() });
        } catch {}
      }, 20000);

      // cleanup when client disconnect
      // @ts-ignore
      req.signal?.addEventListener("abort", () => {
        clearInterval(ping);
        off();
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}