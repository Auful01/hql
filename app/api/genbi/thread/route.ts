import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, databaseId, title } = body;

    if (!id || !databaseId) {
      return NextResponse.json({ ok: false, message: "Missing fields" }, { status: 400 });
    }

    // forward ke n8n / backend kamu yang simpan DB
    const r = await fetch("https://n8n.apergu.co.id/webhook/hql/genbi/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thread_id: id,
        database_id: databaseId,
        title,
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return NextResponse.json({ ok: false, message: t }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}