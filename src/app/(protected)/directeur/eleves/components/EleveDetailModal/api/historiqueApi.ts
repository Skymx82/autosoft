/**
 * API pour la gestion de l'historique des élèves
 * Fonctions pour récupérer l'historique des leçons et des paiements
 */

import { supabase } from '@/lib/supabase';

/**
 * Interface pour les données d'une leçon
 */
export interface Lecon {
  id_planning: number;
  id_eleve: number;
  id_moniteur: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  statut_lecon: string;
  type_lecon: string;
  commentaire?: string;
  nom_moniteur?: string;
  prenom_moniteur?: string;
}

/**
 * Interface pour les données d'un paiement
 */
export interface Paiement {
  id_paiement: number;
  id_eleve: number;
  paiement_du_jour: number;
  reste_a_payer: number;
  type_paiement: string;
  id_bureau?: number;
  id_ecole?: number;
}

/**
 * Récupère les dernières leçons d'un élève
 * @param eleveId ID de l'élève
 * @param limit Nombre maximum de leçons à récupérer
 * @returns Liste des dernières leçons
 */
export async function getDernieresLecons(eleveId: number, limit: number = 2): Promise<Lecon[]> {
  try {
    // D'abord, récupérer les leçons
    const { data: lecons, error } = await supabase
      .from('planning')
      .select(`
        id_planning,
        id_eleve,
        id_moniteur,
        date,
        heure_debut,
        heure_fin,
        statut_lecon,
        type_lecon,
        commentaire
      `)
      .eq('id_eleve', eleveId)
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Erreur SQL:', error);
      throw new Error(`Erreur lors de la récupération des leçons: ${error.message || JSON.stringify(error)}`);
    }
    
    // Si nous avons des leçons, récupérer les informations des moniteurs
    if (lecons && lecons.length > 0) {
      // Récupérer tous les IDs de moniteurs uniques
      const moniteurIds = [...new Set(lecons.map(lecon => lecon.id_moniteur).filter(Boolean))];
      
      // Si nous avons des IDs de moniteurs, récupérer leurs informations
      if (moniteurIds.length > 0) {
        const { data: moniteurs, error: moniteurError } = await supabase
          .from('enseignants')
          .select('id_moniteur, nom, prenom')
          .in('id_moniteur', moniteurIds);
          
        if (moniteurError) {
          console.error('Erreur lors de la récupération des moniteurs:', moniteurError);
        }
        
        // Créer un dictionnaire des moniteurs pour un accès rapide
        const moniteurMap = (moniteurs || []).reduce((acc, moniteur) => {
          acc[moniteur.id_moniteur] = moniteur;
          return acc;
        }, {} as Record<number, any>);
        
        // Associer les informations des moniteurs aux leçons
        return lecons.map(lecon => {
          const moniteur = lecon.id_moniteur ? moniteurMap[lecon.id_moniteur] : null;
          return {
            ...lecon,
            nom_moniteur: moniteur?.nom || '',
            prenom_moniteur: moniteur?.prenom || ''
          };
        }) as Lecon[];
      }
    }
    
    return (lecons || []) as Lecon[];
  } catch (error) {
    console.error('Erreur lors de la récupération des leçons:', error);
    return [];
  }
}

/**
 * Récupère les derniers paiements d'un élève
 * @param eleveId ID de l'élève
 * @param limit Nombre maximum de paiements à récupérer
 * @returns Liste des derniers paiements
 */
export async function getDerniersPaiements(eleveId: number, limit: number = 2): Promise<Paiement[]> {
  try {
    const { data, error } = await supabase
      .from('paiement')
      .select('*')
      .eq('id_eleve', eleveId)
      .order('id_paiement', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Erreur SQL:', error);
      throw new Error(`Erreur lors de la récupération des paiements: ${error.message || JSON.stringify(error)}`);
    }
    
    return data as Paiement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return [];
  }
}
