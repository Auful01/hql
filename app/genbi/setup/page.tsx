'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type DatabaseConfig = {
  id: string;
  db_name: string;
  db_type: string;
};

export default function GenBISetupPage() {
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
      const response = await axios.get(
        'https://n8n.apergu.co.id/webhook/get-list-db',
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (Array.isArray(response.data)) {
        setDatabases(response.data);
      } else {
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching databases:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="overflow-hidden" style={{padding: 0}}>
      <div className="h-full w-full flex">
        {/* CONTENT COLUMN (SAMA DENGAN GENBI) */}
        <div className="w-full ">
          <div className="hq-card p-6">
            {/* HEADER */}
            <div className="mb-6">
              <div className="hq-badge mb-3">🧩 GenBI Setup</div>
              <h1 className="text-xl font-semibold mb-1">
                Select a Database
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                Choose which database you want to explore with GenBI.
              </p>
            </div>

            {/* CONTENT */}
            {isLoading && (
              <div style={{ color: 'var(--muted)' }}>Loading databases…</div>
            )}

            {!isLoading && databases.length === 0 && (
              <div style={{ color: 'var(--muted)' }}>
                No database configured yet.
              </div>
            )}

            {!isLoading && databases.length > 0 && (
              <div className="space-y-3 mb-6">
                {databases.map((db) => (
                  <div
                    key={db.id}
                    onClick={() => handleSelect(db)}
                    className="hq-card-2 p-4 cursor-pointer"
                    style={{
                      transition: 'all .15s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = 'var(--accent)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = 'var(--border)')
                    }
                  >
                    <div className="font-medium">{db.db_name}</div>
                    <div
                      style={{
                        color: 'var(--muted)',
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      {db.db_type}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FOOTER ACTION */}
            <div className="flex gap-3">
              <button
                className="hq-btn-primary"
                onClick={() => router.push('/database-setup')}
              >
                + Create New Database
              </button>
              <button
                className="hq-btn"
                onClick={() => router.push('/genbi')}
              >
                Back to GenBI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}