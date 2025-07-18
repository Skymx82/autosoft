'use client';

import React from 'react';
import { useFormContext } from '../../context/FormContext';
import DocumentUpload from './DocumentUpload';

interface DocumentType {
  id: string;
  label: string;
  required: boolean;
  acceptedTypes?: string;
  helpText?: string;
}

interface DocumentsManagerProps {
  documents: DocumentType[];
  className?: string;
}

export default function DocumentsManager({
  documents,
  className = ''
}: DocumentsManagerProps) {
  const { formState } = useFormContext();
  
  // Calculer le nombre de documents téléchargés
  const uploadedCount = documents.filter(doc => 
    formState.documents.some((d: { type: string }) => d.type === doc.id)
  ).length;
  
  // Calculer le pourcentage de progression
  const progressPercentage = (uploadedCount / documents.length) * 100;
  
  return (
    <div className={className}>
      {/* Barre de progression */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Documents téléchargés
          </span>
          <span className="text-sm font-medium text-gray-700">
            {uploadedCount}/{documents.length}
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
        {documents.map((doc) => (
          <DocumentUpload
            key={doc.id}
            id={doc.id}
            label={doc.label}
            required={doc.required}
            acceptedTypes={doc.acceptedTypes}
            helpText={doc.helpText}
          />
        ))}
      </div>
    </div>
  );
}
