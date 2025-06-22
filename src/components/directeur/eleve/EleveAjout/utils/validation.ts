import { FormState } from '../context/FormContext';

// Types d'erreurs possibles
export type ValidationError = string;
export type ValidationResult = { [key: string]: ValidationError };

// Interface pour les règles de validation
export interface ValidationRule {
  field: string;
  validate: (value: any, formState: FormState) => ValidationError | null;
}

// Fonctions de validation réutilisables
export const isRequired = (value: any): ValidationError | null => {
  if (value === undefined || value === null || value === '') {
    return 'Ce champ est obligatoire';
  }
  return null;
};

export const isEmail = (value: string): ValidationError | null => {
  if (!value) return null; // Ne pas valider si vide (utiliser isRequired pour ça)
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(value)) {
    return 'Adresse email invalide';
  }
  return null;
};

export const isPhone = (value: string): ValidationError | null => {
  if (!value) return null;
  
  // Format français: +33 X XX XX XX XX ou 0X XX XX XX XX
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  if (!phoneRegex.test(value)) {
    return 'Numéro de téléphone invalide';
  }
  return null;
};

export const isDate = (value: string): ValidationError | null => {
  if (!value) return null;
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }
  return null;
};

export const isMinLength = (minLength: number) => {
  return (value: string): ValidationError | null => {
    if (!value) return null;
    
    if (value.length < minLength) {
      return `Doit contenir au moins ${minLength} caractères`;
    }
    return null;
  };
};

export const isMaxLength = (maxLength: number) => {
  return (value: string): ValidationError | null => {
    if (!value) return null;
    
    if (value.length > maxLength) {
      return `Ne doit pas dépasser ${maxLength} caractères`;
    }
    return null;
  };
};

export const isPostalCode = (value: string): ValidationError | null => {
  if (!value) return null;
  
  // Code postal français: 5 chiffres
  const postalCodeRegex = /^[0-9]{5}$/;
  if (!postalCodeRegex.test(value)) {
    return 'Code postal invalide';
  }
  return null;
};

export const isNumber = (value: any): ValidationError | null => {
  if (!value && value !== 0) return null;
  
  if (isNaN(Number(value))) {
    return 'Doit être un nombre';
  }
  return null;
};

export const isPositiveNumber = (value: any): ValidationError | null => {
  if (!value && value !== 0) return null;
  
  const num = Number(value);
  if (isNaN(num)) {
    return 'Doit être un nombre';
  }
  if (num < 0) {
    return 'Doit être un nombre positif';
  }
  return null;
};

export const isInRange = (min: number, max: number) => {
  return (value: any): ValidationError | null => {
    if (!value && value !== 0) return null;
    
    const num = Number(value);
    if (isNaN(num)) {
      return 'Doit être un nombre';
    }
    if (num < min || num > max) {
      return `Doit être compris entre ${min} et ${max}`;
    }
    return null;
  };
};

export const isOneOf = (options: string[]) => {
  return (value: string): ValidationError | null => {
    if (!value) return null;
    
    if (!options.includes(value)) {
      return 'Valeur non valide';
    }
    return null;
  };
};

// Fonction pour combiner plusieurs validations
export const combineValidations = (
  value: any,
  formState: FormState,
  ...validations: ((value: any, formState?: FormState) => ValidationError | null)[]
): ValidationError | null => {
  for (const validation of validations) {
    const error = validation(value, formState);
    if (error) {
      return error;
    }
  }
  return null;
};

// Fonction pour valider un champ spécifique
export const validateField = (
  field: string,
  value: any,
  formState: FormState,
  rules: ValidationRule[]
): ValidationError | null => {
  const fieldRules = rules.filter(rule => rule.field === field);
  
  for (const rule of fieldRules) {
    const error = rule.validate(value, formState);
    if (error) {
      return error;
    }
  }
  
  return null;
};

// Fonction pour valider un ensemble de champs
export const validateFields = (
  fields: string[],
  formState: FormState,
  rules: ValidationRule[]
): ValidationResult => {
  const errors: ValidationResult = {};
  
  for (const field of fields) {
    const value = formState[field as keyof typeof formState];
    const error = validateField(field, value, formState, rules);
    
    if (error) {
      errors[field] = error;
    }
  }
  
  return errors;
};

// Fonction pour valider une étape complète
export const validateStep = (
  step: number,
  formState: FormState,
  stepFields: { [step: number]: string[] },
  rules: ValidationRule[]
): ValidationResult => {
  const fields = stepFields[step] || [];
  return validateFields(fields, formState, rules);
};

// Fonction pour vérifier si une étape est valide
export const isStepValid = (
  step: number,
  formState: FormState,
  stepFields: { [step: number]: string[] },
  rules: ValidationRule[]
): boolean => {
  const errors = validateStep(step, formState, stepFields, rules);
  return Object.keys(errors).length === 0;
};

// Fonction pour vérifier si le formulaire entier est valide
export const isFormValid = (
  formState: FormState,
  allFields: string[],
  rules: ValidationRule[]
): boolean => {
  const errors = validateFields(allFields, formState, rules);
  return Object.keys(errors).length === 0;
};
