import { createClient } from '@supabase/supabase-js';

// Types
export interface AutoEcole {
  id_ecole: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  siret: string;
  logo_url: string;
  description: string;
  site_web: string;
  agrement: string;
  date_creation: string;
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
 * Récupère les informations de l'auto-école
 */
export const fetchAutoEcole = async (): Promise<AutoEcole | null> => {
  try {
    const idEcole = getIdEcole();
    
    const { data, error } = await supabase
      .from('auto_ecole')
      .select('*')
      .eq('id_ecole', idEcole)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // Aucune auto-école trouvée
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de l\'auto-école:', error);
    throw error;
  }
};

/**
 * Met à jour les informations de l'auto-école
 */
export const updateAutoEcole = async (autoEcole: Partial<AutoEcole> & { id_ecole: number }): Promise<AutoEcole> => {
  try {
    const { data, error } = await supabase
      .from('auto_ecole')
      .update(autoEcole)
      .eq('id_ecole', autoEcole.id_ecole)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations de l\'auto-école:', error);
    throw error;
  }
};

/**
 * Télécharge un logo pour l'auto-école
 */
export const uploadLogo = async (file: File, id_ecole: number): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id_ecole}-logo.${fileExt}`;
    const filePath = `logos/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('auto_ecole_assets')
      .upload(filePath, file, {
        upsert: true
      });
      
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('auto_ecole_assets')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Erreur lors du téléchargement du logo:', error);
    throw error;
  }
};
