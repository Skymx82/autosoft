'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiAlertCircle, FiCheckCircle, FiSettings, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

interface AutoEcoleSettings {
  id_ecole: number;
  notifications_email: boolean;
  notifications_sms: boolean;
  notifications_app: boolean;
  rappel_rdv_eleve: number; // heures avant le rendez-vous
  rappel_rdv_moniteur: number; // heures avant le rendez-vous
  archivage_auto_eleves: boolean;
  duree_archivage_eleves: number; // jours
  theme_couleur: string;
}

export default function AutoEcoleParametres() {
  const [settings, setSettings] = useState<Partial<AutoEcoleSettings>>({
    notifications_email: true,
    notifications_app: true,
    notifications_sms: false,
    rappel_rdv_eleve: 24,
    rappel_rdv_moniteur: 12,
    archivage_auto_eleves: false,
    duree_archivage_eleves: 365,
    theme_couleur: '#3b82f6' // Bleu par défaut
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Récupérer l'ID de l'auto-école depuis le localStorage
  const getIdEcole = (): number => {
    const userDataStr = localStorage.getItem('autosoft_user');
    if (!userDataStr) {
      throw new Error('Utilisateur non connecté');
    }
    
    const userData = JSON.parse(userDataStr);
    const idEcole = userData.id_ecole;
    
    if (!idEcole) {
      throw new Error('ID auto-école non trouvé');
    }
    
    return idEcole;
  };

  // Charger les paramètres de l'auto-école
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const idEcole = getIdEcole();
      
      const { data, error } = await supabase
        .from('auto_ecole_settings')
        .select('*')
        .eq('id_ecole', idEcole)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
        throw error;
      }
      
      if (data) {
        setSettings(data);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des paramètres:', error);
      setError('Une erreur est survenue lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Gérer le changement des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setSettings(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  // Sauvegarder les paramètres
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const idEcole = getIdEcole();
      
      // Vérifier si les paramètres existent déjà
      const { data: existingSettings, error: checkError } = await supabase
        .from('auto_ecole_settings')
        .select('id_ecole')
        .eq('id_ecole', idEcole)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = No rows found
        throw checkError;
      }
      
      let error;
      
      if (existingSettings) {
        // Mettre à jour les paramètres existants
        const { error: updateError } = await supabase
          .from('auto_ecole_settings')
          .update({
            ...settings,
            id_ecole: idEcole
          })
          .eq('id_ecole', idEcole);
          
        error = updateError;
      } else {
        // Créer de nouveaux paramètres
        const { error: insertError } = await supabase
          .from('auto_ecole_settings')
          .insert({
            ...settings,
            id_ecole: idEcole
          });
          
        error = insertError;
      }
      
      if (error) throw error;
      
      setSuccess('Les paramètres ont été enregistrés avec succès');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      setError(error.message || 'Une erreur est survenue lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800">
      <div className="flex items-center mb-6">
        <FiSettings className="text-gray-500 mr-2 h-5 w-5" />
        <h2 className="text-xl font-semibold text-gray-800">Paramètres de l'auto-école</h2>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
          <FiAlertCircle className="mr-2 h-5 w-5 text-red-500" />
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 flex items-center">
          <FiCheckCircle className="mr-2 h-5 w-5 text-green-500" />
          <p>{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Section Notifications */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="notifications_email" className="text-sm font-medium text-gray-700">
                  Notifications par email
                </label>
                <p className="text-sm text-gray-500">
                  Envoyer des notifications par email aux élèves et au personnel
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications_email"
                  name="notifications_email"
                  checked={settings.notifications_email}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label
                  htmlFor="notifications_email"
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    settings.notifications_email ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      settings.notifications_email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                  {settings.notifications_email ? (
                    <FiToggleRight className="absolute right-1 text-white" />
                  ) : (
                    <FiToggleLeft className="absolute left-1 text-gray-400" />
                  )}
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="notifications_sms" className="text-sm font-medium text-gray-700">
                  Notifications par SMS
                </label>
                <p className="text-sm text-gray-500">
                  Envoyer des notifications par SMS aux élèves et au personnel
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications_sms"
                  name="notifications_sms"
                  checked={settings.notifications_sms}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label
                  htmlFor="notifications_sms"
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    settings.notifications_sms ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      settings.notifications_sms ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                  {settings.notifications_sms ? (
                    <FiToggleRight className="absolute right-1 text-white" />
                  ) : (
                    <FiToggleLeft className="absolute left-1 text-gray-400" />
                  )}
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="notifications_app" className="text-sm font-medium text-gray-700">
                  Notifications dans l'application
                </label>
                <p className="text-sm text-gray-500">
                  Afficher des notifications dans l'application pour les élèves et le personnel
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications_app"
                  name="notifications_app"
                  checked={settings.notifications_app}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label
                  htmlFor="notifications_app"
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    settings.notifications_app ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      settings.notifications_app ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                  {settings.notifications_app ? (
                    <FiToggleRight className="absolute right-1 text-white" />
                  ) : (
                    <FiToggleLeft className="absolute left-1 text-gray-400" />
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section Rappels */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rappels de rendez-vous</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="rappel_rdv_eleve" className="block text-sm font-medium text-gray-700 mb-1">
                Rappel pour les élèves
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="rappel_rdv_eleve"
                  name="rappel_rdv_eleve"
                  value={settings.rappel_rdv_eleve}
                  onChange={handleChange}
                  min="1"
                  max="72"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="ml-2 text-gray-700">heures avant le rendez-vous</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Délai d'envoi du rappel avant le rendez-vous pour les élèves
              </p>
            </div>
            
            <div>
              <label htmlFor="rappel_rdv_moniteur" className="block text-sm font-medium text-gray-700 mb-1">
                Rappel pour les moniteurs
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="rappel_rdv_moniteur"
                  name="rappel_rdv_moniteur"
                  value={settings.rappel_rdv_moniteur}
                  onChange={handleChange}
                  min="1"
                  max="72"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="ml-2 text-gray-700">heures avant le rendez-vous</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Délai d'envoi du rappel avant le rendez-vous pour les moniteurs
              </p>
            </div>
          </div>
        </div>
        
        {/* Section Archivage */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Archivage automatique</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="archivage_auto_eleves" className="text-sm font-medium text-gray-700">
                  Archivage automatique des élèves inactifs
                </label>
                <p className="text-sm text-gray-500">
                  Archiver automatiquement les élèves sans activité récente
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="archivage_auto_eleves"
                  name="archivage_auto_eleves"
                  checked={settings.archivage_auto_eleves}
                  onChange={handleChange}
                  className="sr-only"
                />
                <label
                  htmlFor="archivage_auto_eleves"
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    settings.archivage_auto_eleves ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      settings.archivage_auto_eleves ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                  {settings.archivage_auto_eleves ? (
                    <FiToggleRight className="absolute right-1 text-white" />
                  ) : (
                    <FiToggleLeft className="absolute left-1 text-gray-400" />
                  )}
                </label>
              </div>
            </div>
            
            {settings.archivage_auto_eleves && (
              <div>
                <label htmlFor="duree_archivage_eleves" className="block text-sm font-medium text-gray-700 mb-1">
                  Durée d'inactivité avant archivage
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="duree_archivage_eleves"
                    name="duree_archivage_eleves"
                    value={settings.duree_archivage_eleves}
                    onChange={handleChange}
                    min="30"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="ml-2 text-gray-700">jours</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Nombre de jours d'inactivité avant l'archivage automatique
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Section Apparence */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Apparence</h3>
          
          <div>
            <label htmlFor="theme_couleur" className="block text-sm font-medium text-gray-700 mb-1">
              Couleur principale du thème
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                id="theme_couleur"
                name="theme_couleur"
                value={settings.theme_couleur}
                onChange={handleChange}
                className="h-10 w-10 border-0 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">{settings.theme_couleur}</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Cette couleur sera utilisée pour les éléments principaux de l'interface
            </p>
          </div>
        </div>
        
        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Enregistrement...
              </>
            ) : (
              <>
                <FiSave className="mr-2 -ml-1 h-5 w-5" />
                Enregistrer les paramètres
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
