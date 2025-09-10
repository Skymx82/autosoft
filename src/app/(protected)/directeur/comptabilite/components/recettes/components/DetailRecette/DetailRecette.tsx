'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FiX, FiUpload, FiFile, FiTrash2, FiSave } from 'react-icons/fi';

interface Recette {
  id: string;
  date: string;
  categorie: string;
  description: string;
  montant: number;
  tva: number;
  client: string;
  modePaiement: string;
  statut: 'encaissé' | 'en attente' | 'annulé';
  justificatif_url?: string;
}

interface DetailRecetteProps {
  showModal: boolean;
  onClose: () => void;
  recetteId: string;
  id_ecole?: string;
  id_bureau?: string;
  onUpdate: () => void; // Callback pour rafraîchir la liste après modification
}

export default function DetailRecette({
  showModal,
  onClose,
  recetteId,
  id_ecole,
  id_bureau,
  onUpdate
}: DetailRecetteProps) {
  // États pour les données et le chargement
  const [recette, setRecette] = useState<Recette | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [justificatif, setJustificatif] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    date: '',
    categorie: '',
    description: '',
    montant: 0,
    tva: 0,
    tauxTVA: 20, // Taux par défaut
    client: '',
    modePaiement: '',
    statut: 'encaissé' as 'encaissé' | 'en attente' | 'annulé'
  });

  // Récupérer les détails de la recette
  useEffect(() => {
    const fetchRecetteDetails = async () => {
      if (!recetteId || !showModal) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les informations utilisateur
        let ecole_id = id_ecole;
        let bureau_id = id_bureau;
        
        if (!ecole_id || !bureau_id) {
          try {
            const userData = localStorage.getItem('autosoft_user');
            if (userData) {
              const user = JSON.parse(userData);
              ecole_id = ecole_id || user.id_ecole;
              bureau_id = bureau_id || user.id_bureau;
            }
          } catch (err) {
            console.error('Erreur lors de la récupération des informations utilisateur:', err);
          }
        }
        
        // Valeurs par défaut si toujours undefined
        ecole_id = ecole_id || '1';
        bureau_id = bureau_id || '0';
        
        // Appel API pour récupérer les détails de la recette
        const response = await fetch(`/directeur/comptabilite/components/recettes/components/DetailRecette/api/detail?id_recette=${recetteId}&id_ecole=${ecole_id}&id_bureau=${bureau_id}`);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setRecette(data.recette);
        
        // Calculer le taux de TVA
        const tauxTVA = data.recette.montant > 0 
          ? Math.round((data.recette.tva / data.recette.montant) * 100) 
          : 20;
        
        // Initialiser le formulaire avec les données de la recette
        setFormData({
          date: data.recette.date,
          categorie: data.recette.categorie,
          description: data.recette.description,
          montant: data.recette.montant,
          tva: data.recette.tva,
          tauxTVA: tauxTVA,
          client: data.recette.client || '',
          modePaiement: data.recette.modePaiement,
          statut: data.recette.statut
        });
        
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de la recette:', err);
        setError('Impossible de charger les détails de la recette. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecetteDetails();
  }, [recetteId, showModal, id_ecole, id_bureau]);

  // Gestion des changements de formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Pour les champs numériques, convertir en nombre
    if (name === 'montant') {
      const montant = parseFloat(value) || 0;
      const tva = (montant * formData.tauxTVA) / 100;
      
      setFormData({
        ...formData,
        montant,
        tva: parseFloat(tva.toFixed(2))
      });
    } else if (name === 'tauxTVA') {
      const tauxTVA = parseFloat(value) || 0;
      const tva = (formData.montant * tauxTVA) / 100;
      
      setFormData({
        ...formData,
        tauxTVA,
        tva: parseFloat(tva.toFixed(2))
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Gestion du glisser-déposer pour les justificatifs
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // Vérifier que c'est un fichier PDF, image ou document
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setJustificatif(file);
      } else {
        alert('Format de fichier non supporté. Veuillez utiliser PDF, JPG, PNG ou DOC.');
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setJustificatif(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setJustificatif(null);
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Récupérer les informations utilisateur
      let ecole_id = id_ecole;
      let bureau_id = id_bureau;
      
      if (!ecole_id || !bureau_id) {
        try {
          const userData = localStorage.getItem('autosoft_user');
          if (userData) {
            const user = JSON.parse(userData);
            ecole_id = ecole_id || user.id_ecole;
            bureau_id = bureau_id || user.id_bureau;
          }
        } catch (err) {
          console.error('Erreur lors de la récupération des informations utilisateur:', err);
        }
      }
      
      // Valeurs par défaut si toujours undefined
      ecole_id = ecole_id || '1';
      bureau_id = bureau_id || '0';
      
      // Créer un FormData pour l'envoi des données
      const formDataToSend = new FormData();
      
      // Ajouter les champs de base
      formDataToSend.append('id_recette', recetteId);
      formDataToSend.append('id_ecole', ecole_id);
      formDataToSend.append('id_bureau', bureau_id);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('categorie', formData.categorie);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('montant', formData.montant.toString());
      formDataToSend.append('tva', formData.tva.toString());
      formDataToSend.append('client', formData.client);
      formDataToSend.append('modePaiement', formData.modePaiement);
      formDataToSend.append('statut', formData.statut);
      
      // Ajouter le fichier justificatif s'il existe
      if (justificatif) {
        formDataToSend.append('justificatif', justificatif);
      }
      
      // Appel API pour mettre à jour la recette
      const response = await fetch(`/directeur/comptabilite/components/recettes/components/DetailRecette/api/modifier`, {
        method: 'PUT',
        body: formDataToSend
      });
      
      if (!response.ok) {
        // Récupérer les détails de l'erreur
        const errorData = await response.json();
        
        if (response.status === 400 && errorData.error) {
          // Erreur spécifique retournée par l'API
          throw new Error(errorData.error);
        } else {
          // Erreur générique
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      }
      
      // Fermer la modale et rafraîchir la liste
      onUpdate();
      onClose();
      
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la recette:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour de la recette');
    } finally {
      setSaving(false);
    }
  };

  // Si la modale n'est pas visible, ne rien afficher
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 text-gray-800 overflow-y-auto">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full border border-gray-200 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* En-tête avec titre et bouton de fermeture */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <h3 className="text-xl font-semibold">Modifier la recette</h3>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            onClick={onClose}
            aria-label="Fermer"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        {/* Contenu principal avec défilement */}
        <div className="overflow-y-auto p-6 flex-grow">
          {/* Affichage du chargement */}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {/* Affichage de l'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* Formulaire de modification */}
          {!loading && recette && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Première colonne */}
                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      name="categorie"
                      value={formData.categorie}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option value="Forfait">Forfait</option>
                      <option value="Leçon">Leçon</option>
                      <option value="Examen">Examen</option>
                      <option value="Inscription">Inscription</option>
                      <option value="Livre">Livre/Matériel</option>
                      <option value="Autres">Autres</option>
                    </select>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  
                  {/* Client */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client <span className="text-xs text-gray-500">(optionnel)</span></label>
                    <input
                      type="text"
                      name="client"
                      value={formData.client}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {/* Deuxième colonne */}
                <div className="space-y-4">
                  {/* Montant HT */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant HT (€)</label>
                    <input
                      type="number"
                      name="montant"
                      value={formData.montant}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  
                  {/* Taux de TVA */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taux de TVA (%)</label>
                    <select
                      name="tauxTVA"
                      value={formData.tauxTVA}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="0">0%</option>
                      <option value="5.5">5.5%</option>
                      <option value="10">10%</option>
                      <option value="20">20%</option>
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      Montant TVA: {formData.tva.toFixed(2)} €
                    </div>
                  </div>
                  
                  {/* Mode de paiement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
                    <select
                      name="modePaiement"
                      value={formData.modePaiement}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Espèces">Espèces</option>
                      <option value="Carte bancaire">Carte bancaire</option>
                      <option value="Chèque">Chèque</option>
                      <option value="Virement">Virement</option>
                      <option value="Prélèvement">Prélèvement</option>
                    </select>
                  </div>
                  
                  {/* Statut */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      name="statut"
                      value={formData.statut}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="encaissé">Encaissé</option>
                      <option value="en attente">En attente</option>
                      <option value="annulé">Annulé</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Zone de dépôt pour justificatif */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Justificatif</label>
                <div 
                  className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center h-32 cursor-pointer transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload-edit')?.click()}
                >
                  <input
                    id="file-upload-edit"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  
                  {justificatif ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <FiFile className="w-6 h-6 text-blue-500 mr-2" />
                        <span className="text-sm font-medium truncate max-w-[200px]">{justificatif.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{(justificatif.size / 1024).toFixed(1)} KB</div>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); removeFile(); }}
                        className="mt-2 text-red-600 hover:text-red-800 flex items-center text-xs"
                      >
                        <FiTrash2 className="w-3 h-3 mr-1" /> Supprimer
                      </button>
                    </div>
                  ) : recette.justificatif_url ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <FiFile className="w-6 h-6 text-blue-500 mr-2" />
                        <span className="text-sm font-medium">Justificatif existant</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Déposez un nouveau fichier pour remplacer l'existant
                      </p>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center">
                        Glissez et déposez un fichier ici, ou<br />
                        <span className="text-blue-500">cliquez pour sélectionner</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG ou DOC (max 5MB)</p>
                    </>
                  )}
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
