import MarkdownRenderer from "@/components/ReactMarkdownRender";
import axios from "axios";
import { Copy } from "lucide-react";
import { useState } from "react";


export default function ExplainSQL(){

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