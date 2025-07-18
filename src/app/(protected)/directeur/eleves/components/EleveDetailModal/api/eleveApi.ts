/**
 * API pour la gestion des élèves
 * Fonctions pour récupérer et mettre à jour les données d'un élève
 */

import { supabase } from '@/lib/supabase';

/**
 * Interface pour les données d'un élève
 */
export interface Eleve {
  id_eleve: number;
  nom: string;
  prenom: string;
  nom_deux?: string;
  nom_trois?: string;
  mail?: string;
  tel?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  categorie?: string;
  statut_dossier?: string;
  archived?: boolean;
  date_inscription?: string;
  id_bureau?: number;
  id_ecole?: number;
  [key: string]: any; // Pour les autres propriétés dynamiques
}

/**
 * Récupère les informations complètes d'un élève par son ID
 * @param eleveId ID de l'élève à récupérer
 * @returns Données complètes de l'élève
 */
export async function getEleveById(eleveId: number): Promise<Eleve> {
  try {
    const { data, error } = await supabase
      .from('eleves')
      .select('*')
      .eq('id_eleve', eleveId)
      .single();
    
    if (error) {
      throw new Error(`Erreur lors de la récupération des données: ${error.message}`);
    }
    
    if (!data) {
      throw new Error(`Élève non trouvé avec l'ID: ${eleveId}`);
    }
    
    return data as Eleve;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'élève:', error);
    throw error;
  }
}

/**
 * Met à jour les informations d'un élève
 * @param eleveId ID de l'élève à mettre à jour
 * @param updatedData Données mises à jour
 * @returns Données mises à jour de l'élève
 */
export async function updateEleve(eleveId: number, updatedData: Partial<Eleve>): Promise<Eleve> {
  try {
    const { data, error } = await supabase
      .from('eleves')
      .update(updatedData)
      .eq('id_eleve', eleveId)
      .select('*')
      .single();
    
    if (error) {
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
    }
    
    if (!data) {
      throw new Error(`Élève non trouvé avec l'ID: ${eleveId}`);
    }
    
    return data as Eleve;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des détails de l\'élève:', error);
    throw error;
  }
}
