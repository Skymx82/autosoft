import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

// GET - Récupérer une auto-école par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'auto-école non fourni' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('auto_ecole')
      .select(`
        id_ecole,
        id_bureau,
        nom,
        adresse,
        siret,
        num_agrement,
        logo,
        presentation,
        bureau:bureau!bureau_id_ecole_fkey(id_bureau, nom, adresse, telephone),
        enseignants:enseignants!enseignants_id_ecole_fkey(count),
        eleves:eleves!eleves_id_ecole_fkey(count)
      `)
      .eq('id_ecole', id)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération de l\'auto-école:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'auto-école' },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Auto-école non trouvée' },
        { status: 404 }
      );
    }
    
    // Transformer les données pour correspondre au format attendu par le frontend
    // Extraire l'adresse pour en tirer la ville et le code postal
    const adresseParts = data.adresse ? data.adresse.split(',') : ['', ''];
    const ville = adresseParts.length > 1 ? adresseParts[adresseParts.length - 2]?.trim() : '';
    const codePostal = adresseParts.length > 1 ? adresseParts[adresseParts.length - 1]?.trim() : '';
    
    // Récupérer les informations du bureau principal si disponible
    const bureauPrincipal = data.bureau && data.bureau.length > 0 ? data.bureau[0] : null;
    
    const formattedData = {
      id: data.id_ecole,
      nom: data.nom,
      adresse: data.adresse,
      ville: ville,
      code_postal: codePostal,
      telephone: bureauPrincipal?.telephone || '', // Utiliser le téléphone du bureau principal
      email: '', // Pas disponible directement
      responsable: '', // Pas disponible directement
      statut: 'active', // Valeur par défaut
      date_creation: new Date().toISOString().split('T')[0], // Date actuelle par défaut
      bureaux: data.bureau || [],
      nb_moniteurs: data.enseignants?.[0]?.count || 0,
      nb_eleves: data.eleves?.[0]?.count || 0
    };
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une auto-école
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'auto-école non fourni' },
        { status: 400 }
      );
    }
    
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
    
    // Mettre à jour l'auto-école
    const { data, error } = await supabase
      .from('auto_ecole')
      .update({
        nom: nom,
        adresse: adresseComplete
      })
      .eq('id_ecole', id)
      .select('id_ecole')
      .single();
      
    // Mettre à jour le bureau principal si l'auto-école a un bureau principal
    if (!error) {
      const { data: autoEcole } = await supabase
        .from('auto_ecole')
        .select('id_bureau')
        .eq('id_ecole', id)
        .single();
      
      if (autoEcole?.id_bureau) {
        await supabase
          .from('bureau')
          .update({
            nom: 'Bureau principal',
            adresse: adresseComplete,
            telephone: telephone
          })
          .eq('id_bureau', autoEcole.id_bureau);
      }
    }
    
    if (error) {
      console.error('Erreur lors de la mise à jour de l\'auto-école:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de l\'auto-école' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      id_ecole: data.id_ecole,
      message: 'Auto-école mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une auto-école
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'auto-école non fourni' },
        { status: 400 }
      );
    }
    
    // Vérifier si l'auto-école a des enseignants ou des élèves
    const { data: checkData, error: checkError } = await supabase
      .from('auto_ecole')
      .select(`
        enseignants:enseignants!enseignants_id_ecole_fkey(count),
        eleves:eleves!eleves_id_ecole_fkey(count)
      `)
      .eq('id_ecole', id)
      .single();
    
    if (checkError) {
      console.error('Erreur lors de la vérification de l\'auto-école:', checkError);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification de l\'auto-école' },
        { status: 500 }
      );
    }
    
    const nbMoniteurs = checkData.enseignants?.[0]?.count || 0;
    const nbEleves = checkData.eleves?.[0]?.count || 0;
    
    if (nbMoniteurs > 0 || nbEleves > 0) {
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer cette auto-école car elle contient des moniteurs ou des élèves',
          nbMoniteurs,
          nbEleves
        },
        { status: 400 }
      );
    }
    
    // Supprimer d'abord les bureaux associés
    const { error: bureauError } = await supabase
      .from('bureau')
      .delete()
      .eq('id_ecole', id);
    
    if (bureauError) {
      console.error('Erreur lors de la suppression des bureaux:', bureauError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression des bureaux associés' },
        { status: 500 }
      );
    }
    
    // Supprimer l'auto-école
    const { error } = await supabase
      .from('auto_ecole')
      .delete()
      .eq('id_ecole', id);
    
    if (error) {
      console.error('Erreur lors de la suppression de l\'auto-école:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de l\'auto-école' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Auto-école supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
