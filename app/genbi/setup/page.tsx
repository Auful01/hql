'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type DatabaseConfig = {
  id: string;
  db_name: string;
  db_type: string;
};

export default function SetupPage() {
  
  const [databases, setDatabases] = useState<DatabaseConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getDatabaseList();
  }, []);

  const handleSelect = (db: DatabaseConfig) => {
    localStorage.setItem('selectedDb', JSON.stringify(db));
    router.push('/genbi');
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Database List</h1>

        {databases.length === 0 ? (
          <p className="mb-4 text-gray-400">No database configured yet.</p>
        ) : (
          <ul className="space-y-4 mb-6">
            {databases.map((db, idx) => (
              <li key={idx} className="border p-4 rounded-md bg-gray-800 hover:bg-gray-700 transition cursor-pointer" onClick={() => handleSelect(db)}>
                <p className="font-semibold text-white">{db.db_name}</p>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => router.push('/genbi/setup/new')}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Create New Database
        </button>
      </div>
    </div>
  );
}