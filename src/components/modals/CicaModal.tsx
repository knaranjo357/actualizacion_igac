import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CicaModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  data: any[];
}

export function CicaModal({ isOpen, onClose, title, category, data }: CicaModalProps) {
  if (!isOpen || !data.length) return null;

  const formatMatricula = (matricula: string | number | null | undefined): string => {
    if (matricula === null || matricula === undefined) return '';
    const strMatricula = String(matricula);
    return strMatricula.replace(/^320-/, '');
  };

  // Determine which columns to show and in what order based on the title
  const columns = useMemo(() => {
    const baseColumns = [
      { key: 'Matricula', label: 'Matrícula', width: 'w-48' },
      { key: 'Numero Predial', label: 'Número Predial', width: 'w-48' }
    ];

    const additionalColumns = (() => {
      switch (title) {
        case 'Predios por Usuario':
          return [
            { key: 'Usuario', label: 'Usuario', width: 'w-48', highlight: true },
            { key: 'Coordinador', label: 'Coordinador', width: 'w-48' },
            { key: 'Tenencia', label: 'Tenencia', width: 'w-48' },
            { key: 'Etapa', label: 'Etapa', width: 'w-48' }
          ];
        case 'Predios por Coordinador':
          return [
            { key: 'Usuario', label: 'Usuario', width: 'w-48' },
            { key: 'Coordinador', label: 'Coordinador', width: 'w-48', highlight: true },
            { key: 'Tenencia', label: 'Tenencia', width: 'w-48' },
            { key: 'Etapa', label: 'Etapa', width: 'w-48' }
          ];
        case 'Predios por Tenencia':
          return [
            { key: 'Usuario', label: 'Usuario', width: 'w-48' },
            { key: 'Coordinador', label: 'Coordinador', width: 'w-48' },
            { key: 'Tenencia', label: 'Tenencia', width: 'w-48', highlight: true },
            { key: 'Etapa', label: 'Etapa', width: 'w-48' }
          ];
        case 'Predios por Etapa':
          return [
            { key: 'Usuario', label: 'Usuario', width: 'w-48' },
            { key: 'Coordinador', label: 'Coordinador', width: 'w-48' },
            { key: 'Tenencia', label: 'Tenencia', width: 'w-48' },
            { key: 'Etapa', label: 'Etapa', width: 'w-48', highlight: true }
          ];
        default:
          return [
            { key: 'Usuario', label: 'Usuario', width: 'w-48' },
            { key: 'Coordinador', label: 'Coordinador', width: 'w-48' },
            { key: 'Tenencia', label: 'Tenencia', width: 'w-48' },
            { key: 'Etapa', label: 'Etapa', width: 'w-48' }
          ];
      }
    })();

    return [...baseColumns, ...additionalColumns];
  }, [title]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">
            {title}: <span className="text-blue-600">{category}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4 overflow-auto flex-1">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {columns.map((col) => (
                    <th 
                      key={col.key}
                      className={`px-6 py-3 text-left text-xs font-medium tracking-wider ${
                        col.highlight 
                          ? 'text-blue-800 bg-blue-50' 
                          : 'text-gray-500'
                      } ${col.width}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td 
                        key={col.key}
                        className={`px-6 py-4 text-sm ${
                          col.highlight 
                            ? 'bg-blue-50 font-medium text-blue-900' 
                            : 'text-gray-500'
                        } ${
                          col.key === 'Matricula' 
                            ? 'text-blue-600 hover:text-blue-800' 
                            : ''
                        }`}
                      >
                        {col.key === 'Matricula' ? (
                          <Link to={`/matricula/${formatMatricula(record[col.key])}`}>
                            {record[col.key] || '-'}
                          </Link>
                        ) : (
                          <div className={`${col.width} truncate`}>
                            {record[col.key] || '-'}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}