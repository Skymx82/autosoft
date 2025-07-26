import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../../../lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

// Fonction utilitaire pour calculer les statistiques des devis
async function calculerStatistiquesDevis(id_ecole: string, id_bureau: string) {
  try {
    // Construire la requête de base
    let query = supabase
      .from('devis')
      .select('statut_devis, montant_devis, tva_devis')
      .eq('id_ecole', id_ecole);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      query = query.eq('id_bureau', id_bureau);
    }
    
    const { data: devis, error } = await query;
    
    if (error) {
      console.error('Erreur lors de la récupération des devis:', error);
      return null;
    }
    
    // Calculer les statistiques
    const total = devis.length;
    const enAttente = devis.filter(d => d.statut_devis === 'en attente').length;
    const acceptes = devis.filter(d => d.statut_devis === 'accepté').length;
    const refuses = devis.filter(d => d.statut_devis === 'refusé').length;
    const expires = devis.filter(d => d.statut_devis === 'expiré').length;
    
    // Calculer les montants totaux
    const montantTotal = devis.reduce((sum, d) => sum + parseFloat(d.montant_devis), 0);
    const montantEnAttente = devis
      .filter(d => d.statut_devis === 'en attente')
      .reduce((sum, d) => sum + parseFloat(d.montant_devis), 0);
    const montantAcceptes = devis
      .filter(d => d.statut_devis === 'accepté')
      .reduce((sum, d) => sum + parseFloat(d.montant_devis), 0);
    
    // Calculer le taux de conversion
    const tauxConversion = total > 0 ? (acceptes / total) * 100 : 0;
    
    return {
      nombre: {
        total,
        enAttente,
        acceptes,
        refuses,
        expires
      },
      montants: {
        total: montantTotal,
        enAttente: montantEnAttente,
        acceptes: montantAcceptes
      },
      tauxConversion: parseFloat(tauxConversion.toFixed(2))
    };
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques des devis:', error);
    return null;
  }
}

