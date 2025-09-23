import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Interface pour la table utilisateur
interface Utilisateur {
  id_utilisateur: string;  // UUID de auth.user
  id_bureau: number | null;
  id_ecole: number;
  email: string;
  password?: string;  // Optionnel car géré par Supabase Auth
  role: 'admin' | 'directeur' | 'moniteur' | 'secretaire' | 'comptable' | 'autosoft';
  created_at: string;
  updated_at: string;
}

// Interface pour les enseignants (moniteurs)
interface Enseignant {
  id_moniteur: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  num_enseignant: string;
  date_delivrance_num: string | null;
  id_ecole: number;
  id_bureau: number | null;
  id_utilisateur: string;  // Référence à utilisateur.id_utilisateur
}

// Interface pour l'API (pour maintenir la compatibilité avec le frontend)
interface UserResponse {
  id: string;  // Utilise id_utilisateur
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  auto_ecole: string;
  id_auto_ecole: number;
  statut: string;  // Simulé car n'existe pas dans la table utilisateur
  date_creation: string;  // Utilise created_at
}

// Fonction pour transformer les données de la base en format attendu par le frontend
async function mapToUserResponse(utilisateur: Utilisateur): Promise<UserResponse> {
  // Récupérer l'auto-école correspondante
  const { data: autoEcole } = await supabase
    .from('auto_ecole')
    .select('nom')
    .eq('id_ecole', utilisateur.id_ecole)
    .single();
  
  // Récupérer l'enseignant correspondant si c'est un moniteur
  let enseignant = null;
  if (utilisateur.role === 'moniteur') {
    const { data } = await supabase
      .from('enseignants')
      .select('*')
      .eq('id_utilisateur', utilisateur.id_utilisateur)
      .single();
    enseignant = data;
  }
  
  return {
    id: utilisateur.id_utilisateur,
    nom: enseignant?.nom || utilisateur.email.split('@')[0],  // Fallback si pas d'enseignant
    prenom: enseignant?.prenom || '',
    email: utilisateur.email,
    telephone: enseignant?.tel || '',
    role: utilisateur.role,
    auto_ecole: autoEcole?.nom || `Auto-École #${utilisateur.id_ecole}`,
    id_auto_ecole: utilisateur.id_ecole,
    statut: 'active',  // Valeur par défaut car ce champ n'existe pas dans la table utilisateur
    date_creation: utilisateur.created_at.split('T')[0]  // Format YYYY-MM-DD
  };
}

export async function GET(request: Request) {
  try {
    // Récupérer les paramètres de recherche et de filtre
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const role = searchParams.get('role') || '';
    
    // Construire la requête Supabase
    let query = supabase.from('utilisateur').select('*');
    
    // Filtrer par rôle si spécifié
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }
    
    // Exécuter la requête
    const { data: utilisateurs, error } = await query;
    
    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des utilisateurs' },
        { status: 500 }
      );
    }
    
    // Filtrer par recherche si spécifié
    // Note: idéalement, cela devrait être fait côté serveur avec une requête SQL plus complexe
    let filteredUtilisateurs = utilisateurs || [];
    
    if (search && filteredUtilisateurs.length > 0) {
      // Récupérer tous les enseignants pour la recherche par nom/prénom
      const { data: enseignants } = await supabase.from('enseignants').select('*');
      
      filteredUtilisateurs = filteredUtilisateurs.filter(utilisateur => {
        // Trouver l'enseignant correspondant pour avoir accès au nom et prénom
        const enseignant = enseignants?.find(e => e.id_utilisateur === utilisateur.id_utilisateur);
        
        return (
          utilisateur.email.toLowerCase().includes(search) ||
          (enseignant && enseignant.nom.toLowerCase().includes(search)) ||
          (enseignant && enseignant.prenom.toLowerCase().includes(search))
        );
      });
    }
    
    // Transformer les utilisateurs filtrés en format attendu par le frontend
    const userResponsesPromises = filteredUtilisateurs.map(mapToUserResponse);
    const userResponses = await Promise.all(userResponsesPromises);
    
    return NextResponse.json(userResponses);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // Validation des données
    if (!userData.nom || !userData.prenom || !userData.email || !userData.role || !userData.id_auto_ecole) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }
    
    // Créer d'abord un utilisateur dans auth.user via Supabase Auth avec le client admin
    // Import du client admin
    const { supabaseAdmin } = await import('@/lib/supabase-admin');
    
    // Générer un lien d'invitation pour l'utilisateur
    // Selon la documentation Supabase : https://supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(userData.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}`,  // URL de redirection après confirmation
      data: {
        role: userData.role,
        id_auto_ecole: userData.id_auto_ecole,
        nom: userData.nom,
        prenom: userData.prenom
      }
    });
    
    // Afficher des informations de débogage
    console.log('Invitation envoyée à:', userData.email);
    console.log('URL de redirection:', process.env.NEXT_PUBLIC_SITE_URL);
    
    if (authError) {
      console.error('Erreur lors de la création de l\'utilisateur dans auth:', authError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'utilisateur' },
        { status: 500 }
      );
    }
    
    // Vérifier que l'utilisateur a bien été créé
    if (!authData || !authData.user) {
      console.error('Erreur: Aucun utilisateur créé');
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'utilisateur' },
        { status: 500 }
      );
    }
    
    const userId = authData.user.id;
    const now = new Date().toISOString();
    
    // Créer l'utilisateur dans la table utilisateur
    const { error: utilisateurError } = await supabase
      .from('utilisateur')
      .insert({
        id_utilisateur: userId,
        id_bureau: userData.id_bureau || null,
        id_ecole: userData.id_auto_ecole,
        email: userData.email,
        role: userData.role,
        created_at: now,
        updated_at: now
      });
    
    if (utilisateurError) {
      console.error('Erreur lors de la création de l\'utilisateur dans la table utilisateur:', utilisateurError);
      // Essayer de supprimer l'utilisateur auth créé pour éviter les utilisateurs orphelins
      await supabase.auth.admin.deleteUser(userId);
      
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'utilisateur' },
        { status: 500 }
      );
    }
    
    // Si c'est un moniteur, créer aussi une entrée dans la table enseignants
    if (userData.role === 'moniteur') {
      const { error: enseignantError } = await supabase
        .from('enseignants')
        .insert({
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          tel: userData.telephone || '',
          num_enseignant: userData.num_enseignant || '',
          date_delivrance_num: null,
          id_ecole: userData.id_auto_ecole,
          id_bureau: userData.id_bureau || null,
          id_utilisateur: userId
        });
      
      if (enseignantError) {
        console.error('Erreur lors de la création de l\'enseignant:', enseignantError);
        // Ne pas retourner d'erreur ici, car l'utilisateur a été créé avec succès
      }
    }
    
    // Récupérer l'utilisateur créé
    const { data: newUtilisateur } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('id_utilisateur', userId)
      .single();
    
    if (!newUtilisateur) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'utilisateur créé' },
        { status: 500 }
      );
    }
    
    // Transformer en format attendu par le frontend
    const userResponse = await mapToUserResponse(newUtilisateur);
    
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}
