"use client";

import { useState } from "react";

import GenerateSQL from "./generate-sql";
import SQLAssistant from "./sql-assistant";
import ExplainSQL from "./explain-sql";
import CSVAnalyst from "./csv-analyst";

type ToolKey =
  | "query-builder"
  | "sql-assistant"
  | "explain-sql"
  | "csv-analyst";

export default function QueryBuilderPage() {
  const [selectedTool, setSelectedTool] = useState<ToolKey>("query-builder");

  return (
    <div className="">
      <div className="grid grid-cols-12">
        {/* LEFT TOOL SIDEBAR */}
        <aside
          className="col-span-12 lg:col-span-3 border-r"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="p-4 flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold">Query Tools</h2>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                Choose how you want to work with SQL
              </p>
            </div>

            <ToolButton
              active={selectedTool === "query-builder"}
              onClick={() => setSelectedTool("query-builder")}
              title="Query Builder"
              desc="Generate SQL from structured inputs"
            />
            <ToolButton
              active={selectedTool === "sql-assistant"}
              onClick={() => setSelectedTool("sql-assistant")}
              title="SQL Assistant"
              desc="Ask questions and refine SQL"
            />
            <ToolButton
              active={selectedTool === "explain-sql"}
              onClick={() => setSelectedTool("explain-sql")}
              title="Explain SQL"
              desc="Understand what a SQL query does"
            />
            <ToolButton
              active={selectedTool === "csv-analyst"}
              onClick={() => setSelectedTool("csv-analyst")}
              title="CSV Analyst"
              desc="Analyze CSV or spreadsheet files"
            />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="col-span-12 lg:col-span-9">
          <div className="py-6 pl-4">
            <div className="w-full mx-auto">
              <div className="hq-card p-6">
                {selectedTool === "query-builder" && <GenerateSQL />}
                {selectedTool === "sql-assistant" && <SQLAssistant />}
                {selectedTool === "explain-sql" && <ExplainSQL />}
                {selectedTool === "csv-analyst" && <CSVAnalyst />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function ToolButton({
  title,
  desc,
  active,
  onClick,
}: {
  title: string;
  desc: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="hq-card-2 text-left p-4 transition"
      style={{
        borderColor: active ? "var(--accent)" : "var(--border)",
        background: active
          ? "rgba(124, 92, 255, 0.12)"
          : undefined,
      }}
    >
      <div className="font-medium">{title}</div>
      <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
        {desc}
      </div>
    </button>
  );
}