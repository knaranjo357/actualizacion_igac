import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DatabaseResponse, ENDPOINTS, MATRICULA_COLUMNS, normalizeMatricula } from '../types/database';
import { useDatabase } from '../hooks/useDatabase';

const DATABASE_NAMES = {
  reconocedores: 'Reconocedores',
  vurGeneral: 'VUR General',
  vurPropietarios: 'VUR Propietarios',
  vurSalvedades: 'VUR Salvedades',
  vurAnotaciones: 'VUR Anotaciones',
  vurTramites: 'VUR Trámites',
  r1: 'Registro 1',
  r2: 'Registro 2',
  cica: 'CICA'
};

interface ParsedAnnotation {
  number: string;
  date: string;
  radicacion: string;
  document: string;
  value: string;
  specification: string;
  from?: string;
  to?: string;
}

export function MatriculaDetail() {
  const { matricula } = useParams();
  const navigate = useNavigate();
  const [databaseData, setDatabaseData] = useState<Record<string, DatabaseResponse>>({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { fetchDatabase } = useDatabase();

  const parseAnnotation = (annotation: string): ParsedAnnotation | null => {
    if (!annotation) return null;

    const parts = annotation.split(';').map(part => part.trim());
    const parsed: Partial<ParsedAnnotation> = {};

    parts.forEach(part => {
      if (part.startsWith('Nro:')) parsed.number = part.replace('Nro:', '').trim();
      else if (part.startsWith('Fecha:')) parsed.date = part.replace('Fecha:', '').trim();
      else if (part.startsWith('Radicación:')) parsed.radicacion = part.replace('Radicación:', '').trim();
      else if (part.startsWith('Doc:')) parsed.document = part.replace('Doc:', '').trim();
      else if (part.startsWith('Valor_Acto:')) parsed.value = part.replace('Valor_Acto:', '').trim();
      else if (part.startsWith('Especificacion:')) parsed.specification = part.replace('Especificacion:', '').trim();
      else if (part.startsWith('De:')) parsed.from = part.replace('De:', '').trim();
      else if (part.startsWith('A:')) parsed.to = part.replace('A:', '').trim();
    });

    return parsed as ParsedAnnotation;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const results = await Promise.all(
          Object.keys(ENDPOINTS).map(async (key) => {
            const data = await fetchDatabase(key);
            return [key, data];
          })
        );

        const newData = Object.fromEntries(results);
        setDatabaseData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [matricula, fetchDatabase]);

  const findMatchingRecords = () => {
    const matches: Record<string, any[]> = {};
    const normalizedSearchMatricula = normalizeMatricula(matricula || '');

    Object.entries(databaseData).forEach(([dbName, dbResponse]) => {
      if (!dbResponse?.data) return;

      const matchingRecords = dbResponse.data.filter((record: any) => {
        const matriculaColumn = MATRICULA_COLUMNS[dbName as keyof typeof MATRICULA_COLUMNS];
        const recordMatricula = normalizeMatricula(String(record[matriculaColumn] || ''));
        return recordMatricula === normalizedSearchMatricula;
      });

      matches[dbName] = matchingRecords;
    });

    return matches;
  };

  const renderAnnotations = (record: any) => {
    const annotations: { [key: string]: string } = {};
    Object.entries(record).forEach(([key, value]) => {
      if (key.startsWith('Anotacion_') && value) {
        annotations[key] = value as string;
      }
    });

    if (Object.keys(annotations).length === 0) return null;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Radicación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especificación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">De</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">A</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(annotations).map(([key, value]) => {
              const parsed = parseAnnotation(value);
              if (!parsed) return null;

              return (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parsed.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parsed.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parsed.radicacion}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{parsed.document}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parsed.value}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{parsed.specification}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{parsed.from || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{parsed.to || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSalvedades = (records: any[]) => {
    return records.map((record, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Salvedad #{record['NÚMERO DE ANOTACIÓN']}
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(record).map(([key, value]) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                  {key}
                </td>
                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500">
                  {String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const matchingRecords = findMatchingRecords();

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
        {Object.entries(DATABASE_NAMES).map(([dbName, fullName]) => {
          const hasData = matchingRecords[dbName]?.length > 0;
          return (
            <button
              key={dbName}
              onClick={() => {
                setActiveSection(dbName);
                document.getElementById(dbName)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-lg flex items-center justify-start text-sm font-medium transition-all w-48
                ${activeSection === dbName 
                  ? 'scale-105 shadow-lg ' + (hasData ? 'bg-green-600 text-white' : 'bg-red-600 text-white')
                  : hasData 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
              title={hasData ? 'Data available' : 'No data available'}
            >
              {fullName}
            </button>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Details for Matricula: {matricula}
        </h1>
        
        <div className="space-y-8">
          {Object.entries(matchingRecords).map(([dbName, records]) => {
            if (records.length === 0) return null;
            return (
              <div key={dbName} id={dbName} className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {DATABASE_NAMES[dbName as keyof typeof DATABASE_NAMES]}
                </h2>
                
                {dbName === 'vurSalvedades' ? (
                  renderSalvedades(records)
                ) : dbName === 'vurAnotaciones' ? (
                  renderAnnotations(records[0])
                ) : (
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="bg-white divide-y divide-gray-200">
                        {records.map((record, recordIndex) => (
                          <React.Fragment key={recordIndex}>
                            {Object.entries(record).map(([key, value]) => (
                              <tr key={key}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                                  {key}
                                </td>
                                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500">
                                  {String(value)}
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}