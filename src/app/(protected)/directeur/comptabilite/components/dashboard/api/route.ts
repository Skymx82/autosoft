import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

// Fonction utilitaire pour obtenir les données d'un mois spécifique
async function getDonneesMois(id_ecole: string, id_bureau: string, annee: number, mois: number) {
  const premierJourMois = new Date(annee, mois, 1);
  const dernierJourMois = new Date(annee, mois + 1, 0);
  
  // Format des dates pour Supabase
  const premierJourFormate = premierJourMois.toISOString().split('T')[0];
  const dernierJourFormate = dernierJourMois.toISOString().split('T')[0];
  
  // Récupérer les recettes du mois
  let recettesQuery = supabase
    .from('recette')
    .select('montant_recette, tva_recette')
    .eq('id_ecole', id_ecole)
    .gte('date_recette', premierJourFormate)
    .lte('date_recette', dernierJourFormate);
  
  // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
  if (id_bureau !== '0') {
    recettesQuery = recettesQuery.eq('id_bureau', id_bureau);
  }
  
  const { data: recettesData, error: recettesError } = await recettesQuery;
  
  if (recettesError) {
    console.error(`Erreur lors de la récupération des recettes du mois ${mois+1}/${annee}:`, recettesError);
    return { recettes: 0, depenses: 0, benefices: 0 };
  }
  
  // Récupérer les dépenses du mois
  let depensesQuery = supabase
    .from('depense')
    .select('montant_depense, tva_depense')
    .eq('id_ecole', id_ecole)
    .gte('date_depense', premierJourFormate)
    .lte('date_depense', dernierJourFormate);
  
  // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
  if (id_bureau !== '0') {
    depensesQuery = depensesQuery.eq('id_bureau', id_bureau);
  }
  
  const { data: depensesData, error: depensesError } = await depensesQuery;
  
  if (depensesError) {
    console.error(`Erreur lors de la récupération des dépenses du mois ${mois+1}/${annee}:`, depensesError);
    return { recettes: 0, depenses: 0, benefices: 0 };
  }
  
  // Calculer les totaux manuellement
  const recettes = recettesData
    ?.reduce((sum, r) => sum + parseFloat(r.montant_recette) + parseFloat(r.tva_recette), 0) || 0;
    
  const depenses = depensesData
    ?.reduce((sum, d) => sum + parseFloat(d.montant_depense) + parseFloat(d.tva_depense), 0) || 0;

  const benefices = recettes - depenses;
  
  return { recettes, depenses, benefices };
}

