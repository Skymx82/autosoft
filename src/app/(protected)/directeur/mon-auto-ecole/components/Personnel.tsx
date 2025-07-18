'use client';

import { useState } from 'react';
import { FiUsers, FiUserPlus } from 'react-icons/fi';
import PersonnelEnseignants from '@/app/(protected)/directeur/mon-auto-ecole/components/PersonnelEnseignants';
import PersonnelUtilisateurs from '@/app/(protected)/directeur/mon-auto-ecole/components/PersonnelUtilisateurs';

export default function AutoEcolePersonnel() {
  const [activeTab, setActiveTab] = useState('enseignants');

  return (
    <div className="p-6 text-gray-800">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Gestion du personnel</h2>
      
      {/* Sous-navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('enseignants')}
            className={`
              group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'enseignants'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            aria-current={activeTab === 'enseignants' ? 'page' : undefined}
          >
            <FiUsers className={`mr-2 ${activeTab === 'enseignants' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
            Enseignants / Moniteurs
          </button>
          <button
            onClick={() => setActiveTab('utilisateurs')}
            className={`
              group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'utilisateurs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            aria-current={activeTab === 'utilisateurs' ? 'page' : undefined}
          >
            <FiUserPlus className={`mr-2 ${activeTab === 'utilisateurs' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
            Utilisateurs du système
          </button>
        </nav>
      </div>
      
      {/* Contenu des onglets */}
      {activeTab === 'enseignants' && <PersonnelEnseignants />}
      {activeTab === 'utilisateurs' && <PersonnelUtilisateurs />}
    </div>
  );
}
