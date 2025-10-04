'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiClock, FiLogOut, FiEdit, FiLock, FiFileText } from 'react-icons/fi';
import EleveLayout from '@/components/layout/EleveLayout';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function EleveProfil() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Récupérer les données utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('autosoft_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setLoading(false);
    } else {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      router.push('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('autosoft_user');
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return (
      <EleveLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </EleveLayout>
    );
  }

  return (
    <EleveLayout>
      <div className="p-4 sm:p-6 text-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon profil</h1>
        
        {/* Carte principale - Informations personnelles */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="bg-blue-600 px-4 py-4 text-white">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 mr-4">
                <FiUser className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{userData?.prenom} {userData?.nom}</h2>
                <p className="text-blue-100">Élève</p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <FiMail className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiPhone className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{userData?.tel || 'Non renseigné'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="font-medium">
                    {userData?.naiss 
                      ? new Date(userData.naiss).toLocaleDateString('fr-FR')
                      : 'Non renseignée'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Options du profil */}
        <div className="space-y-4">
          <button className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <FiEdit className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Modifier mes informations</p>
                <p className="text-sm text-gray-500">Mettre à jour vos coordonnées personnelles</p>
              </div>
            </div>
            <FiEdit className="text-gray-400" />
          </button>
          
          <button className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <FiLock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Changer de mot de passe</p>
                <p className="text-sm text-gray-500">Mettre à jour votre mot de passe</p>
              </div>
            </div>
            <FiEdit className="text-gray-400" />
          </button>
          
          <button className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <FiClock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Historique des leçons</p>
                <p className="text-sm text-gray-500">Consulter vos leçons passées</p>
              </div>
            </div>
            <FiEdit className="text-gray-400" />
          </button>
          
          <button className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <FiFileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Mes documents</p>
                <p className="text-sm text-gray-500">Accéder à vos documents administratifs</p>
              </div>
            </div>
            <FiEdit className="text-gray-400" />
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-red-50 p-4 rounded-lg shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                <FiLogOut className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-red-700">Déconnexion</p>
                <p className="text-sm text-red-500">Se déconnecter de l'application</p>
              </div>
            </div>
            <FiLogOut className="text-red-400" />
          </button>
        </div>
      </div>
    </EleveLayout>
  );
}
