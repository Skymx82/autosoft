'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { createNotification } from '@/lib/notifications';
import '@/styles/anim_Notif.css';

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

// Type pour les notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface Document {
  id?: string;
  type: string;
  file: File | null;
  url?: string;
  status: 'pending' | 'uploaded' | 'validated' | 'rejected' | 'error';
  comments?: string;
  _fileForLater?: File;
  _objectUrl?: string;
  path?: string;
  lien_fichier?: string;
  id_doc?: string; // ID du document dans la base de données
  id_eleve?: string; // ID de l'élève associé
  date_depot?: string; // Date de dépôt du document
}

export interface FormState {
  // Identifiants
  id?: string; // ID de l'élève
  id_bureau?: string; // ID du bureau
  id_ecole?: string; // ID de l'auto-école
  
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
export interface FormContextType {
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
  saveAsDraft: () => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  notifications: Notification[];
  removeNotification: (id: string) => void;
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
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Fonction pour ajouter une notification
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = uuidv4();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Suppression automatique après un délai
    if (notification.duration) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, notification.duration);
    }
  }, []);
  
  // Fonction pour supprimer une notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
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
  
  // Fonction pour sauvegarder les données en brouillon
  const saveAsDraft = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    // Vérification des données minimales requises
    if (!formState.nom || !formState.prenom) {
      addNotification({
        type: 'warning',
        message: 'Veuillez au moins renseigner le nom et prénom',
        duration: 3000
      });
      return { success: false, error: 'Données minimales manquantes' };
    }

    setIsLoading(true);
    
    try {
      // Récupérer l'utilisateur actuel depuis le localStorage
      const userData = localStorage.getItem('autosoft_user');
      if (!userData) {
        throw new Error('Utilisateur non trouvé dans le localStorage');
      }
      
      // Parser les données utilisateur
      const user = JSON.parse(userData);
      const id_ecole = user.id_ecole;
      const id_bureau = user.id_bureau;
      
      // Mettre à jour le formState avec les IDs
      if (!formState.id_ecole) {
        dispatch({ type: 'UPDATE_FIELD', field: 'id_ecole', value: id_ecole.toString() });
      }
      
      if (!formState.id_bureau) {
        dispatch({ type: 'UPDATE_FIELD', field: 'id_bureau', value: id_bureau.toString() });
      }
      
      // Préparer les données de l'élève
      const eleveData = {
        nom: formState.nom,
        nom_deux: formState.nomDeux || null,
        nom_trois: formState.nomTrois || null,
        prenom: formState.prenom,
        prenom_deux: formState.prenomDeux || null,
        prenom_trois: formState.prenomTrois || null,
        mail: formState.email || null,
        tel: formState.telephone || null,
        genre: formState.genre || null,
        naiss: formState.dateNaissance || null,
        pays_naiss: formState.paysNaissance || null,
        dep_naiss: formState.departementNaissance || null,
        ville_naiss: formState.villeNaissance || null,
        adresse: formState.adresse || null,
        code_postal: formState.codePostal || null,
        ville: formState.ville || null,
        pays: formState.pays || null,
        // Utiliser les IDs récupérés du localStorage
        id_bureau: id_bureau,
        id_ecole: id_ecole,
        statut_dossier: 'Brouillon' // Statut brouillon
      };

      // Si l'élève existe déjà, mettre à jour, sinon créer
      if (formState.id) {
        // Mettre à jour l'élève existant
        const { error } = await supabase
          .from('eleves')
          .update(eleveData)
          .eq('id_eleve', formState.id);

        if (error) throw error;
      } else {
        // Créer un nouvel élève en brouillon
        const { data: newEleve, error } = await supabase
          .from('eleves')
          .insert(eleveData)
          .select()
          .single();

        if (error) throw error;

        // Mettre à jour l'état avec le nouvel ID
        dispatch({ type: 'UPDATE_FIELD', field: 'id', value: newEleve.id_eleve.toString() });
      }

      // Notification silencieuse
      addNotification({
        type: 'info',
        message: 'Brouillon enregistré',
        duration: 2000
      });

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du brouillon:', error);
      
      // Notification d'erreur
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'enregistrement du brouillon',
        duration: 5000
      });
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    } finally {
      setIsLoading(false);
    }
  }, [formState, dispatch, addNotification]);

  // Fonction pour finaliser le formulaire
  const submitForm = async () => {
    try {
      setIsLoading(true);
      
      // Vérifier si l'élève existe déjà dans la base de données
      if (!formState.id) {
        // Si l'élève n'existe pas, l'enregistrer d'abord
        const { success, error } = await saveAsDraft();
        if (!success) throw new Error(error || 'Erreur lors de l\'enregistrement de l\'élève');
      }
      
      // Mettre à jour le statut de l'élève à "Complet"
      const { error: updateError } = await supabase
        .from('eleves')
        .update({ statut_dossier: 'Complet' })
        .eq('id_eleve', formState.id);
      
      if (updateError) throw updateError;
      
      // Pour chaque document temporaire, le déplacer vers l'emplacement final
      if (formState.documents && formState.documents.length > 0) {
        for (const document of formState.documents) {
          // Vérifier si le document a un chemin temporaire (commence par 'temp/')
          if (document.path && document.path.startsWith('temp/') && document.id_doc) {
            // Déplacer le document vers l'emplacement final
            const moveResult = await moveDocumentToFinalLocation(
              document.path,
              formState.id || '',
              document.type
            );
            
            if (moveResult) {
              // Mettre à jour le document dans la base de données
              await updateDocumentAfterMove(
                document.id_doc,
                moveResult.path,
                moveResult.url,
                formState.id || ''
              );
              
              // Mettre à jour le document dans le state
              dispatch({
                type: 'UPDATE_DOCUMENT',
                id: document.id || '',
                updates: {
                  path: moveResult.path,
                  url: moveResult.url,
                  lien_fichier: moveResult.url
                }
              });
            }
          }
        }
      }
      
      addNotification({
        type: 'success',
        message: 'Inscription finalisée avec succès',
        duration: 5000
      });
      
      // 🔔 CRÉER LA NOTIFICATION pour la personne qui a créé l'inscription
      try {
        const userData = localStorage.getItem('autosoft_user');
        if (userData) {
          const user = JSON.parse(userData);
          const eleveName = `${formState.prenom} ${formState.nom}`;
          
          await createNotification({
            type: 'success',
            message: `Nouvel élève inscrit avec succès : ${eleveName}`,
            id_destinataire: user.id,
            id_ecole: user.id_ecole,
            id_bureau: user.id_bureau,
            priorite: 'normale'
          });
          
          console.log('✅ Notification créée pour l\'inscription de l\'élève');
        }
      } catch (notifError) {
        console.error('⚠️ Erreur lors de la création de la notification:', notifError);
        // Ne pas bloquer l'inscription si la notification échoue
      }
      
      // Réinitialiser le formulaire après soumission réussie
      resetForm();
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la finalisation de l\'inscription:', error);
      
      addNotification({
        type: 'error',
        message: 'Erreur lors de la finalisation de l\'inscription',
        duration: 5000
      });
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions pour la navigation entre les étapes
  const nextStep = useCallback(async () => {
    // À chaque étape, on sauvegarde en brouillon
    // Sauf pour la dernière étape qui sera gérée différemment (finalisation)
    if (formState.currentStep < 6) {
      const { success } = await saveAsDraft();
      
      // Même en cas d'erreur, on permet de continuer
      // L'utilisateur a déjà été notifié par saveAsDraft
    }
    
    dispatch({ type: 'NEXT_STEP' });
  }, [formState.currentStep, saveAsDraft]);
  
  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };
  
  const setErrors = (errors: Record<string, string>) => {
    dispatch({ type: 'SET_ERRORS', errors });
  };
  
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };
  
  // Fonction pour uploader un document vers Supabase Storage
  const uploadDocumentToStorage = useCallback(async (file: File, documentType: string, eleveId?: string): Promise<{ path: string; url: string } | null> => {
    try {
      if (!file) return null;
      
      // Récupérer les identifiants depuis le localStorage ou le state
      const id_bureau = formState.id_bureau || localStorage.getItem('id_bureau');
      const id_ecole = formState.id_ecole || localStorage.getItem('id_ecole');
      
      if (!id_bureau || !id_ecole) {
        throw new Error('ID bureau ou ID école manquant');
      }
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      
      // Définir le chemin du fichier
      // Si l'élève existe, on utilise son ID avec la nouvelle structure, sinon on utilise un dossier temporaire
      const filePath = eleveId 
        ? `${id_ecole}/eleves/${eleveId}/${documentType}.${fileExt}` 
        : `temp/${id_ecole}/${id_bureau}/${Date.now()}/${documentType}.${fileExt}`;
      
      // Upload du fichier vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents') // Nom du bucket
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Récupérer l'URL publique du fichier
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      return {
        path: filePath,
        url: publicUrl
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload du document:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'upload du document',
        duration: 5000
      });
      return null;
    }
  }, [formState.id_bureau, formState.id_ecole, addNotification]);
  
  // Fonction pour enregistrer un document dans la base de données
  const saveDocumentToDatabase = useCallback(async (
    documentType: string, 
    filePath: string, 
    fileUrl: string, 
    eleveId?: string
  ): Promise<{ id_doc: string } | null> => {
    try {
      // Récupérer les identifiants depuis le localStorage ou le state
      const id_bureau = formState.id_bureau || localStorage.getItem('id_bureau');
      const id_ecole = formState.id_ecole || localStorage.getItem('id_ecole');
      
      if (!id_bureau || !id_ecole) {
        throw new Error('ID bureau ou ID école manquant');
      }
      
      // Préparer les données du document
      const documentData = {
        id_eleve: eleveId || null,
        type_doc: documentType,
        etat: 'pending', // État initial du document
        lien_fichier: fileUrl,
        id_bureau,
        id_ecole
      };
      
      // Insérer le document dans la base de données
      const { data, error } = await supabase
        .from('documents')
        .insert(documentData)
        .select('id_doc')
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du document dans la base de données:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'enregistrement du document',
        duration: 5000
      });
      return null;
    }
  }, [formState.id_bureau, formState.id_ecole, addNotification]);
  
  // Fonction pour déplacer un document du dossier temporaire vers le dossier définitif
  const moveDocumentToFinalLocation = useCallback(async (
    tempPath: string, 
    eleveId: string, 
    documentType: string
  ): Promise<{ path: string; url: string } | null> => {
    try {
      // Extraire le nom du fichier du chemin temporaire
      const fileName = tempPath.split('/').pop();
      
      if (!fileName) throw new Error('Nom de fichier invalide');
      
      // Nouveau chemin de destination
      // Récupérer l'ID de l'école depuis le state ou localStorage
      let id_ecole = formState.id_ecole;
      if (!id_ecole) {
        try {
          const userData = localStorage.getItem('autosoft_user');
          if (userData) {
            const user = JSON.parse(userData);
            id_ecole = user.id_ecole;
          }
        } catch (err) {
          console.error('Erreur lors de la récupération des informations utilisateur:', err);
        }
      }
      
      // Valeur par défaut si toujours undefined
      id_ecole = id_ecole || '1';
      
      // Utiliser le type de document comme partie du nom de fichier
      const newPath = `${id_ecole}/eleves/${eleveId}/${documentType}.${fileName.split('.').pop()}`;
      
      // Copier le fichier vers le nouveau chemin
      const { data: copyData, error: copyError } = await supabase.storage
        .from('documents')
        .copy(tempPath, newPath);
        
      if (copyError) throw copyError;
      
      // Supprimer l'ancien fichier
      const { data: removeData, error: removeError } = await supabase.storage
        .from('documents')
        .remove([tempPath]);
        
      if (removeError) throw removeError;
      
      // Obtenir l'URL publique du nouveau fichier
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(newPath);
        
      return {
        path: newPath,
        url: publicUrl
      };
    } catch (error) {
      console.error('Erreur lors du déplacement du document:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors du déplacement du document',
        duration: 5000
      });
      return null;
    }
  }, [addNotification]);
  
  // Fonction pour mettre à jour le document dans la base de données après déplacement
  const updateDocumentAfterMove = useCallback(async (
    id_doc: string, 
    newPath: string, 
    newUrl: string, 
    eleveId: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          id_eleve: eleveId,
          lien_fichier: newUrl
        })
        .eq('id_doc', id_doc);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
      return false;
    }
  }, []);

  // Fonctions pour la gestion des documents dans le state
  const addDocument = useCallback(async (document: Document) => {
    try {
      // D'abord ajouter le document au state avec statut 'pending'
      dispatch({ type: 'ADD_DOCUMENT', document });
      
      // Si un fichier est présent, l'uploader
      if (document.file) {
        // Uploader le fichier vers Supabase Storage
        const uploadResult = await uploadDocumentToStorage(
          document.file, 
          document.type, 
          formState.id // ID de l'élève s'il existe déjà
        );
        
        if (!uploadResult) return;
        
        // Enregistrer le document dans la base de données
        const dbResult = await saveDocumentToDatabase(
          document.type, 
          uploadResult.path, 
          uploadResult.url, 
          formState.id // ID de l'élève s'il existe déjà
        );
        
        if (!dbResult) return;
        
        // Mettre à jour le document dans le state avec les nouvelles informations
        dispatch({ 
          type: 'UPDATE_DOCUMENT', 
          id: document.id || '', 
          updates: {
            status: 'uploaded',
            url: uploadResult.url,
            path: uploadResult.path,
            id_doc: dbResult.id_doc,
            lien_fichier: uploadResult.url
          }
        });
        
        addNotification({
          type: 'success',
          message: 'Document téléchargé avec succès',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'ajout du document',
        duration: 5000
      });
    }
  }, [formState.id, uploadDocumentToStorage, saveDocumentToDatabase, addNotification]);

  const updateDocument = useCallback(async (id: string, updates: Partial<Document>) => {
    try {
      // Mettre à jour le document dans le state
      dispatch({ type: 'UPDATE_DOCUMENT', id, updates });
      
      // Si un nouveau fichier est fourni, le traiter
      if (updates.file) {
        // Récupérer le document complet depuis le state
        const document = formState.documents?.find(doc => doc.id === id);
        if (!document) return;
        
        // Uploader le nouveau fichier
        const uploadResult = await uploadDocumentToStorage(
          updates.file, 
          document.type, 
          formState.id
        );
        
        if (!uploadResult) return;
        
        // Si le document existe déjà dans la base de données, mettre à jour son lien
        if (document.id_doc) {
          const { error } = await supabase
            .from('documents')
            .update({
              lien_fichier: uploadResult.url,
              etat: 'pending' // Réinitialiser l'état car c'est un nouveau fichier
            })
            .eq('id_doc', document.id_doc);
          
          if (error) throw error;
        } else {
          // Sinon, créer une nouvelle entrée dans la base de données
          const dbResult = await saveDocumentToDatabase(
            document.type, 
            uploadResult.path, 
            uploadResult.url, 
            formState.id
          );
          
          if (!dbResult) return;
          
          // Mettre à jour l'ID du document dans le state
          dispatch({ 
            type: 'UPDATE_DOCUMENT', 
            id, 
            updates: { id_doc: dbResult.id_doc }
          });
        }
        
        // Mettre à jour le document dans le state avec les nouvelles informations
        dispatch({ 
          type: 'UPDATE_DOCUMENT', 
          id, 
          updates: {
            status: 'uploaded',
            url: uploadResult.url,
            path: uploadResult.path,
            lien_fichier: uploadResult.url
          }
        });
        
        addNotification({
          type: 'success',
          message: 'Document mis à jour avec succès',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors de la mise à jour du document',
        duration: 5000
      });
    }
  }, [formState.id, formState.documents, uploadDocumentToStorage, saveDocumentToDatabase, addNotification]);

  const removeDocument = useCallback(async (id: string) => {
    try {
      // Récupérer le document depuis le state
      const document = formState.documents?.find(doc => doc.id === id);
      
      // Supprimer le document du state
      dispatch({ type: 'REMOVE_DOCUMENT', id });
      
      // Si le document a une URL d'objet, la révoquer
      if (document?.url && document.url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(document.url);
        } catch (error) {
          console.error('Erreur lors de la libération de l\'URL:', error);
        }
      }
      
      // Si le document existe dans la base de données, le supprimer
      if (document?.id_doc) {
        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('id_doc', document.id_doc);
        
        if (error) throw error;
      }
      
      // Si le document a un chemin dans le stockage, supprimer le fichier
      if (document?.path) {
        const { error } = await supabase.storage
          .from('documents')
          .remove([document.path]);
        
        if (error) console.error('Erreur lors de la suppression du fichier:', error);
      }
      
      addNotification({
        type: 'info',
        message: 'Document supprimé',
        duration: 3000
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors de la suppression du document',
        duration: 5000
      });
    }
  }, [formState.documents, addNotification]);
  
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
    resetForm,
    saveAsDraft,
    isLoading,
    addNotification,
    notifications,
    removeNotification
  };
  
  return (
    <FormContext.Provider value={value}>
      {children}
      {/* Intégration du conteneur de notifications */}
      <div className="fixed top-4 right-4 z-50 w-80 max-w-md">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`flex items-center p-4 mb-3 rounded-md shadow-md transition-all transform animate-slide-in ${
              notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' :
              notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-700' :
              notification.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700' :
              'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
            }`}
            role="alert"
          >
            {/* Icône en fonction du type */}
            {notification.type === 'success' && (
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {notification.type === 'error' && (
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {notification.type === 'warning' && (
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {notification.type === 'info' && (
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 012 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
            )}
            
            <div className="flex-grow">{notification.message}</div>
            
            <button 
              type="button" 
              className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => removeNotification(notification.id)}
              aria-label="Fermer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
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
