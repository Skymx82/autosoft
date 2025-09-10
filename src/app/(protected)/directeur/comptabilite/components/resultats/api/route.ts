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
  let recettesQuery = supabase
    .from('recette')
    .select('montant_recette, tva_recette')
    .eq('id_ecole', id_ecole)
    .gte('date_recette', premierJourFormate)
    .lte('date_recette', dernierJourFormate);
  
  let depensesQuery = supabase
    .from('depense')
    .select('montant_depense, tva_depense')
    .eq('id_ecole', id_ecole)
    .gte('date_depense', premierJourFormate)
    .lte('date_depense', dernierJourFormate);
  
  // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
  if (id_bureau !== '0') {
    recettesQuery = recettesQuery.eq('id_bureau', id_bureau);
    depensesQuery = depensesQuery.eq('id_bureau', id_bureau);
  }
  
  const [recettesResult, depensesResult] = await Promise.all([
    recettesQuery,
    depensesQuery
  ]);
  
  const { data: recettes, error: recettesError } = recettesResult;
  const { data: depenses, error: depensesError } = depensesResult;
  
  if (recettesError) {
    console.error(`Erreur lors de la récupération des recettes du mois ${mois+1}/${annee}:`, recettesError);
  }
  
  if (depensesError) {
    console.error(`Erreur lors de la récupération des dépenses du mois ${mois+1}/${annee}:`, depensesError);
  }
  
  // Calculer les totaux manuellement
  const chiffreAffaires = recettes
    ?.reduce((sum, r) => sum + parseFloat(r.montant_recette) + parseFloat(r.tva_recette), 0) || 0;
    
  const charges = depenses
    ?.reduce((sum, d) => sum + parseFloat(d.montant_depense) + parseFloat(d.tva_depense), 0) || 0;
  
  const resultat = chiffreAffaires - charges;
  
  return { chiffreAffaires, charges, resultat };
}

// Fonction pour obtenir le nom du mois en français
function getNomMois(mois: number): string {
  const noms = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return noms[mois];
}

