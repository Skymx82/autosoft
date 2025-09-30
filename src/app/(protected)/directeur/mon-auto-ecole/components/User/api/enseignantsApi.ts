import { createClient } from '@supabase/supabase-js';

// Types
export interface Enseignant {
  id_moniteur: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  num_enseignant: string;
  date_delivrance_num: string;
  id_bureau: number;
  id_ecole: number;
  bureau?: {
    nom: string;
  };
}

export interface Bureau {
  id_bureau: number;
  nom: string;
}

// Création du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Récupérer l'ID de l'auto-école depuis le localStorage
const getIdEcole = (): number => {
  if (typeof window !== 'undefined') {
    const userDataStr = localStorage.getItem('autosoft_user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      return userData.id_ecole || 0;
    }
  }
  return 0;
};

/**
 * Récupère la liste des enseignants de l'auto-école
 */
export const fetchEnseignants = async (): Promise<Enseignant[]> => {
  try {
    const idEcole = getIdEcole();
    
    const { data, error } = await supabase
      .from('enseignants')
      .select('*, bureau:id_bureau(nom)')
      .eq('id_ecole', idEcole)
      .order('nom');
      
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Erreur lors du chargement des enseignants:', error);
    throw error;
  }
};

/**
 * Récupère la liste des bureaux de l'auto-école
 */
export const fetchBureaux = async (): Promise<Bureau[]> => {
  try {
    const idEcole = getIdEcole();
    
    const { data, error } = await supabase
      .from('bureau')
      .select('id_bureau, nom')
      .eq('id_ecole', idEcole)
      .order('nom');
      
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Erreur lors du chargement des bureaux:', error);
    throw [];
  }
};

/**
 * Ajoute un nouvel enseignant
 */
export const addEnseignant = async (enseignant: Omit<Enseignant, 'id_moniteur'>): Promise<Enseignant> => {
  try {
    const { data, error } = await supabase
      .from('enseignants')
      .insert(enseignant)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout de l\'enseignant:', error);
    throw error;
  }
};

/**
 * Met à jour un enseignant existant
 */
export const updateEnseignant = async (enseignant: Partial<Enseignant> & { id_moniteur: number }): Promise<Enseignant> => {
  try {
    const { data, error } = await supabase
      .from('enseignants')
      .update(enseignant)
      .eq('id_moniteur', enseignant.id_moniteur)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'enseignant:', error);
    throw error;
  }
};

/**
 * Supprime un enseignant
 */
export const deleteEnseignant = async (id_moniteur: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('enseignants')
      .delete()
      .eq('id_moniteur', id_moniteur);
      
    if (error) throw error;
  } catch (error: any) {
    console.error('Erreur lors de la suppression de l\'enseignant:', error);
    throw error;
  }
};
