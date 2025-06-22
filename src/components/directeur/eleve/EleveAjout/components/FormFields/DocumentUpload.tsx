'use client';

import React, { useState, useRef } from 'react';
import { useFormContext } from '../../context/FormContext';
import { Document } from '../../context/FormContext';

interface DocumentUploadProps {
  id: string;
  label: string;
  acceptedTypes?: string;
  required?: boolean;
  maxSizeMB?: number;
  helpText?: string;
  className?: string;
}

export default function DocumentUpload({
  id,
  label,
  acceptedTypes = 'image/jpeg,image/png,application/pdf',
  required = false,
  maxSizeMB = 5,
  helpText,
  className = ''
}: DocumentUploadProps) {
  const { formState, addDocument, updateDocument, removeDocument } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Trouver le document dans le state s'il existe déjà
  const document = formState.documents.find((doc: Document) => doc.type === id);
  
  // Convertir maxSizeMB en octets
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
    if (!acceptedTypes.includes(file.type)) {
      setUploadError(`Type de fichier non accepté. Veuillez utiliser: ${acceptedTypes.replace(/,/g, ', ')}`);
      return;
    }
    
    // Vérifier la taille du fichier
    if (file.size > maxSizeBytes) {
      setUploadError(`Fichier trop volumineux. Taille maximale: ${maxSizeMB}MB`);
      return;
    }
    
    // Créer un ID unique pour le document
    const docId = document?.id || `${id}-${Date.now()}`;
    
    // Si le document existe déjà, le mettre à jour, sinon l'ajouter
    if (document) {
      updateDocument(docId, {
        file,
        status: 'pending',
        url: URL.createObjectURL(file)
      });
    } else {
      addDocument({
        id: docId,
        type: id,
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
    if (document?.id) {
      // Libérer l'URL de l'objet si elle existe
      if (document.url && document.url.startsWith('blob:')) {
        URL.revokeObjectURL(document.url);
      }
      
      removeDocument(document.id);
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
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {!document ? (
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
              htmlFor={id}
              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
            >
              <span>Télécharger un fichier</span>
              <input
                id={id}
                name={id}
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept={acceptedTypes}
                onChange={handleChange}
              />
            </label>
            <p className="pl-1">ou glisser-déposer</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {acceptedTypes.includes('image') && acceptedTypes.includes('pdf')
              ? 'PNG, JPG, PDF'
              : acceptedTypes.includes('image')
              ? 'PNG, JPG'
              : 'PDF'} jusqu'à {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {document.url && isImage(document.file as File) ? (
                <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={document.url}
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
                  {document.file?.name || 'Document téléchargé'}
                </h4>
                <p className="text-xs text-gray-500">
                  {document.file?.size
                    ? `${(document.file.size / 1024 / 1024).toFixed(2)} MB · ${document.file.type || getFileExtension(document.file.name)}`
                    : 'Fichier téléchargé'}
                </p>
                <div className="mt-1">
                  {document.status === 'pending' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      En attente
                    </span>
                  )}
                  {document.status === 'uploaded' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Téléchargé
                    </span>
                  )}
                  {document.status === 'validated' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Validé
                    </span>
                  )}
                  {document.status === 'rejected' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Rejeté
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {document.url && (
                <a
                  href={document.url}
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
          
          {document.comments && (
            <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
              <p className="font-medium">Commentaires:</p>
              <p>{document.comments}</p>
            </div>
          )}
        </div>
      )}
      
      {uploadError && (
        <p className="mt-2 text-sm text-red-600">{uploadError}</p>
      )}
      
      {helpText && !uploadError && (
        <p className="mt-2 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
