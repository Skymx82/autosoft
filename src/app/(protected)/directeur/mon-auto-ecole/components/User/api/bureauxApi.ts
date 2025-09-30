import { createClient } from '@supabase/supabase-js';

// Types
export interface Bureau {
  id_bureau: number;
  nom: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  tel?: string;
  email?: string;
  id_ecole: number;
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
 * Récupère la liste des bureaux de l'auto-école
 */
export const fetchBureaux = async (): Promise<Bureau[]> => {
  try {
    const idEcole = getIdEcole();
    
    const { data, error } = await supabase
      .from('bureau')
      .select('*')
      .eq('id_ecole', idEcole)
      .order('nom');
      
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Erreur lors du chargement des bureaux:', error);
    throw error;
  }
};

/**
 * Récupère un bureau par son ID
 */
export const fetchBureauById = async (id_bureau: number): Promise<Bureau | null> => {
  try {
    const { data, error } = await supabase
      .from('bureau')
      .select('*')
      .eq('id_bureau', id_bureau)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Erreur lors du chargement du bureau:', error);
    return null;
  }
};

/**
 * Ajoute un nouveau bureau
 */
export const addBureau = async (bureau: Omit<Bureau, 'id_bureau'>): Promise<Bureau> => {
  try {
    const { data, error } = await supabase
      .from('bureau')
      .insert(bureau)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout du bureau:', error);
    throw error;
  }
};

/**
 * Met à jour un bureau existant
 */
export const updateBureau = async (bureau: Partial<Bureau> & { id_bureau: number }): Promise<Bureau> => {
  try {
    const { data, error } = await supabase
      .from('bureau')
      .update(bureau)
      .eq('id_bureau', bureau.id_bureau)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du bureau:', error);
    throw error;
  }
};

/**
 * Supprime un bureau
 */
export const deleteBureau = async (id_bureau: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bureau')
      .delete()
      .eq('id_bureau', id_bureau);
      
    if (error) throw error;
  } catch (error: any) {
    console.error('Erreur lors de la suppression du bureau:', error);
    throw error;
  }
};
