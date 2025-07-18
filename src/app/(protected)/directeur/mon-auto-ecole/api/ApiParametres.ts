import { createClient } from '@supabase/supabase-js';

// Types
export interface Parametre {
  id_parametre: number;
  cle: string;
  valeur: string;
  description: string;
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
 * Récupère tous les paramètres d'une école
 */
export const fetchParametres = async (): Promise<Parametre[]> => {
  try {
    const idEcole = getIdEcole();
    
    const { data, error } = await supabase
      .from('parametres')
      .select('*')
      .eq('id_ecole', idEcole);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    throw error;
  }
};

/**
 * Ajoute un nouveau paramètre
 */
export const addParametre = async (parametre: Omit<Parametre, 'id_parametre'>): Promise<Parametre> => {
  try {
    const { data, error } = await supabase
      .from('parametres')
      .insert(parametre)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du paramètre:', error);
    throw error;
  }
};

/**
 * Met à jour un paramètre existant
 */
export const updateParametre = async (parametre: Parametre): Promise<Parametre> => {
  try {
    const { data, error } = await supabase
      .from('parametres')
      .update(parametre)
      .eq('id_parametre', parametre.id_parametre)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paramètre:', error);
    throw error;
  }
};

/**
 * Supprime un paramètre
 */
export const deleteParametre = async (id_parametre: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('parametres')
      .delete()
      .eq('id_parametre', id_parametre);
      
    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors de la suppression du paramètre:', error);
    throw error;
  }
};

/**
 * Récupère un paramètre par sa clé
 */
export const getParametreByKey = async (cle: string): Promise<Parametre | null> => {
  try {
    const idEcole = getIdEcole();
    
    const { data, error } = await supabase
      .from('parametres')
      .select('*')
      .eq('id_ecole', idEcole)
      .eq('cle', cle)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // Aucun paramètre trouvé
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du paramètre:', error);
    throw error;
  }
};
