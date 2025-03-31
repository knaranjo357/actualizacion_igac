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

interface ChartData {
  name: string;
  count: number;
  details: any[];
}

interface AnalyticsChartProps {
  title: string;
  data: ChartData[];
  color: string;
  onBarClick: (data: ChartData) => void;
  onLabelClick: (category: string) => void;
}

export function AnalyticsChart({ title, data, color, onBarClick, onLabelClick }: AnalyticsChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">Predios: {payload[0].value}</p>
          <p className="text-sm text-gray-500">Click para ver detalles</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100} 
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              onClick={(e) => onLabelClick(e.value)}
              style={{ cursor: 'pointer' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Número de Predios" 
              fill={color} 
              onClick={(data) => onBarClick(data as ChartData)} 
              cursor="pointer" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}