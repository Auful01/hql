"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BubblesIcon,
  ChartBar,
  CheckCircle,
  Database,
  RefreshCwIcon,
} from "lucide-react";
import DynamicTransactionChart from "@/components/DynamicChart";

type Thread = {
  id: string;
  databaseId?: string;
  title: string;
  messages: any[];
  createdAt: number;
};

export default function GenBIPage() {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [userQuestion, setUserQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [selectedDb, setSelectedDb] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadIndex, setActiveThreadIndex] = useState<number | null>(
    null
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [tempQuestion, setTempQuestion] = useState<string | null>(null);

  const generateSessionId = () =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  /* ==============================
      THREADS FETCH
  ============================== */
  const getThreads = async (): Promise<Thread[]> => {
    try {
      if (!selectedDb) return [];
      const dbId = JSON.parse(selectedDb).id;
      const r = await fetch(
        "https://n8n.apergu.co.id/webhook/threads?db=" + dbId
      );
      const data = await r.json();
      const raw = Array.isArray(data) ? data : data?.threads ?? [];
      const next = raw.map((t: any) => ({
        id: String(t.thread_id),
        databaseId: dbId,
        title: t.title || "Untitled",
        messages: Array.isArray(t.message) ? t.message : [],
        createdAt: t.createdAt ?? Date.now(),
      }));
      setThreads(next);
      return next;
    } catch {
      setThreads([]);
      return [];
    }
  };

  /* ==============================
      EFFECTS
  ============================== */
  useEffect(() => {
    const db = localStorage.getItem("selectedDb");
    if (!db) window.location.href = "/genbi/setup";
    else setSelectedDb(db);
  }, []);

  useEffect(() => {
    if (selectedDb) getThreads();
  }, [selectedDb]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  /* ==============================
      HANDLERS
  ============================== */
  const startNewThread = () => {
    setChatHistory([]);
    setShowSuggestions(true);
    setActiveThreadIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const q = userQuestion.trim();
    setUserQuestion("");
    setTempQuestion(q);
    setShowSuggestions(false);
    setIsProcessing(true);

    setTimeout(() => {
      setChatHistory((p) => [
        ...p,
        {
          question: q,
          content: {
            content: [
              { text: "<p>This is a sample answer.</p>" },
              { query: "SELECT * FROM table" },
              { data: [] },
            ],
          },
        },
      ]);
      setTempQuestion(null);
      setIsProcessing(false);
    }, 1200);
  };

    const handleRefresh = () => {
    setChatHistory([]);
    setShowSuggestions(true);
    setActiveThreadIndex(null);
    setUserQuestion("");
    setThreads([]);
    localStorage.removeItem("selectedDb");
    window.location.href = "/genbi/setup";
  };

  /* ==============================
      RENDER
  ============================== */
  return (
    <div className="h-[88vh] overflow-hidden" style={{padding: '0px'}}>
      <div className="grid grid-cols-12 gap-4 h-[88vh]" >
        {/* ================= SIDEBAR ================= */}
        <div className="col-span-12 lg:col-span-3">
          <div className="hq-card h-full p-4 flex flex-col">
            <p style={{ color: "var(--muted)" }} className="mb-4 text-sm">
              {selectedDb
                ? JSON.parse(selectedDb).db_name
                : "Select Database"}
              <RefreshCwIcon
                className="inline ml-2 cursor-pointer"
                size={14}
                onClick={() => { handleRefresh() }}
              />
            </p>

            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Threads</h3>
              <button className="hq-btn" onClick={startNewThread}>
                New
              </button>
            </div>

            <div className="flex-1 overflow-auto space-y-1">
              {threads.map((t, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setActiveThreadIndex(i);
                    setChatHistory(t.messages);
                    setShowSuggestions(false);
                  }}
                  className="p-2 rounded cursor-pointer"
                  style={{
                    background:
                      i === activeThreadIndex
                        ? "var(--surface-2)"
                        : "transparent",
                  }}
                >
                  {t.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= MAIN ================= */}
        <div className="col-span-12 lg:col-span-9">
          <div className="hq-card h-full p-6 relative overflow-hidden">
            {/* SUGGESTIONS */}
            {showSuggestions && (
              <div className="h-full flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold mb-2">
                  Know more about your data
                </h2>
                <p style={{ color: "var(--muted)" }} className="mb-6">
                  Try asking…
                </p>

                <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
                  <SuggestionCard
                    type="Ranking"
                    q="Top 3 cities with highest orders?"
                  />
                  <SuggestionCard
                    type="Aggregation"
                    q="Average review score per city?"
                  />
                  <SuggestionCard
                    type="Aggregation"
                    q="Total payments per state?"
                  />
                </div>
              </div>
            )}

            {/* CHAT */}
            {!showSuggestions && (
              <div className="h-[78vh] overflow-auto pb-28">
                <AnimatePresence>
                  {chatHistory.map((q, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-10"
                      ref={i === chatHistory.length - 1 ? bottomRef : null}
                    >
                      <AnswerCard question={q} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {tempQuestion && (
                  <div className="hq-card-2 p-4 max-w-3xl mx-auto">
                    {tempQuestion}
                    {isProcessing && (
                      <div
                        className="mt-2 text-sm"
                        style={{ color: "var(--muted)" }}
                      >
                        Processing…
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* INPUT */}
            <form
              onSubmit={handleSubmit}
              className="absolute bottom-4 left-0 right-0 px-6"
            >
              <div className="hq-card flex max-w-3xl mx-auto overflow-hidden">
                <input
                  className="hq-input border-none"
                  placeholder="Ask to explore your data"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                />
                <button className="hq-btn-primary px-6">Ask</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SuggestionCard({ type, q }: { type: string; q: string }) {
  return (
    <div className="hq-card-2 p-4 cursor-pointer">
      <div style={{ color: "var(--muted)", fontSize: 12 }}>{type}</div>
      <div className="mt-1">{q}</div>
    </div>
  );
}

function AnswerCard({ question }: any) {
  const [tab, setTab] = useState<"answer" | "sql" | "chart">("answer");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-2 mb-3">
        <BubblesIcon size={20} style={{ color: "var(--accent)" }} />
        <h3 className="font-semibold">{question.question}</h3>
      </div>

      <div className="hq-card p-5">
        <div className="flex gap-4 mb-4 border-b pb-2">
          {["answer", "sql", "chart"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              style={{
                color:
                  tab === t ? "var(--text)" : "var(--muted)",
                fontWeight: tab === t ? 600 : 400,
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === "answer" && (
          <article
            dangerouslySetInnerHTML={{
              __html: question.content.content[0].text,
            }}
          />
        )}

        {tab === "sql" && (
          <pre className="hq-card-2 p-4 text-sm overflow-auto">
            {question.content.content[1].query}
          </pre>
        )}

        {tab === "chart" && (
          <DynamicTransactionChart
            data={question.content.content[2].data}
          />
        )}
      </div>
    </div>
  );
}