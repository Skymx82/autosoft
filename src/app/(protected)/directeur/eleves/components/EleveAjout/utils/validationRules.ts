import { ValidationRule, isRequired, isEmail, isPhone, isDate, isPostalCode, combineValidations } from './validation';
import { FormState } from '../context/FormContext';

// Cache pour les résultats de validation
type ValidationCache = { result: string | null; timestamp: number };
const validationCache = new Map<string, ValidationCache>();

// Définition des champs par étape
export const stepFields = {
  // Étape 1: Informations de base
  1: ['typeInscription', 'nom', 'nomDeux', 'nomTrois', 'prenom', 'prenomDeux', 'prenomTrois', 'dateNaissance', 'genre', 'paysNaissance', 'departementNaissance', 'villeNaissance'],
  
  // Étape 2: Coordonnées
  2: ['email', 'telephone', 'adresse', 'codePostal', 'ville', 'pays', 'neph', 'profession'],
  
  // Étape 3: Informations permis
  3: ['categoriePermis', 'interesseCode', 'serviceNational', 'journeeDefense', 'idForfait', 'typeFinanceur'],
  
  // Étape 4: Représentant légal (si mineur)
  4: ['representantLegal'],
  
  // Étape 5: Documents
  5: ['documents'],
  
  // Étape 6: Paiement
  6: ['modePaiement', 'montantPaiement', 'resteAPayer']
};

// Liste de tous les champs du formulaire
export const allFields = [
  ...stepFields[1],
  ...stepFields[2],
  ...stepFields[3],
  ...stepFields[4],
  ...stepFields[5]
];

