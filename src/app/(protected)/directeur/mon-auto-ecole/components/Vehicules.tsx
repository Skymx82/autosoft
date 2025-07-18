/**
 * Composant de gestion des véhicules pour l'auto-école
 * 
 * Ce composant permet de visualiser, filtrer, ajouter, modifier et supprimer des véhicules
 * dans le parc automobile de l'auto-école. Il utilise l'API ApiVehicule.ts pour les
 * opérations CRUD et ApiBureaux.ts pour récupérer la liste des bureaux (utilisée pour le filtrage).
 */

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';
import { FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa';
// Import des fonctions et types depuis l'API des véhicules
import { getVehicules, filterVehicules, Vehicule, VehiculeFilters } from '../api/ApiVehicule';
// Import des fonctions et types depuis l'API des bureaux (utilisée pour le filtre par bureau)
import { fetchBureaux, Bureau } from '../api/ApiBureaux';

/**
 * Interface pour les filtres locaux utilisés dans le composant
 * 
 * Cette interface est légèrement différente de l'interface VehiculeFilters de l'API
 * car elle est adaptée à l'utilisation dans les composants d'interface utilisateur.
 * Les valeurs sont toutes des chaînes de caractères (y compris pour les IDs) et
 * utilisent 'all' comme valeur spéciale pour indiquer l'absence de filtre.
 */
interface LocalVehiculeFilters {
  searchTerm: string;      // Terme de recherche (immatriculation, marque, modèle)
  type_vehicule: string;   // Type de véhicule (Auto, Moto, Poids lourd, ou 'all')
  categorie_permis: string; // Catégorie de permis (B, A, C, etc., ou 'all')
  statut: string;          // Statut du véhicule (Actif, En maintenance, etc., ou 'all')
  bureau: string;          // ID du bureau ou 'all' pour tous les bureaux
}

export default function AutoEcoleVehicules() {
  // ===== ÉTATS =====
  
  // États principaux pour les données des véhicules
  const [vehicules, setVehicules] = useState<Vehicule[]>([]); // Tous les véhicules non filtrés
  const [filteredVehicules, setFilteredVehicules] = useState<Vehicule[]>([]); // Véhicules après application des filtres
  
  // États pour le chargement et les erreurs
  const [isLoading, setIsLoading] = useState(false); // Indicateur de chargement
  const [error, setError] = useState<string | null>(null); // Message d'erreur éventuel
  
  // États pour les modals (ajout, modification, suppression)
  const [showAddModal, setShowAddModal] = useState(false); // Modal d'ajout
  const [showEditModal, setShowEditModal] = useState(false); // Modal de modification
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal de suppression
  const [selectedVehicule, setSelectedVehicule] = useState<Vehicule | null>(null); // Véhicule sélectionné pour édition/suppression
  
  // État pour la liste des bureaux (utilisée dans le filtre)
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  
  // État pour les filtres appliqués à la liste des véhicules
  const [filters, setFilters] = useState<LocalVehiculeFilters>({
    searchTerm: '',
    type_vehicule: 'all',
    categorie_permis: 'all',
    statut: 'all',
    bureau: 'all'
  });

  /**
   * Récupère la liste des véhicules depuis l'API
   * 
   * Cette fonction utilise l'API ApiVehicule.ts pour récupérer les véhicules
   * associés à l'auto-école de l'utilisateur connecté. Elle gère également
   * les états de chargement et d'erreur.
   */
  const fetchVehicules = async () => {
    // Activer l'indicateur de chargement et réinitialiser les erreurs
    setIsLoading(true);
    setError(null);
    
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
      
      // Appeler l'API pour récupérer les véhicules
      const data = await getVehicules(id_ecole, id_bureau);
      
      // Mettre à jour les états avec les données récupérées
      setVehicules(data);
      setFilteredVehicules(data); // Initialiser les véhicules filtrés avec tous les véhicules
      
    } catch (error: any) {
      // Gérer les erreurs
      console.error('Erreur lors de la récupération des véhicules:', error);
      setError(error.message || "Erreur lors de la récupération des véhicules");
    } finally {
      // Désactiver l'indicateur de chargement
      setIsLoading(false);
    }
  };

  /**
   * Récupère la liste des bureaux depuis l'API
   * 
   * Cette fonction utilise l'API ApiBureaux.ts pour récupérer les bureaux
   * associés à l'auto-école. Ces bureaux sont utilisés dans le filtre
   * pour permettre à l'utilisateur de filtrer les véhicules par bureau.
   */
  const loadBureaux = async () => {
    try {
      // Appeler l'API pour récupérer les bureaux
      const data = await fetchBureaux();
      // Mettre à jour l'état avec les bureaux récupérés
      setBureaux(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des bureaux:', error);
    }
  };

  /**
   * Effet pour charger les données initiales au montage du composant
   * 
   * Cet effet s'exécute une seule fois au chargement du composant et déclenche
   * la récupération des véhicules et des bureaux depuis les APIs.
   */
  useEffect(() => {
    fetchVehicules(); // Récupérer les véhicules
    loadBureaux();    // Récupérer les bureaux pour le filtre
  }, []);

  /**
   * Applique les filtres à la liste des véhicules
   * 
   * Cette fonction prend les filtres définis dans l'interface utilisateur,
   * les convertit au format attendu par l'API, puis utilise la fonction
   * filterVehicules de l'API pour filtrer la liste des véhicules.
   * 
   * @param currentFilters - Les filtres à appliquer au format de l'interface utilisateur
   */
  const applyFilters = (currentFilters: LocalVehiculeFilters) => {
    // Vérifier si la liste des véhicules est vide
    if (!vehicules || vehicules.length === 0) {
      setFilteredVehicules([]);
      return;
    }
    
    // Convertir les filtres locaux au format attendu par l'API
    // Les valeurs 'all' sont converties en undefined pour indiquer l'absence de filtre
    const apiFilters: VehiculeFilters = {
      searchTerm: currentFilters.searchTerm,
      type_vehicule: currentFilters.type_vehicule === 'all' ? undefined : currentFilters.type_vehicule,
      categorie_permis: currentFilters.categorie_permis === 'all' ? undefined : currentFilters.categorie_permis,
      statut: currentFilters.statut === 'all' ? undefined : currentFilters.statut,
      id_bureau: currentFilters.bureau === 'all' ? undefined : currentFilters.bureau
    };
    
    // Utiliser la fonction de filtrage de l'API et mettre à jour l'état
    const filtered = filterVehicules(vehicules, apiFilters);
    setFilteredVehicules(filtered);
  };

  /**
   * Gère le changement des filtres dans l'interface utilisateur
   * 
   * Cette fonction est appelée lorsque l'utilisateur modifie un filtre dans l'interface.
   * Elle met à jour l'état des filtres et applique les nouveaux filtres à la liste des véhicules.
   * 
   * @param newFilters - Les nouveaux filtres à appliquer
   */
  const handleFilterChange = (newFilters: LocalVehiculeFilters) => {
    setFilters(newFilters); // Mettre à jour l'état des filtres
    applyFilters(newFilters); // Appliquer les filtres à la liste des véhicules
  };

  /**
   * Renvoie l'icône correspondant au type de véhicule
   * 
   * Cette fonction détermine quelle icône afficher en fonction du type de véhicule.
   * Chaque type de véhicule a une icône et une couleur spécifiques.
   * 
   * @param type - Le type de véhicule (Auto, Moto, Poids lourd)
   * @returns L'élément React représentant l'icône appropriée
   */
  const getVehiculeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'auto':
        return <FaCar className="text-blue-500" />; // Voiture en bleu
      case 'moto':
        return <FaMotorcycle className="text-green-500" />; // Moto en vert
      case 'poids lourd':
        return <FaTruck className="text-red-500" />; // Camion en rouge
      default:
        return <FaCar className="text-gray-500" />; // Par défaut, voiture en gris
    }
  };

  /**
   * Détermine les classes CSS à appliquer en fonction du statut du véhicule
   * 
   * Cette fonction renvoie les classes Tailwind CSS à appliquer pour colorer
   * l'indicateur de statut en fonction de la valeur du statut.
   * 
   * @param status - Le statut du véhicule (Actif, En maintenance, Hors service, Vendu)
   * @returns Les classes CSS à appliquer
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800'; // Vert pour les véhicules actifs
      case 'En maintenance':
        return 'bg-yellow-100 text-yellow-800'; // Jaune pour les véhicules en maintenance
      case 'Hors service':
        return 'bg-red-100 text-red-800'; // Rouge pour les véhicules hors service
      case 'Vendu':
        return 'bg-gray-100 text-gray-800'; // Gris pour les véhicules vendus
      default:
        return 'bg-gray-100 text-gray-800'; // Gris par défaut
    }
  };

  /**
   * Formate une date au format français
   * 
   * Cette fonction prend une chaîne de date et la convertit au format français (JJ/MM/AAAA).
   * Si la date n'est pas définie, elle renvoie un tiret.
   * 
   * @param dateString - La date à formater (peut être undefined)
   * @returns La date formatée ou un tiret si la date n'est pas définie
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR'); // Format: JJ/MM/AAAA
  };

  /**
   * Vérifie si un contrôle technique expire bientôt (dans moins d'un mois)
   * 
   * Cette fonction compare la date du prochain contrôle technique avec la date actuelle
   * et détermine si le contrôle technique expire dans moins d'un mois.
   * 
   * @param date - La date du prochain contrôle technique (peut être undefined)
   * @returns true si le contrôle technique expire dans moins d'un mois, false sinon
   */
  const isCtcExpiringSoon = (date?: string) => {
    if (!date) return false;
    
    const ctcDate = new Date(date);
    const today = new Date();
    const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 jours en millisecondes
    
    return ctcDate.getTime() - today.getTime() < oneMonth;
  };

  /**
   * Vérifie si une assurance expire bientôt (dans moins d'un mois)
   * 
   * Cette fonction compare la date d'expiration de l'assurance avec la date actuelle
   * et détermine si l'assurance expire dans moins d'un mois.
   * 
   * @param date - La date d'expiration de l'assurance (peut être undefined)
   * @returns true si l'assurance expire dans moins d'un mois, false sinon
   */
  const isAssuranceExpiringSoon = (date?: string) => {
    if (!date) return false;
    
    const assuranceDate = new Date(date);
    const today = new Date();
    const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 jours en millisecondes
    
    return assuranceDate.getTime() - today.getTime() < oneMonth;
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout et filtres */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold">Gestion des véhicules</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" /> Ajouter un véhicule
        </button>
      </div>
      
      {/* Filtres */}
      <div className="bg-white p-4 rounded-md shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <input
              type="text"
              placeholder="Immatriculation, marque..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange({ ...filters, searchTerm: e.target.value })}
            />
          </div>
          
          {/* Type de véhicule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de véhicule</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type_vehicule}
              onChange={(e) => handleFilterChange({ ...filters, type_vehicule: e.target.value })}
            >
              <option value="all">Tous les types</option>
              <option value="Auto">Auto</option>
              <option value="Moto">Moto</option>
              <option value="Poids lourd">Poids lourd</option>
            </select>
          </div>
          
          {/* Catégorie de permis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie de permis</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.categorie_permis}
              onChange={(e) => handleFilterChange({ ...filters, categorie_permis: e.target.value })}
            >
              <option value="all">Toutes les catégories</option>
              <option value="B">B</option>
              <option value="A">A</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          
          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.statut}
              onChange={(e) => handleFilterChange({ ...filters, statut: e.target.value })}
            >
              <option value="all">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="En maintenance">En maintenance</option>
              <option value="Hors service">Hors service</option>
              <option value="Vendu">Vendu</option>
            </select>
          </div>
          
          {/* Bureau */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bureau</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.bureau}
              onChange={(e) => handleFilterChange({ ...filters, bureau: e.target.value })}
            >
              <option value="all">Tous les bureaux</option>
              {bureaux.map((bureau) => (
                <option key={bureau.id_bureau} value={bureau.id_bureau}>
                  {bureau.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Liste des véhicules */}
      <div className="overflow-x-auto bg-white rounded-md shadow">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des véhicules...</p>
          </div>
        ) : filteredVehicules.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Aucun véhicule trouvé.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Immatriculation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type / Permis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilométrage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bureau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contrôles
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicules.map((vehicule) => (
                <tr key={vehicule.id_vehicule}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                        {getVehiculeIcon(vehicule.type_vehicule)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicule.marque} {vehicule.modele}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicule.annee || '-'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vehicule.immatriculation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vehicule.type_vehicule}</div>
                    <div className="text-sm text-gray-500">Permis {vehicule.categorie_permis}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vehicule.kilometrage_actuel.toLocaleString()} km</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicule.statut)}`}>
                      {vehicule.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicule.bureau?.nom || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {/* Contrôle technique */}
                      {vehicule.prochain_controle_technique && (
                        <div className="flex items-center">
                          {isCtcExpiringSoon(vehicule.prochain_controle_technique) ? (
                            <FiAlertTriangle className="text-yellow-500 mr-1" />
                          ) : (
                            <FiCheck className="text-green-500 mr-1" />
                          )}
                          <span className="text-xs">
                            CT: {formatDate(vehicule.prochain_controle_technique)}
                          </span>
                        </div>
                      )}
                      
                      {/* Assurance */}
                      {vehicule.assurance_date_expiration && (
                        <div className="flex items-center">
                          {isAssuranceExpiringSoon(vehicule.assurance_date_expiration) ? (
                            <FiAlertTriangle className="text-yellow-500 mr-1" />
                          ) : (
                            <FiCheck className="text-green-500 mr-1" />
                          )}
                          <span className="text-xs">
                            Assurance: {formatDate(vehicule.assurance_date_expiration)}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedVehicule(vehicule);
                          setShowEditModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVehicule(vehicule);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Ici, nous ajouterons les modals pour ajouter, modifier et supprimer un véhicule */}
      {/* Ces modals seront implémentés dans une prochaine étape */}
      
      {/* Message indiquant que les modals seront implémentés plus tard */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Les formulaires d'ajout, de modification et de suppression seront implémentés dans une prochaine étape.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
