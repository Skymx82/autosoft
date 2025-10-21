'use client';

import { useState, useEffect } from 'react';
import DirectorLayout from '@/components/layout/DirectorLayout';
import { FiPlus, FiEdit, FiTrash2, FiTruck, FiAlertCircle, FiCheckCircle, FiClock, FiSearch, FiFilter } from 'react-icons/fi';
import AjoutVehiculeModal from './components/AjoutVehicule/page';
import ModifierVehiculeModal from './components/DetailVehicule/page';

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
  dernier_controle_technique: string;
  prochain_controle_technique: string;
  dernier_entretien: string;
  prochain_entretien_km: number;
  prochain_entretien_date: string;
  assurance_numero_contrat: string;
  assurance_date_expiration: string;
  cout_acquisition: number;
  cout_entretien_total: number;
  cout_carburant_total: number;
  consommation_moyenne: number;
  statut: string;
  id_bureau: number;
  id_ecole: number;
}

export default function VehiculesPage() {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [vehiculeToDelete, setVehiculeToDelete] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vehiculeToEdit, setVehiculeToEdit] = useState<Vehicule | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fonction pour récupérer les véhicules depuis l'API
  const fetchVehicules = async () => {
    setLoading(true);
    
    try {
      // Vérifier qu'on est bien côté client (accès au localStorage)
      if (typeof window === 'undefined') {
        throw new Error("Cette fonction ne peut être exécutée que côté client");
      }
      
      // Récupérer les informations de l'utilisateur connecté
      const storedUser = localStorage.getItem('autosoft_user');
      if (!storedUser) {
        throw new Error("Utilisateur non connecté");
      }
      
      // Extraire l'ID de l'école et du bureau
      const userData = JSON.parse(storedUser);
      const id_ecole = userData.id_ecole;
      const id_bureau = userData.id_bureau === 0 ? 'all' : userData.id_bureau;
      
      if (!id_ecole) {
        throw new Error("ID de l'auto-école non disponible");
      }
      
      // Construire l'URL de l'API
      const url = `/directeur/vehicules/api?id_ecole=${id_ecole}&id_bureau=${id_bureau}`;
      console.log('🌐 Fetching vehicules from:', url);
      
      // Appeler l'API
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mettre à jour les états avec les données récupérées
      setVehicules(data.vehicules || []);
      
    } catch (error: any) {
      console.error('Erreur lors de la récupération des véhicules:', error);
      setVehicules([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les véhicules au montage du composant
  useEffect(() => {
    fetchVehicules();
  }, []);

  // Filtrer les véhicules
  const vehiculesFiltres = vehicules.filter(vehicule => {
    const matchSearch = vehicule.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       vehicule.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       vehicule.modele.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = filterStatut === 'tous' || vehicule.statut === filterStatut;
    const matchType = filterType === 'tous' || vehicule.type_vehicule === filterType;
    
    return matchSearch && matchStatut && matchType;
  });

  // Statistiques
  const stats = {
    total: vehicules.length,
    disponibles: vehicules.filter(v => v.statut === 'Actif').length,
    enCours: vehicules.filter(v => v.statut === 'En cours').length,
    maintenance: vehicules.filter(v => v.statut === 'Maintenance').length,
  };

  // Fonction pour obtenir la couleur du badge de statut
  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'Hors service':
        return 'bg-red-100 text-red-800';
      case 'Inactif':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'Actif':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'En cours':
        return <FiClock className="w-4 h-4" />;
      case 'Maintenance':
        return <FiAlertCircle className="w-4 h-4" />;
      case 'Hors service':
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Fonction pour formater le statut
  const formatStatut = (statut: string) => {
    return statut;
  };

  return (
    <DirectorLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-900">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parc Automobile</h1>
              <p className="text-gray-500 mt-1">Gérez vos véhicules et leur maintenance</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Ajouter un véhicule
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total véhicules</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FiTruck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Disponibles</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.disponibles}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">En cours</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{stats.enCours}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FiClock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Maintenance</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">{stats.maintenance}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <FiAlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Recherche */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par immatriculation, marque ou modèle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bouton filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiFilter className="w-5 h-5 mr-2" />
                Filtres
              </button>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={filterStatut}
                    onChange={(e) => setFilterStatut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tous">Tous les statuts</option>
                    <option value="Actif">Actif</option>
                    <option value="En cours">En cours</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Hors service">Hors service</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tous">Tous les types</option>
                    <option value="Voiture">Voiture</option>
                    <option value="Moto">Moto</option>
                    <option value="Camion">Camion</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Liste des véhicules */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Chargement des véhicules...</p>
          </div>
        ) : vehiculesFiltres.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FiTruck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun véhicule trouvé</p>
            <p className="text-gray-400 text-sm mt-2">Essayez de modifier vos filtres de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehiculesFiltres.map((vehicule) => (
              <div key={vehicule.id_vehicule} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* En-tête de la carte */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{vehicule.immatriculation}</h3>
                      <p className="text-sm text-gray-500">{vehicule.marque} {vehicule.modele}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatutBadge(vehicule.statut)}`}>
                      <span className="mr-1">{getStatutIcon(vehicule.statut)}</span>
                      {formatStatut(vehicule.statut)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{vehicule.type_vehicule}</span>
                    <span className="mx-2">•</span>
                    <span>{vehicule.annee}</span>
                    <span className="mx-2">•</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Permis {vehicule.categorie_permis}</span>
                  </div>
                </div>

                {/* Informations principales */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Kilométrage</span>
                    <span className="text-sm font-medium text-gray-900">{vehicule.kilometrage_actuel.toLocaleString()} km</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Prochain entretien</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(vehicule.prochain_entretien_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Contrôle technique</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(vehicule.prochain_controle_technique).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
                  <button 
                    onClick={() => {
                      setVehiculeToEdit(vehicule);
                      setShowEditModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setVehiculeToDelete(vehicule.id_vehicule);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'ajout de véhicule */}
      <AjoutVehiculeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={() => {
          // Fermer le modal
          setShowAddModal(false);
          // Recharger la liste des véhicules
          fetchVehicules();
        }}
      />

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setVehiculeToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (!vehiculeToDelete) return;
                  
                  try {
                    const response = await fetch(`/directeur/vehicules/api/supprimer?id_vehicule=${vehiculeToDelete}`, {
                      method: 'DELETE',
                    });
                    
                    if (!response.ok) {
                      const errorData = await response.json();
                      alert(errorData.error || 'Erreur lors de la suppression');
                      return;
                    }
                    
                    // Succès
                    setShowDeleteConfirm(false);
                    setVehiculeToDelete(null);
                    fetchVehicules();
                    
                  } catch (error) {
                    console.error('Erreur:', error);
                    alert('Erreur lors de la suppression du véhicule');
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification de véhicule */}
      <ModifierVehiculeModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setVehiculeToEdit(null);
        }}
        onSave={() => {
          setShowEditModal(false);
          setVehiculeToEdit(null);
          fetchVehicules();
        }}
        vehicule={vehiculeToEdit}
      />
    </DirectorLayout>
  );
}