export async function GET(request: NextRequest) {
  try {
    // Extraire les paramètres de la requête
    const searchParams = request.nextUrl.searchParams;
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau') || '0'; // 0 = Tous les bureaux
    
    // Vérifier que les paramètres requis sont présents
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'id_ecole est requis' },
        { status: 400 }
      );
    }
    
    // Récupérer les recettes récentes
    let recettesQuery = supabase
      .from('recette')
      .select(
        'id_recette, date_recette, description_recette, categorie_recette, montant_recette, tva_recette'
      )
      .eq('id_ecole', id_ecole)
      .order('date_recette', { ascending: false })
      .limit(5);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      recettesQuery = recettesQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: recettesRecentes, error: recettesError } = await recettesQuery;
    
    if (recettesError) {
      console.error('Erreur lors de la récupération des recettes récentes:', recettesError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des recettes récentes' },
        { status: 500 }
      );
    }
    
    // Récupérer les dépenses récentes
    let depensesQuery = supabase
      .from('depense')
      .select(
        'id_depense, date_depense, description_depense, categorie_depense, montant_depense, tva_depense'
      )
      .eq('id_ecole', id_ecole)
      .order('date_depense', { ascending: false })
      .limit(5);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      depensesQuery = depensesQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: depensesRecentes, error: depensesError } = await depensesQuery;
    
    if (depensesError) {
      console.error('Erreur lors de la récupération des dépenses récentes:', depensesError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des dépenses récentes' },
        { status: 500 }
      );
    }
    
    // Transformer les recettes et dépenses en format transaction pour maintenir la compatibilité
    const transactionsRecentes = [
      ...recettesRecentes.map(r => ({
        id_transaction: `r_${r.id_recette}`,
        date_transaction: r.date_recette,
        description_transaction: r.description_recette,
        categorie_transaction: r.categorie_recette,
        montant_transaction: parseFloat(r.montant_recette) + parseFloat(r.tva_recette),
        type_transaction: 'recette'
      })),
      ...depensesRecentes.map(d => ({
        id_transaction: `d_${d.id_depense}`,
        date_transaction: d.date_depense,
        description_transaction: d.description_depense,
        categorie_transaction: d.categorie_depense,
        montant_transaction: parseFloat(d.montant_depense) + parseFloat(d.tva_depense),
        type_transaction: 'depense'
      }))
    ].sort((a, b) => new Date(b.date_transaction).getTime() - new Date(a.date_transaction).getTime())
     .slice(0, 10); // Limiter à 10 transactions au total
    
    // Calculer les totaux du mois courant
    const dateActuelle = new Date();
    const premierJourMois = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth(), 1);
    const dernierJourMois = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth() + 1, 0);
    
    // Format des dates pour Supabase
    const premierJourFormate = premierJourMois.toISOString().split('T')[0];
    const dernierJourFormate = dernierJourMois.toISOString().split('T')[0];
    
    // Récupérer les recettes du mois courant
    let recettesMoisCourantQuery = supabase
      .from('recette')
      .select('montant_recette, tva_recette')
      .eq('id_ecole', id_ecole)
      .gte('date_recette', premierJourFormate)
      .lte('date_recette', dernierJourFormate);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      recettesMoisCourantQuery = recettesMoisCourantQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: recettesMoisCourantData, error: recettesMoisCourantError } = await recettesMoisCourantQuery;
    
    if (recettesMoisCourantError) {
      console.error('Erreur lors de la récupération des recettes du mois courant:', recettesMoisCourantError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des recettes du mois courant' },
        { status: 500 }
      );
    }
    
    // Récupérer les dépenses du mois courant
    let depensesMoisCourantQuery = supabase
      .from('depense')
      .select('montant_depense, tva_depense')
      .eq('id_ecole', id_ecole)
      .gte('date_depense', premierJourFormate)
      .lte('date_depense', dernierJourFormate);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      depensesMoisCourantQuery = depensesMoisCourantQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: depensesMoisCourantData, error: depensesMoisCourantError } = await depensesMoisCourantQuery;
    
    if (depensesMoisCourantError) {
      console.error('Erreur lors de la récupération des dépenses du mois courant:', depensesMoisCourantError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des dépenses du mois courant' },
        { status: 500 }
      );
    }
    
    // Calculer les totaux manuellement
    const recettesMoisCourant = recettesMoisCourantData
      ?.reduce((sum, r) => sum + parseFloat(r.montant_recette) + parseFloat(r.tva_recette), 0) || 0;
      
    const depensesMoisCourant = depensesMoisCourantData
      ?.reduce((sum, d) => sum + parseFloat(d.montant_depense) + parseFloat(d.tva_depense), 0) || 0;
    
    // Calculer les totaux du mois précédent
    const moisPrecedent = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth() - 1, 1);
    const premierJourMoisPrecedent = new Date(moisPrecedent.getFullYear(), moisPrecedent.getMonth(), 1);
    const dernierJourMoisPrecedent = new Date(moisPrecedent.getFullYear(), moisPrecedent.getMonth() + 1, 0);
    
    // Format des dates pour Supabase
    const premierJourMoisPrecedentFormate = premierJourMoisPrecedent.toISOString().split('T')[0];
    const dernierJourMoisPrecedentFormate = dernierJourMoisPrecedent.toISOString().split('T')[0];
    
    // Récupérer les recettes du mois précédent
    let recettesMoisPrecedentQuery = supabase
      .from('recette')
      .select('montant_recette, tva_recette')
      .eq('id_ecole', id_ecole)
      .gte('date_recette', premierJourMoisPrecedentFormate)
      .lte('date_recette', dernierJourMoisPrecedentFormate);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      recettesMoisPrecedentQuery = recettesMoisPrecedentQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: recettesMoisPrecedentData, error: recettesMoisPrecedentError } = await recettesMoisPrecedentQuery;
    
    if (recettesMoisPrecedentError) {
      console.error('Erreur lors de la récupération des recettes du mois précédent:', recettesMoisPrecedentError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des recettes du mois précédent' },
        { status: 500 }
      );
    }
    
    // Récupérer les dépenses du mois précédent
    let depensesMoisPrecedentQuery = supabase
      .from('depense')
      .select('montant_depense, tva_depense')
      .eq('id_ecole', id_ecole)
      .gte('date_depense', premierJourMoisPrecedentFormate)
      .lte('date_depense', dernierJourMoisPrecedentFormate);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      depensesMoisPrecedentQuery = depensesMoisPrecedentQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: depensesMoisPrecedentData, error: depensesMoisPrecedentError } = await depensesMoisPrecedentQuery;
    
    if (depensesMoisPrecedentError) {
      console.error('Erreur lors de la récupération des dépenses du mois précédent:', depensesMoisPrecedentError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des dépenses du mois précédent' },
        { status: 500 }
      );
    }
    
    // Calculer les totaux manuellement
    const recettesMoisPrecedent = recettesMoisPrecedentData
      ?.reduce((sum, r) => sum + parseFloat(r.montant_recette) + parseFloat(r.tva_recette), 0) || 0;
      
    const depensesMoisPrecedent = depensesMoisPrecedentData
      ?.reduce((sum, d) => sum + parseFloat(d.montant_depense) + parseFloat(d.tva_depense), 0) || 0;
    
    // Calculer les bénéfices
    const beneficesMoisCourant = recettesMoisCourant - depensesMoisCourant;
    const beneficesMoisPrecedent = recettesMoisPrecedent - depensesMoisPrecedent;
    
    // Calculer les évolutions en pourcentage
    const evolutionRecettes = recettesMoisPrecedent > 0 
      ? ((recettesMoisCourant - recettesMoisPrecedent) / recettesMoisPrecedent) * 100 
      : 100;
    
    const evolutionDepenses = depensesMoisPrecedent > 0 
      ? ((depensesMoisCourant - depensesMoisPrecedent) / depensesMoisPrecedent) * 100 
      : 100;
    
    const evolutionBenefices = beneficesMoisPrecedent > 0 
      ? ((beneficesMoisCourant - beneficesMoisPrecedent) / beneficesMoisPrecedent) * 100 
      : 100;
    
    // Récupérer les données des 6 derniers mois pour le graphique
    // Réutiliser la variable dateActuelle déjà déclarée plus haut
    const anneeActuelle = dateActuelle.getFullYear();
    const moisActuel = dateActuelle.getMonth();
    
    // Tableau pour stocker les données historiques
    const historiqueData: {
      recettes: number[],
      depenses: number[],
      benefices: number[]
    } = {
      recettes: [],
      depenses: [],
      benefices: []
    };
    
    // Récupérer les données pour les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const moisIndex = moisActuel - i;
      const annee = anneeActuelle + Math.floor(moisIndex / 12);
      const mois = ((moisIndex % 12) + 12) % 12; // Pour gérer les mois négatifs
      
      const donneesMois = await getDonneesMois(id_ecole, id_bureau, annee, mois);
      
      historiqueData.recettes.push(donneesMois.recettes);
      historiqueData.depenses.push(donneesMois.depenses);
      historiqueData.benefices.push(donneesMois.benefices);
    }
    
    // Préparer la réponse
    const response = {
      transactionsRecentes: transactionsRecentes,
      statistiques: {
        recettes: {
          montant: recettesMoisCourant,
          evolution: parseFloat(evolutionRecettes.toFixed(2))
        },
        depenses: {
          montant: depensesMoisCourant,
          evolution: parseFloat(evolutionDepenses.toFixed(2))
        },
        benefices: {
          montant: beneficesMoisCourant,
          evolution: parseFloat(evolutionBenefices.toFixed(2))
        }
      },
      historique: historiqueData
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de comptabilité:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}