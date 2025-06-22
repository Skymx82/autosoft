'use client';

import React, { useEffect } from 'react';
import { useFormContext } from '../../context/FormContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { 
  InputField, 
  RadioGroupField,
  SelectField
} from '../FormFields';
import { RepresentantLegal } from '../../context/FormContext';

export default function Step4RepresentantLegal() {
  const { formState, updateField, updateMultipleFields } = useFormContext();
  const { validateField } = useFormValidation();
  const { typeInscription, representantLegal } = formState;

  // Si l'élève est majeur, cette étape ne devrait pas être accessible
  if (typeInscription === 'majeur') {
    return (
      <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-700 font-medium">
          Cette étape n'est pas requise pour les élèves majeurs.
        </p>
      </div>
    );
  }

  // Initialiser le représentant légal si nécessaire
  useEffect(() => {
    if (!representantLegal && typeInscription === 'mineur') {
      updateField('representantLegal', {
        nom: '',
        nomDeux: '',
        prenom: '',
        prenomDeux: '',
        dateNaissance: '',
        genre: '',
        telephone: '',
        email: '',
        adresse: '',
        codePostal: '',
        ville: '',
        pays: '',
        lienParente: ''
      });
    }
  }, [typeInscription, representantLegal, updateField]);

  // Options pour le genre
  const genreOptions = [
    { value: 'masculin', label: 'Masculin' },
    { value: 'feminin', label: 'Féminin' }
  ];

  // Options pour le lien de parenté
  const lienParenteOptions = [
    { value: 'pere', label: 'Père' },
    { value: 'mere', label: 'Mère' },
    { value: 'tuteur', label: 'Tuteur légal' },
    { value: 'autre', label: 'Autre' }
  ];

  // Fonction pour mettre à jour les champs du représentant légal
  const handleRepresentantChange = (field: keyof RepresentantLegal, value: any) => {
    if (!representantLegal) return;
    
    const updatedRepresentant = {
      ...representantLegal,
      [field]: value
    };
    
    updateField('representantLegal', updatedRepresentant);
  };

  // Si le représentant légal n'est pas encore initialisé
  if (!representantLegal) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Représentant légal</h2>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        {/* Lien de parenté */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lien de parenté <span className="text-red-500">*</span>
          </label>
          <select
            value={representantLegal.lienParente}
            onChange={(e) => handleRepresentantChange('lienParente', e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
            required
          >
            <option value="" disabled>Sélectionnez le lien de parenté</option>
            {lienParenteOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Nom et prénom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={representantLegal.nom}
              onChange={(e) => handleRepresentantChange('nom', e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={representantLegal.prenom}
              onChange={(e) => handleRepresentantChange('prenom', e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Noms et prénoms additionnels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deuxième nom (optionnel)
            </label>
            <input
              type="text"
              value={representantLegal.nomDeux}
              onChange={(e) => handleRepresentantChange('nomDeux', e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deuxième prénom (optionnel)
            </label>
            <input
              type="text"
              value={representantLegal.prenomDeux}
              onChange={(e) => handleRepresentantChange('prenomDeux', e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Date de naissance et genre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de naissance <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={representantLegal.dateNaissance}
              onChange={(e) => handleRepresentantChange('dateNaissance', e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-4 mt-2">
              {genreOptions.map((option) => (
                <label key={option.value} className="inline-flex items-center">
                  <input
                    type="radio"
                    value={option.value}
                    checked={representantLegal.genre === option.value}
                    onChange={() => handleRepresentantChange('genre', option.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <h3 className="text-md font-medium text-gray-800 mb-4">Informations de contact</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={representantLegal.email}
              onChange={(e) => handleRepresentantChange('email', e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={representantLegal.telephone}
              onChange={(e) => handleRepresentantChange('telephone', e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Adresse */}
        <h3 className="text-md font-medium text-gray-800 mb-4">Adresse</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={representantLegal.adresse}
            onChange={(e) => handleRepresentantChange('adresse', e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code postal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={representantLegal.codePostal}
              onChange={(e) => handleRepresentantChange('codePostal', e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={representantLegal.ville}
              onChange={(e) => handleRepresentantChange('ville', e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pays <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={representantLegal.pays}
            onChange={(e) => handleRepresentantChange('pays', e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
}
