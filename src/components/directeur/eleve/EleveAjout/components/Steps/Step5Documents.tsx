'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFormContext } from '../../context/FormContext';
import { Document } from '../../context/FormContext';
import { useFormValidation } from '../../hooks/useFormValidation';

// Type pour un document
interface DocumentType {
  id: string;
  label: string;
  required: boolean;
  acceptedTypes: string;
  helpText?: string;
  file?: File;
  url?: string;
  status?: 'pending' | 'uploaded' | 'validated' | 'rejected';
  comments?: string;
}

// Props pour le composant DocumentUpload
interface DocumentUploadProps {
  document: DocumentType;
  formDocuments: Document[];
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
}

// Composant pour télécharger un document
function DocumentUpload({ document, formDocuments, addDocument, updateDocument, removeDocument }: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Trouver le document dans le state s'il existe déjà
  const existingDoc = formDocuments.find((doc) => doc.type === document.id);
  
  // Convertir maxSizeMB en octets (5MB par défaut)
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  // Gérer le glisser-déposer
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Gérer le dépôt de fichier
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  // Gérer la sélection de fichier via le bouton
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  // Traiter le fichier sélectionné
  const handleFile = (file: File) => {
    setUploadError(null);
    
    // Vérifier le type de fichier
    if (!document.acceptedTypes.includes(file.type)) {
      setUploadError(`Type de fichier non accepté. Veuillez utiliser: ${document.acceptedTypes.replace(/,/g, ', ')}`);
      return;
    }
    
    // Vérifier la taille du fichier
    if (file.size > maxSizeBytes) {
      setUploadError(`Fichier trop volumineux. Taille maximale: ${maxSizeMB}MB`);
      return;
    }
    
    // Créer un ID unique pour le document
    const docId = existingDoc?.id || `${document.id}-${Date.now()}`;
    
    // Si le document existe déjà, le mettre à jour, sinon l'ajouter
    if (existingDoc) {
      updateDocument(docId, {
        file,
        status: 'pending',
        url: URL.createObjectURL(file)
      });
    } else {
      addDocument({
        id: docId,
        type: document.id,
        file,
        status: 'pending',
        url: URL.createObjectURL(file)
      });
    }
    
    // Réinitialiser l'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Supprimer le document
  const handleRemove = () => {
    if (existingDoc?.id) {
      // Créer une copie de l'URL avant de supprimer le document
      const urlToRevoke = existingDoc.url;
      
      // Supprimer d'abord le document du state
      removeDocument(existingDoc.id);
      
      // Ensuite, libérer l'URL de l'objet si elle existe
      if (urlToRevoke && urlToRevoke.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(urlToRevoke);
          console.log('URL d\'objet libérée lors de la suppression:', urlToRevoke);
        } catch (error) {
          console.error('Erreur lors de la libération de l\'URL:', error);
        }
      }
    }
  };
  
  // Déterminer l'extension du fichier
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };
  
  // Vérifier si le fichier est une image
  const isImage = (file: File) => {
    return file.type.startsWith('image/');
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {document.label}
        {document.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {!existingDoc ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4 flex text-sm text-gray-600 justify-center">
            <label
              htmlFor={document.id}
              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
            >
              <span>Télécharger un fichier</span>
              <input
                id={document.id}
                name={document.id}
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept={document.acceptedTypes}
                onChange={handleChange}
              />
            </label>
            <p className="pl-1">ou glisser-déposer</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {document.acceptedTypes.includes('image') && document.acceptedTypes.includes('pdf')
              ? 'PNG, JPG, PDF'
              : document.acceptedTypes.includes('image')
              ? 'PNG, JPG'
              : 'PDF'} jusqu'à {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {existingDoc.url && existingDoc.file && isImage(existingDoc.file as File) ? (
                <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={existingDoc.url}
                    alt="Aperçu du document"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              )}
              
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">
                  {existingDoc.file?.name || 'Document téléchargé'}
                </h4>
                <p className="text-xs text-gray-500">
                  {existingDoc.file?.size
                    ? `${(existingDoc.file.size / 1024 / 1024).toFixed(2)} MB · ${existingDoc.file.type || getFileExtension(existingDoc.file.name)}`
                    : 'Fichier téléchargé'}
                </p>
                <div className="mt-1">
                  {existingDoc.status === 'pending' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      En attente
                    </span>
                  )}
                  {existingDoc.status === 'uploaded' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Téléchargé
                    </span>
                  )}
                  {existingDoc.status === 'validated' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Validé
                    </span>
                  )}
                  {existingDoc.status === 'rejected' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Rejeté
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {existingDoc.url && (
                <a
                  href={existingDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  title="Voir le document"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </a>
              )}
              
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                title="Supprimer le document"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          {existingDoc.comments && (
            <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
              <p className="font-medium">Commentaires:</p>
              <p>{existingDoc.comments}</p>
            </div>
          )}
        </div>
      )}
      
      {uploadError && (
        <p className="mt-2 text-sm text-red-600">{uploadError}</p>
      )}
      
      {document.helpText && !uploadError && (
        <p className="mt-2 text-sm text-gray-500">{document.helpText}</p>
      )}
    </div>
  );
}

