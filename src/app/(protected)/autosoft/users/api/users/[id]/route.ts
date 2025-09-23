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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Rechercher l'utilisateur par ID (UUID)
    const { data: utilisateur, error } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('id_utilisateur', id)
      .single();
    
    if (error || !utilisateur) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Transformer en format attendu par le frontend
    const userResponse = await mapToUserResponse(utilisateur);
    
    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const userData = await request.json();
    
    // Vérifier si l'utilisateur existe
    const { data: existingUser, error: fetchError } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('id_utilisateur', id)
      .single();
    
    if (fetchError || !existingUser) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', fetchError);
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Validation des données
    if (!userData.email || !userData.role || !userData.id_auto_ecole) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }
    
    // Mettre à jour l'utilisateur dans la table utilisateur
    const { error: updateError } = await supabase
      .from('utilisateur')
      .update({
        id_bureau: userData.id_bureau || existingUser.id_bureau,
        id_ecole: userData.id_auto_ecole,
        email: userData.email,
        role: userData.role,
        updated_at: new Date().toISOString()
      })
      .eq('id_utilisateur', id);
    
    if (updateError) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
        { status: 500 }
      );
    }
    
    // Si c'est un moniteur, mettre à jour ou créer l'entrée dans la table enseignants
    if (userData.role === 'moniteur') {
      // Vérifier si l'enseignant existe déjà
      const { data: existingEnseignant } = await supabase
        .from('enseignants')
        .select('*')
        .eq('id_utilisateur', id)
        .single();
      
      if (existingEnseignant) {
        // Mettre à jour l'enseignant existant
        await supabase
          .from('enseignants')
          .update({
            nom: userData.nom,
            prenom: userData.prenom,
            email: userData.email,
            tel: userData.telephone || existingEnseignant.tel,
            id_ecole: userData.id_auto_ecole,
            id_bureau: userData.id_bureau || existingEnseignant.id_bureau
          })
          .eq('id_utilisateur', id);
      } else {
        // Créer un nouvel enseignant
        await supabase
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
            id_utilisateur: id
          });
      }
    }
    
    // Récupérer l'utilisateur mis à jour
    const { data: updatedUtilisateur } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('id_utilisateur', id)
      .single();
    
    if (!updatedUtilisateur) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'utilisateur mis à jour' },
        { status: 500 }
      );
    }
    
    // Transformer en format attendu par le frontend
    const userResponse = await mapToUserResponse(updatedUtilisateur);
    
    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Vérifier si l'utilisateur existe
    const { data: utilisateur, error: fetchError } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('id_utilisateur', id)
      .single();
    
    if (fetchError || !utilisateur) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', fetchError);
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer l'enseignant associé si c'est un moniteur
    if (utilisateur.role === 'moniteur') {
      const { error: deleteEnseignantError } = await supabase
        .from('enseignants')
        .delete()
        .eq('id_utilisateur', id);
      
      if (deleteEnseignantError) {
        console.error('Erreur lors de la suppression de l\'enseignant:', deleteEnseignantError);
        // Ne pas retourner d'erreur ici, car nous voulons quand même supprimer l'utilisateur
      }
    }
    
    // Supprimer l'utilisateur de la table utilisateur
    const { error: deleteUtilisateurError } = await supabase
      .from('utilisateur')
      .delete()
      .eq('id_utilisateur', id);
    
    if (deleteUtilisateurError) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', deleteUtilisateurError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de l\'utilisateur' },
        { status: 500 }
      );
    }
    
    // Désactiver l'utilisateur dans auth.user via Supabase Auth avec le client admin
    // Import du client admin
    const { supabaseAdmin } = await import('@/lib/supabase-admin');
    
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(id);
    
    if (deleteAuthError) {
      console.error('Erreur lors de la suppression de l\'utilisateur dans auth:', deleteAuthError);
      // Ne pas retourner d'erreur ici, car l'utilisateur a été supprimé de la table utilisateur
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}
