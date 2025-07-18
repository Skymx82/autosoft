'use client';

import React from 'react';
import { useFormContext } from '../context/FormContext';
import { useFormValidation } from '../hooks/useFormValidation';
import { ETAPES_MAJEUR, ETAPES_MINEUR } from '../index';

interface StepNavigationProps {
  onClose?: () => void;
}

export default function StepNavigation({ onClose }: StepNavigationProps) {
  const { formState, setStep } = useFormContext();
  const { currentStep, typeInscription } = formState;
  const { validateStep, checkStepValidity } = useFormValidation();
  
  // Utiliser les étapes appropriées en fonction du type d'inscription
  const etapes = typeInscription === 'majeur' ? ETAPES_MAJEUR : ETAPES_MINEUR;
  
  // Calculer le pourcentage de progression
  const progressPercentage = ((currentStep - 1) / (etapes.length - 1)) * 100;
  
  return (
    <div className="mb-8">
      {/* Header avec bouton de fermeture */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {etapes.find(step => step.id === currentStep)?.title}
        </h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Barre de progression interactive */}
      <div className="relative mb-6">
        {/* Ligne de progression (en arrière-plan) */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" style={{ transform: 'translateY(-50%)' }}></div>
        <div 
          className="absolute top-4 left-0 h-0.5 bg-blue-500" 
          style={{ 
            transform: 'translateY(-50%)', 
            width: `${progressPercentage}%`,
            transition: 'width 0.3s ease-in-out'
          }}
        ></div>
        
        {/* Points d'étape */}
        <div className="flex justify-between mb-1 relative z-10">
          {etapes.map((step) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center"
              style={{ width: `${100 / etapes.length}%` }}
            >
              <button
                onClick={async () => {
                  try {
                    // Si on va à une étape précédente, pas besoin de valider
                    if (step.id < currentStep) {
                      setStep(step.id);
                      return;
                    } 
                    
                    // Si on est sur l'étape actuelle, rien à faire
                    if (step.id === currentStep) {
                      return;
                    }
                    
                    // Si on va à une étape suivante, valider l'étape actuelle d'abord
                    if (step.id === currentStep + 1) {
                      const isValid = await validateStep(currentStep);
                      if (isValid) {
                        setStep(step.id);
                      }
                      return;
                    }
                    
                    // Pour les étapes plus lointaines, vérifier que toutes les étapes intermédiaires sont valides
                    let canProceed = true;
                    for (let i = currentStep; i < step.id; i++) {
                      if (!checkStepValidity(i)) {
                        canProceed = false;
                        break;
                      }
                    }
                    
                    if (canProceed) {
                      setStep(step.id);
                    }
                  } catch (error) {
                    console.error('Erreur lors du changement d\'étape:', error);
                  }
                }}
                disabled={step.id > currentStep && !checkStepValidity(currentStep)}
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-200 ${step.id === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : step.id < currentStep 
                  ? 'bg-blue-200 text-blue-800 hover:bg-blue-300' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                aria-label={`Aller à l'étape ${step.id}`}
              >
                {step.id}
              </button>
              <span className={`text-xs font-medium ${step.id === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.title.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicateur d'étape actuelle */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-blue-600">
          Étape {currentStep} sur {etapes.length}
        </span>
        <span className="text-sm font-medium text-gray-500">
          {Math.round(progressPercentage)}% complété
        </span>
      </div>
    </div>
  );
}
