'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiUpload } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

interface AutoEcole {
  id_ecole: number;
  nom: string;
  adresse: string;
  code_postal: string;
  ville: string;
  telephone: string;
  email: string;
  site_web: string;
  numero_agrement: string;
  date_creation: string;
  siret: string;
  logo_url: string;
  horaires_ouverture: string;
}

export default function AutoEcoleInfoGenerales() {
  const [formData, setFormData] = useState<Partial<AutoEcole>>({
    nom: '',
    adresse: '',
    code_postal: '',
    ville: '',
    telephone: '',
    email: '',
    site_web: '',
    numero_agrement: '',
    date_creation: '',
    siret: '',
    horaires_ouverture: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Récupérer les informations de l'auto-école
  useEffect(() => {
    const fetchAutoEcole = async () => {
      try {
        setLoading(true);
        
        // Récupérer l'ID de l'auto-école depuis le localStorage
        const userDataStr = localStorage.getItem('autosoft_user');
        if (!userDataStr) {
          throw new Error('Utilisateur non connecté');
        }
        
        const userData = JSON.parse(userDataStr);
        const idEcole = userData.id_ecole;
        
        if (!idEcole) {
          throw new Error('ID auto-école non trouvé');
        }
        
        // Récupérer les données de l'auto-école
        const { data, error } = await supabase
          .from('auto_ecole')
          .select('*')
          .eq('id_ecole', idEcole)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            ...data,
            date_creation: data.date_creation ? new Date(data.date_creation).toISOString().split('T')[0] : '',
          });
          
          if (data.logo_url) {
            setLogoPreview(data.logo_url);
          }
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des données:', error);
        setError(error.message || 'Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAutoEcole();
  }, []);

  // Gérer le changement des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Réinitialiser les messages
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  // Gérer le téléchargement du logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Créer un aperçu du logo
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sauvegarder les modifications
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Récupérer l'ID de l'auto-école depuis le localStorage
      const userDataStr = localStorage.getItem('autosoft_user');
      if (!userDataStr) {
        throw new Error('Utilisateur non connecté');
      }
      
      const userData = JSON.parse(userDataStr);
      const idEcole = userData.id_ecole;
      
      if (!idEcole) {
        throw new Error('ID auto-école non trouvé');
      }
      
      // Mettre à jour le logo si un nouveau fichier est sélectionné
      let logoUrl = formData.logo_url;
      
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${idEcole}-logo-${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`;
        
        // Télécharger le logo
        const { error: uploadError } = await supabase.storage
          .from('auto_ecole_assets')
          .upload(filePath, logoFile);
          
        if (uploadError) throw uploadError;
        
        // Obtenir l'URL publique
        const { data: urlData } = supabase.storage
          .from('auto_ecole_assets')
          .getPublicUrl(filePath);
          
        logoUrl = urlData.publicUrl;
      }
      
      // Mettre à jour les informations de l'auto-école
      const { error: updateError } = await supabase
        .from('auto_ecole')
        .update({
          ...formData,
          logo_url: logoUrl,
        })
        .eq('id_ecole', idEcole);
        
      if (updateError) throw updateError;
      
      setSuccess('Les informations ont été mises à jour avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.message || 'Une erreur est survenue lors de la sauvegarde');
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
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Informations générales de l'auto-école</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          <p>{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo de l'auto-école */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-32 h-32 relative">
            {logoPreview ? (
              <img 
                src={logoPreview} 
                alt="Logo de l'auto-école" 
                className="w-full h-full object-contain border rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 border rounded-lg text-gray-400">
                Aucun logo
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo de l'auto-école
            </label>
            <div className="flex items-center">
              <label className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <FiUpload className="inline-block mr-2" />
                Choisir un fichier
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </label>
              {logoFile && (
                <span className="ml-3 text-sm text-gray-500">
                  {logoFile.name}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Format recommandé: PNG ou JPG, taille max: 2MB
            </p>
          </div>
        </div>
        
        {/* Informations principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'auto-école *
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="numero_agrement" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro d'agrément *
            </label>
            <input
              type="text"
              id="numero_agrement"
              name="numero_agrement"
              value={formData.numero_agrement || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro SIRET *
            </label>
            <input
              type="text"
              id="siret"
              name="siret"
              value={formData.siret || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="date_creation" className="block text-sm font-medium text-gray-700 mb-1">
              Date de création
            </label>
            <input
              type="date"
              id="date_creation"
              name="date_creation"
              value={formData.date_creation || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Coordonnées */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Coordonnées</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse *
              </label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                value={formData.adresse || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="code_postal" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal *
                </label>
                <input
                  type="text"
                  id="code_postal"
                  name="code_postal"
                  value={formData.code_postal || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  value={formData.ville || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="site_web" className="block text-sm font-medium text-gray-700 mb-1">
                Site web
              </label>
              <input
                type="url"
                id="site_web"
                name="site_web"
                value={formData.site_web || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Horaires */}
        <div>
          <label htmlFor="horaires_ouverture" className="block text-sm font-medium text-gray-700 mb-1">
            Horaires d'ouverture
          </label>
          <textarea
            id="horaires_ouverture"
            name="horaires_ouverture"
            value={formData.horaires_ouverture || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Lundi-Vendredi: 9h-12h, 14h-18h / Samedi: 9h-12h"
          />
        </div>
        
        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {saving ? (
              <>
                <span className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                Sauvegarde en cours...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
