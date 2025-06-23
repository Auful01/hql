"use client";

import { usePathname } from "next/navigation";

export default function PageTitle() {
  const pathname = usePathname();
  const pageName = pathname
    .replace("/", "")
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <h1 className="ms-4 text-3xl font-bold text-white">
      {pageName || "Home"}
    </h1>
  );
}