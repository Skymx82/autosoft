import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de la requête
    const searchParams = request.nextUrl.searchParams;
    const id_depense = searchParams.get('id_depense');
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau');
    
    // Vérifier que les paramètres requis sont présents
    if (!id_depense) {
      return NextResponse.json(
        { error: 'ID de dépense manquant' },
        { status: 400 }
      );
    }

    if (!id_ecole) {
      return NextResponse.json(
        { error: 'ID d\'école manquant' },
        { status: 400 }
      );
    }

    // Récupérer les détails de la dépense
    const { data: depenseData, error: depenseError } = await supabase
      .from('depense')
      .select(`
        id_depense,
        date_depense,
        categorie_depense,
        description_depense,
        montant_depense,
        tva_depense,
        fournisseur_depense,
        mode_paiement_depense,
        statut_depense,
        id_transaction,
        justificatif_url
      `)
      .eq('id_depense', id_depense)
      .eq('id_ecole', id_ecole)
      .single();

    if (depenseError) {
      console.error('Erreur lors de la récupération de la dépense:', depenseError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de la dépense' },
        { status: 500 }
      );
    }

    if (!depenseData) {
      return NextResponse.json(
        { error: 'Dépense non trouvée' },
        { status: 404 }
      );
    }

    // Transformer les données pour correspondre au format attendu par le frontend
    const depense = {
      id: depenseData.id_depense,
      date: depenseData.date_depense,
      categorie: depenseData.categorie_depense,
      description: depenseData.description_depense,
      montant: depenseData.montant_depense,
      tva: depenseData.tva_depense,
      fournisseur: depenseData.fournisseur_depense,
      modePaiement: depenseData.mode_paiement_depense,
      statut: depenseData.statut_depense,
      id_transaction: depenseData.id_transaction,
      justificatif_url: depenseData.justificatif_url || null
    };

    // Retourner les données
    return NextResponse.json({
      success: true,
      depense
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
