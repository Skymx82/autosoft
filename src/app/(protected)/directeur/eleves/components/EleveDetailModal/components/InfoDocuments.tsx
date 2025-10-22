'use client';

import React, { useState, useEffect } from 'react';
import { FiFile, FiPlus, FiTrash2, FiDownload, FiCheck, FiX, FiUpload, FiEye } from 'react-icons/fi';
import { Eleve } from '../api/eleveApi';
import { Document, getDocumentsByEleveId, addDocument, updateDocumentStatus, deleteDocument } from '../api/documentApi';
import ImageViewer from './ImageViewer';
import { supabase } from '@/lib/supabase';

interface InfoDocumentsProps {
  eleve: Eleve | null;
  loading: boolean;
}

export default function InfoDocuments({ eleve, loading }: InfoDocumentsProps) {
  // États pour les données des documents
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // État pour l'ajout d'un nouveau document
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newDocument, setNewDocument] = useState({
    type_doc: '',
    etat: 'En attente',
    lien_fichier: ''
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // État pour la visualisation d'image
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  
  // Types de documents disponibles
  const documentTypes = [
    'Pièce d\'identité',
    'Justificatif de domicile',
    'ASSR2',
    'Photo d\'identité',
    'Contrat de formation',
    'Attestation de recensement',
    'JDC',
    'Autre'
  ];
  
  // États possibles d'un document
  const documentStates = [
    'En attente',
    'Validé',
    'Refusé',
    'À compléter'
  ];
  
  // Fonction pour formater une date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non renseignée';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Fonction pour déterminer la couleur du badge d'état
  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('valid')) {
      return 'bg-green-100 text-green-800';
    } else if (statusLower.includes('refus')) {
      return 'bg-red-100 text-red-800';
    } else if (statusLower.includes('attente')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (statusLower.includes('complet')) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Charger les documents lorsque l'élève change
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!eleve?.id_eleve) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDocumentsByEleveId(eleve.id_eleve);
        setDocuments(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des documents:', err);
        setError('Impossible de charger les documents.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [eleve?.id_eleve]);
  
  // Fonction pour ajouter un nouveau document
  const handleAddDocument = async () => {
    if (!eleve?.id_eleve || !eleve?.id_ecole) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      let lienFichier = newDocument.lien_fichier;
      
      // Upload du fichier vers Supabase Storage si un fichier est sélectionné
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${newDocument.type_doc.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${fileExt}`;
        const filePath = `${eleve.id_ecole}/eleves/${eleve.id_eleve}/${fileName}`;
        
        // Upload du fichier
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, uploadFile, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error('Erreur lors de l\'upload:', uploadError);
          throw new Error(`Erreur lors de l'upload du fichier: ${uploadError.message}`);
        }
        
        // Récupérer l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
        
        lienFichier = publicUrl;
      }
      
      const documentToAdd = {
        id_eleve: eleve.id_eleve,
        type_doc: newDocument.type_doc,
        etat: newDocument.etat,
        lien_fichier: lienFichier,
        id_bureau: eleve.id_bureau || null,
        id_ecole: eleve.id_ecole || null
      };
      
      const addedDocument = await addDocument(documentToAdd);
      setDocuments([addedDocument, ...documents]);
      
      // Réinitialiser le formulaire
      setNewDocument({
        type_doc: '',
        etat: 'En attente',
        lien_fichier: ''
      });
      setUploadFile(null);
      setShowAddForm(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du document:', err);
      setError(err instanceof Error ? err.message : 'Impossible d\'ajouter le document.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour mettre à jour l'état d'un document
  const handleUpdateStatus = async (docId: number, newStatus: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedDoc = await updateDocumentStatus(docId, newStatus);
      
      // Mettre à jour la liste des documents
      setDocuments(documents.map(doc => 
        doc.id_doc === docId ? updatedDoc : doc
      ));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Impossible de mettre à jour le statut du document.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour supprimer un document
  const handleDeleteDocument = async (docId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Trouver le document à supprimer
      const docToDelete = documents.find(doc => doc.id_doc === docId);
      
      // Si le document a un fichier dans le storage, le supprimer
      if (docToDelete?.lien_fichier && docToDelete.lien_fichier.includes('supabase')) {
        try {
          // Extraire le chemin du fichier depuis l'URL publique
          const urlParts = docToDelete.lien_fichier.split('/storage/v1/object/public/documents/');
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            
            const { error: storageError } = await supabase.storage
              .from('documents')
              .remove([filePath]);
            
            if (storageError) {
              console.error('Erreur lors de la suppression du fichier:', storageError);
              // On continue quand même la suppression du document dans la base
            }
          }
        } catch (storageErr) {
          console.error('Erreur lors de la suppression du fichier du storage:', storageErr);
          // On continue quand même
        }
      }
      
      // Supprimer le document de la base de données
      await deleteDocument(docId);
      
      // Mettre à jour la liste des documents
      setDocuments(documents.filter(doc => doc.id_doc !== docId));
    } catch (err) {
      console.error('Erreur lors de la suppression du document:', err);
      setError('Impossible de supprimer le document.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour gérer le changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setNewDocument({
        ...newDocument,
        lien_fichier: e.target.files[0].name
      });
    }
  };
  
  // Fonction pour déterminer si un lien est une image
  const isImageUrl = (url: string): boolean => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };
  
  // Fonction pour ouvrir la visionneuse d'image
  const openImageViewer = (imageUrl: string) => {
    setViewerImage(imageUrl);
  };
  
  // Fonction pour fermer la visionneuse d'image
  const closeImageViewer = () => {
    setViewerImage(null);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
      {/* Visionneuse d'image */}
      {viewerImage && (
        <ImageViewer imageUrl={viewerImage} onClose={closeImageViewer} />
      )}
      {/* En-tête de la section */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium flex items-center">
          <FiFile className="mr-2 text-blue-500" />
          Documents
        </h3>
        
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors"
            disabled={isLoading || loading}
          >
            <FiPlus className="mr-1" />
            Ajouter
          </button>
        )}
      </div>
      
      {/* Affichage des erreurs */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-100 text-red-700">
          {error}
        </div>
      )}
      
      {/* Formulaire d'ajout de document */}
      {showAddForm && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h4 className="text-sm font-medium mb-3">Ajouter un document</h4>
          
          <div className="space-y-3">
            {/* Type de document */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Type de document</label>
              <select
                value={newDocument.type_doc}
                onChange={(e) => setNewDocument({...newDocument, type_doc: e.target.value})}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              >
                <option value="">Sélectionner un type</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* État du document */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">État</label>
              <select
                value={newDocument.etat}
                onChange={(e) => setNewDocument({...newDocument, etat: e.target.value})}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              >
                {documentStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            {/* Upload de fichier */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Fichier</label>
              <div className="flex items-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="document-file"
                  disabled={isLoading}
                />
                <label
                  htmlFor="document-file"
                  className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiUpload className="mr-2" />
                  Choisir un fichier
                </label>
                {uploadFile && (
                  <span className="ml-3 text-sm text-gray-500">{uploadFile.name}</span>
                )}
              </div>
            </div>
            
            {/* Lien du fichier (alternative à l'upload) */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Ou lien du fichier</label>
              <input
                type="text"
                value={newDocument.lien_fichier}
                onChange={(e) => setNewDocument({...newDocument, lien_fichier: e.target.value})}
                placeholder="https://exemple.com/document.pdf"
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading || !!uploadFile}
              />
            </div>
            
            {/* Boutons d'action */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                onClick={handleAddDocument}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                disabled={isLoading || !newDocument.type_doc || (!newDocument.lien_fichier && !uploadFile)}
              >
                <FiCheck className="mr-1" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Contenu de la section */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : documents.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucun document enregistré</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id_doc} className="border border-gray-100 rounded-md p-3 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col space-y-2">
                  {/* Première ligne: Type et état */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.etat)}`}>
                        {doc.etat || 'Non défini'}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">{doc.type_doc}</span>
                    </div>
                    <div className="flex space-x-2">
                      {/* Menu déroulant pour changer l'état */}
                      <select
                        value={doc.etat}
                        onChange={(e) => handleUpdateStatus(doc.id_doc, e.target.value)}
                        className="text-xs border border-gray-200 rounded p-1"
                        disabled={isLoading}
                      >
                        {documentStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      
                      {/* Bouton de téléchargement */}
                      {doc.lien_fichier && (
                        <button
                          onClick={() => window.open(doc.lien_fichier, '_blank')}
                          className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                          title="Télécharger"
                        >
                          <FiDownload size={16} />
                        </button>
                      )}
                      
                      {/* Bouton de suppression */}
                      <button
                        onClick={() => handleDeleteDocument(doc.id_doc)}
                        className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                        title="Supprimer"
                        disabled={isLoading}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Deuxième ligne: Fichier (image ou lien) */}
                  <div>
                    {doc.lien_fichier ? (
                      isImageUrl(doc.lien_fichier) ? (
                        <div className="relative group cursor-pointer" onClick={() => openImageViewer(doc.lien_fichier)}>
                          <div className="w-full h-24 bg-gray-100 rounded-md overflow-hidden relative">
                            <img 
                              src={doc.lien_fichier} 
                              alt={doc.type_doc} 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                              <FiEye className="text-white text-xl" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate" title={doc.lien_fichier}>
                            {doc.lien_fichier.split('/').pop()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-medium truncate max-w-full flex items-center" title={doc.lien_fichier}>
                          <FiFile className="mr-1 text-gray-400" />
                          {doc.lien_fichier.split('/').pop() || doc.lien_fichier}
                        </p>
                      )
                    ) : (
                      <p className="text-sm font-medium text-gray-500 italic">Pas de fichier</p>
                    )}
                  </div>
                  
                  {/* Troisième ligne: Date de dépôt */}
                  <div>
                    <p className="text-xs text-gray-500">
                      Déposé le {formatDate(doc.date_depot)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
