'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  user: any | null;
  isLoading: boolean;
}

interface Bureau {
  id_bureau: number;
  nom: string;
}

export default function UserModal({ isOpen, onClose, onSave, user, isLoading }: UserModalProps) {
  const [formData, setFormData] = useState({
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'moniteur',
    id_bureau: 0,
    statut: 'active',
    // Champs spécifiques pour les moniteurs
    num_enseignant: '',
    date_delivrance_num: ''
  });
  
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [idEcole, setIdEcole] = useState<number>(0);

  // Récupérer l'ID de l'école depuis le localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userDataStr = localStorage.getItem('autosoft_user');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          setIdEcole(userData.id_ecole || 0);
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || 0,
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        role: user.role || 'moniteur',
        id_bureau: user.id_bureau || 0,
        statut: user.statut || 'active',
        num_enseignant: user.num_enseignant || '',
        date_delivrance_num: user.date_delivrance_num || ''
      });
    } else {
      setFormData({
        id: 0,
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        role: 'moniteur',
        id_bureau: 0,
        statut: 'active',
        num_enseignant: '',
        date_delivrance_num: ''
      });
    }
  }, [user]);

  useEffect(() => {
    // Charger la liste des bureaux de l'auto-école
    const fetchBureaux = async () => {
      try {
        if (!idEcole) return;
        
        const response = await fetch(`/directeur/mon-auto-ecole/components/User/components/AjoutUser/api/bureaux?id_ecole=${idEcole}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        setBureaux(data);
      } catch (err) {
        console.error('Erreur lors du chargement des bureaux:', err);
        // En cas d'erreur, utiliser des données fictives pour ne pas bloquer l'interface
        setBureaux([]);
      }
    };

    if (isOpen && idEcole) {
      fetchBureaux();
    }
  }, [isOpen, idEcole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Déboguer le changement de rôle
    if (name === 'role') {
      console.log('Rôle changé à:', value);
    }
    
    // Convertir en nombre pour les champs numériques
    if (name === 'id_bureau') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Effacer l'erreur de validation pour ce champ
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
    
    // Déboguer l'état du formulaire après mise à jour
    if (name === 'role') {
      console.log('formData après mise à jour:', {...formData, [name]: value});
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.nom.trim()) {
      errors.nom = 'Le nom est requis';
    }
    
    if (!formData.prenom.trim()) {
      errors.prenom = 'Le prénom est requis';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'L\'email n\'est pas valide';
    }
    
    if (!formData.telephone.trim()) {
      errors.telephone = 'Le téléphone est requis';
    }
    
    if (!formData.role) {
      errors.role = 'Le rôle est requis';
    }
    
    setValidationErrors(errors);
    
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Ajouter l'ID de l'école au formulaire
      const dataToSave = {
        ...formData,
        id_ecole: idEcole
      };
      
      onSave(dataToSave);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto text-gray-800">
      <div 
        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-[101]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-4 mb-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {user && user.id ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
                type="button"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                {/* Nom */}
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    id="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${validationErrors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {validationErrors.nom && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.nom}</p>
                  )}
                </div>

                {/* Prénom */}
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    id="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${validationErrors.prenom ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {validationErrors.prenom && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.prenom}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    id="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${validationErrors.telephone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {validationErrors.telephone && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.telephone}</p>
                  )}
                </div>

                {/* Rôle */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Rôle *
                  </label>
                  <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${validationErrors.role ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="directeur">Directeur</option>
                    <option value="moniteur">Moniteur</option>
                    <option value="secretaire">Secrétaire</option>
                    <option value="comptable">Comptable</option>
                  </select>
                  {validationErrors.role && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.role}</p>
                  )}
                </div>

                {/* Bureau */}
                <div>
                  <label htmlFor="id_bureau" className="block text-sm font-medium text-gray-700">
                    Bureau
                  </label>
                  <select
                    name="id_bureau"
                    id="id_bureau"
                    value={formData.id_bureau}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="0">Aucun bureau spécifique</option>
                    {bureaux.map((bureau) => (
                      <option key={bureau.id_bureau} value={bureau.id_bureau}>
                        {bureau.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Statut */}
                <div>
                  <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                    Statut *
                  </label>
                  <select
                    name="statut"
                    id="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="pending">En attente</option>
                  </select>
                </div>

                {/* Champs spécifiques pour les moniteurs */}
                {formData.role === 'moniteur' ? (
                  <>
                    {/* Numéro d'enseignant */}
                    <div>
                      <label htmlFor="num_enseignant" className="block text-sm font-medium text-gray-700">
                        Numéro d'enseignant
                      </label>
                      <input
                        type="text"
                        name="num_enseignant"
                        id="num_enseignant"
                        value={formData.num_enseignant}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Date de délivrance du numéro */}
                    <div>
                      <label htmlFor="date_delivrance_num" className="block text-sm font-medium text-gray-700">
                        Date de délivrance
                      </label>
                      <input
                        type="date"
                        name="date_delivrance_num"
                        id="date_delivrance_num"
                        value={formData.date_delivrance_num}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                ) : null}

                {/* Mot de passe - Uniquement pour la création */}
                {!user || !user.id ? (
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertCircle className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Un mot de passe temporaire sera généré et envoyé à l'adresse email de l'utilisateur.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Chargement...
                    </div>
                  ) : (
                    user && user.id ? 'Mettre à jour' : 'Créer'
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
