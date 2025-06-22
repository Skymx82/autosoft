'use client';

import React from 'react';
import { useFormContext } from '../context/FormContext';
import { ETAPES_MAJEUR, ETAPES_MINEUR } from '../index';

interface StepButtonsProps {
  onValidateStep?: () => boolean; // Fonction optionnelle pour valider l'étape actuelle
  isLastStep?: boolean; // Indique si c'est la dernière étape
  onSubmit?: () => void; // Fonction pour soumettre le formulaire
  currentStep?: number; // Étape actuelle
  onNextStep?: () => void; // Fonction personnalisée pour passer à l'étape suivante
  onPrevStep?: () => void; // Fonction personnalisée pour revenir à l'étape précédente
}

export default function StepButtons({ 
  onValidateStep, 
  isLastStep = false,
  onSubmit,
  currentStep: propCurrentStep,
  onNextStep,
  onPrevStep
}: StepButtonsProps) {
  const { formState, nextStep: contextNextStep, prevStep: contextPrevStep } = useFormContext();
  const { currentStep: contextCurrentStep, typeInscription } = formState;
  
  // Utiliser les valeurs des props si fournies, sinon utiliser les valeurs du contexte
  const currentStep = propCurrentStep !== undefined ? propCurrentStep : contextCurrentStep;
  
  // Utiliser les étapes appropriées en fonction du type d'inscription
  const etapes = typeInscription === 'majeur' ? ETAPES_MAJEUR : ETAPES_MINEUR;
  
  // Vérifier si c'est la dernière étape
  const isActuallyLastStep = isLastStep || currentStep === etapes.length;
  
  const handleNext = async () => {
    try {
      // Si une fonction de validation est fournie, on l'exécute
      const isValid = onValidateStep ? onValidateStep() : true;
      
      if (!isValid) {
        console.error('La validation de l\'étape a échoué');
        return; // Si la validation échoue, on ne passe pas à l'étape suivante
      }
      
      if (isActuallyLastStep && onSubmit) {
        await onSubmit();
      } else if (onNextStep) {
        await onNextStep();
      } else {
        contextNextStep();
      }
    } catch (error) {
      console.error('Erreur lors du passage à l\'étape suivante:', error);
    }
  };
  
  const handlePrev = () => {
    if (onPrevStep) {
      onPrevStep();
    } else {
      contextPrevStep();
    }
  };
  
  return (
    <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={handlePrev}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          currentStep === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
        disabled={currentStep === 1}
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Précédent
        </div>
      </button>
      
      <button
        type="button"
        onClick={handleNext}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
      >
        <div className="flex items-center">
          {isActuallyLastStep ? (
            <>
              Terminer
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          ) : (
            <>
              Suivant
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
