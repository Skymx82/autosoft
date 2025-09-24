'use client';

import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface TrendCardProps {
  title: string;
  currentValue: number;
  previousValue: number;
  unit: string;
  icon: React.ReactNode;
  isIncreasePositive?: boolean;
}

export default function TrendCard({
  title,
  currentValue,
  previousValue,
  unit,
  icon,
  isIncreasePositive = true
}: TrendCardProps) {
  const percentChange = previousValue !== 0 
    ? ((currentValue - previousValue) / previousValue) * 100 
    : 0;
  
  const isIncrease = currentValue > previousValue;
  const isPositive = isIncreasePositive ? isIncrease : !isIncrease;

  const formatValue = (value: number): string => {
    if (unit === '€') {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
    } else if (unit === '%') {
      return `${value.toFixed(1)}%`;
    } else {
      return `${new Intl.NumberFormat('fr-FR').format(value)}${unit}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
          <p className="text-3xl font-bold mt-2">{formatValue(currentValue)}</p>
        </div>
        <div className="p-3 rounded-full bg-gray-100">{icon}</div>
      </div>
      
      <div className="mt-4 flex items-center">
        {isIncrease ? (
          <FiArrowUp className={`mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
        ) : (
          <FiArrowDown className={`mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
        )}
        <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {Math.abs(percentChange).toFixed(1)}%
        </span>
        <span className="text-sm text-gray-500 ml-1">depuis la dernière période</span>
      </div>
    </div>
  );
}
