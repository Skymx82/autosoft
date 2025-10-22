'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiUser, FiTruck, FiCalendar } from 'react-icons/fi';

interface Lesson {
  id_planning: number;
  heure_debut: string;
  heure_fin: string;
  type_lecon: string;
  eleve_nom: string;
  eleve_prenom: string;
  moniteur_nom: string;
  moniteur_prenom: string;
  vehicule_immatriculation: string;
  statut_lecon: string;
}

export default function TodayLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayLessons();
  }, []);

  const fetchTodayLessons = async () => {
    try {
      const id_ecole = localStorage.getItem('id_ecole');
      const id_bureau = localStorage.getItem('id_bureau');
      
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(
        `/directeur/dashboard/api/today-lessons?id_ecole=${id_ecole}&id_bureau=${id_bureau}&date=${today}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des leçons:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Prévue':
        return 'bg-blue-100 text-blue-800';
      case 'En cours':
        return 'bg-green-100 text-green-800';
      case 'Terminée':
        return 'bg-gray-100 text-gray-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiCalendar className="mr-2 text-blue-600" />
          Leçons d'aujourd'hui
        </h3>
        <span className="text-sm text-gray-500">{lessons.length} leçon(s)</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : lessons.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucune leçon prévue aujourd'hui</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {lessons.map((lesson) => (
            <div
              key={lesson.id_planning}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiClock className="text-gray-500 w-4 h-4" />
                    <span className="font-medium text-gray-900">
                      {lesson.heure_debut} - {lesson.heure_fin}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.statut_lecon)}`}>
                      {lesson.statut_lecon}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FiUser className="mr-2 w-4 h-4" />
                      <span className="font-medium">Élève:</span>
                      <span className="ml-1">{lesson.eleve_prenom} {lesson.eleve_nom}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiUser className="mr-2 w-4 h-4" />
                      <span className="font-medium">Moniteur:</span>
                      <span className="ml-1">{lesson.moniteur_prenom} {lesson.moniteur_nom}</span>
                    </div>
                    {lesson.vehicule_immatriculation && (
                      <div className="flex items-center text-gray-600">
                        <FiTruck className="mr-2 w-4 h-4" />
                        <span className="ml-1">{lesson.vehicule_immatriculation}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4">
                  <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {lesson.type_lecon}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
