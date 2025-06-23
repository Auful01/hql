import { Copy } from "lucide-react";

export default function SQLAssistant() {
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