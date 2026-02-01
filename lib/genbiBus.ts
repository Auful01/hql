// lib/genbiBus.ts
import { EventEmitter } from "events";

type GenBIEventPayload = {
  sessionId: string;
  threadId: string;
  databaseId: string;
  ok: boolean;
  message?: string;
  // optional result snapshot
  result?: any;
};

class GenBIBus extends EventEmitter {
  emitDone(payload: GenBIEventPayload) {
    this.emit(`done:${payload.sessionId}`, payload);
  }

  onDone(sessionId: string, handler: (p: GenBIEventPayload) => void) {
    this.on(`done:${sessionId}`, handler);
    return () => this.off(`done:${sessionId}`, handler);
  }
}

// IMPORTANT: singleton (so it persists in same node process)
const globalAny = globalThis as any;
export const genbiBus: GenBIBus = globalAny.__genbiBus ?? new GenBIBus();
if (!globalAny.__genbiBus) globalAny.__genbiBus = genbiBus;

export type { GenBIEventPayload };