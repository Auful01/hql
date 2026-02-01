// app/api/genbi/callback/route.ts
import { NextResponse } from "next/server";
import { genbiBus } from "@/lib/genbiBus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CallbackBody = {
  sessionId: string;
  threadId: string;
  databaseId: string;
  ok?: boolean;
  message?: string;
  result?: any;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CallbackBody;

    if (!body?.sessionId || !body?.threadId || !body?.databaseId) {
      return NextResponse.json({ ok: false, message: "Missing fields" }, { status: 400 });
    }

    // Emit event -> SSE stream will receive
    genbiBus.emitDone({
      sessionId: body.sessionId,
      threadId: body.threadId,
      databaseId: body.databaseId,
      ok: body.ok ?? true,
      message: body.message,
      result: body.result,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Server error" }, { status: 500 });
  }
}