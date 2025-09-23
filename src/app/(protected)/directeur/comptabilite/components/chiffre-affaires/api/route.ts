import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Extraire les paramètres de la requête
    const searchParams = request.nextUrl.searchParams;
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau') || '0'; // 0 = Tous les bureaux
    const periode = searchParams.get('periode') || 'mensuel'; // mensuel, trimestriel, annuel
    const annee = parseInt(searchParams.get('annee') || new Date().getFullYear().toString());
    
    // Obtenir la date actuelle pour limiter les données aux mois écoulés
    const dateActuelle = new Date();
    const moisActuel = dateActuelle.getMonth(); // 0-11
    const anneeActuelle = dateActuelle.getFullYear();
    
    // Déterminer la date de fin pour le filtre (dernier jour du mois actuel si année en cours)
    let dateFin = `${annee}-12-31`;
    if (annee === anneeActuelle) {
      // Si on est dans l'année en cours, on limite au mois actuel
      const dernierJourMois = new Date(anneeActuelle, moisActuel + 1, 0).getDate();
      dateFin = `${anneeActuelle}-${String(moisActuel + 1).padStart(2, '0')}-${String(dernierJourMois).padStart(2, '0')}`;
    }
    
    // Vérifier que les paramètres requis sont présents
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'id_ecole est requis' },
        { status: 400 }
      );
    }
    
    // Construire la requête pour obtenir les données par catégorie depuis la table recette
    let categoriesQuery = supabase
      .from('recette')
      .select(`
        categorie_recette,
        montant_recette,
        tva_recette
      `)
      .eq('id_ecole', id_ecole)
      .gte('date_recette', `${annee}-01-01`) // Filtrer par année
      .lte('date_recette', dateFin); // Limiter à la date de fin calculée
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      categoriesQuery = categoriesQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: categoriesData, error: categoriesError } = await categoriesQuery;
    
    if (categoriesError) {
      console.error('Erreur lors de la récupération des données par catégorie:', categoriesError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des données par catégorie' },
        { status: 500 }
      );
    }
    
    // Traiter les données pour obtenir le chiffre d'affaires par catégorie
    const categoriesMap = new Map();
    let totalHT = 0;
    
    categoriesData.forEach(item => {
      // Récupérer directement les montants HT et TVA de la table recette
      const montantHT = parseFloat(item.montant_recette);
      const montantTVA = parseFloat(item.tva_recette);
      const montantTTC = montantHT + montantTVA;
      const categorie = item.categorie_recette || 'Non catégorisé';
      
      if (!categoriesMap.has(categorie)) {
        categoriesMap.set(categorie, {
          nom: categorie,
          montantHT: 0,
          montantTVA: 0,
          montantTTC: 0,
          tauxTVA: 20, // Taux par défaut
          pourcentage: 0
        });
      }
      
      const categorieData = categoriesMap.get(categorie);
      categorieData.montantHT += montantHT;
      categorieData.montantTVA += montantTVA;
      categorieData.montantTTC += montantTTC;
      
      totalHT += montantHT;
    });
    
    // Calculer les pourcentages et taux de TVA moyens
    const categories = Array.from(categoriesMap.values()).map(cat => {
      // Calculer le pourcentage de cette catégorie par rapport au total
      cat.pourcentage = totalHT > 0 ? (cat.montantHT / totalHT) * 100 : 0;
      
      // Le taux de TVA est déjà défini à 20% par défaut
      
      // Arrondir les valeurs pour plus de lisibilité
      cat.montantHT = parseFloat(cat.montantHT.toFixed(2));
      cat.montantTVA = parseFloat(cat.montantTVA.toFixed(2));
      cat.montantTTC = parseFloat(cat.montantTTC.toFixed(2));
      cat.pourcentage = parseFloat(cat.pourcentage.toFixed(2));
      cat.tauxTVA = parseFloat(cat.tauxTVA.toFixed(2));
      
      return cat;
    });
    
    // Trier les catégories par montant HT décroissant
    categories.sort((a, b) => b.montantHT - a.montantHT);
    
    // Construire la requête pour obtenir les données pour le graphique depuis la table recette
    let graphiqueQuery = supabase
      .from('recette')
      .select(`
        date_recette,
        montant_recette,
        tva_recette
      `)
      .eq('id_ecole', id_ecole)
      .gte('date_recette', `${annee}-01-01`)
      .lte('date_recette', dateFin); // Utiliser la même date de fin
    
    if (id_bureau !== '0') {
      graphiqueQuery = graphiqueQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: graphiqueData, error: graphiqueError } = await graphiqueQuery;
    
    if (graphiqueError) {
      console.error('Erreur lors de la récupération des données pour le graphique:', graphiqueError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des données pour le graphique' },
        { status: 500 }
      );
    }
    
    // Traiter les données pour le graphique en fonction de la période
    const donneesGraphique = processGraphiqueData(graphiqueData, periode, annee);
    
    // Retourner les résultats
    return NextResponse.json({
      categories,
      statistiques: {
        totalHT: parseFloat(totalHT.toFixed(2)),
        totalTVA: parseFloat(categoriesData.reduce((sum, item) => sum + parseFloat(item.tva_recette), 0).toFixed(2)),
        totalTTC: parseFloat(categoriesData.reduce((sum, item) => sum + parseFloat(item.montant_recette) + parseFloat(item.tva_recette), 0).toFixed(2))
      },
      graphique: donneesGraphique
    });
    
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Fonction pour traiter les données du graphique selon la période
function processGraphiqueData(data: any[], periode: string, annee: number): any[] {
  // Initialiser un objet pour stocker les données agrégées
  const aggregatedData: Record<string, number> = {};
  
  // Noms des mois en français
  const moisFrancais = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  // Initialiser les périodes en fonction du type de période
  if (periode === 'mensuel') {
    // Initialiser tous les mois à 0
    for (let i = 0; i < 12; i++) {
      aggregatedData[moisFrancais[i]] = 0;
    }
  } else if (periode === 'trimestriel') {
    // Initialiser tous les trimestres à 0
    aggregatedData['T1'] = 0;
    aggregatedData['T2'] = 0;
    aggregatedData['T3'] = 0;
    aggregatedData['T4'] = 0;
  } else if (periode === 'annuel') {
    // Initialiser l'année à 0
    aggregatedData[annee.toString()] = 0;
  }
  
  // Agréger les données selon la période
  data.forEach(item => {
    const date = new Date(item.date_recette);
    const mois = date.getMonth();
    const montantHT = parseFloat(item.montant_recette);
    const montantTVA = parseFloat(item.tva_recette);
    const montantTTC = montantHT + montantTVA;
    
    if (periode === 'mensuel') {
      aggregatedData[moisFrancais[mois]] += montantTTC;
    } else if (periode === 'trimestriel') {
      const trimestre = Math.floor(mois / 3) + 1;
      aggregatedData[`T${trimestre}`] += montantTTC;
    } else if (periode === 'annuel') {
      aggregatedData[annee.toString()] += montantTTC;
    }
  });
  
  // Convertir les données agrégées en format pour le graphique
  const donneesGraphique = Object.entries(aggregatedData).map(([periode, montant]) => ({
    mois: periode,
    montant: parseFloat(montant.toFixed(2)),
    annee
  }));
  
  return donneesGraphique;
}
