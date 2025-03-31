import { useState, useEffect } from 'react';
import { DatabaseResponse, ENDPOINTS } from '../types/database';
import { DatabaseCard } from '../components/DatabaseCard';
import { RefreshCw, Search } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';

export function DatabaseDashboard() {
  const [databases, setDatabases] = useState<Record<string, DatabaseResponse>>({});
  const [globalSearch, setGlobalSearch] = useState('');
  const { loading, fetchDatabase, clearCache, hasPermission } = useDatabase();

  const canRefreshAll = hasPermission('admin');

  const loadDatabase = async (key: string) => {
    const data = await fetchDatabase(key);
    if (data) {
      setDatabases(prev => ({ ...prev, [key]: data }));
    }
  };

  const refreshAll = async () => {
    clearCache();
    const promises = Object.keys(ENDPOINTS).map(key => loadDatabase(key));
    await Promise.all(promises);
  };

  useEffect(() => {
    Object.keys(ENDPOINTS).forEach(key => loadDatabase(key));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-2xl relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search across all databases..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            {canRefreshAll && (
              <button
                onClick={refreshAll}
                className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Dashboard</h1>
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(ENDPOINTS).map(([key, _]) => (
            <DatabaseCard
              key={key}
              dbKey={key}
              title={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              data={databases[key]?.data || []}
              onRefresh={() => loadDatabase(key)}
              globalSearch={globalSearch}
            />
          ))}
        </div>
      </div>
    </div>
  );
}