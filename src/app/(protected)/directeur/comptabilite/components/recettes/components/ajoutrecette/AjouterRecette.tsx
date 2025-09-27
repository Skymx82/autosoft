'use client';

import React, { useState, useCallback } from 'react';
import { FiX, FiUpload, FiFile, FiTrash2 } from 'react-icons/fi';
import EleveSelector from './components/EleveSelector';

interface AjouterRecetteProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recette: {
    date: string;
    categorie: string;
    description: string;
    montant: number;
    tva: number;
    client: number | null; // Modifié pour accepter un ID d'élève ou null
    modePaiement: string;
    statut: 'encaissé' | 'en attente';
    justificatif?: File;
  }) => void;
  id_ecole?: string;
  id_bureau?: string;
}

const AjouterRecette: React.FC<AjouterRecetteProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  id_ecole,
  id_bureau
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    categorie: '',
    description: '',
    montant: 0,
    tva: 0,
    tauxTVA: 20, // Taux par défaut à 20%
    modePaiement: 'Carte bancaire',
    statut: 'encaissé' as 'encaissé' | 'en attente'
  });
  
  // État pour l'élève sélectionné
  const [selectedEleveId, setSelectedEleveId] = useState<number | null>(null);
  
  const [justificatif, setJustificatif] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Pour les champs numériques, convertir en nombre
    if (name === 'montant') {
      // Conserver exactement la valeur saisie sans arrondi
      let montant: number;
      
      // Si la valeur est vide, utiliser 0
      if (value === '') {
        montant = 0;
      } else {
        // Utiliser parseFloat mais sans arrondi
        montant = parseFloat(value);
        
        // Si la valeur n'est pas un nombre valide, utiliser 0
        if (isNaN(montant)) {
          montant = 0;
        }
      }
      
      // Calculer la TVA avec précision
      const tva = Math.round((montant * formData.tauxTVA) / 100 * 100) / 100;
      
      setFormData({
        ...formData,
        montant, // Montant exact saisi
        tva      // TVA calculée avec précision
      });
    } else if (name === 'tauxTVA') {
      const tauxTVA = parseFloat(value) || 0;
      
      // Calculer la TVA avec précision
      const tva = Math.round((formData.montant * tauxTVA) / 100 * 100) / 100;
      
      setFormData({
        ...formData,
        tauxTVA,
        tva      // TVA calculée avec précision
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // Vérifier que c'est un fichier PDF, image ou document
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setJustificatif(file);
      } else {
        alert('Format de fichier non supporté. Veuillez utiliser PDF, JPG, PNG ou DOC.');
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setJustificatif(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setJustificatif(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Créer un objet avec toutes les données nécessaires
    const recetteData = {
      ...formData,
      client: selectedEleveId, // Utiliser l'ID de l'élève sélectionné
      justificatif: justificatif || undefined
    };
    
    // Appeler la fonction onSave avec les données
    onSave(recetteData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-start justify-center z-50 text-gray-800 overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md my-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Ajouter une recette</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Catégorie */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner</option>
                <option value="Forfait">Forfait</option>
                <option value="Leçon">Leçon</option>
                <option value="Examen">Examen</option>
                <option value="Inscription">Inscription</option>
                <option value="Livre">Livre/Matériel</option>
                <option value="Autres">Autres</option>
              </select>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                required
              />
            </div>

            {/* Montant HT */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant HT (€)</label>
              <input
                type="number"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Taux de TVA */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Taux de TVA (%)</label>
              <select
                name="tauxTVA"
                value={formData.tauxTVA}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="0">0%</option>
                <option value="5.5">5.5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
              </select>
              <div className="text-xs text-gray-500 mt-1">
                Montant TVA: {formData.tva.toFixed(2)} €
              </div>
            </div>

            {/* Sélecteur d'élève (remplace le champ client) */}
            <div className="col-span-2">
              <EleveSelector
                selectedEleveId={selectedEleveId}
                onEleveChange={setSelectedEleveId}
              />
            </div>

            {/* Mode de paiement */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
              <select
                name="modePaiement"
                value={formData.modePaiement}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Espèces">Espèces</option>
                <option value="Carte bancaire">Carte bancaire</option>
                <option value="Chèque">Chèque</option>
                <option value="Virement">Virement</option>
                <option value="Prélèvement">Prélèvement</option>
              </select>
            </div>

            {/* Statut */}
            <div className="col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="statut-encaisse"
                  name="statut"
                  checked={formData.statut === 'encaissé'}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      statut: e.target.checked ? 'encaissé' : 'en attente'
                    });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="statut-encaisse" className="ml-2 block text-sm text-gray-700">
                  Recette déjà encaissée
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.statut === 'encaissé' ? 'Cette recette est marquée comme encaissée' : 'Cette recette est en attente d\'encaissement'}
              </p>
            </div>
            
            {/* Zone de dépôt pour justificatif */}
            <div className="col-span-2 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Justificatif</label>
              <div 
                className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center h-32 cursor-pointer transition-colors ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                />
                
                {justificatif ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <FiFile className="w-6 h-6 text-blue-500 mr-2" />
                      <span className="text-sm font-medium truncate max-w-[200px]">{justificatif.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{(justificatif.size / 1024).toFixed(1)} KB</div>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeFile(); }}
                      className="mt-2 text-red-600 hover:text-red-800 flex items-center text-xs"
                    >
                      <FiTrash2 className="w-3 h-3 mr-1" /> Supprimer
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      Glissez et déposez un fichier ici, ou<br />
                      <span className="text-blue-500">cliquez pour sélectionner</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG ou DOC (max 5MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjouterRecette;
