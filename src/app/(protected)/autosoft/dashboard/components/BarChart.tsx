'use client';

import React from 'react';

interface BarChartProps {
  title: string;
  data: { label: string; value: number }[];
  color?: string;
  icon?: React.ReactNode;
}

export default function BarChart({ title, data, color = 'blue', icon }: BarChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  
  const getBarColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      case 'indigo': return 'bg-indigo-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        {icon && <span className="mr-2">{icon}</span>}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      
      <div className="h-64 flex items-end space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`${getBarColor()} rounded-t w-full transition-all duration-300 ease-in-out`} 
              style={{ 
                height: `${(item.value / maxValue) * 200}px`,
                minHeight: '4px' // Pour assurer que les barres avec de petites valeurs sont visibles
              }}
            ></div>
            <div className="text-xs mt-2">{item.label}</div>
            <div className="text-xs font-semibold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
