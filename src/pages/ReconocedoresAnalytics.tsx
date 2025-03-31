import React, { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useReconocedoresStats } from '../hooks/useReconocedoresStats';
import { AnalyticsChart } from '../components/charts/AnalyticsChart';
import { MutacionesChart } from '../components/charts/MutacionesChart';
import { CompletionChart } from '../components/charts/CompletionChart';
import { ReconocedoresModal } from '../components/modals/ReconocedoresModal';

interface ModalState {
  isOpen: boolean;
  title: string;
  category: string;
  data: any[];
}

export function ReconocedoresAnalytics() {
  const [reconocedoresData, setReconocedoresData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    category: '',
    data: []
  });
  
  const { fetchDatabase } = useDatabase();
  const { 
    mutacionesStats,
    solicitudesStats,
    observacionesStats,
    observacionReconocedorStats,
    completionStats
  } = useReconocedoresStats(reconocedoresData);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchDatabase('reconocedores');
      if (response?.data) {
        setReconocedoresData(response.data);
      }
      setLoading(false);
    };
    loadData();
  }, [fetchDatabase]);

  const handleDataClick = (title: string, category: string, data: any[]) => {
    setModalState({
      isOpen: true,
      title,
      category,
      data
    });
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <BarChart2 className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Reconocedores Analytics</h1>
        </div>

        <div className="space-y-8">
          <MutacionesChart 
            data={mutacionesStats}
            onDataClick={handleDataClick}
          />

          <CompletionChart 
            data={completionStats}
            onDataClick={handleDataClick}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnalyticsChart
              title="Solicitudes Tramitadas"
              data={solicitudesStats}
              color="#0891B2"
              onBarClick={(data) => handleDataClick("Solicitudes Tramitadas", data.name, data.details)}
              onLabelClick={(category) => {
                const data = solicitudesStats.find(s => s.name === category);
                if (data) {
                  handleDataClick("Solicitudes Tramitadas", category, data.details);
                }
              }}
            />
            
            <AnalyticsChart
              title="Observaciones"
              data={observacionesStats}
              color="#059669"
              onBarClick={(data) => handleDataClick("Observaciones", data.name, data.details)}
              onLabelClick={(category) => {
                const data = observacionesStats.find(s => s.name === category);
                if (data) {
                  handleDataClick("Observaciones", category, data.details);
                }
              }}
            />

            <AnalyticsChart
              title="Observación Reconocedor"
              data={observacionReconocedorStats}
              color="#7C3AED"
              onBarClick={(data) => handleDataClick("Observación Reconocedor", data.name, data.details)}
              onLabelClick={(category) => {
                const data = observacionReconocedorStats.find(s => s.name === category);
                if (data) {
                  handleDataClick("Observación Reconocedor", category, data.details);
                }
              }}
            />
          </div>
        </div>

        <ReconocedoresModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
          title={modalState.title}
          category={modalState.category}
          data={modalState.data}
        />
      </div>
    </div>
  );
}