export default function Step5Documents() {
  const { formState, addDocument, updateDocument, removeDocument, setFieldError, clearFieldError } = useFormContext();
  const { typeInscription, documents: formDocuments } = formState;
  
  const { validateStep: validateCurrentStep } = useFormValidation();
  
  // Fonction de validation pour l'étape des documents
  const validateStep = useCallback(() => {
    console.log('=== Validation de l\'étape 5 (documents) ===');
    
    // Si aucun document n'est présent, on bloque la progression
    if (!formDocuments || !Array.isArray(formDocuments) || formDocuments.length === 0) {
      const errorMsg = 'Veuvez ajouter au moins un document avant de continuer';
      console.error('❌', errorMsg);
      setFieldError('documents', errorMsg);
      return false;
    }
    
    try {
      const errors = validateCurrentStep(5); // 5 est l'ID de l'étape des documents
      const hasErrors = Object.keys(errors).length > 0;
      
      if (hasErrors) {
        console.error('❌ Erreurs de validation:', errors);
        setFieldError('documents', 'Veuvez corriger les erreurs avant de continuer');
      } else {
        clearFieldError('documents');
        console.log('✅ Validation des documents réussie');
      }
      
      return !hasErrors;
    } catch (error) {
      const errorMsg = 'Une erreur est survenue lors de la validation des documents';
      console.error('❌', errorMsg, error);
      setFieldError('documents', errorMsg);
      return false;
    }
  }, [formDocuments, validateCurrentStep, setFieldError, clearFieldError]);
  
  // Exposer la fonction de validation via un effet pour qu'elle puisse être utilisée par le parent
  useEffect(() => {
    // La validation est maintenant gérée directement dans le composant
    return () => {
      // Nettoyage si nécessaire
    };
  }, [validateStep]);
  
  // Nettoyer les URL d'objets lors du démontage du composant
  useEffect(() => {
    // Créer un tableau pour stocker les URLs à nettoyer
    const urlsToClean: string[] = [];
    
    // Récupérer les URLs des documents existants
    if (Array.isArray(formDocuments)) {
      formDocuments.forEach(doc => {
        if (doc.url && doc.url.startsWith('blob:')) {
          urlsToClean.push(doc.url);
        }
      });
    }
    
    // Fonction de nettoyage exécutée lors du démontage
    return () => {
      // Libérer toutes les URL d'objets
      urlsToClean.forEach(url => {
        try {
          URL.revokeObjectURL(url);
          console.log('URL d\'objet libérée:', url);
        } catch (error) {
          console.error('Erreur lors de la libération de l\'URL:', error);
        }
      });
      
      // Forcer le garbage collection (non standard, mais peut aider dans certains navigateurs)
      if (window.gc) {
        window.gc();
      }
    };
  }, [formDocuments]);  // Dépendance sur formDocuments pour réagir aux changements
  
  // Liste des documents requis pour tous les élèves
  const documentsCommuns = [
    {
      id: 'photoIdentite',
      label: 'Photo d\'identité',
      required: true,
      acceptedTypes: 'image/jpeg,image/png',
      helpText: 'Format JPEG ou PNG, fond uni, visage dégagé'
    },
    {
      id: 'pieceIdentite',
      label: 'Pièce d\'identité',
      required: true,
      acceptedTypes: 'image/jpeg,image/png,application/pdf',
      helpText: 'Carte d\'identité, passeport ou titre de séjour en cours de validité'
    },
    {
      id: 'justificatifDomicile',
      label: 'Justificatif de domicile',
      required: true,
      acceptedTypes: 'image/jpeg,image/png,application/pdf',
      helpText: 'Facture d\'électricité, gaz, téléphone ou quittance de loyer de moins de 3 mois'
    },
    {
      id: 'attestationJDC',
      label: 'Attestation de participation à la JDC',
      required: formState.journeeDefense,
      acceptedTypes: 'image/jpeg,image/png,application/pdf',
      helpText: 'Journée Défense et Citoyenneté (pour les 17-25 ans)'
    }
  ];

  // Documents spécifiques pour les mineurs
  const documentsMineurs = [
    {
      id: 'autorisationParentale',
      label: 'Autorisation parentale',
      required: true,
      acceptedTypes: 'image/jpeg,image/png,application/pdf',
      helpText: 'Document signé par le représentant légal'
    },
    {
      id: 'pieceIdentiteRepresentant',
      label: 'Pièce d\'identité du représentant légal',
      required: true,
      acceptedTypes: 'image/jpeg,image/png,application/pdf',
      helpText: 'Carte d\'identité, passeport ou titre de séjour en cours de validité'
    }
  ];

  // Documents spécifiques pour certains financements
  const documentsFinancement = [
    {
      id: 'attestationCPF',
      label: 'Attestation CPF',
      required: formState.typeFinanceur === 'cpf',
      acceptedTypes: 'image/jpeg,image/png,application/pdf',
      helpText: 'Attestation de droits CPF'
    },
    {
      id: 'attestationPoleEmploi',
      label: 'Attestation Pôle Emploi',
      required: formState.typeFinanceur === 'pole_emploi',
      acceptedTypes: 'image/jpeg,image/png,application/pdf',
      helpText: 'Document justifiant de l\'aide au financement'
    }
  ];

  // Combiner les documents en fonction du type d'inscription
  const documentsRequis = [
    ...documentsCommuns,
    ...(typeInscription === 'mineur' ? documentsMineurs : []),
    ...documentsFinancement
  ];
  
  // Calculer le nombre de documents téléchargés
  const uploadedCount = formDocuments.length;
  
  // Calculer le pourcentage de progression
  const progressPercentage = documentsRequis.length > 0 
    ? (uploadedCount / documentsRequis.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Documents requis</h2>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <p className="mb-4 text-gray-600">
          Veuillez télécharger les documents suivants pour compléter votre inscription. 
          Les documents marqués d'un astérisque (*) sont obligatoires.
        </p>
        
        {/* Barre de progression */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Documents téléchargés
            </span>
            <span className="text-sm font-medium text-gray-700">
              {uploadedCount}/{documentsRequis.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Liste des documents à télécharger */}
        <div className="space-y-6">
          {documentsRequis.map((doc) => (
            <DocumentUpload
              key={doc.id}
              document={doc}
              formDocuments={formDocuments}
              addDocument={addDocument}
              updateDocument={updateDocument}
              removeDocument={removeDocument}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
