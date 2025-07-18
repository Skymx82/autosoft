'use client';

import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { 
  InputField, 
  SelectField, 
  RadioGroupField 
} from '../FormFields';

export default function Step1InformationsBase() {
  const { formState } = useFormContext();
  const { validateField } = useFormValidation();



  // Options pour le genre
  const genreOptions = [
    { value: 'masculin', label: 'Masculin' },
    { value: 'feminin', label: 'Féminin' }
  ];

  // Options pour le type d'inscription
  const typeInscriptionOptions = [
    { value: 'majeur', label: 'Majeure ou Mineur émancipée' },
    { value: 'mineur', label: 'Mineur' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Informations de base</h2>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        {/* Type d'inscription */}
        <div className="mb-6">
          <RadioGroupField
            id="typeInscription"
            label="Type d'inscription"
            options={typeInscriptionOptions}
            required
            inline
          />
        </div>



        {/* Nom et prénom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InputField
            id="nom"
            label="Nom"
            required
            autoComplete="family-name"
          />
          <InputField
            id="prenom"
            label="Prénom"
            required
            autoComplete="given-name"
          />
        </div>

        {/* Noms et prénoms additionnels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InputField
            id="nomDeux"
            label="Deuxième nom (optionnel)"
            autoComplete="family-name"
          />
          <InputField
            id="prenomDeux"
            label="Deuxième prénom (optionnel)"
            autoComplete="additional-name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InputField
            id="nomTrois"
            label="Troisième nom (optionnel)"
            autoComplete="family-name"
          />
          <InputField
            id="prenomTrois"
            label="Troisième prénom (optionnel)"
            autoComplete="additional-name"
          />
        </div>

        {/* Date de naissance et genre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InputField
            id="dateNaissance"
            label="Date de naissance"
            type="date"
            required
            autoComplete="bday"
          />
          <RadioGroupField
            id="genre"
            label="Genre"
            options={genreOptions}
            required
            inline
          />
        </div>

        {/* Lieu de naissance */}
        <div className="mb-6">
          <InputField
            id="paysNaissance"
            label="Pays de naissance"
            required
            autoComplete="country"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="departementNaissance"
            label="Département de naissance"
            required
            helpText="Numéro ou nom du département"
          />
          <InputField
            id="villeNaissance"
            label="Ville de naissance"
            required
            autoComplete="address-level2"
          />
        </div>
      </div>
    </div>
  );
}
