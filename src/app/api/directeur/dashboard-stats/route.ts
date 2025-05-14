import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Extraire les paramètres de la requête (id_ecole, id_bureau)
    const { searchParams } = new URL(request.url);
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau') || '0'; // 0 = Tous les bureaux
    
    // Vérifier que les paramètres nécessaires sont présents
    if (!id_ecole) {
      return NextResponse.json({ error: 'id_ecole est requis' }, { status: 400 });
    }
    
    // Obtenir les dates pour les filtres
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    // Convertir les dates en format ISO pour les requêtes SQL
    const currentMonthStart = firstDayCurrentMonth.toISOString().split('T')[0];
    const currentMonthEnd = firstDayNextMonth.toISOString().split('T')[0];
    const lastMonthStart = firstDayLastMonth.toISOString().split('T')[0];
    const lastMonthEnd = currentMonthStart;
    
    // --- STATISTIQUES DES ÉLÈVES ---
    
    // Requête pour les élèves du mois en cours
    let currentElevesQuery = supabase
      .from('eleves')
      .select('id_eleve', { count: 'exact' })
      .gte('date_inscription', currentMonthStart)
      .lt('date_inscription', currentMonthEnd)
      .eq('id_ecole', id_ecole);
    
    // Requête pour les élèves du mois précédent
    let lastMonthElevesQuery = supabase
      .from('eleves')
      .select('id_eleve', { count: 'exact' })
      .gte('date_inscription', lastMonthStart)
      .lt('date_inscription', lastMonthEnd)
      .eq('id_ecole', id_ecole);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      currentElevesQuery = currentElevesQuery.eq('id_bureau', id_bureau);
      lastMonthElevesQuery = lastMonthElevesQuery.eq('id_bureau', id_bureau);
    }
    
    // --- STATISTIQUES DES HEURES DE CONDUITE ---
    
    // Requête pour les heures de conduite du mois en cours
    let currentConduiteQuery = supabase
      .from('planning')
      .select('heure_debut, heure_fin')
      .gte('date', currentMonthStart)
      .lt('date', currentMonthEnd)
      .eq('statut_lecon', 'Réalisée')
      .eq('id_ecole', id_ecole);
    
    // Requête pour les heures de conduite du mois précédent
    let lastMonthConduiteQuery = supabase
      .from('planning')
      .select('heure_debut, heure_fin')
      .gte('date', lastMonthStart)
      .lt('date', lastMonthEnd)
      .eq('statut_lecon', 'Réalisée')
      .eq('id_ecole', id_ecole);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      currentConduiteQuery = currentConduiteQuery.eq('id_bureau', id_bureau);
      lastMonthConduiteQuery = lastMonthConduiteQuery.eq('id_bureau', id_bureau);
    }
    
    // Exécuter toutes les requêtes en parallèle
    const [
      { count: currentElevesCount, error: currentElevesError },
      { count: lastMonthElevesCount, error: lastMonthElevesError },
      { data: currentConduiteData, error: currentConduiteError },
      { data: lastMonthConduiteData, error: lastMonthConduiteError }
    ] = await Promise.all([
      currentElevesQuery,
      lastMonthElevesQuery,
      currentConduiteQuery,
      lastMonthConduiteQuery
    ]);
    
    // Vérifier les erreurs
    if (currentElevesError || lastMonthElevesError || currentConduiteError || lastMonthConduiteError) {
      console.error('Erreurs lors des requêtes:', {
        currentElevesError,
        lastMonthElevesError,
        currentConduiteError,
        lastMonthConduiteError
      });
      return NextResponse.json({ error: 'Erreur lors de la récupération des données' }, { status: 500 });
    }
    
    // --- CALCUL DES STATISTIQUES ---
    
    // Statistiques des élèves
    let elevesPercentChange = null;
    if (lastMonthElevesCount !== null && lastMonthElevesCount > 0) {
      const change = (currentElevesCount || 0) - lastMonthElevesCount;
      elevesPercentChange = parseFloat(((change / lastMonthElevesCount) * 100).toFixed(1));
    } else if (currentElevesCount && currentElevesCount > 0) {
      elevesPercentChange = 100.0; // Si aucun élève le mois dernier, mais des élèves ce mois-ci
    }
    
    // Statistiques des heures de conduite
    let totalHeuresCurrentMonth = 0;
    let totalHeuresLastMonth = 0;
    
    // Calculer le total des heures pour le mois en cours
    if (currentConduiteData && currentConduiteData.length > 0) {
      totalHeuresCurrentMonth = currentConduiteData.reduce((total, lecon) => {
        const debut = new Date(`1970-01-01T${lecon.heure_debut}`);
        const fin = new Date(`1970-01-01T${lecon.heure_fin}`);
        const dureeHeures = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
        return total + dureeHeures;
      }, 0);
    }
    
    // Calculer le total des heures pour le mois précédent
    if (lastMonthConduiteData && lastMonthConduiteData.length > 0) {
      totalHeuresLastMonth = lastMonthConduiteData.reduce((total, lecon) => {
        const debut = new Date(`1970-01-01T${lecon.heure_debut}`);
        const fin = new Date(`1970-01-01T${lecon.heure_fin}`);
        const dureeHeures = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
        return total + dureeHeures;
      }, 0);
    }
    
    // Calculer le pourcentage de changement pour les heures de conduite
    let conduitePercentChange = null;
    if (totalHeuresLastMonth > 0) {
      const change = totalHeuresCurrentMonth - totalHeuresLastMonth;
      conduitePercentChange = parseFloat(((change / totalHeuresLastMonth) * 100).toFixed(1));
    } else if (totalHeuresCurrentMonth > 0) {
      conduitePercentChange = 100.0; // Si aucune heure le mois dernier, mais des heures ce mois-ci
    }
    
    // --- RÉPONSE FINALE ---
    
    // Log pour le débogage
    console.log('Statistiques du tableau de bord:', {
      eleves: {
        moisActuel: currentElevesCount,
        moisPrecedent: lastMonthElevesCount,
        pourcentageChangement: elevesPercentChange
      },
      conduite: {
        moisActuel: {
          totalHeures: totalHeuresCurrentMonth,
          nombreLecons: currentConduiteData?.length || 0
        },
        moisPrecedent: {
          totalHeures: totalHeuresLastMonth,
          nombreLecons: lastMonthConduiteData?.length || 0
        },
        pourcentageChangement: conduitePercentChange
      }
    });
    
    // Renvoyer toutes les statistiques en une seule réponse
    return NextResponse.json({
      eleves: {
        totalEleves: currentElevesCount || 0,
        percentChange: elevesPercentChange
      },
      conduite: {
        totalHeures: Math.round(totalHeuresCurrentMonth),
        percentChange: conduitePercentChange
      }
      // Vous pourrez ajouter d'autres statistiques ici à l'avenir
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques du tableau de bord:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
