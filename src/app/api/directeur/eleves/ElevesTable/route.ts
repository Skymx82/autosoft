import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // Récupérer les paramètres de la requête
    const searchParams = req.nextUrl.searchParams;
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau') || '0'; // 0 = Tous les bureaux
    
    // Vérifier si l'ID de l'école est fourni
    if (!id_ecole) {
      return NextResponse.json(
        { error: "L'ID de l'auto-école est requis" },
        { status: 400 }
      );
    }

    // Créer le client Supabase
    const cookieStore = cookies();

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
        bureau (
          id_bureau,
          nom
        )
      `)
      .eq('id_ecole', id_ecole);

    // Ajouter le filtre par bureau si spécifié et différent de 0 (tous les bureaux)
    if (id_bureau !== '0') {
      query = query.eq('id_bureau', id_bureau);
    }

    // Exécuter la requête
    const { data: eleves, error } = await query;

    // Gérer les erreurs de la requête
    if (error) {
      console.error('Erreur lors de la récupération des élèves:', error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des élèves" },
        { status: 500 }
      );
    }

    // Transformer les données pour correspondre à l'interface Eleve
    const formattedEleves = eleves.map(eleve => ({
      ...eleve
      // Pas besoin de transformation car la structure est déjà correcte
      // bureau est déjà présent dans les données retournées
    }));

    // Retourner les élèves
    return NextResponse.json(formattedEleves);
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: "Une erreur inattendue s'est produite" },
      { status: 500 }
    );
  }
}
