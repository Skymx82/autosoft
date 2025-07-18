import { supabase } from '@/lib/supabase';

// Interface pour les véhicules
export interface Vehicule {
  id_vehicule: number;
  immatriculation: string;
  marque: string;
  modele: string;
  annee?: number;
  type_vehicule: string;
  categorie_permis: string;
  boite_vitesse?: string;
  carburant?: string;
  date_acquisition?: string;
  date_mise_en_service?: string;
  kilometrage_actuel: number;
  dernier_controle_technique?: string;
  prochain_controle_technique?: string;
  dernier_entretien?: string;
  kilometrage_dernier_entretien?: number;
  prochain_entretien_km?: number;
  prochain_entretien_date?: string;
  assurance_numero_contrat?: string;
  assurance_date_expiration?: string;
  cout_acquisition?: number;
  valeur_residuelle?: number;
  cout_entretien_total?: number;
  cout_carburant_total?: number;
  consommation_moyenne?: number;
  statut: string;
  notes?: string;
  equipements?: string;
  documents?: any;
  historique_entretiens?: any;
  historique_incidents?: any;
  id_bureau?: number;
  id_ecole: number;
  bureau?: {
    id_bureau: number;
    nom: string;
  };
}

// Interface pour les filtres
export interface VehiculeFilters {
  searchTerm?: string;
  type_vehicule?: string;
  categorie_permis?: string;
  statut?: string;
  id_bureau?: number | string;
}

// Fonction pour récupérer tous les véhicules d'une auto-école
export const getVehicules = async (id_ecole: number, id_bureau: number | string = 'all') => {
  try {
    // Construire la requête de base
    let query = supabase
      .from('vehicule')
      .select(`
        *,
        bureau (
          id_bureau,
          nom
        )
      `)
      .eq('id_ecole', id_ecole);

    // Ajouter le filtre par bureau si spécifié et différent de 'all'
    if (id_bureau !== 'all') {
      query = query.eq('id_bureau', id_bureau);
    }

    // Exécuter la requête
    const { data, error } = await query;

    // Gérer les erreurs
    if (error) {
      console.error('Erreur lors de la récupération des véhicules:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules:', error);
    throw error;
  }
};

// Fonction pour récupérer un véhicule par son ID
export const getVehiculeById = async (id_vehicule: number, id_ecole: number) => {
  try {
    const { data, error } = await supabase
      .from('vehicule')
      .select(`
        *,
        bureau (
          id_bureau,
          nom
        )
      `)
      .eq('id_vehicule', id_vehicule)
      .eq('id_ecole', id_ecole)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du véhicule:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du véhicule:', error);
    throw error;
  }
};

// Fonction pour ajouter un nouveau véhicule
export const addVehicule = async (vehicule: Omit<Vehicule, 'id_vehicule'>) => {
  try {
    const { data, error } = await supabase
      .from('vehicule')
      .insert([vehicule])
      .select();

    if (error) {
      console.error('Erreur lors de l\'ajout du véhicule:', error);
      throw new Error(error.message);
    }

    return data?.[0];
  } catch (error) {
    console.error('Erreur lors de l\'ajout du véhicule:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un véhicule
export const updateVehicule = async (id_vehicule: number, id_ecole: number, updates: Partial<Vehicule>) => {
  try {
    const { data, error } = await supabase
      .from('vehicule')
      .update(updates)
      .eq('id_vehicule', id_vehicule)
      .eq('id_ecole', id_ecole)
      .select();

    if (error) {
      console.error('Erreur lors de la mise à jour du véhicule:', error);
      throw new Error(error.message);
    }

    return data?.[0];
  } catch (error) {
    console.error('Erreur lors de la mise à jour du véhicule:', error);
    throw error;
  }
};

// Fonction pour supprimer un véhicule
export const deleteVehicule = async (id_vehicule: number, id_ecole: number) => {
  try {
    const { error } = await supabase
      .from('vehicule')
      .delete()
      .eq('id_vehicule', id_vehicule)
      .eq('id_ecole', id_ecole);

    if (error) {
      console.error('Erreur lors de la suppression du véhicule:', error);
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du véhicule:', error);
    throw error;
  }
};

// Fonction pour mettre à jour le statut d'un véhicule
export const updateVehiculeStatus = async (id_vehicule: number, id_ecole: number, status: string) => {
  try {
    const { data, error } = await supabase
      .from('vehicule')
      .update({ statut: status })
      .eq('id_vehicule', id_vehicule)
      .eq('id_ecole', id_ecole)
      .select();

    if (error) {
      console.error('Erreur lors de la mise à jour du statut du véhicule:', error);
      throw new Error(error.message);
    }

    return data?.[0];
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut du véhicule:', error);
    throw error;
  }
};

// Fonction pour mettre à jour le kilométrage d'un véhicule
export const updateVehiculeKilometrage = async (id_vehicule: number, id_ecole: number, kilometrage: number) => {
  try {
    const { data, error } = await supabase
      .from('vehicule')
      .update({ kilometrage_actuel: kilometrage })
      .eq('id_vehicule', id_vehicule)
      .eq('id_ecole', id_ecole)
      .select();

    if (error) {
      console.error('Erreur lors de la mise à jour du kilométrage du véhicule:', error);
      throw new Error(error.message);
    }

    return data?.[0];
  } catch (error) {
    console.error('Erreur lors de la mise à jour du kilométrage du véhicule:', error);
    throw error;
  }
};

// Fonction pour filtrer les véhicules
export const filterVehicules = (vehicules: Vehicule[], filters: VehiculeFilters) => {
  if (!vehicules || vehicules.length === 0) {
    return [];
  }
  
  let filtered = [...vehicules];
  
  // Filtre par terme de recherche
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(vehicule => {
      return (
        vehicule.immatriculation.toLowerCase().includes(searchLower) ||
        vehicule.marque.toLowerCase().includes(searchLower) ||
        vehicule.modele.toLowerCase().includes(searchLower)
      );
    });
  }
  
  // Filtre par type de véhicule
  if (filters.type_vehicule && filters.type_vehicule !== 'all') {
    filtered = filtered.filter(vehicule => vehicule.type_vehicule === filters.type_vehicule);
  }
  
  // Filtre par catégorie de permis
  if (filters.categorie_permis && filters.categorie_permis !== 'all') {
    filtered = filtered.filter(vehicule => vehicule.categorie_permis === filters.categorie_permis);
  }
  
  // Filtre par statut
  if (filters.statut && filters.statut !== 'all') {
    filtered = filtered.filter(vehicule => vehicule.statut === filters.statut);
  }
  
  // Filtre par bureau
  if (filters.id_bureau && filters.id_bureau !== 'all') {
    filtered = filtered.filter(vehicule => 
      vehicule.id_bureau === (typeof filters.id_bureau === 'string' ? parseInt(filters.id_bureau) : filters.id_bureau)
    );
  }
  
  return filtered;
};
