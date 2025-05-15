import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Extraire les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau') || '0'; // 0 = Tous les bureaux
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const view = searchParams.get('view') || 'week'; // 'day', 'week', 'month'
    
    // Vérifier que les paramètres nécessaires sont présents
    if (!id_ecole || !startDate || !endDate) {
      return NextResponse.json({ error: 'Paramètres manquants (id_ecole, startDate, endDate)' }, { status: 400 });
    }
    
    // --- RÉCUPÉRATION DES MONITEURS ---
    let moniteursQuery = supabase
      .from('enseignants')
      .select('id_moniteur, nom, prenom, email, tel, num_enseignant')
      .eq('id_ecole', id_ecole)
      .order('nom');
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      moniteursQuery = moniteursQuery.eq('id_bureau', id_bureau);
    }
    
    // --- RÉCUPÉRATION DES LEÇONS DE CONDUITE ---
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
        eleves (
          id_eleve,
          nom,
          prenom,
          tel,
          categorie
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('id_ecole', id_ecole);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      leconsQuery = leconsQuery.eq('id_bureau', id_bureau);
    }
    
    // --- RÉCUPÉRATION DES ÉLÈVES (pour la recherche) ---
    // Limiter à 100 élèves pour des raisons de performance
    let elevesQuery = supabase
      .from('eleves')
      .select('id_eleve, nom, prenom, tel, categorie, id_moniteur')
      .eq('id_ecole', id_ecole)
      .order('nom')
      .limit(100);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      elevesQuery = elevesQuery.eq('id_bureau', id_bureau);
    }
    
    // Exécuter toutes les requêtes en parallèle
    const [
      { data: moniteurs, error: moniteursError },
      { data: lecons, error: leconsError },
      { data: eleves, error: elevesError }
    ] = await Promise.all([
      moniteursQuery,
      leconsQuery,
      elevesQuery
    ]);
    
    // Vérifier les erreurs
    if (moniteursError || leconsError || elevesError) {
      console.error('Erreurs lors des requêtes:', {
        moniteursError,
        leconsError,
        elevesError
      });
      return NextResponse.json({ error: 'Erreur lors de la récupération des données' }, { status: 500 });
    }
    
    // Organiser les leçons par jour et par moniteur pour faciliter l'affichage
    const leconsByDay: Record<string, Record<number, any[]>> = {};
    
    if (lecons && lecons.length > 0) {
      lecons.forEach((lecon: any) => {
        const dateStr = lecon.date;
        const moniteurId = lecon.id_moniteur;
        
        if (!leconsByDay[dateStr]) {
          leconsByDay[dateStr] = {};
        }
        
        if (!leconsByDay[dateStr][moniteurId]) {
          leconsByDay[dateStr][moniteurId] = [];
        }
        
        leconsByDay[dateStr][moniteurId].push(lecon);
      });
    }
    
    // Renvoyer toutes les données en une seule réponse
    return NextResponse.json({
      moniteurs: moniteurs || [],
      lecons: lecons || [],
      leconsByDay: leconsByDay,
      eleves: eleves || []
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des données du planning:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
