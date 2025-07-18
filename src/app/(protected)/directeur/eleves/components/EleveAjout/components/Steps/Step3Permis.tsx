'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../context/FormContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { 
  SelectField, 
  CheckboxField,
  RadioGroupField
} from '../FormFields';
import { fetchForfaitsByTypePermis, Forfait } from '../../../../../mon-auto-ecole/api/ApiForfaits';

export default function Step3Permis() {
  const { formState, updateMultipleFields } = useFormContext();
  const { validateField } = useFormValidation();
  const [forfaits, setForfaits] = useState<Forfait[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Charger les forfaits lorsque le type de permis change
  useEffect(() => {
    const typePermis = formState.categoriePermis;
    if (typePermis) {
      loadForfaits(typePermis);
    }
  }, [formState.categoriePermis]);

  // Fonction pour charger les forfaits en fonction du type de permis
  const loadForfaits = async (typePermis: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchForfaitsByTypePermis(typePermis);
      setForfaits(data);
      
      // Réinitialiser le forfait sélectionné si le type de permis change
      if (formState.idForfait) {
        const forfaitExists = data.some(f => f.id_forfait.toString() === formState.idForfait);
        if (!forfaitExists) {
          updateMultipleFields({ idForfait: '' });
        }
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des forfaits:', err);
      setError('Impossible de charger les forfaits pour ce type de permis');
    } finally {
      setLoading(false);
    }
  };

  // Convertir les forfaits en options pour le select
  const forfaitOptions = forfaits.map(forfait => ({
    value: forfait.id_forfait.toString(),
    label: `${forfait.nom} - ${forfait.nb_heures_incluses}h - ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(forfait.tarif_base)}`
  }));

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
            placeholder={loading ? "Chargement des forfaits..." : "Sélectionnez un forfait"}
            disabled={loading || forfaitOptions.length === 0}
          />
          {error && (
            <div className="mt-2 text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && forfaitOptions.length === 0 && formState.categoriePermis && (
            <div className="mt-2 text-sm text-amber-600">
              Aucun forfait disponible pour ce type de permis. Veuillez contacter l'administration.
            </div>
          )}
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