export async function GET(request: NextRequest) {
  try {
    // Extraire les paramètres de la requête
    const searchParams = request.nextUrl.searchParams;
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau') || '0'; // 0 = Tous les bureaux
    const periode = searchParams.get('periode') || 'mensuel'; // mensuel ou trimestriel
    const annee = parseInt(searchParams.get('annee') || new Date().getFullYear().toString());
    
    // Vérifier que les paramètres requis sont présents
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'id_ecole est requis' },
        { status: 400 }
      );
    }
    
    // Tableau pour stocker les résultats mensuels
    const resultats = [];
    
    // Date actuelle pour référence
    const dateActuelle = new Date();
    const moisActuel = dateActuelle.getMonth();
    const anneeActuelle = dateActuelle.getFullYear();
    
    if (periode === 'mensuel') {
      // Récupérer les données pour les 12 derniers mois
      const donneesParMois = [];
      
      // D'abord, récupérer toutes les données mensuelles
      for (let i = 0; i < 12; i++) {
        // Calculer le mois et l'année (en remontant dans le temps)
        const moisIndex = moisActuel - i;
        const anneeResultat = anneeActuelle + Math.floor(moisIndex / 12);
        const mois = ((moisIndex % 12) + 12) % 12; // Pour gérer les mois négatifs
        
        // Récupérer les données du mois
        const donneesMois = await getDonneesMois(id_ecole, id_bureau, anneeResultat, mois);
        
        // Stocker les données avec leur mois et année
        donneesParMois.push({
          mois: getNomMois(mois),
          annee: anneeResultat,
          chiffreAffaires: donneesMois.chiffreAffaires,
          charges: donneesMois.charges,
          resultat: donneesMois.resultat,
          index: i // Pour conserver l'ordre chronologique
        });
      }
      
      // Trier les données du plus récent au plus ancien
      donneesParMois.sort((a, b) => a.index - b.index);
      
      // Calculer les évolutions en parcourant les données triées
      for (let i = 0; i < donneesParMois.length; i++) {
        let evolution = 0;
        if (i < donneesParMois.length - 1 && Math.abs(donneesParMois[i+1].resultat) > 0) {
          evolution = ((donneesParMois[i].resultat - donneesParMois[i+1].resultat) / Math.abs(donneesParMois[i+1].resultat)) * 100;
        }
        
        // Ajouter au tableau de résultats final
        resultats.push({
          mois: donneesParMois[i].mois,
          annee: donneesParMois[i].annee,
          chiffreAffaires: donneesParMois[i].chiffreAffaires,
          charges: donneesParMois[i].charges,
          resultat: donneesParMois[i].resultat,
          evolution: parseFloat(evolution.toFixed(1))
        });
      }
    } else if (periode === 'trimestriel') {
      // Récupérer les données pour les 4 derniers trimestres
      const donneesParTrimestre = [];
      
      for (let trimestre = 0; trimestre < 4; trimestre++) {
        let chiffreAffairesTotal = 0;
        let chargesTotal = 0;
        let resultatTotal = 0;
        
        // Pour chaque trimestre, calculer la somme des 3 mois
        for (let moisDuTrimestre = 0; moisDuTrimestre < 3; moisDuTrimestre++) {
          const moisIndex = moisActuel - (trimestre * 3 + moisDuTrimestre);
          const anneeResultat = anneeActuelle + Math.floor(moisIndex / 12);
          const mois = ((moisIndex % 12) + 12) % 12;
          
          // Récupérer les données du mois
          const donneesMois = await getDonneesMois(id_ecole, id_bureau, anneeResultat, mois);
          
          // Ajouter au total du trimestre
          chiffreAffairesTotal += donneesMois.chiffreAffaires;
          chargesTotal += donneesMois.charges;
          resultatTotal += donneesMois.resultat;
        }
        
        // Déterminer le numéro du trimestre et l'année
        const premierMoisTrimestre = moisActuel - (trimestre * 3);
        const anneeResultat = anneeActuelle + Math.floor(premierMoisTrimestre / 12);
        const numeroTrimestre = Math.floor(((premierMoisTrimestre % 12) + 12) % 12 / 3) + 1;
        
        // Stocker les données du trimestre
        donneesParTrimestre.push({
          mois: `T${numeroTrimestre}`,
          annee: anneeResultat,
          chiffreAffaires: chiffreAffairesTotal,
          charges: chargesTotal,
          resultat: resultatTotal,
          index: trimestre // Pour conserver l'ordre chronologique
        });
      }
      
      // Trier les données du plus récent au plus ancien
      donneesParTrimestre.sort((a, b) => a.index - b.index);
      
      // Calculer les évolutions en parcourant les données triées
      for (let i = 0; i < donneesParTrimestre.length; i++) {
        let evolution = 0;
        if (i < donneesParTrimestre.length - 1 && Math.abs(donneesParTrimestre[i+1].resultat) > 0) {
          evolution = ((donneesParTrimestre[i].resultat - donneesParTrimestre[i+1].resultat) / Math.abs(donneesParTrimestre[i+1].resultat)) * 100;
        }
        
        // Ajouter au tableau de résultats final
        resultats.push({
          mois: donneesParTrimestre[i].mois,
          annee: donneesParTrimestre[i].annee,
          chiffreAffaires: donneesParTrimestre[i].chiffreAffaires,
          charges: donneesParTrimestre[i].charges,
          resultat: donneesParTrimestre[i].resultat,
          evolution: parseFloat(evolution.toFixed(1))
        });
      }
    }
    
    // Calculer les totaux annuels
    const totauxAnnuels = resultats
      .filter(r => r.annee === annee)
      .reduce(
        (acc, curr) => {
          acc.chiffreAffaires += curr.chiffreAffaires;
          acc.charges += curr.charges;
          acc.resultat += curr.resultat;
          return acc;
        },
        { chiffreAffaires: 0, charges: 0, resultat: 0 }
      );
    
    // Calculer le taux de marge moyen
    const tauxMarge = totauxAnnuels.chiffreAffaires > 0 
      ? (totauxAnnuels.resultat / totauxAnnuels.chiffreAffaires) * 100 
      : 0;
    
    // Préparer la réponse
    const response = {
      resultats: resultats,
      totauxAnnuels: {
        ...totauxAnnuels,
        tauxMarge: parseFloat(tauxMarge.toFixed(1))
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats financiers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}