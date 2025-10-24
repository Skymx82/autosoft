import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PUT - Marquer toutes les notifications comme lues
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_ecole, id_bureau, id_utilisateur } = body;

    // Validation
    if (!id_ecole || !id_utilisateur) {
      return NextResponse.json(
        { error: 'Paramètres manquants: id_ecole et id_utilisateur requis' },
        { status: 400 }
      );
    }

    console.log('📝 Marquage de toutes les notifications comme lues pour:', {
      id_ecole,
      id_bureau: id_bureau || 'tous',
      id_utilisateur
    });

    // Construire la requête de mise à jour
    let query = supabase
      .from('notifications')
      .update({ lu: true })
      .eq('id_ecole', id_ecole)
      .eq('id_destinataire', id_utilisateur)
      .eq('lu', false); // Mettre à jour uniquement les non lues

    // Filtrer par bureau si spécifié (et différent de 0 ou 'all')
    if (id_bureau && id_bureau !== '0' && id_bureau !== 'all') {
      query = query.eq('id_bureau', id_bureau);
    }

    const { data, error, count } = await query.select();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    console.log('✅ Toutes les notifications marquées comme lues:', {
      nombre: data?.length || 0
    });

    return NextResponse.json({
      success: true,
      updated: data?.length || 0,
      message: `${data?.length || 0} notification(s) marquée(s) comme lue(s)`
    });

  } catch (error: any) {
    console.error('❌ Erreur API mark-all-read:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error?.message },
      { status: 500 }
    );
  }
}
