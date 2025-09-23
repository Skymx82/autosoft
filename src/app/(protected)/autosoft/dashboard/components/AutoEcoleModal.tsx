'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';

interface Bureau {
  id?: number;
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
  telephone: string;
  email: string;
}

interface AutoEcole {
  id?: number;
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
  telephone: string;
  email: string;
  responsable: string;
  statut: 'active' | 'inactive' | 'pending';
  bureaux?: Bureau[];
}

interface AutoEcoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (autoEcole: AutoEcole) => void;
  autoEcole: AutoEcole | null;
  isLoading: boolean;
}

export default function AutoEcoleModal({ isOpen, onClose, onSave, autoEcole, isLoading }: AutoEcoleModalProps) {
  const [formData, setFormData] = useState<AutoEcole>({
    nom: '',
    adresse: '',
    ville: '',
    code_postal: '',
    telephone: '',
    email: '',
    responsable: '',
    statut: 'pending',
    bureaux: []
  });

  const [additionalBureaux, setAdditionalBureaux] = useState<Bureau[]>([]);
  const [showBureauForm, setShowBureauForm] = useState(false);
  const [currentBureau, setCurrentBureau] = useState<Bureau>({
    nom: '',
    adresse: '',
    ville: '',
    code_postal: '',
    telephone: '',
    email: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bureauErrors, setBureauErrors] = useState<Record<string, string>>({});

  // Mettre à jour le formulaire lorsqu'une auto-école est fournie pour modification
  useEffect(() => {
    if (autoEcole) {
      setFormData(autoEcole);
      // Si l'auto-école a des bureaux supplémentaires, les initialiser
      if (autoEcole.bureaux && autoEcole.bureaux.length > 0) {
        setAdditionalBureaux(autoEcole.bureaux);
      } else {
        setAdditionalBureaux([]);
      }
    } else {
      // Réinitialiser le formulaire pour une nouvelle auto-école
      setFormData({
        nom: '',
        adresse: '',
        ville: '',
        code_postal: '',
        telephone: '',
        email: '',
        responsable: '',
        statut: 'pending',
        bureaux: []
      });
      setAdditionalBureaux([]);
    }
    // Réinitialiser les autres états
    setErrors({});
    setBureauErrors({});
    setShowBureauForm(false);
    setCurrentBureau({
      nom: '',
      adresse: '',
      ville: '',
      code_postal: '',
      telephone: '',
      email: ''
    });
  }, [autoEcole, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Gestion des bureaux supplémentaires
  const handleBureauChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentBureau(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (bureauErrors[name]) {
      setBureauErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateBureau = () => {
    const newErrors: Record<string, string> = {};
    
    // Validation du nom du bureau
    if (!currentBureau.nom.trim()) {
      newErrors.nom = 'Le nom du bureau est requis';
    }
    
    // Validation de l'adresse du bureau
    if (!currentBureau.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est requise';
    }
    
    // Validation de la ville du bureau
    if (!currentBureau.ville.trim()) {
      newErrors.ville = 'La ville est requise';
    }
    
    // Validation du code postal du bureau
    if (!currentBureau.code_postal.trim()) {
      newErrors.code_postal = 'Le code postal est requis';
    } else if (!/^\d{5}$/.test(currentBureau.code_postal)) {
      newErrors.code_postal = 'Le code postal doit contenir 5 chiffres';
    }
    
    // Validation du téléphone du bureau
    if (!currentBureau.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    } else if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(currentBureau.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Format de téléphone invalide';
    }
    
    // Validation de l'email du bureau
    if (currentBureau.email && currentBureau.email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentBureau.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    setBureauErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const addBureau = () => {
    if (validateBureau()) {
      setAdditionalBureaux(prev => [...prev, { ...currentBureau }]);
      setCurrentBureau({
        nom: '',
        adresse: '',
        ville: '',
        code_postal: '',
        telephone: '',
        email: ''
      });
      setShowBureauForm(false);
    }
  };
  
  const removeBureau = (index: number) => {
    setAdditionalBureaux(prev => prev.filter((_, i) => i !== index));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validation du nom
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    // Validation de l'adresse
    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est requise';
    }
    
    // Validation de la ville
    if (!formData.ville.trim()) {
      newErrors.ville = 'La ville est requise';
    }
    
    // Validation du code postal
    if (!formData.code_postal.trim()) {
      newErrors.code_postal = 'Le code postal est requis';
    } else if (!/^\d{5}$/.test(formData.code_postal)) {
      newErrors.code_postal = 'Le code postal doit contenir 5 chiffres';
    }
    
    // Validation du téléphone
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    } else if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Format de téléphone invalide';
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation du responsable
    if (!formData.responsable.trim()) {
      newErrors.responsable = 'Le nom du responsable est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Inclure les bureaux supplémentaires dans les données à sauvegarder
      const dataToSave = {
        ...formData,
        bureaux: additionalBureaux
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
                {autoEcole ? 'Modifier une auto-école' : 'Ajouter une auto-école'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                {/* Nom de l'auto-école */}
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom de l'auto-école *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    id="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.nom ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>

                {/* Adresse */}
                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    id="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.adresse ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.adresse && (
                    <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>
                  )}
                </div>

                {/* Ville et Code postal */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
                      Ville *
                    </label>
                    <input
                      type="text"
                      name="ville"
                      id="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.ville ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.ville && (
                      <p className="mt-1 text-sm text-red-600">{errors.ville}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="code_postal" className="block text-sm font-medium text-gray-700">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      name="code_postal"
                      id="code_postal"
                      value={formData.code_postal}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.code_postal ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.code_postal && (
                      <p className="mt-1 text-sm text-red-600">{errors.code_postal}</p>
                    )}
                  </div>
                </div>

                {/* Téléphone et Email */}
                <div className="grid grid-cols-2 gap-4">
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
                      className={`mt-1 block w-full border ${errors.telephone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.telephone && (
                      <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
                    )}
                  </div>
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
                      className={`mt-1 block w-full border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Responsable */}
                <div>
                  <label htmlFor="responsable" className="block text-sm font-medium text-gray-700">
                    Responsable *
                  </label>
                  <input
                    type="text"
                    name="responsable"
                    id="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.responsable ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.responsable && (
                    <p className="mt-1 text-sm text-red-600">{errors.responsable}</p>
                  )}
                </div>

                {/* Statut */}
                <div>
                  <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <select
                    name="statut"
                    id="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="pending">En attente</option>
                  </select>
                </div>
              </div>

              {/* Section des bureaux supplémentaires */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium text-gray-700">Bureaux supplémentaires</h4>
                  <button
                    type="button"
                    onClick={() => setShowBureauForm(true)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
                  >
                    + Ajouter un bureau
                  </button>
                </div>
                
                {/* Liste des bureaux ajoutés */}
                {additionalBureaux.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {additionalBureaux.map((bureau, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{bureau.nom}</p>
                          <p className="text-sm text-gray-500">{bureau.adresse}, {bureau.ville}, {bureau.code_postal}</p>
                          <p className="text-sm text-gray-500">{bureau.telephone}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBureau(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">Aucun bureau supplémentaire. Le bureau principal sera créé automatiquement.</p>
                )}
                
                {/* Formulaire d'ajout de bureau */}
                {showBureauForm && (
                  <div className="border border-gray-300 rounded-md p-4 mb-4 bg-gray-50">
                    <h5 className="text-md font-medium text-gray-700 mb-3">Ajouter un nouveau bureau</h5>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Nom du bureau */}
                      <div>
                        <label htmlFor="bureau-nom" className="block text-sm font-medium text-gray-700">
                          Nom du bureau *
                        </label>
                        <input
                          type="text"
                          name="nom"
                          id="bureau-nom"
                          value={currentBureau.nom}
                          onChange={handleBureauChange}
                          className={`mt-1 block w-full border ${bureauErrors.nom ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {bureauErrors.nom && (
                          <p className="mt-1 text-sm text-red-600">{bureauErrors.nom}</p>
                        )}
                      </div>

                      {/* Adresse du bureau */}
                      <div>
                        <label htmlFor="bureau-adresse" className="block text-sm font-medium text-gray-700">
                          Adresse *
                        </label>
                        <input
                          type="text"
                          name="adresse"
                          id="bureau-adresse"
                          value={currentBureau.adresse}
                          onChange={handleBureauChange}
                          className={`mt-1 block w-full border ${bureauErrors.adresse ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {bureauErrors.adresse && (
                          <p className="mt-1 text-sm text-red-600">{bureauErrors.adresse}</p>
                        )}
                      </div>

                      {/* Ville et Code postal du bureau */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="bureau-ville" className="block text-sm font-medium text-gray-700">
                            Ville *
                          </label>
                          <input
                            type="text"
                            name="ville"
                            id="bureau-ville"
                            value={currentBureau.ville}
                            onChange={handleBureauChange}
                            className={`mt-1 block w-full border ${bureauErrors.ville ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          {bureauErrors.ville && (
                            <p className="mt-1 text-sm text-red-600">{bureauErrors.ville}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="bureau-code_postal" className="block text-sm font-medium text-gray-700">
                            Code postal *
                          </label>
                          <input
                            type="text"
                            name="code_postal"
                            id="bureau-code_postal"
                            value={currentBureau.code_postal}
                            onChange={handleBureauChange}
                            className={`mt-1 block w-full border ${bureauErrors.code_postal ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          {bureauErrors.code_postal && (
                            <p className="mt-1 text-sm text-red-600">{bureauErrors.code_postal}</p>
                          )}
                        </div>
                      </div>

                      {/* Téléphone et Email du bureau */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="bureau-telephone" className="block text-sm font-medium text-gray-700">
                            Téléphone *
                          </label>
                          <input
                            type="tel"
                            name="telephone"
                            id="bureau-telephone"
                            value={currentBureau.telephone}
                            onChange={handleBureauChange}
                            className={`mt-1 block w-full border ${bureauErrors.telephone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          {bureauErrors.telephone && (
                            <p className="mt-1 text-sm text-red-600">{bureauErrors.telephone}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="bureau-email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="bureau-email"
                            value={currentBureau.email}
                            onChange={handleBureauChange}
                            className={`mt-1 block w-full border ${bureauErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          />
                          {bureauErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{bureauErrors.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowBureauForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={addBureau}
                        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex items-center">
                <FiAlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                <p className="text-sm text-gray-500">
                  Les champs marqués d'un astérisque (*) sont obligatoires.
                </p>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
