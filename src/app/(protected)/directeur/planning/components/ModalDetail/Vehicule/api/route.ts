import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Récupère les véhicules associés à une auto-école et éventuellement un bureau
 * GET /directeur/planning/components/ModalDetail/Vehicule/api?id_ecole=1&id_bureau=1
 */
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
      .from('vehicule')
      .select('id_vehicule, immatriculation, marque, modele, type_vehicule, categorie_permis, boite_vitesse, statut, id_bureau, id_ecole')
      .eq('id_ecole', parseInt(id_ecole));

    // Ajouter le filtre id_bureau si fourni
    if (id_bureau) {
      query = query.eq('id_bureau', parseInt(id_bureau));
    }

    // Filtrer uniquement les véhicules actifs
    query = query.eq('statut', 'Actif');

    // Trier par immatriculation
    query = query.order('immatriculation', { ascending: true });

    // Exécuter la requête
    const { data: vehicules, error } = await query;

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
