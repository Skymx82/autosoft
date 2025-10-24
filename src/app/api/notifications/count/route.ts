import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Récupérer uniquement le nombre de notifications non lues
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau');
    const id_utilisateur = searchParams.get('id_utilisateur');

    // Validation des paramètres obligatoires
    if (!id_ecole || !id_utilisateur) {
      return NextResponse.json(
        { error: 'Paramètres manquants: id_ecole et id_utilisateur requis' },
        { status: 400 }
      );
    }

    // Construire la requête de base
    let query = supabase
      .from('notifications')
      .select('code_notif', { count: 'exact', head: true })
      .eq('id_ecole', id_ecole)
      .eq('id_destinataire', id_utilisateur)
      .eq('lu', false);

    // Filtrer par bureau si spécifié (et différent de 0 ou 'all')
    if (id_bureau && id_bureau !== '0' && id_bureau !== 'all') {
      query = query.eq('id_bureau', id_bureau);
    }

    const { count, error } = await query;

    if (error) {
      console.error('❌ Erreur Supabase count:', error);
      return NextResponse.json(
        { error: 'Erreur lors du comptage des notifications' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      count: count || 0,
      success: true
    });

  } catch (error: any) {
    console.error('❌ Erreur API notifications count:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error?.message },
      { status: 500 }
    );
  }
}
