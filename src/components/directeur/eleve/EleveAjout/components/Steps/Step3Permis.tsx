'use client';

import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { 
  SelectField, 
  CheckboxField,
  RadioGroupField
} from '../FormFields';

export default function Step3Permis() {
  const { formState } = useFormContext();
  const { validateField } = useFormValidation();

  // Options pour les catégories de permis
  const categoriesPermisOptions = [
    { value: 'B', label: 'Permis B - Voiture' },
    { value: 'A', label: 'Permis A - Moto' },
    { value: 'A1', label: 'Permis A1 - Moto légère' },
    { value: 'A2', label: 'Permis A2 - Moto intermédiaire' },
    { value: 'AM', label: 'Permis AM - Cyclomoteur' },
    { value: 'C', label: 'Permis C - Poids lourd' },
    { value: 'D', label: 'Permis D - Transport en commun' },
    { value: 'BE', label: 'Permis BE - Voiture + remorque' }
  ];

  // Options pour les forfaits (à remplacer par des données réelles)
  const forfaitOptions = [
    { value: '1', label: 'Forfait standard - 20h' },
    { value: '2', label: 'Forfait accéléré - 30h' },
    { value: '3', label: 'Forfait intensif - 40h' },
    { value: '4', label: 'Forfait code uniquement' }
  ];

  // Options pour les types de financeurs
  const financeurOptions = [
    { value: 'personnel', label: 'Financement personnel' },
    { value: 'cpf', label: 'CPF (Compte Personnel de Formation)' },
    { value: 'pole_emploi', label: 'Pôle Emploi' },
    { value: 'entreprise', label: 'Entreprise' },
    { value: 'autre', label: 'Autre' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Informations permis</h2>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        {/* Catégorie de permis */}
        <div className="mb-6">
          <SelectField
            id="categoriePermis"
            label="Catégorie de permis"
            options={categoriesPermisOptions}
            required
            placeholder="Sélectionnez une catégorie"
          />
        </div>

        {/* Options supplémentaires */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-800 mb-3">Options</h3>
          
          <div className="space-y-3">
            <CheckboxField
              id="interesseCode"
              label="Intéressé(e) par la formation au code de la route"
            />
          </div>
        </div>

        {/* Service national et journée défense */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-800 mb-3">Obligations nationales</h3>
          
          <div className="space-y-3">
            <CheckboxField
              id="serviceNational"
              label="J'ai effectué mon service national"
            />
            <CheckboxField
              id="journeeDefense"
              label="J'ai participé à la journée défense et citoyenneté (JDC)"
            />
          </div>
        </div>

        {/* Forfait */}
        <div className="mb-6">
          <SelectField
            id="idForfait"
            label="Forfait choisi"
            options={forfaitOptions}
            required
            placeholder="Sélectionnez un forfait"
          />
        </div>

        {/* Type de financeur */}
        <div className="mb-6">
          <SelectField
            id="typeFinanceur"
            label="Type de financement"
            options={financeurOptions}
            required
            placeholder="Sélectionnez un type de financement"
          />
        </div>
      </div>
    </div>
  );
}
