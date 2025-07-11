'use client';

import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface pour les documents
export interface Document {
  id_doc: number;
  id_eleve: number;
  type_doc: string;
  etat: string;
  lien_fichier: string;
  date_depot: string;
}

/**
 * Récupère les documents d'un élève
 * @param eleveId ID de l'élève
 * @returns Liste des documents de l'élève
 */
export async function getDocumentsByEleveId(eleveId: number): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id_eleve', eleveId)
      .order('date_depot', { ascending: false });
    
    if (error) {
      console.error('Erreur SQL lors de la récupération des documents:', error.message);
      throw new Error(`Erreur lors de la récupération des documents: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    throw error;
  }
}

/**
 * Ajoute un nouveau document pour un élève
 * @param document Document à ajouter
 * @returns Document ajouté
 */
export async function addDocument(document: Omit<Document, 'id_doc' | 'date_depot'>): Promise<Document> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([document])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur SQL lors de l\'ajout du document:', error.message);
      throw new Error(`Erreur lors de l'ajout du document: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du document:', error);
    throw error;
  }
}

/**
 * Met à jour l'état d'un document
 * @param docId ID du document
 * @param etat Nouvel état du document
 * @returns Document mis à jour
 */
export async function updateDocumentStatus(docId: number, etat: string): Promise<Document> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .update({ etat })
      .eq('id_doc', docId)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur SQL lors de la mise à jour du document:', error.message);
      throw new Error(`Erreur lors de la mise à jour du document: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du document:', error);
    throw error;
  }
}

/**
 * Supprime un document
 * @param docId ID du document à supprimer
 * @returns true si la suppression a réussi
 */
export async function deleteDocument(docId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id_doc', docId);
    
    if (error) {
      console.error('Erreur SQL lors de la suppression du document:', error.message);
      throw new Error(`Erreur lors de la suppression du document: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    throw error;
  }
}
