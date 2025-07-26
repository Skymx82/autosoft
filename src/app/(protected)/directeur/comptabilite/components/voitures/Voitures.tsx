'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiChevronDown, 
  FiInfo, 
  FiEdit, 
  FiTrash2, 
  FiCalendar, 
  FiTruck, 
  FiSettings, 
  FiAlertTriangle, 
  FiDollarSign, 
  FiPlusCircle,
  FiLoader,
  FiDownload,
  FiPlus,
  FiChevronRight
} from 'react-icons/fi';

interface Voiture {
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

interface VoituresProps {
}

interface ApiResponse {
  vehicules: Voiture[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  statistiques: {
    couts: {
      acquisition: number;
      entretien: number;
      carburant: number;
      total: number;
    };
    statuts: {
      actifs: number;
      enMaintenance: number;
      horsService: number;
      vendus: number;
      total: number;
    };
  };
  filtres: {
    marques: string[];
    categoriesPermis: string[];
  };
  entretiens: any[];
  kilometrages: any[];
}

const Voitures: React.FC<VoituresProps> = () => {
  // États pour les filtres et la pagination
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState<Voiture | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'entretien' | 'assurance' | 'couts'>('general');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les données
  const [voitures, setVoitures] = useState<Voiture[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [statistiques, setStatistiques] = useState({
    couts: {
      acquisition: 0,
      entretien: 0,
      carburant: 0,
      total: 0
    },
    statuts: {
      actifs: 0,
      enMaintenance: 0,
      horsService: 0,
      vendus: 0,
      total: 0
    }
  });
  
  // États pour les filtres
  const [filtreStatut, setFiltreStatut] = useState<string>('tous');
  const [filtreMarque, setFiltreMarque] = useState<string | null>(null);
  const [filtrePermis, setFiltrePermis] = useState<string | null>(null);
  const [optionsMarques, setOptionsMarques] = useState<string[]>([]);
  const [optionsPermis, setOptionsPermis] = useState<string[]>([]);
  
  // Fonction pour charger les données
  const fetchVehicules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simuler l'ID de l'école et du bureau (à remplacer par les valeurs réelles)
      const id_ecole = localStorage.getItem('id_ecole') || '1';
      const id_bureau = localStorage.getItem('id_bureau') || '0';
      
      // Construire l'URL avec les paramètres
      let url = `/directeur/comptabilite/components/voitures/api?id_ecole=${id_ecole}&id_bureau=${id_bureau}&page=${pagination.page}&limit=${pagination.limit}`;
      
      // Ajouter les filtres si nécessaire
      if (filtreStatut !== 'tous') {
        url += `&statut=${filtreStatut}`;
      }
      if (filtreMarque) {
        url += `&marque=${filtreMarque}`;
      }
      if (filtrePermis) {
        url += `&categorie_permis=${filtrePermis}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      // Mettre à jour les états avec les données reçues
      setVoitures(data.vehicules);
      setPagination(data.pagination);
      setStatistiques(data.statistiques);
      setOptionsMarques(data.filtres.marques);
      setOptionsPermis(data.filtres.categoriesPermis);
      
      // Si un véhicule était sélectionné, mettre à jour sa sélection avec les nouvelles données
      if (selectedVehicule) {
        const updatedVehicule = data.vehicules.find(v => v.id_vehicule === selectedVehicule.id_vehicule);
        if (updatedVehicule) {
          setSelectedVehicule(updatedVehicule);
        } else {
          setSelectedVehicule(null);
        }
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des véhicules:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Charger les données au chargement du composant et lorsque les filtres changent
  useEffect(() => {
    fetchVehicules();
  }, [pagination.page, pagination.limit, filtreStatut, filtreMarque, filtrePermis]);
  
  // Fonction pour changer de page
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  
  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Revenir à la première page
    setShowFilters(false); // Fermer le panneau des filtres
  };
  
  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFiltreStatut('tous');
    setFiltreMarque(null);
    setFiltrePermis(null);
    setPagination(prev => ({ ...prev, page: 1 }));
    setShowFilters(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestion des voitures</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
            title="Filtres avancés"
          >
            <FiFilter className="w-5 h-5" />
          </button>
          
          <button 
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
            title="Exporter"
          >
            <FiDownload className="w-5 h-5" />
          </button>
          
          <button 
            className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none flex items-center"
          >
            <FiPlus className="w-5 h-5 mr-1" />
            <span>Ajouter un véhicule</span>
          </button>
        </div>
      </div>
      
      {/* Filtres avancés */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="maintenance">En maintenance</option>
                <option value="vendu">Vendu</option>
                <option value="hors_service">Hors service</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input 
                type="text" 
                placeholder="Marque du véhicule"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input 
                type="text" 
                placeholder="Modèle du véhicule"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
      
      {/* Tableau des voitures */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FiLoader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500">Chargement des données...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FiAlertTriangle className="w-10 h-10 text-red-500 mb-4" />
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => fetchVehicules()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque/Modèle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mise en service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût acquisition</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kilométrage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prochain entretien</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {voitures.length > 0 ? (
              voitures.map((voiture) => (
                <tr 
                  key={voiture.id_vehicule} 
                  className={`hover:bg-gray-50 cursor-pointer ${selectedVehicule?.id_vehicule === voiture.id_vehicule ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedVehicule(voiture)}
                >
                  <td className="py-3 px-4 text-sm text-gray-500">{voiture.immatriculation}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{voiture.marque} {voiture.modele}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(voiture.date_mise_en_service).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{voiture.cout_acquisition.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{voiture.kilometrage_actuel.toLocaleString('fr-FR')} km</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(voiture.prochain_entretien_date).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        voiture.statut === 'Actif' ? 'bg-green-100 text-green-800' : 
                        voiture.statut === 'En maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {voiture.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => setSelectedVehicule(voiture)}
                      >
                        <FiInfo className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">
                  Aucun véhicule enregistré
                </td>
              </tr>
            )}
          </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {voitures.length} véhicules
        </div>
        
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
            Précédent
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
            Suivant
          </button>
        </div>
      </div>
      
      {/* Détails du véhicule sélectionné */}
      {selectedVehicule && (
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Détails du véhicule : {selectedVehicule.marque} {selectedVehicule.modele} ({selectedVehicule.immatriculation})
            </h3>
            <button 
              onClick={() => setSelectedVehicule(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-sm">Fermer</span>
            </button>
          </div>
          
          {/* Onglets */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <div className="flex items-center">
                  <FiTruck className="mr-2" />
                  Informations générales
                </div>
              </button>
              <button
                onClick={() => setActiveTab('entretien')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'entretien' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <div className="flex items-center">
                  <FiSettings className="mr-2" />
                  Entretien et contrôles
                </div>
              </button>
              <button
                onClick={() => setActiveTab('assurance')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'assurance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <div className="flex items-center">
                  <FiAlertTriangle className="mr-2" />
                  Assurance
                </div>
              </button>
              <button
                onClick={() => setActiveTab('couts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'couts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <div className="flex items-center">
                  <FiDollarSign className="mr-2" />
                  Coûts
                </div>
              </button>
            </nav>
          </div>
          
          {/* Contenu des onglets */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Informations du véhicule</h4>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Immatriculation:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.immatriculation}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Marque:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.marque}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Modèle:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.modele}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Année:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.annee}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Type de véhicule:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.type_vehicule}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Catégorie de permis:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.categorie_permis}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Caractéristiques techniques</h4>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Boîte de vitesse:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.boite_vitesse}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Carburant:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.carburant}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Mise en service:</span>
                    <span className="w-1/2 text-sm font-medium">{new Date(selectedVehicule.date_mise_en_service).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Kilométrage actuel:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.kilometrage_actuel.toLocaleString('fr-FR')} km</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Consommation moyenne:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.consommation_moyenne} L/100km</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Statut:</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedVehicule.statut === 'Actif' ? 'bg-green-100 text-green-800' : selectedVehicule.statut === 'En maintenance' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedVehicule.statut}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'entretien' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Contrôle technique</h4>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Dernier contrôle:</span>
                    <span className="w-1/2 text-sm font-medium">{new Date(selectedVehicule.dernier_controle_technique).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Prochain contrôle:</span>
                    <span className="w-1/2 text-sm font-medium">{new Date(selectedVehicule.prochain_controle_technique).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Jours restants:</span>
                    <span className="w-1/2 text-sm font-medium">
                      {Math.ceil((new Date(selectedVehicule.prochain_controle_technique).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    Planifier un contrôle
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Entretien périodique</h4>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Dernier entretien:</span>
                    <span className="w-1/2 text-sm font-medium">{new Date(selectedVehicule.dernier_entretien).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Prochain entretien (date):</span>
                    <span className="w-1/2 text-sm font-medium">{new Date(selectedVehicule.prochain_entretien_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Prochain entretien (km):</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.prochain_entretien_km.toLocaleString('fr-FR')} km</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Km restants:</span>
                    <span className="w-1/2 text-sm font-medium">
                      {(selectedVehicule.prochain_entretien_km - selectedVehicule.kilometrage_actuel).toLocaleString('fr-FR')} km
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    Planifier un entretien
                  </button>
                </div>
              </div>
              
              <div className="md:col-span-2 mt-4">
                <h4 className="font-medium text-gray-700 mb-3">Historique d'entretien</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500 italic">Aucun historique d'entretien disponible pour ce véhicule.</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'assurance' && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Informations d'assurance</h4>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-1/3 text-sm text-gray-500">Numéro de contrat:</span>
                    <span className="w-2/3 text-sm font-medium">{selectedVehicule.assurance_numero_contrat}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 text-sm text-gray-500">Date d'expiration:</span>
                    <span className="w-2/3 text-sm font-medium">{new Date(selectedVehicule.assurance_date_expiration).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/3 text-sm text-gray-500">Jours restants:</span>
                    <span className="w-2/3 text-sm font-medium">
                      {Math.ceil((new Date(selectedVehicule.assurance_date_expiration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    Télécharger l'attestation
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                    Renouveler l'assurance
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-3">Sinistres déclarés</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500 italic">Aucun sinistre déclaré pour ce véhicule.</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'couts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Coûts d'acquisition</h4>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Prix d'achat:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.cout_acquisition.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Date d'acquisition:</span>
                    <span className="w-1/2 text-sm font-medium">{new Date(selectedVehicule.date_mise_en_service).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Coût par jour:</span>
                    <span className="w-1/2 text-sm font-medium">
                      {(selectedVehicule.cout_acquisition / Math.max(1, Math.ceil((new Date().getTime() - new Date(selectedVehicule.date_mise_en_service).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Coûts d'entretien et carburant</h4>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Entretien total:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.cout_entretien_total.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Carburant total:</span>
                    <span className="w-1/2 text-sm font-medium">{selectedVehicule.cout_carburant_total.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex">
                    <span className="w-1/2 text-sm text-gray-500">Coût total:</span>
                    <span className="w-1/2 text-sm font-medium">
                      {(selectedVehicule.cout_acquisition + selectedVehicule.cout_entretien_total + selectedVehicule.cout_carburant_total).toLocaleString('fr-FR')} €
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 mt-4">
                <h4 className="font-medium text-gray-700 mb-3">Analyse des coûts</h4>
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Coût par kilomètre</p>
                      <p className="text-xl font-bold text-gray-800">
                        {(selectedVehicule.cout_acquisition + selectedVehicule.cout_entretien_total + selectedVehicule.cout_carburant_total) / Math.max(1, selectedVehicule.kilometrage_actuel) < 0.01 ? 
                          '< 0,01' : 
                          ((selectedVehicule.cout_acquisition + selectedVehicule.cout_entretien_total + selectedVehicule.cout_carburant_total) / Math.max(1, selectedVehicule.kilometrage_actuel)).toFixed(2)
                        } €/km
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Coût mensuel moyen</p>
                      <p className="text-xl font-bold text-gray-800">
                        {((selectedVehicule.cout_acquisition + selectedVehicule.cout_entretien_total + selectedVehicule.cout_carburant_total) / 
                          Math.max(1, Math.ceil((new Date().getTime() - new Date(selectedVehicule.date_mise_en_service).getTime()) / (1000 * 60 * 60 * 24 * 30)))).toFixed(2)} €/mois
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Coût carburant/100km</p>
                      <p className="text-xl font-bold text-gray-800">
                        {((selectedVehicule.cout_carburant_total / Math.max(1, selectedVehicule.kilometrage_actuel)) * 100).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Résumé des coûts */}
      {!isLoading && !error && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Résumé des coûts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Coût total d'acquisition</p>
              <p className="text-xl font-bold text-gray-800">
                {statistiques.couts.acquisition.toLocaleString('fr-FR')} €
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Coût total d'entretien</p>
              <p className="text-xl font-bold text-gray-800">
                {statistiques.couts.entretien.toLocaleString('fr-FR')} €
              </p>
              <p className="text-xs text-gray-500 mt-1">Basé sur l'historique d'entretien</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Coût total</p>
              <p className="text-xl font-bold text-gray-800">
                {statistiques.couts.total.toLocaleString('fr-FR')} €
              </p>
              <p className="text-xs text-gray-500 mt-1">Acquisition + entretien + carburant</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voitures;
