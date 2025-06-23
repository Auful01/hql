// app/query-builder/page.tsx
"use client";

import { JSX, useEffect, useRef, useState } from "react";
import {
    Info,
    Lamp,
    Copy
} from "lucide-react";
import axios from "axios";
import MarkdownRenderer from "@/components/ReactMarkdownRender";
import DynamicTransactionChart from "@/components/DynamicChart";
import GenerateSQL from "./generate-sql";
import SQLAssistant from "./sql-assistant";
import ExplainSQL from "./explain-sql";
import CSVAnalyst from "./csv-analyst";


type Props = {
    file: File;
  };

export default function QueryBuilderPage() {
    const [selectedTool, setSelectedTool] = useState("query-builder");  
  return (
    <>
    <div className="grid grid-cols-12 p-4 pb-0">
      <div className="col-span-12 lg:col-span-3">
      <h2 className="text-lg font-semibold mb-4">Select a Tool:</h2>
        <select className="w-full mb-4 p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-[#326358]" value={selectedTool} onChange={(e) => setSelectedTool(e.target.value)}>
            <option value="query-builder">Query Builder</option>
            <option value="sql-assistant">SQL Assistant</option>
            <option value="explain-sql">Explain SQL</option>
            <option value="csv-analyst">CSV Analyst</option>
        </select>
      </div>
    </div>
      { selectedTool === "query-builder" && (
        <GenerateSQL />
        )}
        { selectedTool === "sql-assistant" && (
            <SQLAssistant />
        )}

        {selectedTool === "explain-sql" && (
            <ExplainSQL />
        )}

        {selectedTool === "csv-analyst" && (
            <CSVAnalyst />
        )}
   
    </>
  );
}






