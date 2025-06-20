import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Appeler la fonction PostgreSQL pour mettre à jour les leçons passées
    await supabase.rpc('update_past_lessons');
    
    // Extraire les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau') || '0'; // 0 = Tous les bureaux
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const view = searchParams.get('view') || 'week'; // 'day', 'week', 'month'
    const search = searchParams.get('search') || ''; // Recherche d'élève
    const moniteur = searchParams.get('moniteur') || 'all'; // Filtre par moniteur
    
    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50'); // Nombre d'éléments par page
    
    // Vérifier que les paramètres nécessaires sont présents
    if (!id_ecole || !startDate || !endDate) {
      return NextResponse.json({ error: 'Paramètres manquants (id_ecole, startDate, endDate)' }, { status: 400 });
    }
    
    // --- RÉCUPÉRATION DES MONITEURS ---
    // Sélectionner uniquement les champs nécessaires pour améliorer les performances
    let moniteursQuery = supabase
      .from('enseignants')
      .select('id_moniteur, nom, prenom') // Réduire les champs sélectionnés pour optimiser
      .eq('id_ecole', id_ecole)
      .order('nom');
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      moniteursQuery = moniteursQuery.eq('id_bureau', id_bureau);
    }
    
    // --- RÉCUPÉRATION DES LEÇONS DE CONDUITE ---
    // Optimiser la requête en sélectionnant uniquement les champs nécessaires
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
          prenom
        )
      `, { count: 'exact' }) // Ajouter le comptage pour la pagination
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('id_ecole', id_ecole)
      .range((page - 1) * pageSize, page * pageSize - 1); // Ajouter la pagination
      
    // Filtrer par moniteur si spécifié
    if (moniteur && moniteur !== 'all') {
      console.log('Filtrage par moniteur:', moniteur);
      leconsQuery = leconsQuery.eq('id_moniteur', moniteur);
    }
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      leconsQuery = leconsQuery.eq('id_bureau', id_bureau);
    }
    
    // --- RÉCUPÉRATION DES ÉLÈVES (pour la recherche) ---
    // Limiter à 50 élèves pour des raisons de performance
    let elevesQuery = supabase
      .from('eleves')
      .select('id_eleve, nom, prenom') // Réduire les champs sélectionnés pour optimiser
      .eq('id_ecole', id_ecole)
      .order('nom')
      .limit(50); // Réduire la limite pour améliorer les performances
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      elevesQuery = elevesQuery.eq('id_bureau', id_bureau);
    }
    
    // Exécuter toutes les requêtes en parallèle pour améliorer les performances
    const [moniteursResult, leconsResult, elevesResult] = await Promise.all([
      moniteursQuery,
      leconsQuery,
      elevesQuery
    ]);
    
    const { data: moniteurs, error: moniteursError } = moniteursResult;
    const { data: lecons, error: leconsError } = leconsResult;
    const { data: eleves, error: elevesError } = elevesResult;
    
    // Vérifier les erreurs
    if (moniteursError || leconsError || elevesError) {
      console.error('Erreurs lors des requêtes:', {
        moniteursError,
        leconsError,
        elevesError
      });
      return NextResponse.json({ error: 'Erreur lors de la récupération des données' }, { status: 500 });
    }
    
    // Filtrer les leçons si une recherche d'élève est spécifiée
    let filteredLecons = lecons;
    
    // Si une recherche est spécifiée, filtrer les leçons par élève
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      
      // D'abord, trouver les élèves qui correspondent à la recherche
      const matchingEleveIds = eleves
        ?.filter(eleve => 
          (eleve.nom && eleve.nom.toLowerCase().includes(searchLower)) ||
          (eleve.prenom && eleve.prenom.toLowerCase().includes(searchLower))
        )
        .map(eleve => eleve.id_eleve);
      
      // Ensuite, filtrer les leçons pour ne garder que celles avec les élèves correspondants
      filteredLecons = lecons?.filter(lecon => 
        matchingEleveIds.includes(lecon.id_eleve)
      );
    }
    
    // Organiser les leçons par jour et par moniteur pour faciliter l'affichage
    const leconsByDay: Record<string, Record<number, any[]>> = {};
    
    if (filteredLecons && filteredLecons.length > 0) {
      filteredLecons.forEach((lecon: any) => {
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
    
    // Préparation de la réponse avec informations de pagination
    const response = {
      moniteurs: moniteurs || [],
      lecons: filteredLecons || [],
      eleves: eleves || [],
      leconsByDay: leconsByDay,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: leconsResult.count || filteredLecons.length,
        totalPages: Math.ceil((leconsResult.count || filteredLecons.length) / pageSize)
      }
    };
    
    // Renvoyer toutes les données en une seule réponse
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des données du planning:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