// Règles de validation pour chaque champ
export const validationRules: ValidationRule[] = [
  // Étape 1: Informations de base
  {
    field: 'typeInscription',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },

  {
    field: 'nom',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  {
    field: 'prenom',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  {
    field: 'dateNaissance',
    validate: (value) => combineValidations(value, {} as FormState, isRequired, isDate)
  },
  {
    field: 'genre',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  {
    field: 'paysNaissance',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  {
    field: 'departementNaissance',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  {
    field: 'villeNaissance',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  
  // Étape 2: Coordonnées
  {
    field: 'adresse',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  {
    field: 'codePostal',
    validate: (value) => combineValidations(value, {} as FormState, isRequired, isPostalCode)
  },
  {
    field: 'ville',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  {
    field: 'email',
    validate: (value) => combineValidations(value, {} as FormState, isRequired, isEmail)
  },
  {
    field: 'telephone',
    validate: (value) => combineValidations(value, {} as FormState, isRequired, isPhone)
  },
  {
    field: 'pays',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  
  // Étape 3: Informations permis
  {
    field: 'categoriePermis',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  {
    field: 'idForfait',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  {
    field: 'typeFinanceur',
    validate: (value) => combineValidations(value, {} as FormState, isRequired)
  },
  
  // Étape 4: Représentant légal (si mineur)
  {
    field: 'representantLegal',
    validate: (value, formState) => {
      // Validation conditionnelle: requis seulement si l'élève est mineur
      if (formState.typeInscription === 'mineur' && !value) {
        return 'Les informations du représentant légal sont requises pour un mineur';
      }
      return null;
    }
  },
  
  // Étape 5: Documents
  {
    field: 'documents',
    validate: (value, formState) => {
      // Créer une empreinte unique des données de validation
      const validationKey = JSON.stringify({
        typeInscription: formState.typeInscription,
        typeFinanceur: formState.typeFinanceur,
        documents: formState.documents?.map(doc => ({
          type: doc.type,
          status: doc.status,
          // Ne pas inclure le contenu du fichier pour éviter des clés de cache trop grandes
        }))
      });
      
      // Vérifier le cache avec la nouvelle clé
      const cacheKey = `documents_${validationKey}`;
      const cachedResult = validationCache.get(cacheKey);
      
      // Utiliser le cache si disponible
      if (cachedResult) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Utilisation du cache de validation des documents');
        }
        return cachedResult.result;
      }
      
      // Activer les logs uniquement en développement
      const shouldLog = process.env.NODE_ENV !== 'production';
      if (shouldLog) {
        console.group('=== Validation de l\'étape des documents ===');
        console.log('Nouvelle validation des documents déclenchée');
      }
      
      try {
        // Vérification basique des documents
        if (!formState.documents || !Array.isArray(formState.documents) || formState.documents.length === 0) {
          const errorMsg = 'Aucun document téléchargé. Veuillez ajouter les documents requis.';
          if (shouldLog) {
            console.error('❌', errorMsg);
            console.groupEnd();
          }
          
          // Mettre en cache le résultat négatif
          validationCache.set(cacheKey, { 
            result: errorMsg, 
            timestamp: Date.now() 
          });
          
          return errorMsg;
        }
        
        // Documents de base requis pour tous les types d'inscription
        let requiredDocTypes = ['pieceIdentite', 'justificatifDomicile', 'photoIdentite'];
        
        if (shouldLog) {
          console.log('Documents de base requis:', requiredDocTypes);
        }
        
        // Documents spécifiques pour les mineurs
        if (formState.typeInscription === 'mineur') {
          const mineurDocs = ['autorisationParentale', 'pieceIdentiteRepresentant'];
          requiredDocTypes = [...requiredDocTypes, ...mineurDocs];
          if (shouldLog) {
            console.log('Documents supplémentaires pour mineur:', mineurDocs);
          }
        }
        
        // Documents spécifiques pour les financements
        if (formState.typeFinanceur === 'cpf') {
          requiredDocTypes.push('attestationCPF');
          if (shouldLog) console.log('Document CPF requis');
        } else if (formState.typeFinanceur === 'pole_emploi') {
          requiredDocTypes.push('attestationPoleEmploi');
          if (shouldLog) console.log('Document Pôle Emploi requis');
        }
        
        // Éliminer les doublons
        requiredDocTypes = [...new Set(requiredDocTypes)];
        
        if (shouldLog) {
          console.log('Liste complète des documents requis:', requiredDocTypes);
        }
        
        // Vérifier les documents téléchargés
        const uploadedDocTypes = new Set<string>();
        const invalidDocs: any[] = [];
        
        for (const doc of formState.documents) {
          if (!doc || !doc.type) {
            if (shouldLog) console.warn('Document invalide ignoré:', doc);
            invalidDocs.push(doc);
            continue;
          }
          
          uploadedDocTypes.add(doc.type);
          if (shouldLog) {
            console.log(`Document valide: ${doc.type}`, 
              doc.file ? `(fichier: ${doc.file.name})` : '(sans fichier)');
          }
        }
        
        if (invalidDocs.length > 0 && shouldLog) {
          console.warn(`${invalidDocs.length} documents invalides ignorés`);
        }
        
        // Vérifier les documents manquants
        const missingDocs = requiredDocTypes.filter(type => !uploadedDocTypes.has(type));
        
        if (missingDocs.length > 0) {
          const errorMsg = `Documents manquants: ${missingDocs.join(', ')}`;
          
          if (shouldLog) {
            console.error('❌', errorMsg);
            console.groupEnd();
          }
          
          // Mettre en cache le résultat négatif
          validationCache.set(cacheKey, { 
            result: errorMsg, 
            timestamp: Date.now() 
          });
          
          return errorMsg;
        }
        
        // Tous les documents requis sont présents
        if (shouldLog) {
          console.log('✅ Tous les documents requis sont présents');
          console.groupEnd();
        }
        
        // Mettre en cache le résultat positif
        validationCache.set(cacheKey, { 
          result: null, 
          timestamp: Date.now() 
        });
        
        return null; // Aucune erreur
        
      } catch (error) {
        const errorMsg = 'Une erreur est survenue lors de la validation des documents';
        if (process.env.NODE_ENV !== 'production') {
          console.error('❌', errorMsg, error);
          console.groupEnd();
        }
        validationCache.set(cacheKey, { result: errorMsg, timestamp: Date.now() });
        return errorMsg;
      }
    }
  },
  
  // Étape 6: Récapitulatif et consentement
  {
    field: 'acceptCGU',
    validate: (value) => {
      // Pour le développement, on permet de continuer même sans accepter les CGU
      // En production, décommenter la condition ci-dessous
      /*
      if (!value) {
        return 'Vous devez accepter les conditions générales d\'utilisation';
      }
      */
      return null;
    }
  },
  {
    field: 'acceptRGPD',
    validate: (value) => {
      // En mode développement, on affiche un avertissement mais on ne bloque pas
      if (!value) {
        console.warn('La politique de confidentialité doit être acceptée en production');
        // En production, décommenter la ligne ci-dessous pour bloquer la progression
        // return 'Vous devez accepter la politique de confidentialité';
      }
      return null;
    }
  },
  {
    field: 'acceptConditions',
    validate: (value) => {
      // En mode développement, on affiche un avertissement mais on ne bloque pas
      if (!value) {
        console.warn('Les conditions générales doivent être acceptées en production');
        // En production, décommenter la ligne ci-dessous pour bloquer la progression
        // return 'Vous devez accepter les conditions générales d\'utilisation';
      }
      return null;
    }
  }
];

// Fonction pour valider une étape spécifique
export const validateCurrentStep = (step: number, formState: FormState) => {
  const errors: { [key: string]: string } = {};
  
  // Obtenir les champs pour cette étape
  const fields = stepFields[step as keyof typeof stepFields] || [];
  
  // Appliquer les règles de validation pour chaque champ
  fields.forEach(field => {
    const rules = validationRules.filter(rule => rule.field === field);
    
    rules.forEach(rule => {
      const value = formState[field as keyof typeof formState];
      const error = rule.validate(value, formState);
      
      if (error) {
        errors[field] = error;
      }
    });
  });
  
  return errors;
};

// Fonction pour vérifier si une étape est valide
export const isStepValid = (step: number, formState: FormState): boolean => {
  const errors = validateCurrentStep(step, formState);
  return Object.keys(errors).length === 0;
};

// Fonction pour vérifier si le formulaire entier est valide
export const isFormValid = (formState: FormState): boolean => {
  let isValid = true;
  
  // Vérifier chaque étape
  Object.keys(stepFields).forEach(stepKey => {
    const step = parseInt(stepKey);
    if (!isStepValid(step, formState)) {
      isValid = false;
    }
  });
  
  return isValid;
};
