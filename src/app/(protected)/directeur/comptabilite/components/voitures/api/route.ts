import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../../../lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Extraire les paramètres de la requête
    const searchParams = request.nextUrl.searchParams;
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau') || '0'; // 0 = Tous les bureaux
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const statut = searchParams.get('statut') || 'tous';
    const marque = searchParams.get('marque') || null;
    const categorie_permis = searchParams.get('categorie_permis') || null;
    
    // Vérifier que les paramètres requis sont présents
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'id_ecole est requis' },
        { status: 400 }
      );
    }
    
    // Calculer l'offset pour la pagination
    const offset = (page - 1) * limit;
    
    // Construire la requête de base
    let vehiculesQuery = supabase
      .from('vehicule')
      .select('*')
      .eq('id_ecole', id_ecole)
      .order('id_vehicule', { ascending: false });
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      vehiculesQuery = vehiculesQuery.eq('id_bureau', id_bureau);
    }
    
    // Filtrer par statut si ce n'est pas "tous"
    if (statut !== 'tous') {
      vehiculesQuery = vehiculesQuery.eq('statut', statut);
    }
    
    // Filtrer par marque si spécifié
    if (marque) {
      vehiculesQuery = vehiculesQuery.eq('marque', marque);
    }
    
    // Filtrer par catégorie de permis si spécifié
    if (categorie_permis) {
      vehiculesQuery = vehiculesQuery.eq('categorie_permis', categorie_permis);
    }
    
    // Créer une copie de la requête pour compter le nombre total de véhicules
    let countQuery = supabase
      .from('vehicule')
      .select('id_vehicule', { count: 'exact' })
      .eq('id_ecole', id_ecole);
    
    // Appliquer les mêmes filtres que pour la requête principale
    if (id_bureau !== '0') {
      countQuery = countQuery.eq('id_bureau', id_bureau);
    }
    if (statut !== 'tous') {
      countQuery = countQuery.eq('statut', statut);
    }
    if (marque) {
      countQuery = countQuery.eq('marque', marque);
    }
    if (categorie_permis) {
      countQuery = countQuery.eq('categorie_permis', categorie_permis);
    }
    
    // Exécuter la requête de comptage
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error('Erreur lors du comptage des véhicules:', countError);
      return NextResponse.json(
        { error: 'Erreur lors du comptage des véhicules' },
        { status: 500 }
      );
    }
    
    // Ajouter la pagination à la requête
    vehiculesQuery = vehiculesQuery.range(offset, offset + limit - 1);
    
    // Exécuter la requête pour obtenir les véhicules
    const { data: vehicules, error: vehiculesError } = await vehiculesQuery;
    
    if (vehiculesError) {
      console.error('Erreur lors de la récupération des véhicules:', vehiculesError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des véhicules' },
        { status: 500 }
      );
    }
    
    // Récupérer les statistiques globales des véhicules
    let statsQuery = supabase
      .from('vehicule')
      .select(
        'cout_acquisition, cout_entretien_total, cout_carburant_total, statut'
      )
      .eq('id_ecole', id_ecole);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      statsQuery = statsQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: statsData, error: statsError } = await statsQuery;
    
    if (statsError) {
      console.error('Erreur lors de la récupération des statistiques des véhicules:', statsError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques des véhicules' },
        { status: 500 }
      );
    }
    
    // Calculer les statistiques
    const totalAcquisition = statsData?.reduce((sum, v) => sum + parseFloat(v.cout_acquisition || '0'), 0) || 0;
    const totalEntretien = statsData?.reduce((sum, v) => sum + parseFloat(v.cout_entretien_total || '0'), 0) || 0;
    const totalCarburant = statsData?.reduce((sum, v) => sum + parseFloat(v.cout_carburant_total || '0'), 0) || 0;
    const totalCout = totalAcquisition + totalEntretien + totalCarburant;
    
    // Compter les véhicules par statut
    const vehiculesActifs = statsData?.filter(v => v.statut === 'Actif').length || 0;
    const vehiculesEnMaintenance = statsData?.filter(v => v.statut === 'En maintenance').length || 0;
    const vehiculesHorsService = statsData?.filter(v => v.statut === 'Hors service').length || 0;
    const vehiculesVendus = statsData?.filter(v => v.statut === 'Vendu').length || 0;
    
    // Récupérer les marques uniques pour les filtres
    const { data: marquesData, error: marquesError } = await supabase
      .from('vehicule')
      .select('marque')
      .eq('id_ecole', id_ecole)
      .order('marque');
    
    if (marquesError) {
      console.error('Erreur lors de la récupération des marques:', marquesError);
    }
    
    // Filtrer les marques uniques manuellement
    const marquesUniques = Array.from(new Set(marquesData?.map(item => item.marque) || []));
    const marques = marquesUniques;
    
    // Récupérer les catégories de permis uniques pour les filtres
    const { data: permisData, error: permisError } = await supabase
      .from('vehicule')
      .select('categorie_permis')
      .eq('id_ecole', id_ecole)
      .order('categorie_permis');
    
    if (permisError) {
      console.error('Erreur lors de la récupération des catégories de permis:', permisError);
    }
    
    // Filtrer les catégories uniques manuellement
    const categoriesPermisUniques = Array.from(new Set(permisData?.map((item: { categorie_permis: string }) => item.categorie_permis) || []));
    const categoriesPermis = categoriesPermisUniques;
    
    // Récupérer les entretiens récents pour les véhicules
    const { data: entretiensData, error: entretiensError } = await supabase
      .from('entretien_vehicule')
      .select('id_entretien, id_vehicule, date_entretien, type_entretien, description, kilometrage')
      .eq('id_ecole', id_ecole)
      .order('date_entretien', { ascending: false })
      .limit(20);
    
    if (entretiensError) {
      console.error('Erreur lors de la récupération des entretiens:', entretiensError);
    }
    
    // Récupérer les relevés de kilométrage récents
    const { data: kilometrageData, error: kilometrageError } = await supabase
      .from('kilometrage_vehicule')
      .select('id_kilometrage, id_vehicule, date_releve, kilometrage, id_moniteur, notes')
      .eq('id_ecole', id_ecole)
      .order('date_releve', { ascending: false })
      .limit(20);
    
    if (kilometrageError) {
      console.error('Erreur lors de la récupération des relevés de kilométrage:', kilometrageError);
    }
    
    // Préparer la réponse
    const response = {
      vehicules: vehicules,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      },
      statistiques: {
        couts: {
          acquisition: totalAcquisition,
          entretien: totalEntretien,
          carburant: totalCarburant,
          total: totalCout
        },
        statuts: {
          actifs: vehiculesActifs,
          enMaintenance: vehiculesEnMaintenance,
          horsService: vehiculesHorsService,
          vendus: vehiculesVendus,
          total: statsData?.length || 0
        }
      },
      filtres: {
        marques,
        categoriesPermis
      },
      entretiens: entretiensData || [],
      kilometrages: kilometrageData || []
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des données des véhicules:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}