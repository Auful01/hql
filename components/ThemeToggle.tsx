"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark";
    const t = saved || "dark";
    document.documentElement.setAttribute("data-theme", t);
    setTheme(t);
  }, []);

  const toggle = () => {
    const t = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
    setTheme(t);
  };

  return (
    <button className="btn" onClick={toggle}>
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}