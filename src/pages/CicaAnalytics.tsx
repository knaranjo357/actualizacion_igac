import React, { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useCicaStats } from '../hooks/useCicaStats';
import { AnalyticsChart } from '../components/charts/AnalyticsChart';
import { CicaModal } from '../components/modals/CicaModal';

interface ModalState {
  isOpen: boolean;
  title: string;
  category: string;
  data: any[];
}

export function CicaAnalytics() {
  const [cicaData, setCicaData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    category: '',
    data: []
  });
  
  const { fetchDatabase } = useDatabase();
  const { userStats, coordinatorStats, tenenciaStats, etapaStats } = useCicaStats(cicaData);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchDatabase('cica');
      if (response?.data) {
        setCicaData(response.data);
      }
      setLoading(false);
    };
    loadData();
  }, [fetchDatabase]);

  const handleDataClick = (title: string) => (data: any) => {
    setModalState({
      isOpen: true,
      title,
      category: data.name,
      data: data.details
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
          <h1 className="text-3xl font-bold text-gray-900">CICA Analytics</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalyticsChart
            title="Predios por Usuario"
            data={userStats}
            color="#4F46E5"
            onBarClick={handleDataClick("Predios por Usuario")}
            onLabelClick={(category) => {
              const data = userStats.find(s => s.name === category);
              if (data) {
                handleDataClick("Predios por Usuario")(data);
              }
            }}
          />
          
          <AnalyticsChart
            title="Predios por Coordinador"
            data={coordinatorStats}
            color="#2563EB"
            onBarClick={handleDataClick("Predios por Coordinador")}
            onLabelClick={(category) => {
              const data = coordinatorStats.find(s => s.name === category);
              if (data) {
                handleDataClick("Predios por Coordinador")(data);
              }
            }}
          />
          
          <AnalyticsChart
            title="Predios por Tenencia"
            data={tenenciaStats}
            color="#0891B2"
            onBarClick={handleDataClick("Predios por Tenencia")}
            onLabelClick={(category) => {
              const data = tenenciaStats.find(s => s.name === category);
              if (data) {
                handleDataClick("Predios por Tenencia")(data);
              }
            }}
          />
          
          <AnalyticsChart
            title="Predios por Etapa"
            data={etapaStats}
            color="#059669"
            onBarClick={handleDataClick("Predios por Etapa")}
            onLabelClick={(category) => {
              const data = etapaStats.find(s => s.name === category);
              if (data) {
                handleDataClick("Predios por Etapa")(data);
              }
            }}
          />
        </div>

        <CicaModal
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