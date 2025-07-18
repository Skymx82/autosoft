'use client';

import { useState } from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { useFormValidation } from './hooks/useFormValidation';
import StepNavigation from './components/StepNavigation';
import StepButtons from './components/StepButtons';
import Step1InformationsBase from './components/Steps/Step1InformationsBase';
import Step2Coordonnees from './components/Steps/Step2Coordonnees';
import Step3Permis from './components/Steps/Step3Permis';
import Step4RepresentantLegal from './components/Steps/Step4RepresentantLegal';
import Step5Documents from './components/Steps/Step5Documents';
import Step6Recapitulatif from './components/Steps/Step6Recapitulatif';

// Définition des étapes pour les majeurs et les mineurs
export const ETAPES_MAJEUR = [
  { id: 1, title: 'Informations de base', description: 'Identité et informations personnelles', component: Step1InformationsBase },
  { id: 2, title: 'Coordonnées', description: 'Contact et adresse', component: Step2Coordonnees },
  { id: 3, title: 'Permis', description: 'Informations sur le permis', component: Step3Permis },
  { id: 4, title: 'Documents', description: 'Téléchargement des documents requis', component: Step5Documents },
  { id: 5, title: 'Récapitulatif', description: 'Vérification et validation', component: Step6Recapitulatif }
];

export const ETAPES_MINEUR = [
  { id: 1, title: 'Informations de base', description: 'Identité et informations personnelles', component: Step1InformationsBase },
  { id: 2, title: 'Coordonnées', description: 'Contact et adresse', component: Step2Coordonnees },
  { id: 3, title: 'Permis', description: 'Informations sur le permis', component: Step3Permis },
  { id: 4, title: 'Représentant légal', description: 'Informations sur le représentant légal', component: Step4RepresentantLegal },
  { id: 5, title: 'Documents', description: 'Téléchargement des documents requis', component: Step5Documents },
  { id: 6, title: 'Récapitulatif', description: 'Vérification et validation', component: Step6Recapitulatif }
];

// Composant qui contient le contenu des étapes du formulaire
function FormContent() {
  const { formState, nextStep, prevStep } = useFormContext();
  const { currentStep, typeInscription } = formState;
  
  // Déterminer les étapes en fonction du type d'inscription
  const etapes = typeInscription === 'majeur' ? ETAPES_MAJEUR : ETAPES_MINEUR;
  
  // Trouver l'étape actuelle
  const etapeActuelle = etapes.find(etape => etape.id === currentStep) || etapes[0];
  
  // Afficher le composant de l'étape actuelle
  const renderStep = () => {
    const Component = etapeActuelle.component;
    return <Component />;
  };
  
  // Fonction de validation d'étape
  const { validateStep } = useFormValidation();
  
  // Fonction de soumission du formulaire
  const handleSubmit = () => {
    console.log('Formulaire soumis avec les données:', formState);
    // Logique de soumission à implémenter
  };
  
  // Vérifier si c'est la dernière étape
  const isLastStep = etapeActuelle.id === etapes[etapes.length - 1].id;
  
  return (
    <div>
      {/* Contenu de l'étape actuelle */}
      {renderStep()}
      
      {/* Boutons de navigation */}
      <div className="mt-8">
        <StepButtons
          currentStep={currentStep}
          isLastStep={isLastStep}
          onValidateStep={() => validateStep(currentStep)}
          onSubmit={handleSubmit}
          onNextStep={nextStep}
          onPrevStep={prevStep}
        />
      </div>
    </div>
  );
}

// Composant principal
export default function EleveAjout({ onClose }: { onClose?: () => void }) {
  return (
    <FormProvider>
      <div className="bg-white p-6 max-w-4xl mx-auto">
        {/* Navigation entre les étapes */}
        <StepNavigation onClose={onClose} />
        
        {/* Contenu du formulaire */}
        <FormContent />
      </div>
    </FormProvider>
  );
}
