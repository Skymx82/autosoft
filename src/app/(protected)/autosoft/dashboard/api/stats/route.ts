import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Récupérer les paramètres de recherche
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // Déterminer la date de début en fonction de la période
    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else if (period === 'all') {
      startDate = new Date(0); // Depuis le début
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    
    // Récupérer le nombre total d'auto-écoles
    const { count: totalAutoEcoles, error: autoEcolesError } = await supabase
      .from('auto_ecole')
      .select('*', { count: 'exact', head: true });

    if (autoEcolesError) {
      console.error('Erreur lors de la récupération des auto-écoles:', autoEcolesError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques' },
        { status: 500 }
      );
    }

    // Récupérer le nombre d'auto-écoles par statut
    const { data: autoEcolesParStatut, error: statutError } = await supabase
      .from('auto_ecole')
      .select('statut');

    // Compter manuellement les auto-écoles par statut
    let autoEcolesActives = 0;
    let autoEcolesInactives = 0;
    let autoEcolesEnAttente = 0;

    if (autoEcolesParStatut) {
      autoEcolesParStatut.forEach((ecole) => {
        if (ecole.statut === 'active') autoEcolesActives++;
        else if (ecole.statut === 'inactive') autoEcolesInactives++;
        else if (ecole.statut === 'pending') autoEcolesEnAttente++;
      });
    }

    // Récupérer le nombre total d'élèves
    const { count: totalEleves, error: elevesError } = await supabase
      .from('eleves')
      .select('*', { count: 'exact', head: true });

    if (elevesError) {
      console.error('Erreur lors de la récupération des élèves:', elevesError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques' },
        { status: 500 }
      );
    }

    // Récupérer le nombre total de moniteurs
    const { count: totalMoniteurs, error: moniteursError } = await supabase
      .from('enseignants')
      .select('*', { count: 'exact', head: true });

    if (moniteursError) {
      console.error('Erreur lors de la récupération des moniteurs:', moniteursError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques' },
        { status: 500 }
      );
    }

    // Récupérer le nombre total de bureaux
    const { count: totalBureaux, error: bureauxError } = await supabase
      .from('bureau')
      .select('*', { count: 'exact', head: true });

    if (bureauxError) {
      console.error('Erreur lors de la récupération des bureaux:', bureauxError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques' },
        { status: 500 }
      );
    }

    // Récupérer le nombre total de leçons pour la période
    const { count: totalLecons, error: leconsError } = await supabase
      .from('planning')
      .select('*', { count: 'exact', head: true })
      .gte('date', startDateStr);

    if (leconsError) {
      console.error('Erreur lors de la récupération des leçons:', leconsError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques' },
        { status: 500 }
      );
    }

    // Récupérer le nombre total d'examens pour la période
    const { count: totalExamens, error: examensError } = await supabase
      .from('examen_resultats')
      .select('*', { count: 'exact', head: true })
      .gte('date_examen', startDateStr);

    if (examensError) {
      console.error('Erreur lors de la récupération des examens:', examensError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques' },
        { status: 500 }
      );
    }

    // Récupérer les examens réussis par type
    const { data: examensReussisData, error: examensReussisError } = await supabase
      .from('examen_resultats')
      .select('type_examen')
      .eq('resultat', 'réussi')
      .gte('date_examen', startDateStr);

    if (examensReussisError) {
      console.error('Erreur lors de la récupération des examens réussis:', examensReussisError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques' },
        { status: 500 }
      );
    }

    // Compter les examens réussis par type
    const examensReussisCount: Record<string, number> = {};
    if (examensReussisData) {
      examensReussisData.forEach((examen) => {
        const type = examen.type_examen || 'Non spécifié';
        examensReussisCount[type] = (examensReussisCount[type] || 0) + 1;
      });
    }

    // Convertir en tableau pour l'API
    const examensReussis = Object.entries(examensReussisCount).map(([type, count]) => ({
      type,
      count
    }));

    // Calculer le taux de réussite
    const totalExamensReussis = examensReussisData?.length || 0;
    const tauxReussite = totalExamens && totalExamens > 0 ? (totalExamensReussis / totalExamens) * 100 : 0;

    // Récupérer les leçons par mois
    const leconsMois = [];
    const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    // Calculer les 6 derniers mois
    const derniersMois = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      derniersMois.push({
        mois: moisNoms[date.getMonth()],
        annee: date.getFullYear(),
        moisNum: date.getMonth() + 1
      });
    }

    // Récupérer les leçons pour chaque mois
    for (const mois of derniersMois) {
      const debutMois = `${mois.annee}-${String(mois.moisNum).padStart(2, '0')}-01`;
      const finMois = new Date(mois.annee, mois.moisNum, 0).toISOString().split('T')[0];
      
      const { count, error } = await supabase
        .from('planning')
        .select('*', { count: 'exact', head: true })
        .gte('date', debutMois)
        .lte('date', finMois);
      
      if (!error) {
        leconsMois.push({
          mois: mois.mois,
          count: count || 0
        });
      }
    }

    // Récupérer le total des revenus pour la période
    const { data: revenus, error: revenusError } = await supabase
      .from('recette')
      .select('montant_recette')
      .gte('date_recette', startDateStr);

    if (revenusError) {
      console.error('Erreur lors de la récupération des revenus:', revenusError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques' },
        { status: 500 }
      );
    }

    // Calculer le total des revenus
    const totalRevenus = revenus ? revenus.reduce((sum, item) => {
      const montant = parseFloat(item.montant_recette);
      return sum + (isNaN(montant) ? 0 : montant);
    }, 0) : 0;

    // Récupérer le total des dépenses pour la période
    const { data: depenses, error: depensesError } = await supabase
      .from('depense')
      .select('montant_depense')
      .gte('date_depense', startDateStr);

    if (depensesError) {
      console.error('Erreur lors de la récupération des dépenses:', depensesError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques' },
        { status: 500 }
      );
    }

    // Calculer le total des dépenses
    const totalDepenses = depenses ? depenses.reduce((sum, item) => {
      const montant = parseFloat(item.montant_depense);
      return sum + (isNaN(montant) ? 0 : montant);
    }, 0) : 0;

    // Initialiser les statistiques avec toutes les données récupérées
    const stats = {
      totalAutoEcoles: totalAutoEcoles || 0,
      totalEleves: totalEleves || 0,
      totalMoniteurs: totalMoniteurs || 0,
      totalBureaux: totalBureaux || 0,
      totalLecons: totalLecons || 0,
      totalExamens: totalExamens || 0,
      totalRevenus,
      totalDepenses,
      tauxReussite,
      leconsMois,
      examensReussis,
      autoEcolesActives,
      autoEcolesInactives,
      autoEcolesEnAttente
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
