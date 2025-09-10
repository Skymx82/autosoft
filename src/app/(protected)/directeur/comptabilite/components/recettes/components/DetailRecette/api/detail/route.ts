import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de la requête
    const searchParams = request.nextUrl.searchParams;
    const id_recette = searchParams.get('id_recette');
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau');
    
    // Vérifier que les paramètres requis sont présents
    if (!id_recette) {
      return NextResponse.json(
        { error: 'ID de recette manquant' },
        { status: 400 }
      );
    }

    if (!id_ecole) {
      return NextResponse.json(
        { error: 'ID d\'école manquant' },
        { status: 400 }
      );
    }

    // Récupérer les détails de la recette
    const { data: recetteData, error: recetteError } = await supabase
      .from('recette')
      .select(`
        id_recette,
        date_recette,
        categorie_recette,
        description_recette,
        montant_recette,
        tva_recette,
        client_recette,
        mode_paiement_recette,
        statut_recette,
        id_transaction
      `)
      .eq('id_recette', id_recette)
      .eq('id_ecole', id_ecole)
      .single();

    if (recetteError) {
      console.error('Erreur lors de la récupération de la recette:', recetteError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de la recette' },
        { status: 500 }
      );
    }

    if (!recetteData) {
      return NextResponse.json(
        { error: 'Recette non trouvée' },
        { status: 404 }
      );
    }

    // Transformer les données pour correspondre au format attendu par le frontend
    const recette = {
      id: recetteData.id_recette,
      date: recetteData.date_recette,
      categorie: recetteData.categorie_recette,
      description: recetteData.description_recette,
      montant: recetteData.montant_recette,
      tva: recetteData.tva_recette,
      client: recetteData.client_recette,
      modePaiement: recetteData.mode_paiement_recette,
      statut: recetteData.statut_recette,
      id_transaction: recetteData.id_transaction
    };

    // Retourner les données
    return NextResponse.json({
      success: true,
      recette
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
