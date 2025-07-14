import { createClient } from '@supabase/supabase-js';

// Types
export interface Forfait {
  id_forfait: number;
  nom: string;
  description: string;
  type_permis: string;
  tarif_base: number;
  nb_heures_incluses: number;
  prix_heure_supp: number;
  prix_presentation_examen?: number;
  duree_validite_jours?: number;
  frais_inscription: number;
  paiement_fractionnable: boolean;
  nb_max_echeances: number;
  actif: boolean;
  id_ecole: number;
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
 * Récupère tous les forfaits d'une école
 */
export const fetchForfaits = async (): Promise<Forfait[]> => {
  try {
    const idEcole = getIdEcole();
    
    const { data, error } = await supabase
      .from('forfait')
      .select('*')
      .eq('id_ecole', idEcole)
      .order('type_permis', { ascending: true })
      .order('tarif_base', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des forfaits:', error);
    throw error;
  }
};

/**
 * Ajoute un nouveau forfait
 */
export const addForfait = async (forfait: Omit<Forfait, 'id_forfait'>): Promise<Forfait> => {
  try {
    const { data, error } = await supabase
      .from('forfait')
      .insert(forfait)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du forfait:', error);
    throw error;
  }
};

/**
 * Met à jour un forfait existant
 */
export const updateForfait = async (forfait: Forfait): Promise<Forfait> => {
  try {
    const { data, error } = await supabase
      .from('forfait')
      .update(forfait)
      .eq('id_forfait', forfait.id_forfait)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du forfait:', error);
    throw error;
  }
};

/**
 * Supprime un forfait
 */
export const deleteForfait = async (id_forfait: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('forfait')
      .delete()
      .eq('id_forfait', id_forfait);
      
    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors de la suppression du forfait:', error);
    throw error;
  }
};
