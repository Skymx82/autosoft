import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    // Récupérer l'ID du véhicule depuis les paramètres de l'URL
    const searchParams = request.nextUrl.searchParams;
    const id_vehicule = searchParams.get('id_vehicule');

    // Validation
    if (!id_vehicule) {
      return NextResponse.json(
        { error: 'Le paramètre id_vehicule est requis' },
        { status: 400 }
      );
    }

    // Supprimer le véhicule
    const { error } = await supabase
      .from('vehicule')
      .delete()
      .eq('id_vehicule', parseInt(id_vehicule));

    // Gérer les erreurs Supabase
    if (error) {
      console.error('Erreur Supabase lors de la suppression du véhicule:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du véhicule', details: error.message },
        { status: 500 }
      );
    }

    // Retourner le succès
    return NextResponse.json({
      success: true,
      message: 'Véhicule supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du véhicule:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la suppression du véhicule',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
