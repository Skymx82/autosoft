'use client';

import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { InputField } from '../FormFields';

export default function Step2Coordonnees() {
  const { formState } = useFormContext();
  const { validateField } = useFormValidation();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Coordonnées</h2>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        {/* Contact */}
        <h3 className="text-md font-medium text-gray-800 mb-4">Informations de contact</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InputField
            id="email"
            label="Adresse email"
            type="email"
            required
            autoComplete="email"
            placeholder="exemple@email.com"
          />
          <InputField
            id="telephone"
            label="Numéro de téléphone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="06 12 34 56 78"
          />
        </div>

        {/* Adresse */}
        <h3 className="text-md font-medium text-gray-800 mb-4">Adresse</h3>
        
        <div className="mb-4">
          <InputField
            id="adresse"
            label="Adresse"
            required
            autoComplete="street-address"
            placeholder="Numéro et nom de rue"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <InputField
            id="codePostal"
            label="Code postal"
            required
            autoComplete="postal-code"
            placeholder="75000"
          />
          <div className="md:col-span-2">
            <InputField
              id="ville"
              label="Ville"
              required
              autoComplete="address-level2"
              placeholder="Paris"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <InputField
            id="pays"
            label="Pays"
            required
            autoComplete="country-name"
            placeholder="France"
          />
        </div>

        {/* Informations complémentaires */}
        <h3 className="text-md font-medium text-gray-800 mb-4">Informations complémentaires</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="neph"
            label="Numéro NEPH"
            helpText="Numéro d'Enregistrement Préfectoral Harmonisé"
            placeholder="12345678901"
          />
          <InputField
            id="profession"
            label="Profession"
            placeholder="Étudiant, Employé, etc."
          />
        </div>
      </div>
    </div>
  );
}
