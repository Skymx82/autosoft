import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Définir le type pour les paramètres de route
type RouteParams = {
  params: {
    id_eleve: string;
  };
};

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Accéder directement au paramètre id_eleve
    const id_eleve = params.id_eleve;
    const searchParams = request.nextUrl.searchParams;
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau');
    const infoType = searchParams.get('type') || 'all'; // 'all', 'info', 'lecons'

    // Vérifier que les paramètres requis sont présents
    if (!id_eleve || !id_ecole) {
      return NextResponse.json(
        { error: 'Paramètres manquants: id_eleve et id_ecole sont requis' },
        { status: 400 }
      );
    }

    // Objet pour stocker la réponse finale
    const response: any = {};

    // Récupérer les informations de l'élève si demandé
    if (infoType === 'all' || infoType === 'info') {
      let eleveQuery = supabase
        .from('eleves')
        .select('id_eleve, nom, prenom, tel, mail, categorie, id_moniteur')
        .eq('id_eleve', id_eleve)
        .eq('id_ecole', id_ecole);

      // Filtrer par bureau si spécifié et différent de "Tout" (id_bureau = 0)
      if (id_bureau && id_bureau !== '0') {
        eleveQuery = eleveQuery.eq('id_bureau', id_bureau);
      }

      // Exécuter la requête
      const { data: eleve, error: eleveError } = await eleveQuery.single();

      if (eleveError && eleveError.code !== 'PGRST116') { // PGRST116 = No rows found
        console.error('Erreur lors de la récupération des informations de l\'\u00e9lève:', eleveError);
        return NextResponse.json(
          { error: 'Erreur lors de la récupération des informations de l\'\u00e9lève' },
          { status: 500 }
        );
      }

      if (!eleve && infoType === 'info') {
        return NextResponse.json(
          { error: 'Élève non trouvé' },
          { status: 404 }
        );
      }

      if (eleve) {
        response.eleve = eleve;
      }
    }

    // Récupérer les leçons de l'élève si demandé
    if (infoType === 'all' || infoType === 'lecons') {
      let leconsQuery = supabase
        .from('planning')
        .select(`
          id_planning,
          date,
          heure_debut,
          heure_fin,
          type_lecon,
          statut_lecon,
          id_moniteur,
          id_eleve,
          moniteurs:enseignants(id_moniteur, nom, prenom)
        `)
        .eq('id_eleve', id_eleve)
        .eq('id_ecole', id_ecole);

      // Filtrer par bureau si spécifié et différent de "Tout" (id_bureau = 0)
      if (id_bureau && id_bureau !== '0') {
        leconsQuery = leconsQuery.eq('id_bureau', id_bureau);
      }

      // Exécuter la requête
      const { data: lecons, error: leconsError } = await leconsQuery;

      if (leconsError) {
        console.error('Erreur lors de la récupération des leçons:', leconsError);
        return NextResponse.json(
          { error: 'Erreur lors de la récupération des leçons' },
          { status: 500 }
        );
      }

      if (lecons) {
        // Formater les données pour inclure les informations du moniteur
        const formattedLecons = lecons.map((lecon: any) => {
          const { moniteurs, ...rest } = lecon;
          return {
            ...rest,
            moniteur: moniteurs
          };
        });
        
        response.lecons = formattedLecons;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
