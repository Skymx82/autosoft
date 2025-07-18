'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiPackage, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { fetchForfaits, addForfait, updateForfait, deleteForfait, Forfait } from '../api/ApiForfaits';
import { AjoutForfaitModal, SuppressionForfaitModal, AlertMessage } from './AjoutForfait';

// Fonction pour formater les prix
const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return '0,00 €';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

export default function AutoEcoleForfaits() {
  const [forfaits, setForfaits] = useState<Forfait[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentForfait, setCurrentForfait] = useState<Partial<Forfait> | null>(null);
  const [forfaitToDelete, setForfaitToDelete] = useState<Forfait | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [typesPermis, setTypesPermis] = useState<string[]>(['A', 'A1', 'A2', 'B', 'B1', 'BE', 'C', 'CE', 'D', 'DE']);

  // Charger la liste des forfaits
  const loadForfaits = async () => {
    try {
      setLoading(true);
      const data = await fetchForfaits();
      setForfaits(data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des forfaits:', error);
      setError(error.message || 'Une erreur est survenue lors du chargement des forfaits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForfaits();
  }, []);

  // Ouvrir le modal pour ajouter un nouveau forfait
  const handleAddForfait = () => {
    setCurrentForfait({
      nom: '',
      type_permis: '',
      tarif_base: 0,
      nb_heures_incluses: 0,
      prix_heure_supp: 0,
      prix_presentation_examen: 0,
      frais_inscription: 0,
      duree_validite_jours: 365,
      paiement_fractionnable: false,
      nb_max_echeances: 1,
      actif: true,
      description: ''
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Ouvrir le modal pour éditer un forfait existant
  const handleEditForfait = (forfait: Forfait) => {
    setCurrentForfait(forfait);
    setIsEditing(true);
    setShowModal(true);
  };

  // Ouvrir le modal pour confirmer la suppression d'un forfait
  const handleDeleteClick = (forfait: Forfait) => {
    setForfaitToDelete(forfait);
    setShowDeleteModal(true);
  };

  // Gérer le changement des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentForfait(prev => ({
      ...prev,
      [name]: ['tarif_base', 'nb_heures_incluses', 'prix_heure_supp', 'prix_presentation_examen', 'frais_inscription', 'duree_validite_jours', 'nb_max_echeances'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  // Récupérer l'ID de l'école depuis le localStorage
  const getIdEcole = (): number => {
    if (typeof window !== 'undefined') {
      const userDataStr = localStorage.getItem('autosoft_user');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        return userData.id_ecole || 0;
      }
    }
    return 0;
  };
  
  // Sauvegarder un forfait (ajout ou modification)
  const handleSaveForfait = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentForfait) return;
      
      // Vérifier les champs obligatoires
      if (!currentForfait.nom || !currentForfait.type_permis) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      // Récupérer l'ID de l'école depuis localStorage
      const idEcole = getIdEcole();
      if (!idEcole) {
        setError('Impossible de déterminer l\'auto-école. Veuillez vous reconnecter.');
        return;
      }
      
      // Assurer que tous les champs requis sont présents avec des valeurs par défaut
      const forfaitToSave = {
        ...currentForfait,
        prix_heure_supp: currentForfait.prix_heure_supp || 0,
        frais_inscription: currentForfait.frais_inscription || 0,
        paiement_fractionnable: currentForfait.paiement_fractionnable || false,
        nb_max_echeances: currentForfait.nb_max_echeances || 1,
        actif: true,
        id_ecole: idEcole
      };
      
      if (isEditing) {
        // Mettre à jour un forfait existant
        await updateForfait(forfaitToSave as Forfait);
        setSuccess('Le forfait a été mis à jour avec succès');
      } else {
        // Ajouter un nouveau forfait
        await addForfait(forfaitToSave as Omit<Forfait, 'id_forfait'>);
        setSuccess('Le forfait a été ajouté avec succès');
      }
      
      // Fermer le modal et rafraîchir la liste
      setShowModal(false);
      loadForfaits();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde du forfait:', error);
      setError(error.message || 'Une erreur est survenue lors de la sauvegarde du forfait');
    }
  };

  // Supprimer un forfait
  const handleDeleteForfait = async () => {
    try {
      if (!forfaitToDelete) return;
      
      await deleteForfait(forfaitToDelete.id_forfait);
      
      setSuccess('Le forfait a été supprimé avec succès');
      setShowDeleteModal(false);
      loadForfaits();
    } catch (error: any) {
      console.error('Erreur lors de la suppression du forfait:', error);
      setError(error.message || 'Une erreur est survenue lors de la suppression du forfait');
    }
  };

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  if (loading && forfaits.length === 0) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestion des forfaits</h2>
        <button
          onClick={handleAddForfait}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Ajouter un forfait
        </button>
      </div>
      
      {error && (
        <AlertMessage 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
      
      {success && (
        <AlertMessage 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)} 
        />
      )}
      
      {forfaits.length === 0 && !loading ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun forfait</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter un forfait pour votre auto-école.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddForfait}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" />
              Ajouter un forfait
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom du forfait
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de permis
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarif de base
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heures incluses
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix heure supp.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forfaits.map((forfait) => (
                <tr key={forfait.id_forfait} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {forfait.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {forfait.type_permis}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(forfait.tarif_base)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {forfait.nb_heures_incluses} heures
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(forfait.prix_heure_supp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {forfait.paiement_fractionnable ? 
                      `Fractionnable (${forfait.nb_max_echeances} fois)` : 
                      'Comptant'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditForfait(forfait)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(forfait)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal d'ajout/modification de forfait */}
      <AjoutForfaitModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveForfait}
        currentForfait={currentForfait}
        setCurrentForfait={setCurrentForfait}
        isEditing={isEditing}
        typesPermis={typesPermis}
      />
      
      {/* Modal de confirmation de suppression */}
      <SuppressionForfaitModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteForfait}
        forfait={forfaitToDelete}
      />
    </div>
  );
}
