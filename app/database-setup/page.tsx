// app/database-setup/page.tsx
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
    <div className="grid grid-cols-12  gap-4 p-4">
      {/* Step Indicator */}
      <div className="col-span-12 lg:col-span-12 bg-[#0F172A] rounded-lg p-6">
        <div className="flex justify-center gap-4 p-4 text-sm text-gray-300">
            <Step label="Choose" active />
            <Step label="Configure"  active={
selectedMenu !== ""  } />
            <Step label="Finish" />
        </div>

        {
            selectedMenu === "connect-to-database" && (
                <ConnectDatabase />
            )
        }

        {
            selectedMenu === "" && (
                <DefaultPage selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
            )
        }
      
      </div>
    </div>
  );
}

function DefaultPage({selectedMenu, setSelectedMenu}: {selectedMenu: string; setSelectedMenu: (menu: string) => void}) {
    return(
        <>
          {/* Title */}
          <div className="text-start">
          <h1 className="text-3xl font-bold">Welcome to Database Setup</h1>
          <p className="text-gray-400 mt-2">
          Let’s get your workspace ready. How would you like to start?
          </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card icon={<PlusCircle size={28} />} title="Start from Scratch" desc="Build your own database structure" onselect={() => setSelectedMenu("start-from-scratch")} />
          <Card icon={<Database size={28} />} title="Connect to Your Database" desc="Use your existing database from MySQL, SQL Server, PostgreSQL, MongoDB, Snowflake, Oracle Cloud, BigQuery, Clickhouse, Redshift, SQLite, Databricks, Firebird, Microsoft Access, and more." 
          onselect={() => setSelectedMenu("connect-to-database")}
          />
          <Card icon={<UploadCloud size={28} />} title="Upload SQL File" desc="Import schema from a .sql file" 
          onselect={() => setSelectedMenu("upload-sql-file")}
          />
          <Card icon={<FileSpreadsheet size={28} />} title="Upload a Spreadsheet" desc="Use an Excel or CSV file as your database" 
          onselect={() => setSelectedMenu("upload-spreadsheet")}
          />
          <Card icon={<Star size={28} />} title="Try a Sample" desc="Explore with ready-made example data" 
          onselect={() => setSelectedMenu("try-sample")}
          />
      </div>

      {/* Footer Links */}
      <div className="text-center text-sm text-gray-400 mt-8 space-x-4">
          <a href="#" className="underline">Read the documentation</a>
          <span>·</span>
          <a href="#" className="underline">View your existing databases</a>
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-4  mx-auto">
          <button className="flex items-center gap-2 px-6 py-2 bg-[#326358] hover:bg-purple-700 text-white rounded">
          Next <span className="text-lg">→</span>
          </button>
      </div>
      </>
    )
}

function Step({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full text-sm font-semibold flex items-center justify-center border ${
        active ? "bg-[#326358] border-[#589f8f] text-white" : "bg-[#1E2540] border-gray-500"
      }`}>
        
      </div>
      <span>{label}</span>
    </div>
  );
}

function Card({ icon, title, desc, onselect }: { icon: React.ReactNode; title: string; desc: string; onselect?: () => void }) {
  const handleClick = () => {
    if (onselect) {
      onselect();
    }
  };
  return (
    <div className="bg-gray-800 hover:bg-gray-900 transition rounded-xl p-4 space-y-2 border border-[#2C365C] cursor-pointer" onClick={handleClick}>
      <div className="flex items-center gap-3 text-[#326358] font-semibold">
        {icon} <span>{title}</span>
      </div>
      <p className="text-sm text-gray-300 pl-10 leading-relaxed">{desc}</p>
    </div>
  );
}
