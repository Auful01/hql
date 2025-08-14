'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BubblesIcon, ChartBar, CheckCircle, Database, RefreshCwIcon } from 'lucide-react';


export default function GenBIPage() {
    
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

    type Thread = {
      id: string;           // session id
      databaseId: string;   // parent id
      title: string;        // "Untitled" -> diganti saat first question
      messages: string[];
      createdAt: number;
    };

    const [selectedDb, setSelectedDb] = useState<string | null>(null);


    const [threads, setThreads] = useState<Thread[]>([]);
    const [activeThreadIndex, setActiveThreadIndex] = useState<number | null>(null);


     useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

         const db = localStorage.getItem('selectedDb');
            if (!db) {
            window.location.href = '/genbi/setup'; // Paksa kembali ke setup jika belum pilih
            } else {
            setSelectedDb(db);
            }
    }, [chatHistory]);

    
    if (!selectedDb) return null; // loading state dulu
 
    const startNewThread = () => {
    setChatHistory([]);
    setShowSuggestions(true);
    setActiveThreadIndex(null); // biarkan kosong dulu, akan diisi saat submit pertama
    };

    const generateSessionId = () => {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    };

 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userQuestion.trim()) return;

        if (activeThreadIndex === null) {
            const newThread: Thread = {
                id: generateSessionId(),
                databaseId: selectedDb.id,
                title: 'Untitled',
                messages: [userQuestion],
                createdAt: Date.now(),
            };
            const newThreads = [...threads, newThread];
            setThreads(newThreads);
            setActiveThreadIndex(newThreads.length - 1);
            setChatHistory(newThread.messages);
        } else {
            const updatedMessages = [...chatHistory, userQuestion];
            const updatedThreads = [...threads];
            updatedThreads[activeThreadIndex] = {
            ...updatedThreads[activeThreadIndex],
            messages: updatedMessages,
            };
            setThreads(updatedThreads);
            setChatHistory(updatedMessages);
        }

        if (showSuggestions) setShowSuggestions(false);
        setUserQuestion('');
    };


  const handleRefresh = () => {
    setChatHistory([]);
    setShowSuggestions(true);
    setActiveThreadIndex(null);
    setUserQuestion('');
    setThreads([]);
    localStorage.removeItem('selectedDb'); // Hapus pilihan database
    window.location.href = '/genbi/setup'; // Kembali ke setup
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-4 h-full p-4 overflow-y-hidden">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3 bg-gray-900 text-white p-4 rounded" style={{ height: '90vh' }}>
          <p className="text-gray-400 mb-6">
            {selectedDb ? JSON.parse(selectedDb).db_name : 'Select Database'}
            <RefreshCwIcon className="inline ml-2 cursor-pointer size-4" onClick={() => handleRefresh()} />
          </p>

          <a href="#" className="block hover:bg-gray-800 rounded">
            Dashboard
          </a>

          <br />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Threads</h2>
            <button onClick={startNewThread} className="bg-primary hover:bg-[#dbeeea] text-white px-4 py-2 rounded btn-sm">
              New
            </button>
          </div>

            <ul>
                {threads.map((thread, i) => (
                    <li key={i}>
                    <a
                        href="#"
                        onClick={() => {
                        setActiveThreadIndex(i);
                        setChatHistory(thread.messages);
                        setShowSuggestions(false);
                        }}
                        className={`block p-2 rounded hover:bg-gray-800 ${i === activeThreadIndex ? 'bg-gray-800' : ''}`}
                    >
                        {thread.messages.length > 0 ? thread.messages[0].length > 36 ? `${thread.messages[0].substring(0, 36)}...` : thread.messages[0] : ''}
                    </a>
                    </li>
                ))}
            </ul>
        </div>

        {/* Konten Utama */}
        <div className="col-span-12 lg:col-span-9 bg-gray-900 text-white p-4 rounded relative overflow-hidden">

    {/* Header */}

    {/* Chat Area */}
      {showSuggestions && (
  <div className="h-full flex flex-col justify-center">
        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-400px)] pr-2 justify-center items-center">
        <>
                <div className="text-center mb-6">
                <div className="text-2xl font-medium text-white mb-2">
                    Know more about your data
                </div>
                <div className="text-gray-500">Try asking…</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 w-200 text-center mx-auto">
                <Card type="Ranking" question="Which are the top 3 cities with the highest number of orders?" />
                <Card type="Aggregation" question="What is the average score of reviews submitted for orders placed by customers in each city?" />
                <Card type="Aggregation" question="What is the total value of payments made by customers from each state?" />
                </div>
                </>
          </div>
  </div>

      )}

                {!showSuggestions && (
      <div className="relative h-[790px] flex items-start justify-center overflow-auto">
              <AnimatePresence mode="wait">
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-full"
                  >
                    {chatHistory.map((question, index) => (
                        <div key={index} ref={index === chatHistory.length - 1 ? bottomRef : null} className="mb-6">
                            <AnswerCard question={question ?? ''}  />
                            
                            {/* Tambahkan <hr> jika bukan elemen terakhir */}
                            {index < chatHistory.length - 1 && (
                            <hr className="my-6 border-gray-700 max-w-3xl mx-auto" />
                            )}

                            {
                                index === chatHistory.length - 1 && (
                                    <div className='flex bg-gray-700 text-white shadow-md max-w-3xl mx-auto mt-3 rounded-lg'>
                                        {/* Suggestion for next question */}
                                        <div className="p-4">
                                        <p className="text-lg font-semibold mb-2" style={{fontSize:14}}>Suggested Next Question</p>
                                        <ul>
                                            <li>
                                                <small>What are the top 3 products by sales in these cities?</small>
                                            </li>
                                            <li>
                                                <small>How do order volumes differ between residential and commercial customers?</small>
                                            </li>
                                            <li>
                                                <small>What is the average order value for the top 3 cities?</small>
                                            </li>
                                        </ul>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    ))}
                    
                  </motion.div>
              </AnimatePresence>
            </div>
                )}

    {/* Input */}
    <div className="absolute bottom-10 left-0 right-0 px-4">
      <form onSubmit={handleSubmit} className="flex border border-gray-600 rounded-md overflow-hidden bg-gray-800 shadow-md max-w-3xl mx-auto">
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          placeholder="Ask to explore your data"
          className="flex-grow px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          onSubmit={handleSubmit}
          className="bg-blue-600 px-5 py-2 text-white font-medium hover:bg-blue-500 transition"
        >
          Ask
        </button>
      </form>
    </div>
</div>
      </div>
    </div>
  );
}

