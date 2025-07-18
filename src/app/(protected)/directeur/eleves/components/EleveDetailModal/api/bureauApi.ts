'use client';

import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface pour le bureau
export interface Bureau {
  id_bureau: number;
  nom: string;
  adresse: string;
  telephone: string;
  id_ecole: number;
}

/**
 * Récupère tous les bureaux
 * @returns Liste des bureaux
 */
export async function getAllBureaux(): Promise<Bureau[]> {
  try {
    const { data, error } = await supabase
      .from('bureau')
      .select('*');
    
    if (error) {
      console.error('Erreur lors de la récupération des bureaux:', error);
      throw new Error('Impossible de récupérer les bureaux');
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception lors de la récupération des bureaux:', err);
    throw err;
  }
}

/**
 * Récupère un bureau par son ID
 * @param id_bureau ID du bureau à récupérer
 * @returns Informations du bureau
 */
export async function getBureauById(id_bureau: number): Promise<Bureau | null> {
  try {
    const { data, error } = await supabase
      .from('bureau')
      .select('*')
      .eq('id_bureau', id_bureau)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du bureau #${id_bureau}:`, error);
      throw new Error(`Impossible de récupérer le bureau #${id_bureau}`);
    }
    
    return data;
  } catch (err) {
    console.error(`Exception lors de la récupération du bureau #${id_bureau}:`, err);
    throw err;
  }
}
