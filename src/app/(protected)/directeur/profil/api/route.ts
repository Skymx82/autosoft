import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Récupérer les données du profil utilisateur
export async function GET(request: NextRequest) {
  try {
    // Récupérer l'ID utilisateur depuis les cookies ou les headers
    const authHeader = request.headers.get('authorization');
    let userId;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extraire l'ID utilisateur du token (simplifié pour l'exemple)
      const token = authHeader.split(' ')[1];
      // Dans un cas réel, vous décoderiez le token pour obtenir l'ID utilisateur
      // Pour l'instant, nous allons extraire l'ID depuis la requête
      userId = request.nextUrl.searchParams.get('userId');      
    } else {
      // Utiliser l'ID utilisateur depuis les paramètres de requête
      userId = request.nextUrl.searchParams.get('userId');
    }
    
    // Récupérer les données utilisateur de base
    const { data: userData, error: userError } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('id_utilisateur', userId)
      .single();
      
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }
    
    // Vérifier si l'utilisateur est un moniteur pour récupérer des informations supplémentaires
    if (userData.role === 'moniteur') {
      const { data: moniteurData, error: moniteurError } = await supabase
        .from('enseignants')
        .select('nom, prenom, tel, email')
        .eq('id_utilisateur', userId)
        .single();
        
      if (!moniteurError && moniteurData) {
        // Combiner les données
        userData.nom = moniteurData.nom;
        userData.prenom = moniteurData.prenom;
        userData.tel = moniteurData.tel;
      }
    }
    
    return NextResponse.json(userData);
    
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données du profil:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Mettre à jour les informations personnelles
export async function PUT(request: NextRequest) {
  try {
    // Récupérer l'ID utilisateur depuis les cookies ou les headers
    const authHeader = request.headers.get('authorization');
    let userId;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extraire l'ID utilisateur du token (simplifié pour l'exemple)
      const token = authHeader.split(' ')[1];
      // Dans un cas réel, vous décoderiez le token pour obtenir l'ID utilisateur
    }
    
    const requestData = await request.json();
    userId = requestData.userId; // Récupérer l'ID utilisateur depuis le corps de la requête
    
    // Vérifier le type de mise à jour
    const { updateType, ...data } = requestData;
    
    // Mise à jour des informations personnelles (nom, prénom)
    if (updateType === 'personal') {
      const { nom, prenom } = data;
      
      // Récupérer le rôle de l'utilisateur
      const { data: userRoleData, error: roleError } = await supabase
        .from('utilisateur')
        .select('role')
        .eq('id_utilisateur', userId)
        .single();
        
      if (roleError) {
        return NextResponse.json({ error: roleError.message }, { status: 500 });
      }
      
      // Si c'est un moniteur, mettre à jour dans la table enseignants
      if (userRoleData.role === 'moniteur') {
        const { error } = await supabase
          .from('enseignants')
          .update({ nom, prenom })
          .eq('id_utilisateur', userId);
          
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
      
      return NextResponse.json({ success: true, message: 'Informations personnelles mises à jour avec succès' });
    }
    
    // Mise à jour des informations de contact (email, téléphone)
    if (updateType === 'contact') {
      const { email, telephone } = data;
      
      // Mettre à jour l'email dans Auth
      // Récupérer l'email actuel de l'utilisateur
      const { data: userEmailData, error: emailError } = await supabase
        .from('utilisateur')
        .select('email')
        .eq('id_utilisateur', userId)
        .single();
        
      if (emailError) {
        return NextResponse.json({ error: emailError.message }, { status: 500 });
      }
      
      if (email && email !== userEmailData.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: email,
        });
        
        if (authError) {
          return NextResponse.json({ error: authError.message }, { status: 500 });
        }
        
        // Mettre à jour l'email dans la table utilisateur
        const { error: dbError } = await supabase
          .from('utilisateur')
          .update({ email })
          .eq('id_utilisateur', userId);
          
        if (dbError) {
          return NextResponse.json({ error: dbError.message }, { status: 500 });
        }
      }
      
      // Récupérer le rôle de l'utilisateur
      const { data: userRoleData2, error: roleError2 } = await supabase
        .from('utilisateur')
        .select('role')
        .eq('id_utilisateur', userId)
        .single();
        
      if (roleError2) {
        return NextResponse.json({ error: roleError2.message }, { status: 500 });
      }
      
      // Si c'est un moniteur, mettre à jour le téléphone dans la table enseignants
      if (userRoleData2.role === 'moniteur' && telephone) {
        const { error: monitorError } = await supabase
          .from('enseignants')
          .update({ tel: telephone })
          .eq('id_utilisateur', userId);
          
        if (monitorError) {
          return NextResponse.json({ error: monitorError.message }, { status: 500 });
        }
      }
      
      return NextResponse.json({ success: true, message: 'Informations de contact mises à jour avec succès' });
    }
    
    // Mise à jour du mot de passe
    if (updateType === 'password') {
      const { newPassword } = data;
      
      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 });
      }
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
    }
    
    // Si le type de mise à jour n'est pas reconnu
    return NextResponse.json({ error: 'Type de mise à jour non reconnu' }, { status: 400 });
    
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
