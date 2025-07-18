'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../context/FormContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { CheckboxField } from '../FormFields';

export default function Step6Recapitulatif() {
  const { formState, updateField } = useFormContext();
  const { validateAllSteps } = useFormValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    errors: Record<string, string>;
  }>({ isValid: false, errors: {} });
  
  // Référence pour suivre la dernière validation
  const lastValidationRef = React.useRef<{
    formState: any;
    result: { isValid: boolean; errors: Record<string, string> };
    timestamp: number;
  } | null>(null);

  // Valider le formulaire de manière optimisée
  React.useEffect(() => {
    let isMounted = true;
    let needsValidation = true;
    const now = Date.now();

    // Vérifier si on peut réutiliser la dernière validation
    if (lastValidationRef.current) {
      const { formState: lastState, result, timestamp } = lastValidationRef.current;
      
      // Vérifier si le formulaire a changé depuis la dernière validation
      const formStateChanged = JSON.stringify({
        typeInscription: formState.typeInscription,
        typeFinanceur: formState.typeFinanceur,
        documents: formState.documents?.length,
        // Autres champs importants pour la validation
      }) !== JSON.stringify({
        typeInscription: lastState.typeInscription,
        typeFinanceur: lastState.typeFinanceur,
        documents: lastState.documents?.length,
      });

      // Réutiliser le résultat si la validation est récente et que rien n'a changé
      if (!formStateChanged && now - timestamp < 1000) {
        needsValidation = false;
        if (isMounted) {
          setValidationState(result);
        }
      }
    }

    // Si nécessaire, effectuer une nouvelle validation
    if (needsValidation) {
      const timeoutId = setTimeout(async () => {
        try {
          const result = await validateAllSteps();
          
          if (isMounted) {
            lastValidationRef.current = {
              formState: { ...formState },
              result,
              timestamp: Date.now()
            };
            
            setValidationState({
              isValid: result.isValid,
              errors: result.errors || {}
            });
          }
        } catch (error) {
          console.error('Erreur lors de la validation du formulaire:', error);
          if (isMounted) {
            setValidationState({
              isValid: false,
              errors: { global: 'Erreur lors de la validation' }
            });
          }
        }
      }, 100); // Réduit le délai pour une meilleure réactivité

      return () => clearTimeout(timeoutId);
    }

    return () => {
      isMounted = false;
    };
  }, [formState, validateAllSteps]);
  
  const { isValid, errors } = validationState;
  
  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Utiliser la validation en cache si elle est récente, sinon en faire une nouvelle
      const now = Date.now();
      let validationResult;
      
      if (lastValidationRef.current && now - lastValidationRef.current.timestamp < 2000) {
        validationResult = lastValidationRef.current.result;
      } else {
        validationResult = await validateAllSteps();
        lastValidationRef.current = {
          formState: { ...formState },
          result: validationResult,
          timestamp: now
        };
      }
      
      if (!validationResult.isValid) {
        console.error('Erreurs de validation:', validationResult.errors);
        setValidationState({
          isValid: false,
          errors: validationResult.errors || {}
        });
        setSubmitError('Veuillez corriger les erreurs avant de soumettre.');
        return;
      }
      
      // Afficher les données qui seraient envoyées en production
      console.log('Données du formulaire à soumettre:', formState);
      
      // Simuler un délai d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En production, vous enverriez les données à votre API ici
      // Exemple :
      // const response = await fetch('/api/eleves/inscription', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formState)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Échec de la soumission du formulaire');
      // }
      
      // En production, vous pourriez utiliser un système de notification plus élégant
      alert('Inscription enregistrée avec succès !');
      
      // Réinitialiser le formulaire ou rediriger l'utilisateur
      // resetForm();
      
      // Nettoyer le cache de validation
      lastValidationRef.current = null;
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Récapitulatif de l'inscription</h2>
      
      {!isValid && (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
          <h3 className="text-yellow-800 font-medium mb-2">Attention</h3>
          <p className="text-yellow-700">
            Certaines informations sont manquantes ou incorrectes. Veuillez revenir aux étapes précédentes pour les corriger.
          </p>
          <ul className="list-disc list-inside mt-2 text-yellow-700">
            {Object.entries(errors).map(([field, error]) => {
              return error ? <li key={field}>{error}</li> : null;
            })}
          </ul>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        {/* Section 1: Informations de base */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-800 mb-4 pb-2 border-b">
            1. Informations de base
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Type d'inscription</p>
              <p className="text-gray-900">
                {formState.typeInscription === 'mineur' ? 'Mineur' : 'Majeur'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Nom complet</p>
              <p className="text-gray-900">
                {formState.nom} {formState.nomDeux} {formState.nomTrois}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Prénom(s)</p>
              <p className="text-gray-900">
                {formState.prenom} {formState.prenomDeux} {formState.prenomTrois}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Date de naissance</p>
              <p className="text-gray-900">{formatDate(formState.dateNaissance)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Genre</p>
              <p className="text-gray-900">
                {formState.genre === 'masculin' ? 'Masculin' : 'Féminin'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Lieu de naissance</p>
              <p className="text-gray-900">
                {formState.villeNaissance}, {formState.departementNaissance}, {formState.paysNaissance}
              </p>
            </div>
          </div>
        </div>
        
        {/* Section 2: Coordonnées */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-800 mb-4 pb-2 border-b">
            2. Coordonnées
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{formState.email}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Téléphone</p>
              <p className="text-gray-900">{formState.telephone}</p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500">Adresse</p>
              <p className="text-gray-900">
                {formState.adresse}, {formState.codePostal} {formState.ville}, {formState.pays}
              </p>
            </div>
            
            {formState.neph && (
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro NEPH</p>
                <p className="text-gray-900">{formState.neph}</p>
              </div>
            )}
            
            {formState.profession && (
              <div>
                <p className="text-sm font-medium text-gray-500">Profession</p>
                <p className="text-gray-900">{formState.profession}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Section 3: Informations permis */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-800 mb-4 pb-2 border-b">
            3. Informations permis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Catégorie de permis</p>
              <p className="text-gray-900">{formState.categoriePermis}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Forfait choisi</p>
              <p className="text-gray-900">{formState.idForfait}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Type de financement</p>
              <p className="text-gray-900">{formState.typeFinanceur}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Options</p>
              <ul className="list-disc list-inside text-gray-900">
                {formState.interesseCode && <li>Formation au code de la route</li>}
                {formState.serviceNational && <li>Service national effectué</li>}
                {formState.journeeDefense && <li>Journée défense et citoyenneté effectuée</li>}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Section 4: Représentant légal (si mineur) */}
        {formState.typeInscription === 'mineur' && formState.representantLegal && (
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-800 mb-4 pb-2 border-b">
              4. Représentant légal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Lien de parenté</p>
                <p className="text-gray-900">{formState.representantLegal.lienParente}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Nom et prénom</p>
                <p className="text-gray-900">
                  {formState.representantLegal.nom} {formState.representantLegal.prenom}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Contact</p>
                <p className="text-gray-900">
                  {formState.representantLegal.email} - {formState.representantLegal.telephone}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Adresse</p>
                <p className="text-gray-900">
                  {formState.representantLegal.adresse}, {formState.representantLegal.codePostal} {formState.representantLegal.ville}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Section 5: Documents */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-800 mb-4 pb-2 border-b">
            5. Documents fournis
          </h3>
          
          {formState.documents.length > 0 ? (
            <ul className="list-disc list-inside">
              {formState.documents.map((doc, index) => (
                <li key={index} className="text-gray-900">
                  {doc.type} - {doc.status === 'uploaded' ? 'Téléchargé' : doc.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-yellow-600">Aucun document n'a été téléchargé.</p>
          )}
        </div>
        
        {/* Conditions générales et consentement */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-800 mb-4 pb-2 border-b">
            Consentement
          </h3>
          
          <div className="space-y-4">
            <CheckboxField
              id="acceptCGU"
              label="J'accepte les conditions générales d'utilisation"
            />
            
            <CheckboxField
              id="acceptRGPD"
              label="J'accepte que mes données personnelles soient traitées conformément à la politique de confidentialité"
            />
          </div>
        </div>
        
        {/* Bouton de soumission */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting || !formState.acceptCGU || !formState.acceptRGPD}
            className={`w-full py-3 px-4 rounded-md font-medium text-white ${
              !isValid || isSubmitting || !formState.acceptCGU || !formState.acceptRGPD
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Enregistrement en cours...' : 'Finaliser l\'inscription'}
          </button>
          
          {submitError && (
            <p className="mt-2 text-sm text-red-600">{submitError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
