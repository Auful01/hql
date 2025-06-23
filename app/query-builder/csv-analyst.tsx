import axios from "axios";
import { Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";


export default function CSVAnalyst() {
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