import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Utilisateur {
  id_utilisateur: string;
  id_bureau: number;
  id_ecole: number;
  email: string;
  password: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

// Type pour l'affichage avec les champs virtuels
export interface UtilisateurAffichage extends Utilisateur {
  nom?: string;
  prenom?: string;
  actif?: boolean;
  bureau?: {
    nom: string;
    id_bureau: number;
  };
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
 * Extraire prénom et nom à partir de l'email
 */
export const extractNameFromEmail = (email: string): { prenom: string; nom: string } => {
  const emailPrefix = email.split('@')[0];
  const parts = emailPrefix.split('.');
  
  if (parts.length >= 2) {
    const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const nom = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    return { prenom, nom };
  }
  
  return { prenom: emailPrefix, nom: '' };
};

/**
 * Convertir les utilisateurs pour l'affichage
 */
export const convertToUtilisateurAffichage = (utilisateurs: any[]): UtilisateurAffichage[] => {
  return utilisateurs.map(utilisateur => {
    const { prenom, nom } = extractNameFromEmail(utilisateur.email);
    return {
      ...utilisateur,
      prenom,
      nom,
      actif: true, // Par défaut, tous les utilisateurs sont considérés comme actifs
      // Conserver les informations du bureau si elles existent
      bureau: utilisateur.bureau || undefined
    };
  });
};

/**
 * Récupère la liste des utilisateurs de l'auto-école avec leurs bureaux associés
 */
export const fetchUtilisateurs = async (): Promise<UtilisateurAffichage[]> => {
  try {
    const idEcole = getIdEcole();
    const { data, error } = await supabase
      .from('utilisateur')
      .select(`
        *,
        bureau:id_bureau (id_bureau, nom)
      `)
      .eq('id_ecole', idEcole);
      
    if (error) throw error;
    
    return convertToUtilisateurAffichage(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

/**
 * Ajoute un nouvel utilisateur en utilisant l'authentification Supabase
 * Cette fonction crée d'abord un utilisateur dans Supabase Auth, puis ajoute les informations 
 * complémentaires dans la table utilisateur
 */
export const addUtilisateur = async (utilisateur: Omit<Utilisateur, 'id_utilisateur' | 'created_at' | 'updated_at'>): Promise<UtilisateurAffichage> => {
  try {
    // 1. Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: utilisateur.email,
      password: utilisateur.password,
      options: {
        data: {
          role: utilisateur.role,
          id_ecole: utilisateur.id_ecole
        }
      }
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('Erreur lors de la création de l\'utilisateur dans Auth');
    
    // 2. Récupérer l'ID utilisateur généré par Supabase Auth
    const id_utilisateur = authData.user.id;
    
    // 3. Créer l'entrée dans la table utilisateur avec l'ID généré
    const newUtilisateur = {
      ...utilisateur,
      id_utilisateur
    };
    
    const { data, error } = await supabase
      .from('utilisateur')
      .insert(newUtilisateur)
      .select()
      .single();
      
    if (error) {
      // En cas d'erreur, essayer de supprimer l'utilisateur créé dans Auth pour éviter les incohérences
      await supabase.auth.admin.deleteUser(id_utilisateur).catch(e => 
        console.error('Impossible de supprimer l\'utilisateur Auth après échec:', e)
      );
      throw error;
    }
    
    // Convertir pour l'affichage
    const { prenom, nom } = extractNameFromEmail(data.email);
    return {
      ...data,
      prenom,
      nom,
      actif: true
    };
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
    throw error;
  }
};

/**
 * Met à jour un utilisateur existant en utilisant l'authentification Supabase
 * Cette fonction met à jour les informations dans Supabase Auth si nécessaire (mot de passe),
 * puis met à jour les informations complémentaires dans la table utilisateur
 */
export const updateUtilisateur = async (utilisateur: Partial<Utilisateur> & { id_utilisateur: string }): Promise<UtilisateurAffichage> => {
  try {
    // 1. Si un nouveau mot de passe est fourni, mettre à jour l'utilisateur dans Supabase Auth
    if (utilisateur.password) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        utilisateur.id_utilisateur,
        { password: utilisateur.password }
      );
      
      if (authError) throw authError;
      
      // Ne pas stocker le mot de passe dans la table utilisateur
      const { password, ...userDataWithoutPassword } = utilisateur;
      utilisateur = userDataWithoutPassword;
    }
    
    // 2. Mettre à jour les informations dans la table utilisateur
    const { data, error } = await supabase
      .from('utilisateur')
      .update(utilisateur)
      .eq('id_utilisateur', utilisateur.id_utilisateur)
      .select()
      .single();
      
    if (error) throw error;
    
    // Convertir pour l'affichage
    const { prenom, nom } = extractNameFromEmail(data.email);
    return {
      ...data,
      prenom,
      nom,
      actif: true
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw error;
  }
};

/**
 * Supprime un utilisateur en utilisant l'authentification Supabase
 * Cette fonction supprime l'utilisateur dans la table utilisateur et dans Supabase Auth
 */
export const deleteUtilisateur = async (id_utilisateur: string): Promise<void> => {
  try {
    // 1. Supprimer l'utilisateur dans la table utilisateur
    const { error } = await supabase
      .from('utilisateur')
      .delete()
      .eq('id_utilisateur', id_utilisateur);
      
    if (error) throw error;
    
    // 2. Supprimer l'utilisateur dans Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id_utilisateur);
    
    if (authError) {
      console.error('Erreur lors de la suppression de l\'utilisateur dans Auth:', authError);
      // Ne pas bloquer l'opération si la suppression dans Auth échoue
      // L'utilisateur pourrait ne plus exister dans Auth ou avoir été déjà supprimé
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    throw error;
  }
};
