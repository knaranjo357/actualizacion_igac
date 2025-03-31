import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CompletionChartProps {
  data: {
    name: string;
    count: number;
    details: any[];
  }[];
  onDataClick: (title: string, category: string, data: any[]) => void;
}

export function CompletionChart({ data, onDataClick }: CompletionChartProps) {
  const chartData = data.reduce((acc: any[], item) => {
    const reconocedor = item.name.split(' (')[0];
    const type = item.name.includes('Completos') ? 'complete' : 'incomplete';
    
    const existing = acc.find(d => d.name === reconocedor);
    if (existing) {
      existing[type] = item.count;
      existing[`${type}Data`] = item.details;
    } else {
      acc.push({
        name: reconocedor,
        complete: type === 'complete' ? item.count : 0,
        incomplete: type === 'incomplete' ? item.count : 0,
        completeData: type === 'complete' ? item.details : [],
        incompleteData: type === 'incomplete' ? item.details : []
      });
    }
    return acc;
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          <p className="text-green-600">Completos: {payload[0].value}</p>
          <p className="text-red-600">Incompletos: {payload[1].value}</p>
          <p className="text-sm text-gray-500">Click para ver detalles</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Estado de Completitud por Reconocedor</h2>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 40, bottom: 100 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="complete"
              name="Completos"
              fill="#059669"
              stackId="stack"
              onClick={(data) => onDataClick(
                "Estado de Completitud",
                `${data.name} (Completos)`,
                data.completeData
              )}
              cursor="pointer"
            />
            <Bar
              dataKey="incomplete"
              name="Incompletos"
              fill="#DC2626"
              stackId="stack"
              onClick={(data) => onDataClick(
                "Estado de Completitud",
                `${data.name} (Incompletos)`,
                data.incompleteData
              )}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}