import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Récupère les moniteurs associés à une auto-école et éventuellement un bureau
 * GET /api/directeur/planning/ModalDetail/moniteur?id_ecole=456&id_bureau=123
 */
export async function GET(request: Request) {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const id_bureau = searchParams.get('id_bureau');
    const id_ecole = searchParams.get('id_ecole');

    // Vérifier que les paramètres nécessaires sont fournis
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'Le paramètre id_ecole est requis' },
        { status: 400 }
      );
    }

    // Récupérer les moniteurs associés à l'auto-école
    let moniteursQuery = supabase
      .from('enseignants')
      .select('id_moniteur, nom, prenom, email, tel, num_enseignant, date_delivrance_num')
      .eq('id_ecole', id_ecole)
      .order('nom', { ascending: true });
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau && id_bureau !== '0') {
      moniteursQuery = moniteursQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: moniteurs, error } = await moniteursQuery;

    if (error) {
      console.error('Erreur lors de la récupération des moniteurs:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des moniteurs' },
        { status: 500 }
      );
    }

    return NextResponse.json({ moniteurs });
  } catch (error) {
    console.error('Erreur lors de la récupération des moniteurs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des moniteurs' },
      { status: 500 }
    );
  }
}
