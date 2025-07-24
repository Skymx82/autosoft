import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../../../lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

// Fonction utilitaire pour obtenir les données d'un mois spécifique
async function getDonneesMois(id_ecole: string, id_bureau: string, annee: number, mois: number) {
  const premierJourMois = new Date(annee, mois, 1);
  const dernierJourMois = new Date(annee, mois + 1, 0);
  
  // Format des dates pour Supabase
  const premierJourFormate = premierJourMois.toISOString().split('T')[0];
  const dernierJourFormate = dernierJourMois.toISOString().split('T')[0];
  
  // Récupérer les transactions du mois
  let transactionsMoisQuery = supabase
    .from('transactions')
    .select('type_transaction, montant_transaction')
    .eq('id_ecole', id_ecole)
    .gte('date_transaction', premierJourFormate)
    .lte('date_transaction', dernierJourFormate);
  
  // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
  if (id_bureau !== '0') {
    transactionsMoisQuery = transactionsMoisQuery.eq('id_bureau', id_bureau);
  }
  
  const { data: transactionsMois, error: transactionsMoisError } = await transactionsMoisQuery;
  
  if (transactionsMoisError) {
    console.error(`Erreur lors de la récupération des transactions du mois ${mois+1}/${annee}:`, transactionsMoisError);
    return { recettes: 0, depenses: 0, benefices: 0 };
  }
  
  // Calculer les totaux manuellement
  const recettes = transactionsMois
    ?.filter(t => t.type_transaction === 'recette')
    .reduce((sum, t) => sum + parseFloat(t.montant_transaction), 0) || 0;
    
  const depenses = transactionsMois
    ?.filter(t => t.type_transaction === 'depense')
    .reduce((sum, t) => sum + parseFloat(t.montant_transaction), 0) || 0;
  
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
    
    // Récupérer les transactions récentes
    let transactionsQuery = supabase
      .from('transactions')
      .select(
        'id_transaction, date_transaction, description_transaction, categorie_transaction, montant_transaction, type_transaction'
      )
      .eq('id_ecole', id_ecole)
      .order('date_transaction', { ascending: false })
      .limit(10);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      transactionsQuery = transactionsQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: transactionsRecentes, error: transactionsError } = await transactionsQuery;
    
    if (transactionsError) {
      console.error('Erreur lors de la récupération des transactions récentes:', transactionsError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des transactions récentes' },
        { status: 500 }
      );
    }
    
    // Calculer les totaux du mois courant
    const dateActuelle = new Date();
    const premierJourMois = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth(), 1);
    const dernierJourMois = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth() + 1, 0);
    
    // Format des dates pour Supabase
    const premierJourFormate = premierJourMois.toISOString().split('T')[0];
    const dernierJourFormate = dernierJourMois.toISOString().split('T')[0];
    
    // Récupérer les transactions du mois courant
    let transactionsMoisCourantQuery = supabase
      .from('transactions')
      .select('type_transaction, montant_transaction')
      .eq('id_ecole', id_ecole)
      .gte('date_transaction', premierJourFormate)
      .lte('date_transaction', dernierJourFormate);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      transactionsMoisCourantQuery = transactionsMoisCourantQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: transactionsMoisCourant, error: transactionsMoisCourantError } = await transactionsMoisCourantQuery;
    
    if (transactionsMoisCourantError) {
      console.error('Erreur lors de la récupération des transactions du mois courant:', transactionsMoisCourantError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des transactions du mois courant' },
        { status: 500 }
      );
    }
    
    // Calculer les totaux manuellement
    const recettesMoisCourant = transactionsMoisCourant
      ?.filter(t => t.type_transaction === 'recette')
      .reduce((sum, t) => sum + parseFloat(t.montant_transaction), 0) || 0;
      
    const depensesMoisCourant = transactionsMoisCourant
      ?.filter(t => t.type_transaction === 'depense')
      .reduce((sum, t) => sum + parseFloat(t.montant_transaction), 0) || 0;
    
    // Calculer les totaux du mois précédent
    const moisPrecedent = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth() - 1, 1);
    const premierJourMoisPrecedent = new Date(moisPrecedent.getFullYear(), moisPrecedent.getMonth(), 1);
    const dernierJourMoisPrecedent = new Date(moisPrecedent.getFullYear(), moisPrecedent.getMonth() + 1, 0);
    
    // Format des dates pour Supabase
    const premierJourMoisPrecedentFormate = premierJourMoisPrecedent.toISOString().split('T')[0];
    const dernierJourMoisPrecedentFormate = dernierJourMoisPrecedent.toISOString().split('T')[0];
    
    // Récupérer les transactions du mois précédent
    let transactionsMoisPrecedentQuery = supabase
      .from('transactions')
      .select('type_transaction, montant_transaction')
      .eq('id_ecole', id_ecole)
      .gte('date_transaction', premierJourMoisPrecedentFormate)
      .lte('date_transaction', dernierJourMoisPrecedentFormate);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      transactionsMoisPrecedentQuery = transactionsMoisPrecedentQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: transactionsMoisPrecedent, error: transactionsMoisPrecedentError } = await transactionsMoisPrecedentQuery;
    
    if (transactionsMoisPrecedentError) {
      console.error('Erreur lors de la récupération des transactions du mois précédent:', transactionsMoisPrecedentError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des transactions du mois précédent' },
        { status: 500 }
      );
    }
    
    // Calculer les totaux manuellement
    const recettesMoisPrecedent = transactionsMoisPrecedent
      ?.filter(t => t.type_transaction === 'recette')
      .reduce((sum, t) => sum + parseFloat(t.montant_transaction), 0) || 0;
      
    const depensesMoisPrecedent = transactionsMoisPrecedent
      ?.filter(t => t.type_transaction === 'depense')
      .reduce((sum, t) => sum + parseFloat(t.montant_transaction), 0) || 0;
    
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
    
    // Ajouter des logs pour déboguer
    console.log('Données historiques récupérées:', historiqueData);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de comptabilité:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}