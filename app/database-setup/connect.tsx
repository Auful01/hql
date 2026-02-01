"use client";

import { useState } from "react";
import { Database, Wifi, ChevronLeft } from "lucide-react";
import axios from "axios";

export default function ConnectDatabase() {
  const [dbType, setDbType] = useState("mysql");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [databaseName, setDatabaseName] = useState("");
  const [testConnection, setTestConnection] = useState<
    "" | "loading" | "true" | "false"
  >("");

  /* ================= API ================= */

  const handleConnect = async () => {
    try {
      const response = await axios.post(
        "https://n8n.apergu.co.id/webhook-test/save-db",
        {
          db_name: databaseName,
          db_type: dbType,
          db_host: host,
          db_port: port,
          db_username: username,
          db_password: password,
        }
      );
      console.log("Database connected successfully:", response.data);
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  };

  const handleTestConnection = async () => {
    setTestConnection("loading");
    try {
      const response = await axios.post(
        "https://n8n.apergu.co.id/webhook/test-db",
        {
          db_name: databaseName,
          db_type: dbType,
          db_host: host,
          db_port: port,
          db_username: username,
          db_password: password,
        }
      );
      console.log("Connection successful:", response.data);
      setTestConnection("true");
    } catch (error) {
      console.error("Connection failed:", error);
      setTestConnection("false");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold">Connect to Database</h2>
        <p style={{ color: "var(--muted)", marginTop: 4 }}>
          Enter your database credentials to connect.
        </p>
      </div>

      {/* STATUS */}
      {testConnection === "true" && (
        <StatusBox type="success" text="Connection successful!" />
      )}
      {testConnection === "false" && (
        <StatusBox
          type="error"
          text="Connection failed. Please check your credentials."
        />
      )}
      {testConnection === "loading" && (
        <StatusBox type="loading" text="Testing connection…" />
      )}

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <Field label="Database Type">
            <select
              value={dbType}
              onChange={(e) => setDbType(e.target.value)}
              className="hq-input"
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="sqlite">SQLite</option>
            </select>
          </Field>

          <Field label="Name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="hq-input"
            />
          </Field>

          <Field label="Host">
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="hq-input"
              placeholder="e.g. 127.0.0.1"
            />
          </Field>

          <Field label="Port">
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="hq-input"
              placeholder="3306"
            />
          </Field>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <Field label="Username">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="hq-input"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="hq-input"
            />
          </Field>

          <Field label="Database Name">
            <input
              type="text"
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
              className="hq-input"
            />
          </Field>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center pt-4 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <button className="hq-btn flex items-center gap-2">
          <ChevronLeft size={18} />
          Back
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleTestConnection}
            className="hq-btn flex items-center gap-2"
          >
            <Wifi size={18} />
            Test Connection
          </button>

          <button
            onClick={handleConnect}
            className="hq-btn-primary flex items-center gap-2"
          >
            <Database size={18} />
            Connect Database
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm" style={{ color: "var(--muted)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function StatusBox({
  type,
  text,
}: {
  type: "success" | "error" | "loading";
  text: string;
}) {
  const color =
    type === "success"
      ? "var(--accent-2)"
      : type === "error"
      ? "#ef4444"
      : "var(--muted)";

  return (
    <div
      className="hq-card-2 p-3 text-sm"
      style={{ color, borderColor: color }}
    >
      {text}
    </div>
  );
}