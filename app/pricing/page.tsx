export default function PricingPage() {
  return (
    <div className="hq-card" style={{ padding: 18 }}>
      <div className="hq-badge">🏷️ Pricing</div>
      <h2 style={{ margin: "12px 0 6px", fontSize: 18, fontWeight: 700 }}>
        Simple tiers
      </h2>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
        Add your real pricing here.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginTop: 16 }}>
        {[
          { t: "Free", d: "Local dev + single DB" },
          { t: "Pro", d: "Multiple DB + saved dashboards" },
          { t: "Team", d: "Roles, audit log, SSO" },
        ].map((p) => (
          <div key={p.t} className="hq-card-2" style={{ padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{p.t}</div>
            <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6, lineHeight: 1.55 }}>{p.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
