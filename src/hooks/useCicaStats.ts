import { useMemo } from 'react';

interface CicaRecord {
  Usuario: string;
  Coordinador: string;
  Tenencia: string;
  Etapa: string;
  'Numero Predial': string;
  Matricula: string;
}

export function useCicaStats(cicaData: CicaRecord[]) {
  const userStats = useMemo(() => {
    const stats = cicaData.reduce((acc: { [key: string]: any[] }, record) => {
      const user = record.Usuario || 'No asignado';
      if (!acc[user]) acc[user] = [];
      acc[user].push(record);
      return acc;
    }, {});

    return Object.entries(stats).map(([name, records]) => ({
      name,
      count: records.length,
      details: records
    }));
  }, [cicaData]);

  const coordinatorStats = useMemo(() => {
    const stats = cicaData.reduce((acc: { [key: string]: any[] }, record) => {
      const coordinator = record.Coordinador || 'No asignado';
      if (!acc[coordinator]) acc[coordinator] = [];
      acc[coordinator].push(record);
      return acc;
    }, {});

    return Object.entries(stats).map(([name, records]) => ({
      name,
      count: records.length,
      details: records
    }));
  }, [cicaData]);

  const tenenciaStats = useMemo(() => {
    const stats = cicaData.reduce((acc: { [key: string]: any[] }, record) => {
      const tenencia = record.Tenencia || 'No especificado';
      if (!acc[tenencia]) acc[tenencia] = [];
      acc[tenencia].push(record);
      return acc;
    }, {});

    return Object.entries(stats).map(([name, records]) => ({
      name,
      count: records.length,
      details: records
    }));
  }, [cicaData]);

  const etapaStats = useMemo(() => {
    const stats = cicaData.reduce((acc: { [key: string]: any[] }, record) => {
      const etapa = record.Etapa || 'No especificado';
      if (!acc[etapa]) acc[etapa] = [];
      acc[etapa].push(record);
      return acc;
    }, {});

    return Object.entries(stats).map(([name, records]) => ({
      name,
      count: records.length,
      details: records
    }));
  }, [cicaData]);

  return {
    userStats,
    coordinatorStats,
    tenenciaStats,
    etapaStats
  };
}