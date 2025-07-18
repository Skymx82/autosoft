'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiX, FiAlertTriangle, FiPhone, FiMail, FiCalendar } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

interface Enseignant {
  id_moniteur: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  num_enseignant: string;
  date_delivrance_num: string;
  id_bureau: number;
  id_ecole: number;
  bureau?: {
    nom: string;
  };
}

interface Bureau {
  id_bureau: number;
  nom: string;
}

export default function PersonnelEnseignants() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEnseignant, setCurrentEnseignant] = useState<Partial<Enseignant> | null>(null);
  const [enseignantToDelete, setEnseignantToDelete] = useState<Enseignant | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  // Charger la liste des enseignants
  const fetchEnseignants = async () => {
    try {
      setLoading(true);
      const idEcole = getIdEcole();
      
      const { data, error } = await supabase
        .from('enseignants')
        .select('*, bureau:id_bureau(nom)')
        .eq('id_ecole', idEcole)
        .order('nom');
        
      if (error) throw error;
      
      setEnseignants(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des enseignants:', error);
      setError(error.message || 'Une erreur est survenue lors du chargement des enseignants');
    } finally {
      setLoading(false);
    }
  };

  // Charger la liste des bureaux
  const fetchBureaux = async () => {
    try {
      const idEcole = getIdEcole();
      
      const { data, error } = await supabase
        .from('bureau')
        .select('id_bureau, nom')
        .eq('id_ecole', idEcole)
        .order('nom');
        
      if (error) throw error;
      
      setBureaux(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des bureaux:', error);
    }
  };

  useEffect(() => {
    fetchEnseignants();
    fetchBureaux();
  }, []);

  // Ouvrir le modal pour ajouter un nouvel enseignant
  const handleAddEnseignant = () => {
    setCurrentEnseignant({});
    setIsEditing(false);
    setShowModal(true);
  };

  // Ouvrir le modal pour éditer un enseignant existant
  const handleEditEnseignant = (enseignant: Enseignant) => {
    setCurrentEnseignant({
      ...enseignant,
      date_delivrance_num: enseignant.date_delivrance_num ? new Date(enseignant.date_delivrance_num).toISOString().split('T')[0] : ''
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Ouvrir le modal pour confirmer la suppression d'un enseignant
  const handleDeleteClick = (enseignant: Enseignant) => {
    setEnseignantToDelete(enseignant);
    setShowDeleteModal(true);
  };

  // Gérer le changement des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEnseignant(prev => ({ ...prev, [name]: value }));
  };

  // Sauvegarder un enseignant (ajout ou modification)
  const handleSaveEnseignant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const idEcole = getIdEcole();
      
      if (!currentEnseignant) return;
      
      // Vérifier les champs obligatoires
      if (!currentEnseignant.nom || !currentEnseignant.prenom) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      if (isEditing) {
        // Mettre à jour un enseignant existant
        const { error } = await supabase
          .from('enseignants')
          .update({
            ...currentEnseignant,
            id_ecole: idEcole
          })
          .eq('id_moniteur', currentEnseignant.id_moniteur);
          
        if (error) throw error;
        
        setSuccess('L\'enseignant a été mis à jour avec succès');
      } else {
        // Ajouter un nouvel enseignant
        const { error } = await supabase
          .from('enseignants')
          .insert({
            ...currentEnseignant,
            id_ecole: idEcole
          });
          
        if (error) throw error;
        
        setSuccess('L\'enseignant a été ajouté avec succès');
      }
      
      // Fermer le modal et rafraîchir la liste
      setShowModal(false);
      fetchEnseignants();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde de l\'enseignant:', error);
      setError(error.message || 'Une erreur est survenue lors de la sauvegarde de l\'enseignant');
    }
  };

  // Supprimer un enseignant
  const handleDeleteEnseignant = async () => {
    try {
      if (!enseignantToDelete) return;
      
      const { error } = await supabase
        .from('enseignants')
        .delete()
        .eq('id_moniteur', enseignantToDelete.id_moniteur);
        
      if (error) throw error;
      
      setSuccess('L\'enseignant a été supprimé avec succès');
      setShowDeleteModal(false);
      fetchEnseignants();
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'enseignant:', error);
      setError(error.message || 'Une erreur est survenue lors de la suppression de l\'enseignant');
    }
  };

  // Formater une date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  if (loading && enseignants.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Gérez les enseignants et moniteurs de votre auto-école
        </p>
        <button
          onClick={handleAddEnseignant}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Ajouter un enseignant
        </button>
      </div>
      
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
      
      {enseignants.length === 0 && !loading ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun enseignant</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter un enseignant pour votre auto-école.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddEnseignant}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" />
              Ajouter un enseignant
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enseignants.map((enseignant) => (
            <div key={enseignant.id_moniteur} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">{enseignant.prenom} {enseignant.nom}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditEnseignant(enseignant)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(enseignant)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  {enseignant.bureau?.nom && (
                    <p className="mb-2 flex items-center">
                      <span className="w-5 h-5 mr-2 flex items-center justify-center">🏢</span>
                      Bureau: {enseignant.bureau.nom}
                    </p>
                  )}
                  {enseignant.email && (
                    <p className="mb-2 flex items-center">
                      <FiMail className="w-5 h-5 mr-2" />
                      {enseignant.email}
                    </p>
                  )}
                  {enseignant.tel && (
                    <p className="mb-2 flex items-center">
                      <FiPhone className="w-5 h-5 mr-2" />
                      {enseignant.tel}
                    </p>
                  )}
                </div>
                
                {(enseignant.num_enseignant || enseignant.date_delivrance_num) && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {enseignant.num_enseignant && (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">N° enseignant:</span> {enseignant.num_enseignant}
                      </p>
                    )}
                    {enseignant.date_delivrance_num && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        <span className="font-medium">Délivré le:</span> {formatDate(enseignant.date_delivrance_num)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal pour ajouter/éditer un enseignant */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Modifier l\'enseignant' : 'Ajouter un enseignant'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEnseignant} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={currentEnseignant?.nom || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={currentEnseignant?.prenom || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={currentEnseignant?.email || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="tel" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="tel"
                  name="tel"
                  value={currentEnseignant?.tel || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="id_bureau" className="block text-sm font-medium text-gray-700 mb-1">
                  Bureau d'affectation
                </label>
                <select
                  id="id_bureau"
                  name="id_bureau"
                  value={currentEnseignant?.id_bureau || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un bureau</option>
                  {bureaux.map((bureau) => (
                    <option key={bureau.id_bureau} value={bureau.id_bureau}>
                      {bureau.nom}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="num_enseignant" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro d'enseignant
                </label>
                <input
                  type="text"
                  id="num_enseignant"
                  name="num_enseignant"
                  value={currentEnseignant?.num_enseignant || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="date_delivrance_num" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de délivrance du numéro
                </label>
                <input
                  type="date"
                  id="date_delivrance_num"
                  name="date_delivrance_num"
                  value={currentEnseignant?.date_delivrance_num || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isEditing ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && enseignantToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-red-500">
                <FiAlertTriangle className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmation de suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer l'enseignant <span className="font-semibold">{enseignantToDelete.prenom} {enseignantToDelete.nom}</span> ?
                <br /><br />
                Cette action est irréversible.
              </p>
              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteEnseignant}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
