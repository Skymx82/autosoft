import { useCallback, useMemo } from 'react';
import { useFormContext } from '../context/FormContext';
import { validateCurrentStep, isStepValid, isFormValid } from '../utils/validationRules';

// Cache pour stocker les résultats de validation
const validationCache = new Map<string, { timestamp: number; result: any }>();
const CACHE_DURATION = 1000; // 1 seconde de cache

// Fonction pour générer une clé de cache basée sur le state
const getCacheKey = (formState: any, step?: number) => {
  const keyParts = [JSON.stringify({
    // Inclure uniquement les champs pertinents pour la validation
    typeInscription: formState.typeInscription,
    typeFinanceur: formState.typeFinanceur,
    documents: formState.documents?.length,
    // Ajouter d'autres champs si nécessaire
  })];
  
  if (step !== undefined) {
    keyParts.push(`step:${step}`);
  }
  
  return keyParts.join('|');
};

export const useFormValidation = () => {
  const { formState, setErrors } = useFormContext();
  
  // Invalider le cache lorsque le formulaire change
  const formStateKey = useMemo(() => getCacheKey(formState), [formState]);
  
  // Valider l'étape actuelle et mettre à jour les erreurs
  const validateStep = useCallback((step: number) => {
    const cacheKey = `${formStateKey}|step:${step}`;
    const cached = validationCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setErrors(cached.result);
      return Object.keys(cached.result).length === 0;
    }
    
    const errors = validateCurrentStep(step, formState);
    validationCache.set(cacheKey, { timestamp: Date.now(), result: errors });
    setErrors(errors);
    
    return Object.keys(errors).length === 0;
  }, [formState, formStateKey, setErrors]);
  
  // Vérifier si une étape est valide sans mettre à jour les erreurs
  const checkStepValidity = useCallback((step: number) => {
    return isStepValid(step, formState);
  }, [formState]);
  
  // Vérifier si le formulaire entier est valide
  const checkFormValidity = useCallback(() => {
    return isFormValid(formState);
  }, [formState]);
  
  // Valider toutes les étapes et retourner les erreurs
  const validateAllSteps = useCallback(() => {
    const cacheKey = `${formStateKey}|all`;
    const cached = validationCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setErrors(cached.result);
      return {
        isValid: Object.keys(cached.result).length === 0,
        errors: cached.result
      };
    }
    
    let allErrors: Record<string, string> = {};
    
    // Valider chaque étape
    for (let step = 1; step <= 6; step++) {
      const stepErrors = validateCurrentStep(step, formState);
      allErrors = { ...allErrors, ...stepErrors };
    }
    
    validationCache.set(cacheKey, { timestamp: Date.now(), result: allErrors });
    setErrors(allErrors);
    
    return {
      isValid: Object.keys(allErrors).length === 0,
      errors: allErrors
    };
  }, [formState, formStateKey, setErrors]);
  
  // Valider un champ spécifique
  const validateField = useCallback((field: string, step: number) => {
    const errors = validateCurrentStep(step, formState);
    
    if (errors[field]) {
      setErrors({ ...formState.errors, [field]: errors[field] });
      return false;
    } else {
      // Si le champ n'a plus d'erreur, on la supprime
      const newErrors = { ...formState.errors };
      delete newErrors[field];
      setErrors(newErrors);
      return true;
    }
  }, [formState, setErrors]);
  
  // Effacer toutes les erreurs
  const clearErrors = useCallback(() => {
    validationCache.clear();
    setErrors({});
  }, [setErrors]);
  
  return useMemo(() => ({
    validateStep,
    checkStepValidity,
    checkFormValidity,
    validateField,
    validateAllSteps,
    clearErrors,
    errors: formState.errors
  }), [
    validateStep,
    checkStepValidity,
    checkFormValidity,
    validateField,
    validateAllSteps,
    clearErrors,
    formState.errors
  ]);
};

export default useFormValidation;
