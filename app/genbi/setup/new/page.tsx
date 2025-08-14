'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function NewDatabasePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDb = { name, host, port };

    const saved = localStorage.getItem('databases');
    const parsed = saved ? JSON.parse(saved) : [];

    parsed.push(newDb);
    localStorage.setItem('databases', JSON.stringify(parsed));

    router.push('/genbi/setup');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-6">Create New Database</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Database Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 bg-gray-800 border rounded" />
          </div>
          <div>
            <label className="block mb-1">Host</label>
            <input type="text" value={host} onChange={(e) => setHost(e.target.value)} required className="w-full p-2 bg-gray-800 border rounded" />
          </div>
          <div>
            <label className="block mb-1">Port</label>
            <input type="text" value={port} onChange={(e) => setPort(e.target.value)} required className="w-full p-2 bg-gray-800 border rounded" />
          </div>
          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => router.back()} className="text-gray-400 hover:underline">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}