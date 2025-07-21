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
    const fournisseur = searchParams.get('fournisseur');
    const statut = searchParams.get('statut');
    const dateDebut = searchParams.get('dateDebut');
    const dateFin = searchParams.get('dateFin');
    
    // Calculer l'offset pour la pagination
    const offset = (page - 1) * limit;
    
    // Construire la requête de base
    let query = supabase
      .from('depense')
      .select(`
        id_depense,
        date_depense,
        description_depense,
        categorie_depense,
        montant_depense,
        tva_depense,
        fournisseur_depense,
        mode_paiement_depense,
        statut_depense
      `)
      .eq('id_ecole', id_ecole)
      .order('date_depense', { ascending: false });
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      query = query.eq('id_bureau', id_bureau);
    }
    
    // Appliquer les filtres supplémentaires si présents
    if (categorie) {
      query = query.eq('categorie_depense', categorie);
    }
    
    if (fournisseur) {
      query = query.ilike('fournisseur_depense', `%${fournisseur}%`);
    }
    
    if (statut) {
      query = query.eq('statut_depense', statut);
    }
    
    if (dateDebut) {
      query = query.gte('date_depense', dateDebut);
    }
    
    if (dateFin) {
      query = query.lte('date_depense', dateFin);
    }
    
    // Exécuter la requête principale avec pagination
    const { data: depenses, error } = await query
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Erreur lors de la récupération des dépenses:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des dépenses' },
        { status: 500 }
      );
    }
    
    // Créer une nouvelle requête pour le comptage (car clone() n'existe pas)
    let countQuery = supabase
      .from('depense')
      .select('id_depense', { count: 'exact' })
      .eq('id_ecole', id_ecole);
      
    // Appliquer les mêmes filtres que la requête principale
    if (id_bureau !== '0') {
      countQuery = countQuery.eq('id_bureau', id_bureau);
    }
    
    if (categorie) {
      countQuery = countQuery.eq('categorie_depense', categorie);
    }
    
    if (fournisseur) {
      countQuery = countQuery.ilike('fournisseur_depense', `%${fournisseur}%`);
    }
    
    if (statut) {
      countQuery = countQuery.eq('statut_depense', statut);
    }
    
    if (dateDebut) {
      countQuery = countQuery.gte('date_depense', dateDebut);
    }
    
    if (dateFin) {
      countQuery = countQuery.lte('date_depense', dateFin);
    }
    
    // Exécuter la requête de comptage avec la bonne syntaxe pour Supabase
    const { data: countData, error: countError, count } = await countQuery;
    
    if (countError) {
      console.error('Erreur lors du comptage des dépenses:', countError);
      return NextResponse.json(
        { error: 'Erreur lors du comptage des dépenses' },
        { status: 500 }
      );
    }
    
    // Calculer les statistiques des dépenses
    let statsQuery = supabase
      .from('depense')
      .select('montant_depense, tva_depense')
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
        const montantHT = parseFloat(item.montant_depense);
        const montantTVA = parseFloat(item.tva_depense);
        
        totalHT += montantHT;
        totalTVA += montantTVA;
        totalTTC += (montantHT + montantTVA);
      });
    }
    
    // Transformer les données pour correspondre au format attendu par le composant
    const formattedDepenses = depenses.map(depense => ({
      id: depense.id_depense.toString(),
      date: depense.date_depense,
      categorie: depense.categorie_depense,
      description: depense.description_depense,
      montant: parseFloat(depense.montant_depense),
      tva: parseFloat(depense.tva_depense),
      fournisseur: depense.fournisseur_depense,
      modePaiement: depense.mode_paiement_depense,
      statut: depense.statut_depense
    }));
    
    // Retourner les résultats avec les métadonnées de pagination
    return NextResponse.json({
      depenses: formattedDepenses,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
        filtres: {
          categorie,
          fournisseur,
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