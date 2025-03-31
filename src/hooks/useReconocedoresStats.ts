import { useMemo } from 'react';

interface ReconocedorRecord {
  'Matricula CICA': string;
  'Numero Predial_ CICA': string;
  RECONOCEDOR: string;
  MUTACIONES: string;
  MUTACIONES2: string;
  'SOLICITUDES TRAMITADAS': string;
  OBSERVACIONES: string;
  'OBSERVACION RECONOCEDOR': string;
}

export function useReconocedoresStats(data: ReconocedorRecord[]) {
  const mutacionesStats = useMemo(() => {
    const stats = data.reduce((acc: {
      mutaciones: { [key: string]: number };
      mutaciones2: { [key: string]: number };
      details: { [key: string]: any[] };
    }, record) => {
      const mut1 = record.MUTACIONES || '0';
      const mut2 = record.MUTACIONES2 || '0';

      // Count for Mutaciones
      acc.mutaciones[mut1] = (acc.mutaciones[mut1] || 0) + 1;
      acc.details[`1_${mut1}`] = acc.details[`1_${mut1}`] || [];
      acc.details[`1_${mut1}`].push(record);

      // Count for Mutaciones2
      acc.mutaciones2[mut2] = (acc.mutaciones2[mut2] || 0) + 1;
      acc.details[`2_${mut2}`] = acc.details[`2_${mut2}`] || [];
      acc.details[`2_${mut2}`].push(record);

      return acc;
    }, { mutaciones: {}, mutaciones2: {}, details: {} });

    return stats;
  }, [data]);

  const solicitudesStats = useMemo(() => {
    const stats = data.reduce((acc: { [key: string]: any[] }, record) => {
      const value = record['SOLICITUDES TRAMITADAS'] || 'No especificado';
      if (!acc[value]) acc[value] = [];
      acc[value].push(record);
      return acc;
    }, {});

    return Object.entries(stats).map(([name, records]) => ({
      name,
      count: records.length,
      details: records
    }));
  }, [data]);

  const observacionesStats = useMemo(() => {
    const stats = data.reduce((acc: { [key: string]: any[] }, record) => {
      const hasObservaciones = record.OBSERVACIONES ? 'Con observaciones' : 'Sin observaciones';
      if (!acc[hasObservaciones]) acc[hasObservaciones] = [];
      acc[hasObservaciones].push(record);
      return acc;
    }, {});

    return Object.entries(stats).map(([name, records]) => ({
      name,
      count: records.length,
      details: records
    }));
  }, [data]);

  const observacionReconocedorStats = useMemo(() => {
    const stats = data.reduce((acc: { [key: string]: any[] }, record) => {
      const hasObservaciones = record['OBSERVACION RECONOCEDOR'] ? 'Con observaciones' : 'Sin observaciones';
      if (!acc[hasObservaciones]) acc[hasObservaciones] = [];
      acc[hasObservaciones].push(record);
      return acc;
    }, {});

    return Object.entries(stats).map(([name, records]) => ({
      name,
      count: records.length,
      details: records
    }));
  }, [data]);

  const completionStats = useMemo(() => {
    const stats = data.reduce((acc: { [key: string]: { complete: any[], incomplete: any[] } }, record) => {
      const reconocedor = record.RECONOCEDOR || 'No asignado';
      if (!acc[reconocedor]) {
        acc[reconocedor] = { complete: [], incomplete: [] };
      }
      
      const isComplete = Boolean(
        record.MUTACIONES ||
        record.MUTACIONES2 ||
        record['SOLICITUDES TRAMITADAS'] ||
        record.OBSERVACIONES ||
        record['OBSERVACION RECONOCEDOR']
      );

      if (isComplete) {
        acc[reconocedor].complete.push(record);
      } else {
        acc[reconocedor].incomplete.push(record);
      }
      
      return acc;
    }, {});

    return Object.entries(stats).flatMap(([reconocedor, { complete, incomplete }]) => [
      {
        name: `${reconocedor} (Completos)`,
        count: complete.length,
        details: complete
      },
      {
        name: `${reconocedor} (Incompletos)`,
        count: incomplete.length,
        details: incomplete
      }
    ]);
  }, [data]);

  return {
    mutacionesStats,
    solicitudesStats,
    observacionesStats,
    observacionReconocedorStats,
    completionStats
  };
}