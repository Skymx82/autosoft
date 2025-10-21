'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiTruck, FiCheckCircle } from 'react-icons/fi';

interface Vehicule {
  id_vehicule: number;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  type_vehicule: string;
  categorie_permis: string;
  boite_vitesse: string;
  carburant: string;
  date_mise_en_service: string;
  kilometrage_actuel: number;
  prochain_controle_technique: string;
  prochain_entretien_date: string;
  prochain_entretien_km: number;
  assurance_numero_contrat: string;
  assurance_date_expiration: string;
  cout_acquisition: number;
  statut: string;
}

interface ModifierVehiculeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  vehicule: Vehicule | null;
}

const ModifierVehiculeModal: React.FC<ModifierVehiculeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicule
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // États du formulaire
  const [formData, setFormData] = useState({
    immatriculation: '',
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    type_vehicule: 'Voiture',
    categorie_permis: 'B',
    boite_vitesse: 'Manuelle',
    carburant: 'Essence',
    date_mise_en_service: '',
    kilometrage_actuel: 0,
    prochain_controle_technique: '',
    prochain_entretien_date: '',
    prochain_entretien_km: 0,
    assurance_numero_contrat: '',
    assurance_date_expiration: '',
    cout_acquisition: 0,
    statut: 'Actif'
  });

  // Pré-remplir le formulaire avec les données du véhicule
  useEffect(() => {
    if (vehicule) {
      setFormData({
        immatriculation: vehicule.immatriculation || '',
        marque: vehicule.marque || '',
        modele: vehicule.modele || '',
        annee: vehicule.annee || new Date().getFullYear(),
        type_vehicule: vehicule.type_vehicule || 'Voiture',
        categorie_permis: vehicule.categorie_permis || 'B',
        boite_vitesse: vehicule.boite_vitesse || 'Manuelle',
        carburant: vehicule.carburant || 'Essence',
        date_mise_en_service: vehicule.date_mise_en_service || '',
        kilometrage_actuel: vehicule.kilometrage_actuel || 0,
        prochain_controle_technique: vehicule.prochain_controle_technique || '',
        prochain_entretien_date: vehicule.prochain_entretien_date || '',
        prochain_entretien_km: vehicule.prochain_entretien_km || 0,
        assurance_numero_contrat: vehicule.assurance_numero_contrat || '',
        assurance_date_expiration: vehicule.assurance_date_expiration || '',
        cout_acquisition: vehicule.cout_acquisition || 0,
        statut: vehicule.statut || 'Actif'
      });
    }
  }, [vehicule]);

  if (!isOpen || !vehicule) return null;

  // Gérer le changement des champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['annee', 'kilometrage_actuel', 'prochain_entretien_km', 'cout_acquisition'].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  // Navigation
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fermer et réinitialiser
  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  // Soumettre les modifications
  const handleFinalSubmit = async () => {
    setLoading(true);
    
    try {
      // Appeler l'API de modification
      const response = await fetch('/directeur/vehicules/components/DetailVehicule/api', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_vehicule: vehicule.id_vehicule,
          ...formData
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Erreur lors de la modification du véhicule');
        setLoading(false);
        return;
      }
      
      // Succès - afficher le message
      setShowSuccess(true);
      
      // Fermer après 2 secondes
      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
        onSave();
      }, 2000);
      
    } catch (error: any) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification du véhicule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Message de succès */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-[60] animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <FiCheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Succès !</p>
              <p className="text-sm">Le véhicule a été modifié avec succès</p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50 p-4 text-gray-900">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiTruck className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Modifier le véhicule
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Indicateur d'étapes */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step === 1 ? 'Informations' : step === 2 ? 'Technique' : 'Administratif'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Contenu des étapes */}
        <div className="p-6">
          {/* Étape 1: Informations de base */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations de base</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Immatriculation *
                  </label>
                  <input
                    type="text"
                    name="immatriculation"
                    value={formData.immatriculation}
                    onChange={handleChange}
                    placeholder="AB-123-CD"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut *
                  </label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En cours">En cours</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Hors service">Hors service</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marque *
                  </label>
                  <input
                    type="text"
                    name="marque"
                    value={formData.marque}
                    onChange={handleChange}
                    placeholder="Renault"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modèle *
                  </label>
                  <input
                    type="text"
                    name="modele"
                    value={formData.modele}
                    onChange={handleChange}
                    placeholder="Clio 5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année *
                  </label>
                  <input
                    type="number"
                    name="annee"
                    value={formData.annee}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de véhicule *
                  </label>
                  <select
                    name="type_vehicule"
                    value={formData.type_vehicule}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Voiture">Voiture</option>
                    <option value="Moto">Moto</option>
                    <option value="Camion">Camion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie permis *
                  </label>
                  <select
                    name="categorie_permis"
                    value={formData.categorie_permis}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A">A</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B">B</option>
                    <option value="BE">BE</option>
                    <option value="C">C</option>
                    <option value="CE">CE</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de mise en service
                  </label>
                  <input
                    type="date"
                    name="date_mise_en_service"
                    value={formData.date_mise_en_service}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Informations techniques */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations techniques</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Boîte de vitesse *
                  </label>
                  <select
                    name="boite_vitesse"
                    value={formData.boite_vitesse}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Manuelle">Manuelle</option>
                    <option value="Automatique">Automatique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carburant *
                  </label>
                  <select
                    name="carburant"
                    value={formData.carburant}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Électrique">Électrique</option>
                    <option value="Hybride">Hybride</option>
                    <option value="GPL">GPL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kilométrage actuel *
                  </label>
                  <input
                    type="number"
                    name="kilometrage_actuel"
                    value={formData.kilometrage_actuel}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prochain entretien (km)
                  </label>
                  <input
                    type="number"
                    name="prochain_entretien_km"
                    value={formData.prochain_entretien_km}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prochain contrôle technique
                  </label>
                  <input
                    type="date"
                    name="prochain_controle_technique"
                    value={formData.prochain_controle_technique}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prochain entretien (date)
                  </label>
                  <input
                    type="date"
                    name="prochain_entretien_date"
                    value={formData.prochain_entretien_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Informations administratives */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations administratives</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de contrat d'assurance
                  </label>
                  <input
                    type="text"
                    name="assurance_numero_contrat"
                    value={formData.assurance_numero_contrat}
                    onChange={handleChange}
                    placeholder="ASS-2024-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'expiration assurance
                  </label>
                  <input
                    type="date"
                    name="assurance_date_expiration"
                    value={formData.assurance_date_expiration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coût d'acquisition (€)
                  </label>
                  <input
                    type="number"
                    name="cout_acquisition"
                    value={formData.cout_acquisition}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={currentStep === 1 ? handleClose : goToPrevStep}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {currentStep === 1 ? 'Annuler' : 'Précédent'}
            </button>

            {currentStep < 3 ? (
              <button
                onClick={goToNextStep}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <FiTruck className="mr-2" />
                    Modifier le véhicule
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ModifierVehiculeModal;
