import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LinkItem } from '../types';

interface LinkStatsChartProps {
  data: LinkItem[];
}

const LinkStatsChart: React.FC<LinkStatsChartProps> = ({ data }) => {
  // Sort by click count descending and take top 5
  const chartData = [...data]
    .sort((a, b) => b.click_count - a.click_count)
    .slice(0, 5)
    .map(item => ({
      name: item.short_code,
      clicks: item.click_count,
    }));

  if (chartData.length === 0) {
    return <div className="text-center text-gray-500 py-10">No data available for analytics</div>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#4F46E5' : '#818CF8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LinkStatsChart;