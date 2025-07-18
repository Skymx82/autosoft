import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Récupère la liste des élèves associés à une auto-école et éventuellement un bureau
 * GET /api/directeur/planning/ModalDetail/eleve?id_ecole=1&id_bureau=1
 */
export async function GET(request: Request) {
  try {
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau');

    // Vérifier que l'ID de l'auto-école est fourni
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'ID de l\'auto-école manquant' },
        { status: 400 }
      );
    }

    // Construire la requête de base
    let query = supabase
      .from('eleves')
      .select(`
        id_eleve,
        nom,
        prenom,
        mail,
        tel,
        adresse,
        code_postal,
        ville,
        categorie,
        id_bureau,
        id_ecole
      `)
      .eq('id_ecole', id_ecole);

    // Filtrer par bureau si spécifié
    if (id_bureau) {
      query = query.eq('id_bureau', id_bureau);
    }

    // Exécuter la requête
    const { data: eleves, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des élèves:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des élèves' },
        { status: 500 }
      );
    }

    return NextResponse.json({ eleves });
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des élèves' },
      { status: 500 }
    );
  }
}
