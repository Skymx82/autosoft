'use client';

import { useState } from 'react';
import { FiX, FiCalendar, FiUsers, FiFileText } from 'react-icons/fi';

interface AjouteHoraireProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (horaire: any) => void; // À typer correctement selon vos besoins
}

export default function AjouteHoraire({ isOpen, onClose, onSave }: AjouteHoraireProps) {
  const [step, setStep] = useState(1);
  
  // États pour stocker les données du formulaire
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [heureDebut, setHeureDebut] = useState<string>("8:00");
  const [duree, setDuree] = useState<string>("60");
  const [moniteurId, setMoniteurId] = useState<string>("");
  const [eleveId, setEleveId] = useState<string>("");
  const [typeLecon, setTypeLecon] = useState<string>("");
  const [commentaire, setCommentaire] = useState<string>("");
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setStep(1);
    setDate(new Date().toISOString().split('T')[0]);
    setHeureDebut("8:00");
    setDuree("60");
    setMoniteurId("");
    setEleveId("");
    setTypeLecon("");
    setCommentaire("");
  };
  
  // Fermer le modal et réinitialiser le formulaire
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  // Soumettre le formulaire
  const handleSubmit = () => {
    // Calculer l'heure de fin en fonction de l'heure de début et de la durée
    const [heures, minutes] = heureDebut.split(':').map(Number);
    const debutMinutes = heures * 60 + minutes;
    const finMinutes = debutMinutes + parseInt(duree);
    const heureFinHeures = Math.floor(finMinutes / 60);
    const heureFinMinutes = finMinutes % 60;
    const heureFin = `${heureFinHeures}:${heureFinMinutes.toString().padStart(2, '0')}`;
    
    // Créer l'objet horaire
    const horaire = {
      date,
      heure_debut: heureDebut,
      heure_fin: heureFin,
      id_moniteur: moniteurId,
      id_eleve: eleveId,
      type_lecon: typeLecon,
      commentaire
    };
    
    // Appeler la fonction onSave avec l'objet horaire
    onSave(horaire);
    
    // Fermer le modal et réinitialiser le formulaire
    handleClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 text-black">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* En-tête du modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {step === 1 ? 'Créer un nouvel horaire - Étape 1/3' : 
             step === 2 ? 'Créer un nouvel horaire - Étape 2/3' : 
             'Créer un nouvel horaire - Étape 3/3'}
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        {/* Contenu du modal - Étape 1: Date et heure */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <FiCalendar className="w-5 h-5" />
              <h3 className="font-medium">Date et heure</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={heureDebut}
                  onChange={(e) => setHeureDebut(e.target.value)}
                >
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={duree}
                  onChange={(e) => setDuree(e.target.value)}
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="90">1h30</option>
                  <option value="120">2 heures</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setStep(2)}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
        
        {/* Contenu du modal - Étape 2: Moniteur et élève */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <FiUsers className="w-5 h-5" />
              <h3 className="font-medium">Moniteur et élève</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Moniteur</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={moniteurId}
                  onChange={(e) => setMoniteurId(e.target.value)}
                >
                  <option value="">Sélectionner un moniteur</option>
                  {/* Ici, on pourrait mapper les moniteurs disponibles */}
                  <option value="1">Jean Dupont</option>
                  <option value="2">Marie Martin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Élève</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={eleveId}
                  onChange={(e) => setEleveId(e.target.value)}
                >
                  <option value="">Sélectionner un élève</option>
                  {/* Ici, on pourrait mapper les élèves disponibles */}
                  <option value="1">Lucas Bernard</option>
                  <option value="2">Sophie Petit</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between space-x-3 mt-6">
              <button 
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Précédent
              </button>
              <div className="flex space-x-3">
                <button 
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => setStep(3)}
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Contenu du modal - Étape 3: Type de leçon et commentaires */}
        {step === 3 && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <FiFileText className="w-5 h-5" />
              <h3 className="font-medium">Type de leçon et commentaires</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de leçon</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={typeLecon}
                  onChange={(e) => setTypeLecon(e.target.value)}
                >
                  <option value="">Sélectionner un type</option>
                  <option value="B manuelle">B manuelle</option>
                  <option value="B auto">B auto</option>
                  <option value="B manuelle conduite accompagnée">B manuelle conduite accompagnée</option>
                  <option value="B auto conduite accompagnée">B auto conduite accompagnée</option>
                  <option value="A">A</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="Examen">Examen</option>
                  <option value="Indisponible">Indisponible</option>
                  <option value="Disponible">Disponible</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-md" 
                  rows={3}
                  placeholder="Commentaire optionnel..."
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-between space-x-3 mt-6">
              <button 
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Précédent
              </button>
              <div className="flex space-x-3">
                <button 
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleSubmit}
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