function Card({ type, question }: { type: string; question: string }) {
  return (
    <div className="border border-gray-300 p-4 rounded-md text-left shadow-sm hover:shadow-md transition">
      <div className="text-sm font-semibold text-gray-500 mb-1">{type}</div>
      <div className="text-white">{question}</div>
    </div>
  );
}

function AnswerCard({ question }: { question: string }) {
  const [tab, setTab] = useState<'answer' | 'sql' | 'chart'>('answer');

  return (
    <>
    <div className='flex text-white shadow-md max-w-3xl mx-auto pt-10'>
        <BubblesIcon className="w-6 h-6 text-blue-300 mr-2 mt-1" />
        <h2 className="text-xl font-semibold mb-4">{question}</h2>
    </div>

    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">

      <div className="flex gap-4 mb-4 border-b pb-2">
        <button onClick={() => setTab('answer')} className={`${tab === 'answer' ? 'font-bold text-white' : 'text-gray-500'} hover:text-white`}><CheckCircle className="inline mr-1" size={16} />Answer</button>
        <button onClick={() => setTab('sql')} className={`${tab === 'sql' ? 'font-bold text-white' : 'text-gray-500'} hover:text-white`}><Database className="inline mr-1" size={16} />View SQL</button>
        <button onClick={() => setTab('chart')} className={`${tab === 'chart' ? 'font-bold text-white' : 'text-gray-500'} hover:text-white`}><ChartBar className="inline mr-1" size={16} />Graphic</button>
      </div>

      {tab === 'answer' && (
        <div>
          <p className="mb-3">The top 3 cities with the highest number of orders are:</p>
          <ol className="list-decimal list-inside mb-4">
            <li>São Paulo – 15,540 orders</li>
            <li>Rio de Janeiro – 6,882 orders</li>
            <li>Belo Horizonte – 2,773 orders</li>
          </ol>
          <p className="mb-4 text-sm text-gray-300">
            These cities have the most orders placed, showcasing their significant activity in the market.
          </p>

          <table className="w-full border border-gray-300 text-sm mb-6">
            <thead>
              <tr className="bg-gray-800">
                <th className="text-left px-3 py-2 border-b">city</th>
                <th className="text-left px-3 py-2 border-b">order_count</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-2 border-t">sao paulo</td><td className="px-3 py-2 border-t">15540</td></tr>
              <tr><td className="px-3 py-2 border-t">rio de janeiro</td><td className="px-3 py-2 border-t">6882</td></tr>
              <tr><td className="px-3 py-2 border-t">belo horizonte</td><td className="px-3 py-2 border-t">2773</td></tr>
            </tbody>
          </table>

        </div>
      )}

      {tab === 'sql' && (
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
SELECT city, COUNT(*) AS order_count
FROM orders
GROUP BY city
ORDER BY order_count DESC
LIMIT 3;
        </pre>
      )}

      {tab === 'chart' && (
        <div className="text-center text-gray-400 py-12 italic">
          (Chart placeholder – to be implemented)
        </div>
      )}
    </div>

    
    </>
  );
}
