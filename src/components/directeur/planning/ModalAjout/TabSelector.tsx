'use client';

import React from 'react';
import { EventType, TabSelectorProps } from './types';

export default function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  // Définition des onglets disponibles
  const tabs: { id: EventType; label: string; icon: string }[] = [
    { id: 'lesson', label: 'Leçon', icon: '' },
    { id: 'unavailability', label: 'Indisponibilité', icon: '' },
    { id: 'exam', label: 'Examen', icon: '' },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex items-center px-4 py-2 text-sm font-medium ${
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => onTabChange(tab.id)}
          type="button"
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
