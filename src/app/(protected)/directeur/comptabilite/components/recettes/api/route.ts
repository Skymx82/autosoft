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
    
    // Vérifier que les paramètres requis sont présents
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'id_ecole est requis' },
        { status: 400 }
      );
    }
    
    // Paramètres de pagination et filtrage
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categorie = searchParams.get('categorie');
    const client = searchParams.get('client');
    const statut = searchParams.get('statut');
    const dateDebut = searchParams.get('dateDebut');
    const dateFin = searchParams.get('dateFin');
    
    // Calculer l'offset pour la pagination
    const offset = (page - 1) * limit;
    
    // Construire la requête de base
    let query = supabase
      .from('recette')
      .select(`
        id_recette,
        date_recette,
        description_recette,
        categorie_recette,
        montant_recette,
        tva_recette,
        client_recette,
        mode_paiement_recette,
        statut_recette
      `)
      .eq('id_ecole', id_ecole)
      .order('date_recette', { ascending: false });
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      query = query.eq('id_bureau', id_bureau);
    }
    
    // Appliquer les filtres supplémentaires si présents
    if (categorie) {
      query = query.eq('categorie_recette', categorie);
    }
    
    if (client) {
      query = query.eq('client_recette', client);
    }
    
    if (statut) {
      query = query.eq('statut_recette', statut);
    }
    
    if (dateDebut) {
      query = query.gte('date_recette', dateDebut);
    }
    
    if (dateFin) {
      query = query.lte('date_recette', dateFin);
    }
    
    // Exécuter la requête principale avec pagination
    const { data: recettes, error } = await query
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Erreur lors de la récupération des recettes:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des recettes' },
        { status: 500 }
      );
    }
    
    // Créer une nouvelle requête pour le comptage (car clone() n'existe pas)
    let countQuery = supabase
      .from('recette')
      .select('id_recette', { count: 'exact' })
      .eq('id_ecole', id_ecole);
      
    // Appliquer les mêmes filtres que la requête principale
    if (id_bureau !== '0') {
      countQuery = countQuery.eq('id_bureau', id_bureau);
    }
    
    if (categorie) {
      countQuery = countQuery.eq('categorie_recette', categorie);
    }
    
    if (client) {
      countQuery = countQuery.eq('client_recette', client);
    }
    
    if (statut) {
      countQuery = countQuery.eq('statut_recette', statut);
    }
    
    if (dateDebut) {
      countQuery = countQuery.gte('date_recette', dateDebut);
    }
    
    if (dateFin) {
      countQuery = countQuery.lte('date_recette', dateFin);
    }
    
    // Exécuter la requête de comptage avec la bonne syntaxe pour Supabase
    const { data: countData, error: countError, count } = await countQuery;
    
    if (countError) {
      console.error('Erreur lors du comptage des recettes:', countError);
      return NextResponse.json(
        { error: 'Erreur lors du comptage des recettes' },
        { status: 500 }
      );
    }
    
    // Calculer les statistiques des recettes
    let statsQuery = supabase
      .from('recette')
      .select('montant_recette, tva_recette')
      .eq('id_ecole', id_ecole);
      
    // Appliquer le filtre par bureau si nécessaire
    if (id_bureau !== '0') {
      statsQuery = statsQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: statsData, error: statsError } = await statsQuery;
    
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;
    
    if (!statsError && statsData) {
      statsData.forEach(item => {
        const montantHT = parseFloat(item.montant_recette);
        const montantTVA = parseFloat(item.tva_recette);
        
        totalHT += montantHT;
        totalTVA += montantTVA;
        totalTTC += (montantHT + montantTVA);
      });
    }
    
    // Transformer les données pour correspondre au format attendu par le composant
    const formattedRecettes = recettes.map(recette => ({
      id: recette.id_recette.toString(),
      date: recette.date_recette,
      categorie: recette.categorie_recette,
      description: recette.description_recette,
      montant: parseFloat(recette.montant_recette),
      tva: parseFloat(recette.tva_recette),
      client: recette.client_recette,
      modePaiement: recette.mode_paiement_recette,
      statut: recette.statut_recette
    }));
    
    // Retourner les résultats avec les métadonnées de pagination
    return NextResponse.json({
      recettes: formattedRecettes,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
        filtres: {
          categorie,
          client,
          statut,
          dateDebut,
          dateFin
        }
      },
      statistiques: {
        totalHT: parseFloat(totalHT.toFixed(2)),
        totalTVA: parseFloat(totalTVA.toFixed(2)),
        totalTTC: parseFloat(totalTTC.toFixed(2))
      }
    });
    
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}