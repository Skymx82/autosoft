import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

// GET - Récupérer toutes les auto-écoles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    let query = supabase
      .from('auto_ecole')
      .select(`
        id_ecole,
        nom,
        adresse,
        siret,
        num_agrement,
        logo,
        presentation,
        bureau:bureau!bureau_id_ecole_fkey(id_bureau, nom, adresse, telephone),
        enseignants:enseignants!enseignants_id_ecole_fkey(count),
        eleves:eleves!eleves_id_ecole_fkey(count)
      `);
    
    // Filtrer par statut si spécifié
    if (status && status !== 'all') {
      query = query.eq('statut_ecole', status);
    }
    
    // Recherche si spécifiée
    if (search) {
      query = query.or(`nom.ilike.%${search}%,adresse.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur lors de la récupération des auto-écoles:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des auto-écoles' },
        { status: 500 }
      );
    }
    
    // Transformer les données pour correspondre au format attendu par le frontend
    const formattedData = data.map(ecole => {
      // Extraire l'adresse pour en tirer la ville et le code postal
      const adresseParts = ecole.adresse ? ecole.adresse.split(',') : ['', ''];
      const ville = adresseParts.length > 1 ? adresseParts[adresseParts.length - 2]?.trim() : '';
      const codePostal = adresseParts.length > 1 ? adresseParts[adresseParts.length - 1]?.trim() : '';
      
      // Récupérer les informations du bureau principal si disponible
      const bureauPrincipal = ecole.bureau && ecole.bureau.length > 0 ? ecole.bureau[0] : null;
      
      return {
        id: ecole.id_ecole,
        nom: ecole.nom,
        adresse: ecole.adresse,
        ville: ville,
        code_postal: codePostal,
        telephone: bureauPrincipal?.telephone || '', // Utiliser le téléphone du bureau principal
        email: '', // Pas disponible directement
        responsable: '', // Pas disponible directement
        statut: 'active', // Valeur par défaut
        date_creation: new Date().toISOString().split('T')[0], // Date actuelle par défaut
        nb_bureaux: ecole.bureau?.length || 0,
        nb_moniteurs: ecole.enseignants?.[0]?.count || 0,
        nb_eleves: ecole.eleves?.[0]?.count || 0
      };
    });
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle auto-école
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Valider les données requises
    const { nom, adresse, ville, code_postal, telephone, email, responsable, statut } = body;
    
    if (!nom || !adresse || !ville || !code_postal || !telephone || !email || !responsable) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }
    
    // Construire l'adresse complète avec ville et code postal
    const adresseComplete = `${adresse}, ${ville}, ${code_postal}`;
    
    // Insérer la nouvelle auto-école
    const { data, error } = await supabase
      .from('auto_ecole')
      .insert({
        nom: nom,
        adresse: adresseComplete,
        siret: '', // Champ optionnel
        num_agrement: '' // Champ optionnel
      })
      .select('id_ecole')
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de l\'auto-école:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'auto-école' },
        { status: 500 }
      );
    }
    
    // Créer un bureau principal par défaut
    const { data: bureauData, error: bureauError } = await supabase
      .from('bureau')
      .insert({
        id_ecole: data.id_ecole,
        nom: 'Bureau principal',
        adresse: adresseComplete,
        telephone: telephone
      })
      .select('id_bureau')
      .single();
    
    if (bureauError) {
      console.error('Erreur lors de la création du bureau principal:', bureauError);
      
      // Si la création du bureau échoue, supprimer l'auto-école créée
      const { error: deleteError } = await supabase
        .from('auto_ecole')
        .delete()
        .eq('id_ecole', data.id_ecole);
      
      if (deleteError) {
        console.error('Erreur lors de la suppression de l\'auto-école après échec de création du bureau:', deleteError);
      }
      
      return NextResponse.json(
        { error: 'Erreur lors de la création du bureau principal. Une auto-école doit avoir au moins un bureau.' },
        { status: 500 }
      );
    } else {
      // Mettre à jour l'auto-école pour référencer son bureau principal
      const { error: updateError } = await supabase
        .from('auto_ecole')
        .update({ id_bureau: bureauData.id_bureau })
        .eq('id_ecole', data.id_ecole);
      
      if (updateError) {
        console.error('Erreur lors de la mise à jour du bureau principal de l\'auto-école:', updateError);
      }
    }
    
    return NextResponse.json({
      success: true,
      id_ecole: data.id_ecole,
      message: 'Auto-école créée avec succès'
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
