import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    // Extraire les paramètres de la requête
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

    // Vérifier si la recette existe avant de la supprimer
    const { data: recetteData, error: recetteError } = await supabase
      .from('recette')
      .select('id_recette')
      .eq('id_recette', id_recette)
      .eq('id_ecole', id_ecole)
      .single();

    if (recetteError) {
      console.error('Erreur lors de la vérification de la recette:', recetteError);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification de la recette' },
        { status: 500 }
      );
    }

    if (!recetteData) {
      return NextResponse.json(
        { error: 'Recette non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la recette
    const { error: deleteError } = await supabase
      .from('recette')
      .delete()
      .eq('id_recette', id_recette)
      .eq('id_ecole', id_ecole);

    if (deleteError) {
      console.error('Erreur lors de la suppression de la recette:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la recette' },
        { status: 500 }
      );
    }

    // Note: Nous ne supprimons plus les transactions associées car la table recette n'a plus de colonne id_transaction

    // Retourner la réponse de succès
    return NextResponse.json({
      success: true,
      message: 'Recette supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
