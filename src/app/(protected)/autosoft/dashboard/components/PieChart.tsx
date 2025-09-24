'use client';

import React from 'react';

interface PieChartProps {
  title: string;
  data: { label: string; value: number; color: string }[];
  icon?: React.ReactNode;
}

export default function PieChart({ title, data, icon }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculer les pourcentages et les angles pour chaque segment
  let startAngle = 0;
  const segments = data.map(item => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = total > 0 ? (item.value / total) * 360 : 0;
    const segment = {
      ...item,
      percentage,
      startAngle,
      endAngle: startAngle + angle
    };
    startAngle += angle;
    return segment;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        {icon && <span className="mr-2">{icon}</span>}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Cercle de base */}
          <div className="absolute inset-0 rounded-full bg-gray-100"></div>
          
          {/* Segments du graphique */}
          {segments.map((segment, index) => (
            <div 
              key={index} 
              className="absolute inset-0"
              style={{
                background: `conic-gradient(transparent ${segment.startAngle}deg, ${segment.color} ${segment.startAngle}deg, ${segment.color} ${segment.endAngle}deg, transparent ${segment.endAngle}deg)`,
                borderRadius: '50%'
              }}
            ></div>
          ))}
          
          {/* Cercle central pour créer l'effet donut */}
          <div className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Légende */}
      <div className="grid grid-cols-2 gap-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: segment.color }}
            ></div>
            <div className="text-sm">
              <span className="font-medium">{segment.label}</span>
              <span className="text-gray-500 ml-1">({segment.percentage.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
