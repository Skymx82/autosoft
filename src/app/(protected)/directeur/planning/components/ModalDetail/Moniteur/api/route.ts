import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de l'URL
    const searchParams = request.nextUrl.searchParams;
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau');

    // Validation des paramètres
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'Le paramètre id_ecole est requis' },
        { status: 400 }
      );
    }

    // Construire la requête Supabase
    let query = supabase
      .from('enseignants')
      .select('*')
      .eq('id_ecole', parseInt(id_ecole));

    // Ajouter le filtre id_bureau si fourni
    if (id_bureau) {
      query = query.eq('id_bureau', parseInt(id_bureau));
    }

    // Trier par nom et prénom
    query = query.order('nom', { ascending: true }).order('prenom', { ascending: true });

    // Exécuter la requête
    const { data: moniteurs, error } = await query;

    // Gérer les erreurs Supabase
    if (error) {
      console.error('Erreur Supabase lors de la récupération des moniteurs:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des moniteurs', details: error.message },
        { status: 500 }
      );
    }

    // Retourner les moniteurs
    return NextResponse.json({
      moniteurs: moniteurs || [],
      success: true
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des moniteurs:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la récupération des moniteurs',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
