// components/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Tag,
  Share2,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ReactNode } from "react";

interface MenuItem {
  icon: ReactNode;
  href: string;
  text: string;
  separator?: boolean;
}

const menuItems: MenuItem[] = [
  { icon: <LayoutDashboard size={18} />, href: "/query-builder", text: "Query Builder" },
  { icon: <Database size={18} />, href: "/database-setup", text: "Database Setup" },
  { icon: <Search size={18} />, href: "/assistant", text: "SQL Assistants" },
  { icon: <LayoutDashboard size={18} />, href: "/dashboard", text: "Dashboard" },
  { separator: true, icon: null, href: "", text: "" },
  { icon: <User size={18} />, href: "/account", text: "Account" },
  { icon: <Tag size={18} />, href: "/pricing", text: "Pricing" },
  { icon: <Settings size={18} />, href: "/settings", text: "Settings" },
  { icon: <Share2 size={18} />, href: "/refer", text: "Refer & Earn" },
  { icon: <HelpCircle size={18} />, href: "/docs", text: "Documentation" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Toggle Sidebar visibility (mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-2 rounded"
      >
        {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 h-screen
          ${isMinimized ? "w-20" : "w-64"}
          bg-[#1C1C2E] text-white transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:flex`}
      >
        <div className="flex flex-col w-full h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h1
              className={`text-xl font-bold text-primary transition-opacity ${
                isMinimized ? "opacity-0 w-0" : "opacity-100"
              }`}
            >
              HumanQL
            </h1>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hidden lg:block text-white"
            >
              {isMinimized ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2 text-sm">
            {menuItems.map((item, idx) =>
              item.separator ? (
                <hr key={idx} className="my-2 border-gray-700" />
              ) : (
                <SidebarItem
                  key={item.href}
                  icon={item.icon}
                  href={item.href}
                  text={item.text}
                  isMinimized={isMinimized}
                  active={isActive(item.href)}
                />
              )
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                MA
              </div>
              {!isMinimized && (
                <div>
                  <p className="text-sm font-semibold truncate">Muhammad Auful...</p>
                  <p className="text-xs text-gray-400 truncate">auful.work@gmail.com</p>
                </div>
              )}
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-red-400 py-2 px-3 rounded">
              <LogOut size={16} />
              {!isMinimized && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon, href, text, active = false, isMinimized }: {
  icon: ReactNode;
  href: string;
  text: string;
  active?: boolean;
  isMinimized?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active
          ? "bg-primary text-white"
          : "hover:bg-gray-700 text-gray-300"
      }`}
    >
      {icon}
      {!isMinimized && <span>{text}</span>}
    </Link>
  );
}
