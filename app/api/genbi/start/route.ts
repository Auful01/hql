// app/api/genbi/start/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  question: string;
  databaseId: string;
  threadId: string;
  sessionId: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    if (!body?.question || !body?.databaseId || !body?.threadId || !body?.sessionId) {
      return NextResponse.json({ ok: false, message: "Missing fields" }, { status: 400 });
    }

    // IMPORTANT:
    // n8n must be able to callback to /api/genbi/callback with the SAME sessionId
    // so we forward sessionId, threadId, databaseId
    const n8nUrl = process.env.N8N_GENBI_WEBHOOK_URL || "https://n8n.apergu.co.id/webhook/hql/genbi";

    const r = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: body.question,
        databaseId: body.databaseId,
        threadId: body.threadId,
        sessionId: body.sessionId,
        // optional: pass callback url if you want n8n to use it dynamically
        callbackUrl: process.env.GENBI_CALLBACK_URL, // e.g. https://xxxx.trycloudflare.com/api/genbi/callback
      }),
    });

    // n8n biasanya langsung 200/202. Kita anggap "queued"
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return NextResponse.json(
        { ok: false, message: `Failed to trigger n8n: ${text}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, queued: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Server error" }, { status: 500 });
  }
}