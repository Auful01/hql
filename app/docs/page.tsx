export default function DocsPage() {
  return (
    <div className="hq-card" style={{ padding: 18 }}>
      <div className="hq-badge">📚 Docs</div>
      <h2 style={{ margin: "12px 0 6px", fontSize: 18, fontWeight: 700 }}>
        Quick start
      </h2>
      <ol style={{ margin: "8px 0 0", paddingLeft: 18, color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>
        <li>Go to Database Setup and save a connection.</li>
        <li>Use GenBI or Query Builder to generate SQL.</li>
        <li>Pin results to Dashboard (coming soon).</li>
      </ol>
    </div>
  );
}
