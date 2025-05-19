'use client';

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import dayjs from 'dayjs';
import { usePlanningData } from '@/hooks/Directeur/planning/usePlanningData';
import { useAvailableSlots } from '@/hooks/Directeur/planning/disponibilite/useAvailableSlots';
import { supabase } from '@/lib/supabase';

// Import des composants d'étapes
import DateHeureStep from './DateHeureStep';
import MoniteurEleveStep from './MoniteurEleveStep';
import TypeLeconStep from './TypeLeconStep';

interface AjouteHoraireProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (horaire: any) => void;
}

export default function AjouteHoraire({ 
  isOpen, 
  onClose,
  onSave 
}: AjouteHoraireProps) {
  const [step, setStep] = useState<number>(1);
  
  // États pour les informations utilisateur et bureau
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [id_ecole, setIdEcole] = useState<string>('0');
  const [id_bureau, setIdBureau] = useState<string>('0');
  
  // Vérifier si un bureau valide est sélectionné
  const isBureauValid = id_bureau !== '0';
  
  // États pour stocker les données du formulaire
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [heureDebut, setHeureDebut] = useState<dayjs.Dayjs | null>(dayjs().hour(8).minute(0));
  const [duree, setDuree] = useState<string>("60");
  
  // État pour stocker le créneau sélectionné
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  
  // Fonction pour formater l'heure pour l'API
  const formatHeureForAPI = (time: dayjs.Dayjs | null): string => {
    if (!time) return "08:00";
    return time.format('HH:mm');
  };
  
  const [moniteurId, setMoniteurId] = useState<string>("");
  const [eleveId, setEleveId] = useState<string>("");
  const [typeLecon, setTypeLecon] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [commentaire, setCommentaire] = useState<string>("");
  
  // États pour la recherche d'élèves avec suggestions
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEleve, setSelectedEleve] = useState<{id_eleve: number, nom: string, prenom: string} | null>(null);

  // Utiliser le même hook que PlanningFilters pour récupérer les données
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const { isLoading, error, data } = usePlanningData(
    id_ecole,
    id_bureau,
    startDate,
    endDate,
    'month'
  );
  
  // Récupérer les créneaux disponibles
  const { 
    isLoading: isLoadingSlots, 
    error: errorSlots, 
    data: availableSlotsData 
  } = useAvailableSlots(date, id_ecole, id_bureau);
  
  // Récupérer les informations de l'utilisateur depuis le localStorage
  useEffect(() => {
    const userData = localStorage.getItem('autosoft_user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setIdEcole(String(user.id_ecole));
      setIdBureau(String(user.id_bureau));
    }
    
    // Débogage
    console.log('ID Bureau actuel:', id_bureau);
  }, []);
  
  // Mettre à jour selectedSlot quand heureDebut change
  useEffect(() => {
    if (heureDebut) {
      setSelectedSlot(heureDebut.format('HH:mm'));
    }
  }, [heureDebut]);
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setStep(1);
    setDate(new Date().toISOString().split('T')[0]);
    setHeureDebut(dayjs().hour(8).minute(0));
    setDuree("60");
    setSelectedSlot("");
    setMoniteurId("");
    setEleveId("");
    setTypeLecon("");
    setSelectedCategory("");
    setCommentaire("");
    setSearchQuery('');
    setSelectedEleve(null);
  };
  
  // Fermer le modal et réinitialiser le formulaire
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  // Navigation entre les étapes
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  // Soumettre le formulaire
  const handleSubmit = () => {
    // Calculer l'heure de fin en fonction de l'heure de début et de la durée
    const heureDebutStr = formatHeureForAPI(heureDebut);
    const [heures, minutes] = heureDebutStr.split(':').map(Number);
    const debutMinutes = heures * 60 + minutes;
    const finMinutes = debutMinutes + parseInt(duree);
    const heureFinHeures = Math.floor(finMinutes / 60);
    const heureFinMinutes = finMinutes % 60;
    const heureFin = `${heureFinHeures}:${heureFinMinutes.toString().padStart(2, '0')}`;
    
    // Créer l'objet horaire
    const horaire = {
      date,
      heure_debut: heureDebutStr,
      heure_fin: heureFin,
      id_moniteur: moniteurId,
      id_eleve: selectedEleve ? String(selectedEleve.id_eleve) : eleveId,
      type_lecon: typeLecon,
      commentaire
    };
    
    // Appeler la fonction de sauvegarde
    onSave(horaire);
    
    // Fermer le modal et réinitialiser le formulaire
    handleClose();
  };
  
  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) return null;
  
  // Débogage
  console.log('Bureau valide (rendu):', isBureauValid);
  

  
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 text-black">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* En-tête du modal */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-medium">Ajouter un horaire</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        {/* Indicateur d'étapes */}
        <div className="flex justify-center p-4 border-b">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>
        
        {/* Message d'erreur si aucun bureau n'est sélectionné */}
        {!isBureauValid && (
          <div className="p-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Aucun bureau sélectionné</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Veuillez sélectionner un bureau spécifique sur lequel vous souhaitez enregistrer ce créneau horaire.</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                      onClick={handleClose}
                    >
                      Fermer et sélectionner un bureau
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Contenu du modal - Étape 1: Date et heure */}
        {isBureauValid && step === 1 && (
          <DateHeureStep
            date={date}
            setDate={setDate}
            heureDebut={heureDebut}
            setHeureDebut={setHeureDebut}
            duree={duree}
            setDuree={setDuree}
          />
        )}
        
        {/* useEffect pour mettre à jour selectedSlot quand heureDebut change */}
        
        {/* Contenu du modal - Étape 2: Moniteur et élève */}
        {isBureauValid && step === 2 && (
          <MoniteurEleveStep
            moniteurId={moniteurId}
            setMoniteurId={setMoniteurId}
            eleveId={eleveId}
            setEleveId={setEleveId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedEleve={selectedEleve}
            setSelectedEleve={setSelectedEleve}
            isLoading={isLoading}
            data={data}
            selectedSlot={selectedSlot}
            availableSlotsData={availableSlotsData}
            isLoadingSlots={isLoadingSlots}
          />
        )}
        
        {/* Contenu du modal - Étape 3: Type de leçon et commentaires */}
        {isBureauValid && step === 3 && (
          <TypeLeconStep
            typeLecon={typeLecon}
            setTypeLecon={setTypeLecon}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            commentaire={commentaire}
            setCommentaire={setCommentaire}
          />
        )}
        
        {/* Boutons de navigation */}
        {isBureauValid && (
          <div className="flex justify-between p-4 border-t">
            <div>
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Précédent
                </button>
              )}
            </div>
            
            <div>
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Enregistrer
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
