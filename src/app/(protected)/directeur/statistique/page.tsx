'use client';

import React, { useState } from 'react';
import { FiZap, FiRefreshCw, FiTrendingUp, FiAlertCircle, FiUsers, FiDollarSign, FiActivity } from 'react-icons/fi';
import DirectorLayout from '@/components/layout/DirectorLayout';

export default function StatistiquePage() {
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  
  // Mode développement : afficher la fonctionnalité IA
  const isDevelopment = process.env.NODE_ENV === 'development';

  const generateInsights = async () => {
    setIsLoadingInsights(true);
    
    try {
      // Récupérer l'ID de l'école depuis le localStorage ou le contexte
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const id_ecole = user?.id_ecole || 1; // Fallback à 1 pour le dev
      const id_bureau = user?.id_bureau || null;

      // Appel à l'API
      const response = await fetch('/directeur/statistique/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_ecole,
          id_bureau
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération des insights');
      }

      const data = await response.json();
      setInsights(data.insights || []);
    } catch (error) {
      console.error('Erreur:', error);
      // Fallback en cas d'erreur
      setInsights([
        {
          id: 1,
          type: 'warning',
          title: 'Erreur d\'analyse',
          description: 'Impossible de générer les insights. Réessayez plus tard.',
          value: '⚠️'
        }
      ]);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <DirectorLayout>
      <div className="p-6 max-w-6xl mx-auto">
        
        {isDevelopment ? (
          // MODE DÉVELOPPEMENT : Afficher la fonctionnalité IA
          <>
            {/* Titre simple */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                🤖 Analyse IA de votre Auto-École
              </h1>
              <p className="text-xl text-gray-600">
                L'IA analyse vos données et vous donne des recommandations
              </p>
            </div>

            {/* Bouton principal centré */}
            <div className="text-center mb-12">
              <button
                onClick={generateInsights}
                disabled={isLoadingInsights}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto disabled:opacity-50"
              >
                {isLoadingInsights ? (
                  <>
                    <FiRefreshCw className="animate-spin" size={24} />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <FiZap size={24} />
                    Analyser mes données
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-3">🧪 Fonctionnalité en test</p>
            </div>

            {/* Résultats */}
            {insights.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Résultats de l'analyse</h2>
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{insight.title}</h3>
                        <p className="text-gray-600">{insight.description}</p>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 ml-4">
                        {insight.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // MODE PRODUCTION : Page en développement
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-2xl">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
                  <FiActivity className="text-blue-600" size={48} />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Page en cours de développement
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Cette fonctionnalité est actuellement en développement et sera bientôt disponible.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">🚀 Fonctionnalités à venir :</h3>
                <ul className="text-left text-blue-800 space-y-2">
                  <li>• Analyse IA automatique de vos données</li>
                  <li>• Statistiques détaillées et graphiques</li>
                  <li>• Recommandations personnalisées</li>
                  <li>• Rapports d'activité</li>
                  <li>• Tableaux de bord interactifs</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </DirectorLayout>
  );
}