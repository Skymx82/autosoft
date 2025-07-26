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
    const statut = searchParams.get('statut') || 'tous'; // tous, payée, en attente, en retard, annulée
    const periode = searchParams.get('periode') || 'mois'; // jour, semaine, mois, trimestre, annee
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Vérifier que les paramètres requis sont présents
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'id_ecole est requis' },
        { status: 400 }
      );
    }
    
    // Calculer les dates de début et fin selon la période
    const dateActuelle = new Date();
    let dateDebut = new Date();
    
    switch (periode) {
      case 'jour':
        dateDebut.setHours(0, 0, 0, 0);
        break;
      case 'semaine':
        dateDebut.setDate(dateActuelle.getDate() - dateActuelle.getDay());
        dateDebut.setHours(0, 0, 0, 0);
        break;
      case 'mois':
        dateDebut.setDate(1);
        dateDebut.setHours(0, 0, 0, 0);
        break;
      case 'trimestre':
        const moisActuel = dateActuelle.getMonth();
        const debutTrimestre = Math.floor(moisActuel / 3) * 3;
        dateDebut.setMonth(debutTrimestre, 1);
        dateDebut.setHours(0, 0, 0, 0);
        break;
      case 'annee':
        dateDebut.setMonth(0, 1);
        dateDebut.setHours(0, 0, 0, 0);
        break;
      default:
        dateDebut.setDate(1);
        dateDebut.setHours(0, 0, 0, 0);
    }
    
    // Format des dates pour Supabase
    const dateDebutFormatee = dateDebut.toISOString().split('T')[0];
    const dateFinFormatee = dateActuelle.toISOString().split('T')[0];
    
    // Construire la requête de base
    let facturesQuery = supabase
      .from('facture')
      .select(
        `
        id_facture, 
        date_facture, 
        numero_facture, 
        montant_facture, 
        tva_facture, 
        mode_paiement_facture, 
        statut_facture, 
        echeance_facture,
        eleves!inner(nom, prenom)
        `,
        { count: 'exact' }
      )
      .eq('id_ecole', id_ecole)
      .gte('date_facture', dateDebutFormatee)
      .lte('date_facture', dateFinFormatee)
      .order('date_facture', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      facturesQuery = facturesQuery.eq('id_bureau', id_bureau);
    }
    
    // Filtrer par statut si ce n'est pas "tous"
    if (statut !== 'tous') {
      facturesQuery = facturesQuery.eq('statut_facture', statut);
    }
    
    // Exécuter la requête
    const { data: factures, error: facturesError, count } = await facturesQuery;
    
    if (facturesError) {
      console.error('Erreur lors de la récupération des factures:', facturesError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des factures' },
        { status: 500 }
      );
    }
    
    // Calculer les statistiques
    let statsQuery = supabase
      .from('facture')
      .select('statut_facture, montant_facture, tva_facture')
      .eq('id_ecole', id_ecole)
      .gte('date_facture', dateDebutFormatee)
      .lte('date_facture', dateFinFormatee);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      statsQuery = statsQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: statsData, error: statsError } = await statsQuery;
    
    if (statsError) {
      console.error('Erreur lors de la récupération des statistiques de factures:', statsError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des statistiques de factures' },
        { status: 500 }
      );
    }
    
    // Calculer les totaux par statut
    const stats = {
      total: 0,
      payees: 0,
      enAttente: 0,
      enRetard: 0,
      annulees: 0,
      tva: 0
    };
    
    statsData?.forEach(facture => {
      const montant = parseFloat(facture.montant_facture);
      const tva = parseFloat(facture.tva_facture);
      
      stats.total += montant;
      stats.tva += tva;
      
      switch (facture.statut_facture) {
        case 'payée':
          stats.payees += montant;
          break;
        case 'en attente':
          stats.enAttente += montant;
          break;
        case 'en retard':
          stats.enRetard += montant;
          break;
        case 'annulée':
          stats.annulees += montant;
          break;
      }
    });
    
    // Préparer la réponse
    const response = {
      factures: factures,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0
      },
      stats: {
        total: parseFloat(stats.total.toFixed(2)),
        payees: parseFloat(stats.payees.toFixed(2)),
        enAttente: parseFloat(stats.enAttente.toFixed(2)),
        enRetard: parseFloat(stats.enRetard.toFixed(2)),
        annulees: parseFloat(stats.annulees.toFixed(2)),
        tva: parseFloat(stats.tva.toFixed(2))
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}