// app/query-builder/page.tsx
"use client";

import { JSX, useEffect, useRef, useState } from "react";
import {
    Info,
    Lamp,
    Copy
} from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import MarkdownRenderer from "@/components/ReactMarkdownRender";
import DynamicTransactionChart from "@/components/DynamicChart";

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

export function GenerateSQL(){
    const [input, setInput] = useState("");
    const [sql, setSQL] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [output, setOutput] = useState<JSX.Element | string>("");
    const [databases, setDatabases] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // object to store id and type of selected database
    const [selectedDatabase, setSelectedDatabase] = useState<{ id: string; db_type: string } | null>(null);
    const [tables, setTables] = useState<string[]>([]);

    const [isChart, setIsChart] = useState(false);

    const [results, setResults] = useState<string[]>([]);

    const scrollableRef = useRef<HTMLDivElement | null>(null);

    const generateSQL = async () => {
        setIsGenerating(true);
        setTimeout(() => {
        setSQL("SELECT * FROM users WHERE created_at >= NOW() - INTERVAL 7 DAY;");
        setIsGenerating(false);
        }, 1000);
    };

    const getDatabaseList = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("https://n8n.apergu.co.id/webhook/get-list-db", {
                headers: { "Content-Type": "application/json" }
            });
            if (response.data && Array.isArray(response.data)) {
                setDatabases(response.data);
            } else {
                console.error("Invalid response format:", response.data);
            }
          } catch (error) {
            console.error("Error fetching databases:", error);
        }
        setIsLoading(false);
    };


    const jsonToTable = (json: any) => {
      const data = Array.isArray(json) ? json : [json];
      if (!data.length) return <p className="text-gray-500">No data</p>;

      const keys = Object.keys(data[0]);

      return (
        // <div>
        <div>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <table className="min-w-full table-auto divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-800 text-white" style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr>
                  {keys.map((key) => (
                    <th key={key} className="px-4 py-2 text-left whitespace-nowrap">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700 text-white">
                {data.map((row, i) => (
                  <tr key={i}>
                    {keys.map((key) => (
                      <td key={key} className="px-4 py-2 whitespace-nowrap">
                        {row[key] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        // </div>
      );
    };

    const executeSQL = async () => {
        if (!sql.trim()) return;
        const query = sql.replace(/^```sql\n/, '').replace(/\n```$/, '').trim();
        setIsGenerating(true);
        console.log(selectedDatabase);
        
        try {
            const response = await axios.post("https://n8n.apergu.co.id/webhook/exec-sql", { 
                sql: query,
                db_id: selectedDatabase?.id, // Pass the selected database ID,
                db_type: selectedDatabase?.db_type // Pass the selected database type
             }, {
                headers: { "Content-Type": "application/json" },
            });

            console.log("SQL Execution Response:", response.data);
            // setOutput(response.data.output || "No output received");
            if (response.data && response.data.output) {
                const jsonData = JSON.parse(response.data.output);
                console.log("Parsed JSON Data:", jsonData);
                setOutput(jsonToTable(jsonData));
                console.log("Output set to:", jsonToTable(jsonData));
                setResults(jsonData); // Store results for charting
            } else {
                setOutput("No output received or invalid data format.");
            }
        } catch (error) {
            console.error("Error executing SQL:", error); 
            setOutput("Error executing SQL. Please try again.");
        } finally {
            setIsGenerating(false);
        } 
      }

    const getDBDetails = async (dbId: string) => {
        try {
            const response = await axios.get(`https://n8n.apergu.co.id/webhook/get-detail-table?id=${dbId}`, {
                headers: { "Content-Type": "application/json" }
            });
            if (response.data && response.data.id) {
                setSelectedDatabase(response.data);
            } else {
                console.error("Invalid response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching database details:", error);
        }
    };

    const handleDatabaseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsLoading(true);
        setTables([]);
        const dbId = e.target.value;
        getDBDetails(dbId);
        // Optionally, you can fetch tables for the selected database here
        console.log("Selected Database ID:", dbId);
        try {
            const response = await axios.get("https://n8n.apergu.co.id/webhook/get-list-table?id="+dbId, {
                headers: { "Content-Type": "application/json" }
            });
            console.log("Tables for selected database:", response);
            if (response.data && Array.isArray(response.data.tables)) {
                setTables(response.data.tables);
            }
        }
        catch (error) {
            console.error("Error handling database change:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getDatabaseList();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setIsGenerating(true);
        try {
            const response = await axios.post("https://n8n.apergu.co.id/webhook/generate-sql", { 
                prompt: input,
                db_id: selectedDatabase?.id, // Pass the selected database ID
                type: selectedDatabase?.db_type // Pass the selected database type
             }, {
                headers: { "Content-Type": "application/json" }
            });
            setSQL(response.data.output || "No SQL generated.");
            // setOutput(response.data.output || "No output received");
        } catch (error) {
            console.error("Error generating SQL:", error);
            setSQL("Error generating SQL. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return(
      <div className="grid grid-cols-12 gap-4 h-full p-4">
        {/* Judul */}
       {/* Sidebar kiri - 4 kolom */}
       <div className="col-span-12 lg:col-span-3 bg-gray-900 text-white p-4 rounded-2xl">
 
         <h2 className="text-lg font-semibold mb-2">Select a Database:</h2>
         {
          databases.length > 0 ? (
            <select className="w-full mb-2 p-2 bg-gray-800 text-white rounded" onChange={(e) => handleDatabaseChange(e)}>
              <option value="" selected>-- Select Database --</option>
              {databases.map((db, index) => (
                <option key={index} value={db.id}>{db.db_name}</option>
              ))}
            </select>
          ) : (
            <select className="w-full mb-2 p-2 bg-gray-800 text-white rounded">
           <option>No databases found</option>
         </select>
          )
         }
         
 
         <p className="text-sm text-gray-400">Select a database above. If no database exists, <a href="/database-setup" className="underline">add one here</a>.</p>
 
         <div className="mt-4">
           <label className="text-sm font-semibold">List Tables</label>
            <div className="mt-2 bg-gray-800 p-3 rounded-lg" id="table-list">
              {
                 isLoading ? (
                <p className="text-gray-500">Loading tables...</p>
              ) : tables && tables.length > 0 ?  (
                <ul className="list-disc list-inside text-sm text-gray-300" >
                  {tables.map((table, index) => (
                    <li key={index}>{table}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No tables found for the selected database.</p>
              )
              }
              </div>  
         </div>
       </div>
 
       {/* Konten utama - 8 kolom */}
       <div className="col-span-12 lg:col-span-9 bg-[#0F172A] text-white p-6 space-y-4 rounded-2xl">
         <div>
           <h1 className="text-xl font-semibold mb-2">Generate SQL</h1>
           <p className="mb-2">
             Describe your query in natural language:
           </p>
           <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Example: Show the number of users who signed up in the last week, group by date"
             className="w-full h-32 p-3 bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#326358]"
           />
           <div className="mt-2 flex items-center gap-2">
             <input type="checkbox" id="remember" className="mr-1" />
             <label htmlFor="remember" className="text-sm text-gray-300">Remember conversation history</label>
             <button className="ml-auto text-sm text-gray-400 hover:underline">Clear Context</button>
           </div>
         </div>
 
         <div className="bg-primary p-3 rounded-lg">
           <b className="text-sm">
             <Info className="inline mr-1" size={16} />
              Ready to write your first SQL query?</b>
           <p className="text-xs text-gray-300 mt-3">Example: Get all users who signed up in the last 7 days</p>
         </div>
 
         <div className="bg-gray-800 p-4 rounded-lg">
           <h3 className="text-sm font-semibold text-gray-400 mb-2">Generated SQL</h3>
           <pre className="text-sm whitespace-pre-wrap">
            <ReactMarkdown>
                {sql ? sql : "-- No SQL generated yet"}
            </ReactMarkdown>
           </pre>
           <div className="flex gap-2 mt-3 flex-wrap">
             <button onClick={handleSubmit} disabled={isGenerating} className="bg-primary hover:bg-purple-700 text-white px-4 py-2 rounded">
               {isGenerating ? "Generating..." : "Generate SQL"}
             </button>
             <button className="bg-gray-700 px-3 py-2 rounded">Copy</button>
             <button className="bg-green-700 px-3 py-2 rounded" onClick={executeSQL}>Run</button>
             <button className="bg-blue-700 px-3 py-2 rounded">Edit</button>
             <button className="bg-gray-700 px-3 py-2 rounded">Save</button>
             <button className="bg-gray-700 px-3 py-2 rounded">Load</button>
           </div>
         </div>
 
       </div>
     <div className="col-span-12 lg:col-span-12 bg-[#0F172A] text-white p-6 space-y-4 rounded-2xl mt-4">
         <div>
           <h3 className="text-lg font-semibold mb-2">Results</h3>
           <div className="h-32 bg-gray-900 rounded items-center justify-center text-gray-500" style={{ overflowY: "auto", minHeight : "300px" }} ref={scrollableRef}>
            
             {/* <MarkdownRenderer content={output || "No results yet. Run a query to see results."} /> */}
             {/* Set Table */}
             {
              output ? (
                // Render HTML
                output
              )
              : (
                <p className="text-gray-500">No results yet. Run a query to see results.</p>
              )
             }
             
           </div>
           <div className="flex justify-end mt-2">
             <button className="bg-primary px-3 py-2 rounded text-white mr-2" onClick={() => {
                setIsChart(true);
                console.log("Creating chart with results:", results);
             }
             }>Create Chart</button>
             <button className="bg-gray-700 px-3 py-2 rounded text-white">Export CSV</button>
           </div>
         </div>
     </div>

     <div className="col-span-12 lg:col-span:12 bg-[#0F172A] text-white p-6 space-y-4 rounded-2xl mt-4">
            <div className="flex items-center justify-center h-32 bg-gray-900 rounded text-gray-500">
              <p className="text-gray-500">Click "Create Chart" to visualize your results.</p>
            </div>
        {/* {
          isChart ? (
            <DynamicTransactionChart data={results} />
          ) : (
            <div className="flex items-center justify-center h-32 bg-gray-900 rounded text-gray-500">
              <p className="text-gray-500">Click "Create Chart" to visualize your results.</p>
            </div>
          )    
        } */}
     </div>
     </div>
    )
}


export function SQLAssistant() {
  return (
    <div className="grid grid-cols-12 gap-4 p-4">
    <div className="col-span-12 lg:col-span-12 bg-gray-900 text-white p-4 rounded-2xl">
      <h2 className="text-lg font-semibold mb-4">SQL Assistant</h2>
      <p className="text-gray-400 mb-2">
        Ask questions about your database schema or get help with SQL syntax.
      </p>
      <textarea
        placeholder="Ask a question..."
        className="w-full h-32 p-3 bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#326358]"
      />
      <div className="flex justify-end">
      <button className="mt-4 bg-primary hover:bg-[#dbeeea] text-white px-4 py-2 rounded ">
        Ask
      </button>
      </div>

    <div className="flex mt-3">
      <h4
      className="inline-flex items-center text-sm font-semibold text-gray-300"
      >Fixed SQL Output</h4>
      {/* Copy */} 
        <button className="ml-auto bg-gray-700 px-3 py-2 rounded text-white">
            <Copy className="inline mr-1" size={16} />
        </button>
    </div>
        <div className="mt-2 p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300">
            Example: "What tables are in my database?" or "How do I write a JOIN query?"
            </p>
            <pre className="mt-2 text-sm whitespace-pre-wrap">
            -- Example SQL output will appear here
            </pre>
        </div>

    </div>
    </div>
  );
}


export function ExplainSQL(){

    const [sqlInput, setSqlInput] = useState("");
    const [explanation, setExplanation] = useState("");

    const handleExplain = async () => {
        if (!sqlInput.trim()) return;

        // Simulate an API call to explain SQL
        setExplanation("This SQL query selects all columns from the 'users' table where the 'created_at' date is within the last 7 days.");

        // Here you would typically make an API call to your backend service
        const response = await axios.post("https://n8n.apergu.co.id/webhook/explain-sql", { input: sqlInput }, {
            headers: { "Content-Type": "application/json" }
        });
        setExplanation(response.data.output || "No explanation available.");
    };
    return (
        <div className="grid grid-cols-12 gap-4 p-4">
    <div className="col-span-12 lg:col-span-12 bg-gray-900 text-white p-4 rounded-2xl">
      <h2 className="text-lg font-semibold mb-4">Explain SQL</h2>
      <textarea
        placeholder="Paste the SQL you want explain..."
        value={sqlInput}
        onChange={(e) => setSqlInput(e.target.value)}
        className="w-full h-32 p-3 bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#326358]"
      />
      <div className="flex justify-end">
      <button className="mt-4 bg-primary hover:bg-[#dbeeea] text-white px-4 py-2 rounded " onClick={handleExplain}>
        Ask
      </button>
      </div>

    <div className="flex mt-3">
      <h4
      className="inline-flex items-center text-sm font-semibold text-gray-300"
      >Fixed SQL Output</h4>
      {/* Copy */} 
        <button className="ml-auto bg-gray-700 px-3 py-2 rounded text-white">
            <Copy className="inline mr-1" size={16} />
        </button>
    </div>
        <div className="mt-2 p-3 bg-gray-800 rounded-lg">
            <article className="prose max-w-none">
            
                <MarkdownRenderer content={explanation.replace(/\\n/g, '\n' ) || "Paste your SQL query above to get an explanation."} />
            </article>
            <pre className="mt-2 text-sm whitespace-pre-wrap">
            -- Example SQL output will appear here
            </pre>
        </div>

    </div>
    </div>
        
    )
}


export function CSVAnalyst() {
    const [file, setFile] = useState<File | null>(null);
    const [output, setOutput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        const formData = new FormData();
        // formData.append("file", file);
        setFile(file);
    
      };


      const Analyze = (file: File) => {
        setIsLoading(true);
        const reader = new FileReader();
        
        reader.onload = async () => {
          const csvText = reader.result as string;
          const headerContent = csvText.split("\n")[0];

        console.log("Header:", headerContent); // Harusnya muncul: id,absen,nama,kelas
      
          console.log("Raw CSV Content:", csvText);
      
          const body = {
            fileContent: csvText,
          };
      
          const res = await axios.post("https://n8n.apergu.co.id/webhook/analyze-csv", body, {
            headers: { "Content-Type": "application/json" },
          });
            setIsLoading(false);
          console.log(res.data);
            setOutput(res.data.output || "No output received");
        };
      
        reader.onerror = (err) => {
          console.error("File reading error:", err);
        };
      
        reader.readAsText(file);
      };
    
  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-12 lg:col-span-12 bg-gray-900 text-white p-4 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">CSV Analyst</h2>
        <p className="text-gray-400 mb-2">
          Upload a CSV file to analyze its contents.
        </p>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv"
          className="mb-4 p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#326358]"
        />
        &nbsp;
        <button className="bg-primary hover:bg-[#dbeeea] text-white px-4 py-2 rounded" onClick={() => 
            file && Analyze(file)
         }>
          Analyze CSV
        </button>
        <div className="flex mt-3">
            <h4
            className="inline-flex items-center text-sm font-semibold text-gray-300"
            >Fixed SQL Output</h4>
            {/* Copy */} 
                <button className="ml-auto bg-gray-700 px-3 py-2 rounded text-white">
                    <Copy className="inline mr-1" size={16} />
                </button>
        </div>
        <div className="mt-2 max-h-130 p-3 bg-gray-800 rounded-lg overflow-auto">
            <div className="prose max-w-none">
            <pre className="text-sm whitespace-pre-wrap">
                <ReactMarkdown>
                {isLoading ? "Analyzing CSV..." : output || "Upload a CSV file to see results."}
                </ReactMarkdown>
           </pre>
            </div>
        </div>
      </div>
      
    </div>
  );
}


