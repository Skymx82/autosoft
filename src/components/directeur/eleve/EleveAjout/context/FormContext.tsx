'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

// Types pour les données du formulaire
export interface RepresentantLegal {
  nom: string;
  nomDeux: string;
  prenom: string;
  prenomDeux: string;
  dateNaissance: string;
  genre: 'masculin' | 'feminin' | '';
  telephone: string;
  email: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  lienParente: 'pere' | 'mere' | 'tuteur' | 'autre' | '';
}

export interface Document {
  id?: string;
  type: string;
  file: File | null;
  url?: string;
  status: 'pending' | 'uploaded' | 'validated' | 'rejected';
  comments?: string;
}

export interface FormState {
  // Étape 1: Informations de base
  typeInscription: 'mineur' | 'majeur' | '';
  nom: string;
  nomDeux: string;
  nomTrois: string;
  prenom: string;
  prenomDeux: string;
  prenomTrois: string;
  dateNaissance: string;
  genre: 'masculin' | 'feminin' | '';
  paysNaissance: string;
  departementNaissance: string;
  villeNaissance: string;
  
  // Étape 2: Coordonnées
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  neph: string;
  profession: string;
  
  // Étape 3: Informations permis
  categoriePermis: string;
  interesseCode: boolean;
  serviceNational: boolean;
  journeeDefense: boolean;
  idForfait: string;
  typeFinanceur: string;
  
  // Étape 4: Représentant légal (si mineur)
  representantLegal: RepresentantLegal | null;
  
  // Étape 5: Documents
  documents: Document[];
  
  // Étape 6: Consentement
  acceptCGU: boolean;
  acceptRGPD: boolean;
  
  // Étape 6: Paiement
  modePaiement: 'cb' | 'cheque' | 'especes' | '';
  montantPaiement: string;
  dateEcheance: string;
  resteAPayer: string;
  
  // Métadonnées
  currentStep: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
  isValid: boolean;
}

// État initial du formulaire
const initialFormState: FormState = {
  // Étape 1: Informations de base
  typeInscription: '',
  nom: '',
  nomDeux: '',
  nomTrois: '',
  prenom: '',
  prenomDeux: '',
  prenomTrois: '',
  dateNaissance: '',
  genre: '',
  paysNaissance: '',
  departementNaissance: '',
  villeNaissance: '',
  
  // Étape 2: Coordonnées
  email: '',
  telephone: '',
  adresse: '',
  codePostal: '',
  ville: '',
  pays: '',
  neph: '',
  profession: '',
  
  // Étape 3: Informations permis
  categoriePermis: '',
  interesseCode: false,
  serviceNational: false,
  journeeDefense: false,
  idForfait: '',
  typeFinanceur: '',
  
  // Étape 4: Représentant légal (si mineur)
  representantLegal: null,
  
  // Étape 5: Documents
  documents: [],
  
  // Étape 6: Consentement
  acceptCGU: false,
  acceptRGPD: false,
  
  // Étape 6: Paiement
  modePaiement: '',
  montantPaiement: '',
  resteAPayer: '',
  dateEcheance: '',
  
  // Métadonnées
  currentStep: 1,
  isSubmitting: false,
  errors: {},
  isValid: false
};

// Types pour les actions du reducer
type FormAction = 
  | { type: 'UPDATE_FIELD'; field: string; value: any }
  | { type: 'UPDATE_MULTIPLE_FIELDS'; fields: Partial<FormState> }
  | { type: 'SET_STEP'; step: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'ADD_DOCUMENT'; document: Document }
  | { type: 'UPDATE_DOCUMENT'; id: string; updates: Partial<Document> }
  | { type: 'REMOVE_DOCUMENT'; id: string }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET_FORM' };

// Reducer pour gérer les actions sur le formulaire
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
      
    case 'UPDATE_MULTIPLE_FIELDS':
      return {
        ...state,
        ...action.fields
      };
      
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step
      };
      
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1
      };
      
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(1, state.currentStep - 1)
      };
      
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        isValid: Object.keys(action.errors).length === 0
      };
      
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
        isValid: true
      };
      
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.document]
      };
      
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc => 
          doc.id === action.id ? { ...doc, ...action.updates } : doc
        )
      };
      
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.id)
      };
      
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting
      };
      
    case 'RESET_FORM':
      return initialFormState;
      
    default:
      return state;
  }
}

// Interface pour le contexte
interface FormContextType {
  formState: FormState;
  updateField: (field: string, value: any) => void;
  updateMultipleFields: (fields: Partial<FormState>) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  setFieldError: (field: string, message: string) => void;
  clearFieldError: (field: string) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  resetForm: () => void;
}

// Création du contexte
const FormContext = createContext<FormContextType | undefined>(undefined);

// Props pour le provider
interface FormProviderProps {
  children: ReactNode;
}

// Provider du contexte
export function FormProvider({ children }: FormProviderProps) {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  
  // Actions sur le formulaire
  const updateField = (field: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };
  
  const updateMultipleFields = (fields: Partial<FormState>) => {
    dispatch({ type: 'UPDATE_MULTIPLE_FIELDS', fields });
  };
  
  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', step });
  };
  
  // Fonctions simples pour la navigation entre les étapes
  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };
  
  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };
  
  const setErrors = (errors: Record<string, string>) => {
    dispatch({ type: 'SET_ERRORS', errors });
  };
  
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };
  
  const addDocument = useCallback((document: Document) => {
    dispatch({ type: 'ADD_DOCUMENT', document });
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    dispatch({ type: 'UPDATE_DOCUMENT', id, updates });
  }, []);

  const removeDocument = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_DOCUMENT', id });
  }, []);
  
  const setFieldError = useCallback((field: string, message: string) => {
    dispatch({
      type: 'SET_ERRORS',
      errors: { ...formState.errors, [field]: message }
    });
  }, [formState.errors]);
  
  const clearFieldError = useCallback((field: string) => {
    const newErrors = { ...formState.errors };
    delete newErrors[field];
    dispatch({
      type: 'SET_ERRORS',
      errors: newErrors
    });
  }, [formState.errors]);
  
  const setSubmitting = (isSubmitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', isSubmitting });
  };
  
  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };
  
  const value = {
    formState,
    updateField,
    updateMultipleFields,
    setStep,
    nextStep,
    prevStep,
    setErrors,
    clearErrors,
    setFieldError,
    clearFieldError,
    addDocument,
    updateDocument,
    removeDocument,
    setSubmitting,
    resetForm
  };
  
  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext doit être utilisé à l\'intérieur d\'un FormProvider');
  }
  return context;
}
