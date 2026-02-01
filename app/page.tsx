export default function HomePage() {
  return (
    <div className="hq-card" style={{ padding: 18 }}>
      <div className="hq-badge">✨ Ready</div>

      <h2 style={{ margin: "12px 0 6px", fontSize: 18, fontWeight: 700 }}>
        Start with a question
      </h2>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
        Example: “Data Sales Order Q4 2025 dari PT Sokka Tama” → intent → SQL → chart/table.
      </p>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        <input className="hq-input" placeholder="Type your question…" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="hq-btn hq-btn-primary" href="/genbi">
            Open GenBI Chat
          </a>
          <a className="hq-btn" href="/query-builder">
            Open Query Builder
          </a>
          <a className="hq-btn" href="/database-setup">
            Connect Database
          </a>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginTop: 16 }}>
        <div className="hq-card-2" style={{ padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>1) Connect</div>
          <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6, lineHeight: 1.55 }}>
            Save DB connection & schema metadata.
          </div>
        </div>
        <div className="hq-card-2" style={{ padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>2) Ask</div>
          <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6, lineHeight: 1.55 }}>
            Natural language prompt → decide intent.
          </div>
        </div>
        <div className="hq-card-2" style={{ padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>3) Visualize</div>
          <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6, lineHeight: 1.55 }}>
            Table + chart with simple export.
          </div>
        </div>
      </div>
    </div>
  );
}
