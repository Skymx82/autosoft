'use client';

import React from 'react';
import { FiClock, FiTool, FiAlertCircle, FiCalendar, FiBarChart2, FiUsers } from 'react-icons/fi';
import DirectorLayout from '@/components/layout/DirectorLayout';

export default function StatistiquePage() {
  return (
    <DirectorLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Bannière de fonctionnalité en développement */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-800">Fonctionnalité en cours de développement</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Cette section est actuellement en cours de développement. Nous travaillons activement pour vous offrir des statistiques détaillées et des analyses pertinentes pour votre auto-école.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Titre de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Statistiques et analyses</h1>
          <p className="text-gray-600 mt-2">Visualisez et analysez les performances de votre auto-école</p>
        </div>

        {/* Aperçu des fonctionnalités à venir */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Carte 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-500">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
              <FiBarChart2 className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tableau de bord analytique</h3>
            <p className="text-gray-600">Visualisez les indicateurs clés de performance de votre auto-école en un coup d'œil.</p>
            <div className="mt-4 flex items-center">
              <FiClock className="text-amber-500 mr-2" />
              <span className="text-sm text-amber-600">Disponible prochainement</span>
            </div>
          </div>

          {/* Carte 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <FiUsers className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Suivi des élèves</h3>
            <p className="text-gray-600">Analysez les taux de réussite, la progression et l'engagement des élèves.</p>
            <div className="mt-4 flex items-center">
              <FiTool className="text-blue-500 mr-2" />
              <span className="text-sm text-blue-600">En développement</span>
            </div>
          </div>

          {/* Carte 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <FiCalendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Rapports périodiques</h3>
            <p className="text-gray-600">Générez des rapports détaillés hebdomadaires, mensuels ou annuels.</p>
            <div className="mt-4 flex items-center">
              <FiClock className="text-amber-500 mr-2" />
              <span className="text-sm text-amber-600">Disponible prochainement</span>
            </div>
          </div>
        </div>

        {/* Section d'illustration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Aperçu des fonctionnalités à venir</h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                  <p className="ml-3 text-gray-700">Tableaux de bord interactifs avec filtres personnalisables</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">2</div>
                  <p className="ml-3 text-gray-700">Graphiques détaillés sur les taux de réussite aux examens</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">3</div>
                  <p className="ml-3 text-gray-700">Analyse des performances des moniteurs</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">4</div>
                  <p className="ml-3 text-gray-700">Statistiques financières avancées</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">5</div>
                  <p className="ml-3 text-gray-700">Export de données au format Excel ou PDF</p>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 p-4 flex items-center justify-center">
              <div className="w-full max-w-md h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-pulse flex space-x-4 mb-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/6 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">Aperçu du tableau de bord (en développement)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section de feedback */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Nous aimerions avoir votre avis !</h2>
          <p className="mb-4">Quelles fonctionnalités statistiques aimeriez-vous voir dans cette section ? Votre feedback nous aidera à développer les outils qui répondent le mieux à vos besoins.</p>
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors">
            Partager mes suggestions
          </button>
        </div>
      </div>
    </DirectorLayout>
  );
}