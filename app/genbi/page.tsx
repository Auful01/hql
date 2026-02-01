// app/genbi/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BubblesIcon, ChartBar, CheckCircle, Database, RefreshCwIcon } from "lucide-react";
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
  const [activeThreadIndex, setActiveThreadIndex] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [tempQuestion, setTempQuestion] = useState<string | null>(null);

  const saveThread = async (thread: Thread) => {
    const r = await fetch("/api/genbi/thread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(thread),
    });

    if (!r.ok) {
      throw new Error("Failed to save thread");
    }
  };

  const cleanHtml = (html: string) => {
    return html.replace(/```html/g, "").replace(/```/g, "").trim();
  };

  const generateSessionId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  // -----------------------------
  // Threads fetch (same as yours)
  // -----------------------------
  const getThreads = async (): Promise<Thread[]> => {
    try {
      if (!selectedDb) {
        setThreads([]);
        return [];
      }

      const dbId = JSON.parse(selectedDb).id;
      const response = await fetch("https://n8n.apergu.co.id/webhook/threads?db=" + dbId);

      if (!response.ok) throw new Error("Failed to fetch threads");

      const data = await response.json();

      const rawThreads = Array.isArray(data) ? data : Array.isArray(data?.threads) ? data.threads : [];

      const next: Thread[] = rawThreads
        .filter((item: any) => item)
        .map((item: any) => ({
          id: String(item?.thread_id ?? ""),
          databaseId: String(item?.databaseId ?? dbId),
          title: String(item?.title ?? ""),
          messages: Array.isArray(item?.message) ? item.message : [],
          createdAt: typeof item?.createdAt === "number" ? item.createdAt : Date.now(),
        }))
        .filter((t) => t.id.length > 0);

      setThreads(next);
      return next;
    } catch (error) {
      console.error("Error fetching threads:", error);
      setThreads([]);
      return [];
    }
  };

  // -------------------------------------
  // Start job via Next API (no polling)
  // -------------------------------------
  const startGenBIJob = async (payload: {
    question: string;
    databaseId: string;
    threadId: string;
    sessionId: string;
  }) => {
    const r = await fetch("/api/genbi/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const t = await r.text().catch(() => "");
      throw new Error(t || "Failed to start GenBI job");
    }
    return r.json();
  };

  // -------------------------------------
  // Listen SSE until done (1 session only)
  // -------------------------------------
  const waitDoneViaSSE = async (sessionId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const es = new EventSource(`/api/genbi/stream?sessionId=${encodeURIComponent(sessionId)}`);

      const cleanup = () => {
        try {
          es.close();
        } catch {}
      };

      es.addEventListener("open", () => {
        // opened
      });

      es.addEventListener("done", (e: any) => {
        cleanup();
        try {
          const data = JSON.parse(e.data);
          resolve(data);
        } catch {
          resolve({ ok: true });
        }
      });

      es.onerror = () => {
        cleanup();
        reject(new Error("SSE connection failed"));
      };
    });
  };

  // -----------------------------
  // Effects
  // -----------------------------
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const db = localStorage.getItem("selectedDb");
    if (!db) {
      window.location.href = "/genbi/setup";
    } else {
      setSelectedDb(db);
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!selectedDb) return;
    getThreads();
  }, [selectedDb]);

  useEffect(() => {
    if (menuIndex === null) return;

    const handleClickOutside = (e: MouseEvent) => {
      const el = menuRefs.current[menuIndex!];
      if (el && !el.contains(e.target as Node)) setMenuIndex(null);
      if (!el?.classList.contains("popup-thread")) setMenuIndex(null);
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuIndex(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuIndex]);

  const startNewThread = () => {
    setChatHistory([]);
    setShowSuggestions(true);
    setActiveThreadIndex(null);
  };

  const handleRename = (i: number) => {
    const newName = prompt("Rename thread:", threads[i].messages[0] || "Untitled");
    if (newName) {
      const updated = [...threads];
      updated[i].messages[0] = newName;
      setThreads(updated);
    }
    setMenuIndex(null);
  };

  const handleDelete = (i: number) => {
    if (confirm("Delete this thread?")) {
      const updated = threads.filter((_, idx) => idx !== i);
      setThreads(updated);
      if (activeThreadIndex === i) {
        setActiveThreadIndex(null);
        setChatHistory([]);
      }
    }
    setMenuIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim() || !selectedDb) return;

    const questionText = userQuestion.trim();
    const dbId = JSON.parse(selectedDb).id;

    setUserQuestion("");
    setShowSuggestions(false);
    setTempQuestion(questionText);
    setIsProcessing(true);

    let threadId = "";
    let nextActiveIndex = activeThreadIndex;

    // create thread if none
    if (activeThreadIndex === null) {
    const newThread: Thread = {
      id: generateSessionId(),
      databaseId: dbId,
      title: questionText.length > 36
        ? questionText.substring(0, 36) + "..."
        : questionText,
      messages: [],
      createdAt: Date.now(),
    };

    const idx = threads.length;
    nextActiveIndex = idx;

    setThreads(prev => [...prev, newThread]);
    setActiveThreadIndex(idx);

    threadId = newThread.id;

    // 🔥 INI YANG WAJIB ADA
    await saveThread(newThread);
  } else {
      threadId = threads[activeThreadIndex]?.id;
    }

    const sessionId = generateSessionId();

    try {
      // 1) start job (fire)
      await startGenBIJob({
        question: questionText,
        databaseId: dbId,
        threadId,
        sessionId,
      });

      // 2) wait for done event from backend SSE
      await waitDoneViaSSE(sessionId);

      // 3) after done -> fetch threads ONCE and update UI
      const latestThreads = await getThreads();

      // set chatHistory for current thread
      const activeId = threadId;
      const current = latestThreads.find((t) => t.id === activeId);

      if (current) setChatHistory(current.messages || []);
      setIsProcessing(false);
      setTempQuestion(null);
      if (typeof nextActiveIndex === "number") setActiveThreadIndex(nextActiveIndex);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setTempQuestion(null);
      alert("GenBI failed / callback not received. Check tunnel + n8n callback node.");
    }
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

  return (
    <div>
      <div className="grid grid-cols-12 gap-4 h-full p-4 overflow-y-hidden">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3 bg-gray-900 text-white p-4 rounded" style={{ height: "90vh" }}>
          <p className="text-gray-400 mb-6">
            {selectedDb ? JSON.parse(selectedDb).db_name : "Select Database"}
            <RefreshCwIcon className="inline ml-2 cursor-pointer size-4" onClick={() => handleRefresh()} />
          </p>

          <a href="#" className="block hover:bg-gray-800 rounded">
            Dashboard
          </a>

          <br />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Threads</h2>
            <button onClick={startNewThread} className="bg-primary hover:bg-[#dbeeea] text-white px-4 py-2 rounded btn-sm">
              New
            </button>
          </div>

          {!Array.isArray(threads) || threads.length === 0 ? (
            <div className="text-sm text-gray-400 mb-4">No threads yet. Start a new thread.</div>
          ) : (
            <ul>
              {threads.map((thread, i) => (
                <li key={i} className="flex items-center justify-between group">
                  <a
                    href="#"
                    onClick={() => {
                      setActiveThreadIndex(i);
                      setChatHistory(thread.messages);
                      setShowSuggestions(false);
                    }}
                    className={`flex-1 block p-2 rounded hover:bg-gray-800 ${i === activeThreadIndex ? "bg-gray-800" : ""}`}
                  >
                    {thread.title.length > 0 ? (thread.title.length > 36 ? `${thread.title.substring(0, 36)}...` : thread.title) : "Untitled"}
                  </a>

                  {/* 3 dots */}
                  <div className="relative">
                    <button onClick={() => setMenuIndex(menuIndex === i ? null : i)} className="p-1 rounded hover:bg-gray-700">
                      ⋮
                    </button>

                    {menuIndex === i && (
                      <div className="absolute right-0 mt-1 w-32 bg-gray-900 border border-gray-700 rounded shadow-lg z-50 popup-thread">
                        <button onClick={() => handleRename(i)} className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-700">
                          Rename
                        </button>
                        <button onClick={() => handleDelete(i)} className="block w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main */}
        <div className="col-span-12 lg:col-span-9 bg-gray-900 text-white p-4 rounded relative overflow-hidden">
          {/* Suggestions */}
          {showSuggestions && (
            <div className="h-full flex flex-col justify-center">
              <div className="flex-1 overflow-y-auto max-h-[calc(90vh-400px)] pr-2 justify-center items-center">
                <>
                  <div className="text-center mb-6">
                    <div className="text-2xl font-medium text-white mb-2">Know more about your data</div>
                    <div className="text-gray-500">Try asking…</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 w-200 text-center mx-auto">
                    <Card type="Ranking" question="Which are the top 3 cities with the highest number of orders?" />
                    <Card type="Aggregation" question="What is the average score of reviews submitted for orders placed by customers in each city?" />
                    <Card type="Aggregation" question="What is the total value of payments made by customers from each state?" />
                  </div>
                </>
              </div>
            </div>
          )}

          {/* Chat */}
          {!showSuggestions && (
            <div className="relative h-[790px] flex items-start justify-center overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full"
                >
                  {chatHistory.map((question, index) => (
                    <div key={index} ref={index === chatHistory.length - 1 ? bottomRef : null} className="mb-6">
                      <AnswerCard question={question ?? ""} cleanHtml={cleanHtml} />
                      {index < chatHistory.length - 1 && <hr className="my-6 border-gray-700 max-w-3xl mx-auto" />}
                    </div>
                  ))}

                  {/* temp question + processing */}
                  {tempQuestion && (
                    <div className="max-w-3xl mx-auto mb-4">
                      <div className="bg-blue-600 text-white px-4 py-3 rounded-md shadow">{tempQuestion}</div>
                      {isProcessing && (
                        <div className="flex items-center gap-2 mt-2 text-gray-400">
                          <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm italic">Processing...</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Input */}
          <div className="absolute bottom-10 left-0 right-0 px-4">
            <form onSubmit={handleSubmit} className="flex border border-gray-600 rounded-md overflow-hidden bg-gray-800 shadow-md max-w-3xl mx-auto">
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Ask to explore your data"
                className="flex-grow px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
              <button type="submit" className="bg-blue-600 px-5 py-2 text-white font-medium hover:bg-blue-500 transition">
                Ask
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ type, question }: { type: string; question: string }) {
  return (
    <div className="border border-gray-300 p-4 rounded-md text-left shadow-sm hover:shadow-md transition">
      <div className="text-sm font-semibold text-gray-500 mb-1">{type}</div>
      <div className="text-white">{question}</div>
    </div>
  );
}

function AnswerCard({ question, cleanHtml }: { question: any; cleanHtml: (html: string) => string }) {
  const [tab, setTab] = useState<"answer" | "sql" | "chart">("answer");

  const hasContent = question?.content?.content?.length > 0;

  return (
    <>
      <div className="flex text-white shadow-md max-w-3xl mx-auto pt-10">
        <BubblesIcon className="w-6 h-6 text-blue-300 mr-2 mt-1" />
        <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      </div>

      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        {!hasContent ? (
          <div className="flex items-center gap-2 text-gray-400 italic">
            <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Loading answer...
          </div>
        ) : (
          <>
            <div className="flex gap-4 mb-4 border-b pb-2">
              <button onClick={() => setTab("answer")} className={`${tab === "answer" ? "font-bold text-white" : "text-gray-500"} hover:text-white`}>
                <CheckCircle className="inline mr-1" size={16} />
                Answer
              </button>
              <button onClick={() => setTab("sql")} className={`${tab === "sql" ? "font-bold text-white" : "text-gray-500"} hover:text-white`}>
                <Database className="inline mr-1" size={16} />
                View SQL
              </button>
              <button onClick={() => setTab("chart")} className={`${tab === "chart" ? "font-bold text-white" : "text-gray-500"} hover:text-white`}>
                <ChartBar className="inline mr-1" size={16} />
                Graphic
              </button>
            </div>

            {tab === "answer" && (
              <div>
                <article
                  dangerouslySetInnerHTML={{
                    __html: cleanHtml(question.content.content[0].text ?? "untitled"),
                  }}
                />
              </div>
            )}

            {tab === "sql" && (
              <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto text-black">
                {question.content.content?.[1]?.query ?? "No SQL"}
              </pre>
            )}

            {tab === "chart" && (
              <div className="text-center text-gray-400 pb-15 italic">
                <DynamicTransactionChart data={question.content.content?.[2]?.data ?? []} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}