// Fonction utilitaire pour calculer les statistiques des contrats
async function calculerStatistiquesContrats(id_ecole: string, id_bureau: string) {
  try {
    // Construire la requête de base
    let query = supabase
      .from('contrats')
      .select('statut_contrat, montant_contrat, tva_contrat, date_debut, date_fin')
      .eq('id_ecole', id_ecole);
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      query = query.eq('id_bureau', id_bureau);
    }
    
    const { data: contrats, error } = await query;
    
    if (error) {
      console.error('Erreur lors de la récupération des contrats:', error);
      return null;
    }
    
    const dateActuelle = new Date();
    
    // Calculer les statistiques
    const total = contrats.length;
    const actifs = contrats.filter(c => c.statut_contrat === 'actif').length;
    const termines = contrats.filter(c => c.statut_contrat === 'terminé').length;
    const resilies = contrats.filter(c => c.statut_contrat === 'résilié').length;
    
    // Calculer les montants totaux
    const montantTotal = contrats.reduce((sum, c) => sum + parseFloat(c.montant_contrat), 0);
    const montantActifs = contrats
      .filter(c => c.statut_contrat === 'actif')
      .reduce((sum, c) => sum + parseFloat(c.montant_contrat), 0);
    
    // Calculer la durée moyenne des contrats (en mois)
    const dureeMoyenne = contrats.length > 0 ?
      contrats.reduce((sum, c) => {
        const debut = new Date(c.date_debut);
        const fin = new Date(c.date_fin);
        const diffMois = (fin.getFullYear() - debut.getFullYear()) * 12 + (fin.getMonth() - debut.getMonth());
        return sum + diffMois;
      }, 0) / contrats.length : 0;
    
    return {
      nombre: {
        total,
        actifs,
        termines,
        resilies
      },
      montants: {
        total: montantTotal,
        actifs: montantActifs
      },
      dureeMoyenne: parseFloat(dureeMoyenne.toFixed(1))
    };
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques des contrats:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Extraire les paramètres de la requête
    const searchParams = request.nextUrl.searchParams;
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau') || '0'; // 0 = Tous les bureaux
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || 'tous'; // 'devis', 'contrats', ou 'tous'
    
    // Vérifier que les paramètres requis sont présents
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'id_ecole est requis' },
        { status: 400 }
      );
    }
    
    // Calculer l'offset pour la pagination
    const offset = (page - 1) * limit;
    
    // Récupérer les devis récents si type est 'devis' ou 'tous'
    let devisRecents: any[] = [];
    let totalDevis = 0;
    
    if (type === 'devis' || type === 'tous') {
      // Construire la requête pour les devis
      let devisQuery = supabase
        .from('devis')
        .select(
          `
          id_devis, 
          numero_devis, 
          date_devis, 
          montant_devis, 
          tva_devis, 
          statut_devis, 
          date_expiration,
          eleves!inner(nom, prenom)
          `,
          { count: 'exact' }
        )
        .eq('id_ecole', id_ecole)
        .order('date_devis', { ascending: false })
        .range(offset, offset + limit - 1);
      
      // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
      if (id_bureau !== '0') {
        devisQuery = devisQuery.eq('id_bureau', id_bureau);
      }
      
      const { data: devis, error: devisError, count } = await devisQuery;
      
      if (devisError) {
        console.error('Erreur lors de la récupération des devis:', devisError);
        return NextResponse.json(
          { error: 'Erreur lors de la récupération des devis' },
          { status: 500 }
        );
      }
      
      // Transformer les données pour correspondre à la structure attendue par le frontend
      devisRecents = (devis || []).map(item => ({
        id_devis: item.id_devis,
        numero_devis: item.numero_devis,
        date_creation: item.date_devis,
        date_expiration: item.date_expiration,
        eleves: item.eleves,
        montant_ht: parseFloat(item.montant_devis) || 0,
        montant_tva: parseFloat(item.tva_devis) || 0,
        montant_ttc: (parseFloat(item.montant_devis) + parseFloat(item.tva_devis)) || 0,
        statut: item.statut_devis,
        description: ''
      }));
      totalDevis = count || 0;
    }
    
    // Récupérer les contrats récents si type est 'contrats' ou 'tous'
    let contratsRecents: any[] = [];
    let totalContrats = 0;
    
    if (type === 'contrats' || type === 'tous') {
      // Construire la requête pour les contrats
      let contratsQuery = supabase
        .from('contrats')
        .select(
          `
          id_contrat, 
          numero_contrat, 
          date_debut, 
          date_fin, 
          montant_contrat, 
          tva_contrat, 
          statut_contrat,
          eleves!inner(nom, prenom)
          `,
          { count: 'exact' }
        )
        .eq('id_ecole', id_ecole)
        .order('date_debut', { ascending: false })
        .range(offset, offset + limit - 1);
      
      // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
      if (id_bureau !== '0') {
        contratsQuery = contratsQuery.eq('id_bureau', id_bureau);
      }
      
      const { data: contrats, error: contratsError, count } = await contratsQuery;
      
      if (contratsError) {
        console.error('Erreur lors de la récupération des contrats:', contratsError);
        return NextResponse.json(
          { error: 'Erreur lors de la récupération des contrats' },
          { status: 500 }
        );
      }
      
      // Transformer les données pour correspondre à la structure attendue par le frontend
      contratsRecents = (contrats || []).map(item => ({
        id_contrat: item.id_contrat,
        numero_contrat: item.numero_contrat,
        date_debut: item.date_debut,
        date_fin: item.date_fin,
        eleves: item.eleves,
        montant_ht: parseFloat(item.montant_contrat) || 0,
        montant_tva: parseFloat(item.tva_contrat) || 0,
        montant_ttc: (parseFloat(item.montant_contrat) + parseFloat(item.tva_contrat)) || 0,
        statut: item.statut_contrat,
        description: ''
      }));
      totalContrats = count || 0;
    }
    
    // Calculer les statistiques des devis et contrats
    const statsDevis = await calculerStatistiquesDevis(id_ecole, id_bureau);
    const statsContrats = await calculerStatistiquesContrats(id_ecole, id_bureau);
    
    if (!statsDevis || !statsContrats) {
      return NextResponse.json(
        { error: 'Erreur lors du calcul des statistiques' },
        { status: 500 }
      );
    }
    
    // Préparer la réponse
    const response = {
      devis: devisRecents,
      contrats: contratsRecents,
      pagination: {
        page,
        limit,
        totalDevis,
        totalContrats,
        totalPages: Math.ceil(Math.max(totalDevis, totalContrats) / limit)
      },
      statistiques: {
        devis: statsDevis,
        contrats: statsContrats
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de devis et contrats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}