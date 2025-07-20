import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Récupère les véhicules associés à un bureau et une auto-école
 * GET /api/directeur/planning/ModalDetail/vehicule?id_bureau=123&id_ecole=456
 */
export async function GET(request: Request) {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const id_bureau = searchParams.get('id_bureau');
    const id_ecole = searchParams.get('id_ecole');

    // Vérifier que les paramètres nécessaires sont fournis
    if (!id_bureau || !id_ecole) {
      return NextResponse.json(
        { error: 'Les paramètres id_bureau et id_ecole sont requis' },
        { status: 400 }
      );
    }

    // Récupérer les véhicules associés à l'auto-école
    let vehiculesQuery = supabase
      .from('vehicule')
      .select('id_vehicule, immatriculation, marque, modele, type_vehicule, categorie_permis, statut')
      .eq('id_ecole', id_ecole)
      .order('immatriculation', { ascending: true });
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      vehiculesQuery = vehiculesQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: vehicules, error } = await vehiculesQuery;

    if (error) {
      console.error('Erreur lors de la récupération des véhicules:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des véhicules' },
        { status: 500 }
      );
    }

    return NextResponse.json({ vehicules });
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des véhicules' },
      { status: 500 }
    );
  }
}