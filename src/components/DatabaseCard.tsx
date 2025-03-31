import { useState, useMemo, useEffect } from 'react';
import { DatabaseRecord } from '../types/database';
import { RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../hooks/useDatabase';

interface DatabaseCardProps {
  title: string;
  dbKey: string;
  data: DatabaseRecord[];
  onRefresh: () => Promise<void>;
  globalSearch: string;
}

export function DatabaseCard({ title, dbKey, data, onRefresh, globalSearch }: DatabaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState('');
  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();
  const { loading, hasPermission } = useDatabase();

  const canView = hasPermission('viewer');
  const canRefresh = hasPermission('recognizer');

  const filteredData = useMemo(() => {
    if (!canView) return [];
    
    const searchTerm = globalSearch || localSearch;
    if (!searchTerm) return data;
    
    return data.filter(record => 
      Object.values(record).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, localSearch, globalSearch, canView]);

  useEffect(() => {
    setCurrentPage(1);
  }, [globalSearch, localSearch]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleMatriculaClick = (matricula: string) => {
    navigate(`/matricula/${matricula.replace(/^320-/, '')}`);
  };

  if (!canView) return null;

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {canRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={loading[dbKey]}
          >
            <RefreshCw className={`w-5 h-5 ${loading[dbKey] ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">Records: {filteredData.length}</p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search in this database..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {columns.map((column) => {
                      const value = record[column];
                      const isMatricula = column.toLowerCase().includes('matricula');
                      
                      return (
                        <td 
                          key={column} 
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isMatricula ? 'text-blue-600 cursor-pointer hover:text-blue-800' : 'text-gray-500'
                          }`}
                          onClick={isMatricula ? () => handleMatriculaClick(String(value)) : undefined}
                        >
                          {String(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} records
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}