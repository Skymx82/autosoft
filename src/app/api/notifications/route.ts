import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Récupérer les notifications
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

    console.log('📥 Récupération des notifications pour:', {
      id_ecole,
      id_bureau: id_bureau || 'tous',
      id_utilisateur
    });

    // Construire la requête de base
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('id_ecole', id_ecole)
      .eq('id_destinataire', id_utilisateur)
      .order('date_notif', { ascending: false })
      .limit(50); // Limiter à 50 notifications max

    // Filtrer par bureau si spécifié (et différent de 0 ou 'all')
    if (id_bureau && id_bureau !== '0' && id_bureau !== 'all') {
      query = query.eq('id_bureau', id_bureau);
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des notifications' },
        { status: 500 }
      );
    }

    // Compter les notifications non lues
    const unreadCount = notifications?.filter(n => !n.lu).length || 0;

    console.log('✅ Notifications récupérées:', {
      total: notifications?.length || 0,
      nonLues: unreadCount
    });

    return NextResponse.json({
      notifications: notifications || [],
      unreadCount,
      success: true
    });

  } catch (error: any) {
    console.error('❌ Erreur API notifications:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error?.message },
      { status: 500 }
    );
  }
}

// PUT - Marquer une notification comme lue
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { code_notif, lu } = body;

    // Validation
    if (!code_notif || lu === undefined) {
      return NextResponse.json(
        { error: 'Paramètres manquants: code_notif et lu requis' },
        { status: 400 }
      );
    }

    console.log('📝 Mise à jour notification:', { code_notif, lu });

    // Mettre à jour la notification
    const { data, error } = await supabase
      .from('notifications')
      .update({ lu })
      .eq('code_notif', code_notif)
      .select();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    console.log('✅ Notification mise à jour');

    return NextResponse.json({
      notification: data?.[0],
      success: true
    });

  } catch (error: any) {
    console.error('❌ Erreur API notifications PUT:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error?.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une notification
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code_notif = searchParams.get('code_notif');

    // Validation
    if (!code_notif) {
      return NextResponse.json(
        { error: 'Paramètre manquant: code_notif requis' },
        { status: 400 }
      );
    }

    console.log('🗑️ Suppression notification:', code_notif);

    // Supprimer la notification
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('code_notif', code_notif);

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    console.log('✅ Notification supprimée');

    return NextResponse.json({
      success: true,
      message: 'Notification supprimée avec succès'
    });

  } catch (error: any) {
    console.error('❌ Erreur API notifications DELETE:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error?.message },
      { status: 500 }
    );
  }
}
