'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiTrendingUp, FiBook, FiAward } from 'react-icons/fi';
import EleveLayout from '@/components/layout/EleveLayout';

export default function EleveDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les données utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('autosoft_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  return (
    <EleveLayout>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {userData?.prenom || 'Élève'} 👋</h1>
          <p className="text-gray-600">Bienvenue sur votre espace personnel</p>
        </div>
        
        {/* Carte principale - Prochaine leçon */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-5 text-white shadow-lg mb-6">
          <div className="flex items-center mb-3">
            <FiCalendar className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Prochaine leçon</h2>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="font-medium">Conduite - Perfectionnement</p>
            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="text-sm opacity-90">Lundi 6 octobre</p>
                <p className="text-lg font-bold">14:00 - 15:30</p>
              </div>
              <button className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors">
                Détails
              </button>
            </div>
          </div>
          
          <button className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors">
            Voir mon planning complet
          </button>
        </div>
        
        {/* Cartes d'information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center text-blue-600 mb-2">
              <FiClock className="h-5 w-5 mr-2" />
              <h3 className="font-bold">Heures</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">12/20</p>
            <p className="text-xs text-gray-500">Heures effectuées</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center text-green-600 mb-2">
              <FiTrendingUp className="h-5 w-5 mr-2" />
              <h3 className="font-bold">Progression</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">60%</p>
            <p className="text-xs text-gray-500">Objectifs atteints</p>
          </div>
        </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">Vos rendez-vous</h3>
            <p className="text-gray-600">Gérez vos leçons de conduite et examens à venir.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">Documents</h3>
            <p className="text-gray-600">Accédez à vos documents administratifs et pédagogiques.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">Paiements</h3>
            <p className="text-gray-600">Consultez l'état de vos paiements et factures.</p>
          </div>
        </div>
    </EleveLayout>
  );
}
