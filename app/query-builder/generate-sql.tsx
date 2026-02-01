"use client";

import axios from "axios";
import { Info } from "lucide-react";
import { JSX, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownRenderer from "@/components/ReactMarkdownRender";
import DynamicTransactionChart from "@/components/DynamicChart";

export default function GenerateSQL() {
  const [input, setInput] = useState("");
  const [sql, setSQL] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<JSX.Element | string>("");
  const [databases, setDatabases] = useState<
    { id: string; db_name: string; db_type: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<{
    id: string;
    db_type: string;
  } | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [explanation, setExplanation] = useState("");
  const [isChart, setIsChart] = useState(false);
  const [results, setResults] = useState<{ [key: string]: any }[]>([]);
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  /* ================= DB ================= */

  const getDatabaseList = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://n8n.apergu.co.id/webhook/get-list-db"
      );
      if (Array.isArray(res.data)) setDatabases(res.data);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleDatabaseChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const dbId = e.target.value;
    setTables([]);
    try {
      const detail = await axios.get(
        `https://n8n.apergu.co.id/webhook/get-detail-table?id=${dbId}`
      );
      setSelectedDatabase(detail.data);

      const tablesRes = await axios.get(
        `https://n8n.apergu.co.id/webhook/get-list-table?id=${dbId}`
      );
      if (Array.isArray(tablesRes.data?.tables))
        setTables(tablesRes.data.tables);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDatabaseList();
  }, []);

  /* ================= SQL ================= */

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    try {
      const res = await axios.post(
        "https://n8n.apergu.co.id/webhook/generate-sql",
        {
          prompt: input,
          db_id: selectedDatabase?.id,
          type: selectedDatabase?.db_type,
        }
      );
      setSQL(res.data.output || "");
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  const executeSQL = async () => {
    if (!sql.trim()) return;
    setIsGenerating(true);
    try {
      const res = await axios.post(
        "https://n8n.apergu.co.id/webhook/exec-sql2",
        {
          sql,
          db_id: selectedDatabase?.id,
          db_type: selectedDatabase?.db_type,
        }
      );

      if (res.data?.table) {
        setResults(res.data.table);
        setOutput(renderTable(res.data.table));
        setExplanation(res.data.output || "");
      }
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col gap-6">
      {/* TOP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* DB SIDEBAR */}
        <div className="hq-card-2 p-4">
          <h3 className="font-semibold mb-2">Select Database</h3>
          <select className="hq-input mb-2" onChange={handleDatabaseChange}>
            <option value="">-- Select Database --</option>
            {databases.map((db) => (
              <option key={db.id} value={db.id}>
                {db.db_name}
              </option>
            ))}
          </select>

          <p className="text-sm" style={{ color: "var(--muted)" }}>
            If no database exists,{" "}
            <a href="/database-setup" className="underline">
              add one here
            </a>
            .
          </p>

          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Tables</div>
            <div className="hq-card-2 p-2 max-h-[220px] overflow-y-auto">
              {isLoading ? (
                <p style={{ color: "var(--muted)" }}>Loading…</p>
              ) : tables.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {tables.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "var(--muted)" }}>No tables</p>
              )}
            </div>
          </div>
        </div>

        {/* QUERY INPUT */}
        <div className="hq-card p-4 lg:col-span-2">
          <h3 className="font-semibold mb-2">Generate SQL</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="hq-input h-32 resize-none"
            placeholder="Describe your query in natural language…"
          />

          <div className="hq-card-2 p-3 mt-3 text-sm">
            <Info size={14} className="inline mr-1" />
            Example: Get all users who signed up in the last 7 days
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={handleSubmit}
              className="hq-btn-primary"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating…" : "Generate SQL"}
            </button>
            <button className="hq-btn" onClick={executeSQL}>
              Run
            </button>
          </div>
        </div>
      </div>

      {/* SQL OUTPUT */}
      <div className="hq-card p-4">
        <h4 className="text-sm font-semibold mb-2">Generated SQL</h4>
        <pre className="text-sm whitespace-pre-wrap">
          <ReactMarkdown>{sql || "-- No SQL generated yet"}</ReactMarkdown>
        </pre>
      </div>

      {/* RESULTS */}
      <div className="hq-card p-4">
        <h4 className="font-semibold mb-2">Results</h4>
        <div
          ref={scrollableRef}
          className="hq-card-2 p-2 max-h-[360px] overflow-auto"
        >
          {output || (
            <p style={{ color: "var(--muted)" }}>
              No results yet. Run a query.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-3">
          <button className="hq-btn" onClick={() => setIsChart(true)}>
            Create Chart
          </button>
        </div>
      </div>

      {/* EXPLAIN */}
      <div className="hq-card p-4">
        <h4 className="font-semibold mb-2">Explain SQL</h4>
        {explanation ? (
          <MarkdownRenderer content={explanation} />
        ) : (
          <p style={{ color: "var(--muted)" }}>
            No explanation available yet.
          </p>
        )}
      </div>

      {/* CHART */}
      <div className="hq-card p-4">
        <h4 className="font-semibold mb-2">Dynamic Chart</h4>
        {isChart ? (
          <DynamicTransactionChart data={results} />
        ) : (
          <p style={{ color: "var(--muted)" }}>
            Click “Create Chart” to visualize results.
          </p>
        )}
      </div>
    </div>
  );
}

/* ================= TABLE ================= */

function renderTable(data: any[]) {
  if (!Array.isArray(data) || !data.length) return "No data";
  const keys = Object.keys(data[0]);

  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr>
          {keys.map((k) => (
            <th key={k} className="text-left px-2 py-1">
              {k}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {keys.map((k) => (
              <td key={k} className="px-2 py-1">
                {row[k]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}