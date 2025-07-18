import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Récupère la liste complète des élèves pour une école
 * GET /directeur/eleves/api/EleveFiltre?id_ecole=
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
        naiss,
        mail,
        tel,
        adresse,
        code_postal,
        ville,
        categorie,
        statut_dossier,
        date_inscription,
        id_bureau,
        bureau(nom)
      `)
      .eq('id_ecole', id_ecole);

    // Filtrer par bureau si spécifié
    if (id_bureau && id_bureau !== 'all') {
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

/**
 * Récupère des suggestions d'élèves basées sur un terme de recherche
 * GET /directeur/eleves/api/EleveFiltre?searchTerm=&id_ecole=
 */
export async function POST(request: Request) {
  try {
    // Récupérer les données du corps de la requête
    const { searchTerm, id_ecole, id_bureau } = await request.json();

    // Vérifier que l'ID de l'auto-école est fourni
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'ID de l\'auto-école manquant' },
        { status: 400 }
      );
    }

    // Vérifier que le terme de recherche est fourni
    if (!searchTerm) {
      return NextResponse.json({ suggestions: [] });
    }

    // Construire la requête
    let query = supabase
      .from('eleves')
      .select('id_eleve, nom, prenom')
      .eq('id_ecole', id_ecole)
      .or(`nom.ilike.%${searchTerm}%,prenom.ilike.%${searchTerm}%,mail.ilike.%${searchTerm}%,tel.ilike.%${searchTerm}%`)
      .limit(10);

    // Filtrer par bureau si spécifié
    if (id_bureau && id_bureau !== 'all') {
      query = query.eq('id_bureau', id_bureau);
    }

    // Exécuter la requête
    const { data: suggestions, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des suggestions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des suggestions' },
      { status: 500 }
    );
  }
}
