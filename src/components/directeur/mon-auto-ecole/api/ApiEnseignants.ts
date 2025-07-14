import { createClient } from '@supabase/supabase-js';

// Types
export interface Enseignant {
  id_enseignant: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date_embauche: string;
  id_bureau: number;
  id_ecole: number;
  actif: boolean;
}

// Création du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Récupérer l'ID de l'école depuis le localStorage
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
 * Récupère tous les enseignants d'une école
 */
export const fetchEnseignants = async (): Promise<Enseignant[]> => {
  try {
    const idEcole = getIdEcole();
    
    const { data, error } = await supabase
      .from('enseignants')
      .select('*')
      .eq('id_ecole', idEcole);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des enseignants:', error);
    throw error;
  }
};

/**
 * Ajoute un nouvel enseignant
 */
export const addEnseignant = async (enseignant: Omit<Enseignant, 'id_enseignant'>): Promise<Enseignant> => {
  try {
    const { data, error } = await supabase
      .from('enseignants')
      .insert(enseignant)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'enseignant:', error);
    throw error;
  }
};

/**
 * Met à jour un enseignant existant
 */
export const updateEnseignant = async (enseignant: Enseignant): Promise<Enseignant> => {
  try {
    const { data, error } = await supabase
      .from('enseignants')
      .update(enseignant)
      .eq('id_enseignant', enseignant.id_enseignant)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'enseignant:', error);
    throw error;
  }
};

/**
 * Supprime un enseignant
 */
export const deleteEnseignant = async (id_enseignant: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('enseignants')
      .delete()
      .eq('id_enseignant', id_enseignant);
      
    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'enseignant:', error);
    throw error;
  }
};
