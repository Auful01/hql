"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, LayoutDashboard, MessageSquareText, Home, Settings, Tag } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import ThemeToggle from "./ThemeToggle";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const NAV: NavItem[] = [
  { href: "/", label: "Home", icon: <Home size={18} /> },
  { href: "/genbi", label: "GenBI", icon: <MessageSquareText size={18} /> },
  { href: "/query-builder", label: "Query Builder", icon: <LayoutDashboard size={18} /> },
  { href: "/database-setup", label: "Database Setup", icon: <Database size={18} /> },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/pricing", label: "Pricing", icon: <Tag size={18} /> },
  { href: "/settings", label: "Settings", icon: <Settings size={18} /> },
];

function titleFromPath(pathname: string) {
  if (!pathname || pathname === "/") return "Home";
  const clean = pathname.split("?")[0].split("#")[0];
  const last = clean.split("/").filter(Boolean).slice(-1)[0] || "Home";
  return last
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const pageTitle = useMemo(() => titleFromPath(pathname), [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: collapsed ? "84px 1fr" : "280px 1fr",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <aside style={{ padding: 18, borderRight: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="hq-card" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.2 }}>
                {collapsed ? "HQL" : "HumanQL"}
              </div>
              {!collapsed && (
                <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>
                  Query → SQL → Chart
                </div>
              )}
            </div>
            <button
              className="hq-btn"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
              style={{ padding: "8px 10px" }}
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>

          {!collapsed && (
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <Link className="hq-btn hq-btn-primary" href="/genbi" style={{ flex: 1, textAlign: "center" }}>
                New Chat
              </Link>
              <Link className="hq-btn" href="/database-setup" style={{ flex: 1, textAlign: "center" }}>
                Connect
              </Link>
            </div>
          )}
        </div>

        <nav style={{ marginTop: 14, display: "grid", gap: 8 }}>
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="hq-card-2"
                style={{
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderColor: active ? "rgba(124,92,255,0.55)" : "rgba(255,255,255,0.10)",
                  background: active ? "rgba(124,92,255,0.12)" : "rgba(255,255,255,0.04)",
                }}
              >
                <span style={{ opacity: 0.95 }}>{item.icon}</span>
                {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
          <div
            className="hq-card"
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
            }}
          >
            MA
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Muhammad Auful Kirom
              </div>
              <div style={{ color: "var(--muted)", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Local mode
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="hq-container">
        <header
          className="hq-card"
          style={{
            padding: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{pageTitle}</div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Ask a question → get SQL → visualize.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link className="hq-btn" href="/docs">
              Docs
            </Link>
            <Link className="hq-btn hq-btn-primary" href="/pricing">
              Upgrade
            </Link>
            
            <ThemeToggle />
          </div>


          
        </header>

        <div style={{ marginTop: 16 }}>{children}</div>
      </main>
    </div>
  );
}
