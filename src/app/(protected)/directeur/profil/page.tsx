'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DirectorLayout from '@/components/layout/DirectorLayout';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiCamera,
  FiAlertCircle,
  FiCheckCircle,
  FiKey
} from 'react-icons/fi';

interface UserProfile {
  id: string; // ID utilisateur dans le localStorage
  email: string;
  role: string;
  id_ecole: number;
  id_bureau: number;
  // Champs additionnels qui pourraient être joints depuis d'autres tables
  nom?: string;
  prenom?: string;
  tel?: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function ProfilePage() {
  // États pour les données utilisateur et les formulaires
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // États pour les différentes sections d'édition
  const [editingPersonalInfo, setEditingPersonalInfo] = useState<boolean>(false);
  const [editingContactInfo, setEditingContactInfo] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  
  // États pour les formulaires
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données utilisateur depuis le localStorage pour l'affichage initial
        const storedUser = localStorage.getItem('autosoft_user');
        if (!storedUser) {
          router.push('/login');
          return;
        }
        
        const parsedUser = JSON.parse(storedUser);
        
        // Récupérer les données utilisateur complètes depuis l'API
        const response = await fetch(`/directeur/profil/api?userId=${parsedUser.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la récupération des données');
        }
        
        const data = await response.json();
        
        // Combiner les données du localStorage et de l'API
        const combinedData = {
          ...parsedUser,
          ...data,
        };
        
        setUserData(combinedData as UserProfile);
        setFormData({
          nom: combinedData.nom || '',
          prenom: combinedData.prenom || '',
          email: combinedData.email || '',
          telephone: combinedData.tel || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
      } catch (err: any) {
        console.error('Erreur lors du chargement des données utilisateur:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [router]);

  // Gérer les changements dans les formulaires
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Mettre à jour les informations personnelles
  const updatePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Récupérer le token d'authentification
      const storedUser = localStorage.getItem('autosoft_user');
      if (!storedUser) {
        throw new Error('Utilisateur non authentifié');
      }
      
      const parsedUser = JSON.parse(storedUser);
      
      // Appeler l'API pour mettre à jour les informations personnelles
      const response = await fetch('/directeur/profil/api', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parsedUser.id,
          updateType: 'personal',
          nom: formData.nom,
          prenom: formData.prenom,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour des informations');
      }
      
      // Mettre à jour les données locales
      setUserData(prev => prev ? {
        ...prev,
        nom: formData.nom,
        prenom: formData.prenom,
      } : null);
      
      // Mettre à jour le localStorage
      localStorage.setItem('autosoft_user', JSON.stringify({
        ...parsedUser,
        nom: formData.nom,
        prenom: formData.prenom,
      }));
      
      setSuccessMessage('Informations personnelles mises à jour avec succès');
      setEditingPersonalInfo(false);
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour des informations personnelles:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour des informations');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour les informations de contact
  const updateContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Récupérer le token d'authentification
      const storedUser = localStorage.getItem('autosoft_user');
      if (!storedUser) {
        throw new Error('Utilisateur non authentifié');
      }
      
      const parsedUser = JSON.parse(storedUser);
      
      // Appeler l'API pour mettre à jour les informations de contact
      const response = await fetch('/directeur/profil/api', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parsedUser.id,
          updateType: 'contact',
          email: formData.email,
          telephone: formData.telephone,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour des informations');
      }
      
      // Mettre à jour les données locales
      setUserData(prev => prev ? {
        ...prev,
        email: formData.email,
        tel: formData.telephone, // Utiliser tel au lieu de telephone pour correspondre à l'interface
      } : null);
      
      // Mettre à jour le localStorage
      localStorage.setItem('autosoft_user', JSON.stringify({
        ...parsedUser,
        email: formData.email,
        tel: formData.telephone,
      }));
      
      setSuccessMessage('Informations de contact mises à jour avec succès');
      setEditingContactInfo(false);
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour des informations de contact:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour des informations');
    } finally {
      setLoading(false);
    }
  };

  // Changer le mot de passe
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Vérifier que les mots de passe correspondent
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      
      // Vérifier que le mot de passe est assez fort
      if (formData.newPassword.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }
      
      // Récupérer le token d'authentification
      const storedUser = localStorage.getItem('autosoft_user');
      if (!storedUser) {
        throw new Error('Utilisateur non authentifié');
      }
      
      const parsedUser = JSON.parse(storedUser);
      
      // Appeler l'API pour mettre à jour le mot de passe
      const response = await fetch('/directeur/profil/api', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parsedUser.id,
          updateType: 'password',
          newPassword: formData.newPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du changement de mot de passe');
      }
      
      setSuccessMessage('Mot de passe mis à jour avec succès');
      setChangingPassword(false);
      
      // Réinitialiser les champs de mot de passe
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err: any) {
      console.error('Erreur lors du changement de mot de passe:', err);
      setError(err.message || 'Une erreur est survenue lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DirectorLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profil utilisateur</h1>
          
          {/* Message de succès */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-md">
              <div className="flex">
                <FiCheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          )}
          
          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
              <div className="flex">
                <FiAlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {/* En-tête du profil avec avatar */}
              <div className="px-4 py-5 sm:px-6 flex items-center">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {userData?.avatar_url ? (
                      <img 
                        src={userData.avatar_url} 
                        alt={`Avatar de ${userData.prenom} ${userData.nom}`} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600">
                    <FiCamera className="h-4 w-4" />
                  </button>
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-bold text-gray-900">{userData?.prenom} {userData?.nom}</h2>
                  <p className="text-sm text-gray-500 capitalize">{userData?.role || 'Directeur'}</p>
                </div>
              </div>
              
              {/* Informations personnelles */}
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Informations personnelles</h3>
                  {!editingPersonalInfo ? (
                    <button 
                      onClick={() => setEditingPersonalInfo(true)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 className="mr-1" /> Modifier
                    </button>
                  ) : null}
                </div>
                
                {!editingPersonalInfo ? (
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Prénom</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData?.prenom || '-'}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Nom</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData?.nom || '-'}</dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  <form onSubmit={updatePersonalInfo} className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
                        <input
                          type="text"
                          name="prenom"
                          id="prenom"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                        <input
                          type="text"
                          name="nom"
                          id="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditingPersonalInfo(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              {/* Informations de contact */}
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Informations de contact</h3>
                  {!editingContactInfo ? (
                    <button 
                      onClick={() => setEditingContactInfo(true)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 className="mr-1" /> Modifier
                    </button>
                  ) : null}
                </div>
                
                {!editingContactInfo ? (
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData?.email || '-'}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData?.tel || '-'}</dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  <form onSubmit={updateContactInfo} className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <input
                          type="tel"
                          name="telephone"
                          id="telephone"
                          value={formData.telephone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditingContactInfo(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              {/* Sécurité */}
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Sécurité</h3>
                  {!changingPassword ? (
                    <button 
                      onClick={() => setChangingPassword(true)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FiKey className="mr-1" /> Changer le mot de passe
                    </button>
                  ) : null}
                </div>
                
                {changingPassword && (
                  <form onSubmit={changePassword} className="px-4 py-5 sm:p-6">
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setChangingPassword(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {loading ? 'Modification...' : 'Modifier le mot de passe'}
                      </button>
                    </div>
                  </form>
                )}
                
                {!changingPassword && (
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Dernière connexion</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {userData?.updated_at 
                            ? new Date(userData.updated_at).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) 
                            : '-'}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Compte créé le</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {userData?.created_at 
                            ? new Date(userData.created_at).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              }) 
                            : '-'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
              
              {/* Section supprimée : Informations sur l'auto-école */}
            </div>
          )}
        </div>
      </div>
    </DirectorLayout>
  );
}
