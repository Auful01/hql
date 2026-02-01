"use client";

import {
  PlusCircle,
  UploadCloud,
  Star,
  Database,
  FileSpreadsheet,
} from "lucide-react";
import { useState } from "react";
import ConnectDatabase from "./connect";

export default function DatabaseSetupPage() {
  const [selectedMenu, setSelectedMenu] = useState("");

  return (
    <div className="min-h-screen">
      <div className="flex items-start justify-center py-10" style={{padding: 0}}>
        <div className="w-full">
          <div className="hq-card p-6 flex flex-col gap-6">
            {/* Step Indicator */}
            <div className="flex justify-center gap-6 text-sm">
              <Step label="Choose" active />
              <Step label="Configure" active={selectedMenu !== ""} />
              <Step label="Finish" />
            </div>

            {selectedMenu === "connect-to-database" && <ConnectDatabase />}
            {selectedMenu === "" && (
              <DefaultPage setSelectedMenu={setSelectedMenu} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= DEFAULT PAGE ================= */

function DefaultPage({
  setSelectedMenu,
}: {
  setSelectedMenu: (menu: string) => void;
}) {
  return (
    <>
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome to Database Setup
        </h1>
        <p style={{ color: "var(--muted)", marginTop: 6 }}>
          Let’s get your workspace ready. How would you like to start?
        </p>
      </div>

      {/* OPTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Card
          icon={<PlusCircle size={24} />}
          title="Start from Scratch"
          desc="Build your own database structure"
          onselect={() => setSelectedMenu("start-from-scratch")}
        />

        <Card
          icon={<Database size={24} />}
          title="Connect to Your Database"
          desc="Use your existing database from MySQL, PostgreSQL, SQL Server, MongoDB, BigQuery, Snowflake, and more."
          onselect={() => setSelectedMenu("connect-to-database")}
        />

        <Card
          icon={<UploadCloud size={24} />}
          title="Upload SQL File"
          desc="Import schema from a .sql file"
          onselect={() => setSelectedMenu("upload-sql-file")}
        />

        <Card
          icon={<FileSpreadsheet size={24} />}
          title="Upload a Spreadsheet"
          desc="Use an Excel or CSV file as your database"
          onselect={() => setSelectedMenu("upload-spreadsheet")}
        />

        <Card
          icon={<Star size={24} />}
          title="Try a Sample"
          desc="Explore with ready-made example data"
          onselect={() => setSelectedMenu("try-sample")}
        />
      </div>

      {/* FOOTER */}
      <div
        className="text-sm mt-6 flex gap-4"
        style={{ color: "var(--muted)" }}
      >
        <a href="#" className="underline">
          Read the documentation
        </a>
        <span>·</span>
        <a href="#" className="underline">
          View your existing databases
        </a>
      </div>

      {/* NEXT BUTTON */}
      <div className="flex justify-end mt-4">
        <button className="hq-btn-primary flex items-center gap-2 px-6">
          Next <span>→</span>
        </button>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function Step({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
        style={{
          background: active ? "var(--accent)" : "transparent",
          border: `1px solid ${
            active ? "var(--accent)" : "var(--border)"
          }`,
          color: active ? "#fff" : "var(--muted)",
        }}
      >
        ✓
      </div>
      <span style={{ color: active ? "var(--text)" : "var(--muted)" }}>
        {label}
      </span>
    </div>
  );
}
function Card({
  icon,
  title,
  desc,
  onselect,
  fullWidth = false,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onselect?: () => void;
  fullWidth?: boolean;
}) {
  return (
    <div
      onClick={onselect}
      className={`hq-card-2 p-4 cursor-pointer transition ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-3 font-medium">
        <span style={{ color: "var(--accent)" }}>{icon}</span>
        {title}
      </div>
      <p
        className="text-sm mt-2 leading-relaxed"
        style={{ color: "var(--muted)", paddingLeft: 36 }}
      >
        {desc}
      </p>
    </div>
  );
}