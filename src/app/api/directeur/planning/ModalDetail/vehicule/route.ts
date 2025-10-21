import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de l'URL
    const searchParams = request.nextUrl.searchParams;
    const id_bureau = searchParams.get('id_bureau');
    const id_ecole = searchParams.get('id_ecole');

    // Validation des paramètres
    if (!id_bureau || !id_ecole) {
      return NextResponse.json(
        { error: 'Les paramètres id_bureau et id_ecole sont requis' },
        { status: 400 }
      );
    }

    // Récupérer les véhicules depuis la base de données
    const { data: vehicules, error } = await supabase
      .from('vehicule')
      .select('*')
      .eq('id_bureau', parseInt(id_bureau))
      .eq('id_ecole', parseInt(id_ecole))
      .eq('statut', 'Actif') // Uniquement les véhicules actifs
      .order('immatriculation', { ascending: true });

    // Gérer les erreurs Supabase
    if (error) {
      console.error('Erreur Supabase lors de la récupération des véhicules:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des véhicules', details: error.message },
        { status: 500 }
      );
    }

    // Retourner les véhicules
    return NextResponse.json({
      vehicules: vehicules || [],
      success: true
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la récupération des véhicules',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
