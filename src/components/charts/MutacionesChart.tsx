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

interface MutacionesChartProps {
  data: {
    mutaciones: { [key: string]: number };
    mutaciones2: { [key: string]: number };
    details: { [key: string]: any[] };
  };
  onDataClick: (title: string, category: string, data: any[]) => void;
}

export function MutacionesChart({ data, onDataClick }: MutacionesChartProps) {
  const chartData = [
    { name: 'Sin mutaciones', mut1: data.mutaciones['0'] || 0, mut2: data.mutaciones2['0'] || 0 },
    { name: 'Tipo 1', mut1: data.mutaciones['1'] || 0, mut2: data.mutaciones2['1'] || 0 },
    { name: 'Tipo 2', mut1: data.mutaciones['2'] || 0, mut2: data.mutaciones2['2'] || 0 },
    { name: 'Tipo 3', mut1: data.mutaciones['3'] || 0, mut2: data.mutaciones2['3'] || 0 },
    { name: 'Tipo 4', mut1: data.mutaciones['4'] || 0, mut2: data.mutaciones2['4'] || 0 },
    { name: 'Tipo 5', mut1: data.mutaciones['5'] || 0, mut2: data.mutaciones2['5'] || 0 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">Mutaciones: {payload[0].value}</p>
          <p className="text-indigo-600">Mutaciones 2: {payload[1].value}</p>
          <p className="text-sm text-gray-500">Click para ver detalles</p>
        </div>
      );
    }
    return null;
  };

  const handleClick = (type: string, value: string) => {
    onDataClick(
      `Mutaciones ${type}`,
      `Tipo ${value}`,
      data.details[`${type}_${value}`] || []
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Distribución de Mutaciones</h2>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              label={{ value: 'Cantidad de Predios', angle: -90, position: 'insideLeft' }}
              onClick={(e) => handleClick('1', e.value)}
              style={{ cursor: 'pointer' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="mut1" 
              name="Mutaciones" 
              fill="#4F46E5" 
              onClick={(data) => handleClick('1', data.name.split(' ')[1])}
              cursor="pointer"
            />
            <Bar 
              dataKey="mut2" 
              name="Mutaciones 2" 
              fill="#2563EB" 
              onClick={(data) => handleClick('2', data.name.split(' ')[1])}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}