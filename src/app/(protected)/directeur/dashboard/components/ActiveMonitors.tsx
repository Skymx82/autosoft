'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiCheck, FiClock } from 'react-icons/fi';

interface Monitor {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  lessons_today: number;
  hours_today: number;
  status: 'active' | 'disponible' | 'absent';
}

export default function ActiveMonitors() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveMonitors();
  }, []);

  const fetchActiveMonitors = async () => {
    try {
      const id_ecole = localStorage.getItem('id_ecole');
      const id_bureau = localStorage.getItem('id_bureau');
      
      const response = await fetch(
        `/directeur/dashboard/api/active-monitors?id_ecole=${id_ecole}&id_bureau=${id_bureau}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setMonitors(data.monitors || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des moniteurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'disponible':
        return 'bg-blue-100 text-blue-800';
      case 'absent':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'En cours';
      case 'disponible':
        return 'Disponible';
      case 'absent':
        return 'Absent';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiUser className="mr-2 text-blue-600" />
          Moniteurs actifs
        </h3>
        <span className="text-sm text-gray-500">{monitors.length} moniteur(s)</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : monitors.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucun moniteur actif aujourd'hui</p>
      ) : (
        <div className="space-y-3">
          {monitors.map((monitor) => (
            <div
              key={monitor.id_utilisateur}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {monitor.prenom} {monitor.nom}
                  </p>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FiCheck className="mr-1 w-3 h-3" />
                      {monitor.lessons_today} leçon(s)
                    </span>
                    <span className="flex items-center">
                      <FiClock className="mr-1 w-3 h-3" />
                      {monitor.hours_today}h
                    </span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(monitor.status)}`}>
                {getStatusLabel(monitor.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
