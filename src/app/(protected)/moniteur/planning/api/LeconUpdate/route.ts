/**
 * Fonctions utilitaires pour les appels API
 */

import { Lecon } from '../../components/PlanningGrid';
import { supabase } from '../../../../../../lib/supabase';

/**
 * Met à jour une leçon dans la base de données Supabase
 * @param lecon La leçon mise à jour
 * @returns La leçon mise à jour depuis le serveur
 */
export async function updateLecon(lecon: Lecon): Promise<Lecon> {
  try {
    // Extraire uniquement les champs que nous voulons mettre à jour
    // Nous ne mettons à jour que le statut et les commentaires
    const updateData = {
      statut_lecon: lecon.statut_lecon,
      commentaire: lecon.commentaire
    };
    
    // Mettre à jour la leçon dans Supabase
    const { data, error } = await supabase
      .from('planning') // Nom de la table dans Supabase
      .update(updateData) // Uniquement le statut et les commentaires
      .eq('id_planning', lecon.id_planning) // Condition pour trouver la leçon à mettre à jour
      .select() // Récupérer les données mises à jour
      .single(); // On s'attend à un seul résultat
    
    // Vérifier s'il y a eu une erreur
    if (error) {
      throw new Error(`Erreur lors de la mise à jour de la leçon: ${error.message}`);
    }
    
    // Si aucune donnée n'a été retournée, c'est que la leçon n'existe pas
    if (!data) {
      throw new Error(`La leçon avec l'ID ${lecon.id_planning} n'existe pas`);
    }
    
    // Retourner la leçon mise à jour
    return data as Lecon;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la leçon:', error);
    throw error;
  }
}
