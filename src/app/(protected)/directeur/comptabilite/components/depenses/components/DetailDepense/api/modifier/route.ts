import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    // Récupérer les données du corps de la requête
    const formData = await request.formData();
    
    // Extraire les champs de base
    const id_depense = formData.get('id_depense') as string;
    const id_ecole = formData.get('id_ecole') as string;
    const id_bureau = formData.get('id_bureau') as string || '0';
    const date = formData.get('date') as string;
    const categorie = formData.get('categorie') as string;
    const description = formData.get('description') as string;
    const montant = parseFloat(formData.get('montant') as string);
    const tva = parseFloat(formData.get('tva') as string);
    const fournisseur = formData.get('fournisseur') as string;
    const modePaiement = formData.get('modePaiement') as string;
    const statut = formData.get('statut') as string;
    
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

    // Vérifier les données numériques
    if (isNaN(montant) || montant < 0) {
      return NextResponse.json(
        { error: 'Le montant doit être un nombre positif' },
        { status: 400 }
      );
    }

    if (isNaN(tva) || tva < 0) {
      return NextResponse.json(
        { error: 'La TVA doit être un nombre positif' },
        { status: 400 }
      );
    }

    // Récupérer l'ID de la transaction associée à la dépense
    const { data: depenseData, error: depenseError } = await supabase
      .from('depense')
      .select('id_transaction')
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

    const id_transaction = depenseData.id_transaction;

    // Mettre à jour la transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .update({
        date_transaction: date,
        description_transaction: description,
        categorie_transaction: categorie,
        montant_transaction: montant + tva // Montant total TTC
      })
      .eq('id_transaction', id_transaction)
      .eq('id_ecole', id_ecole);

    if (transactionError) {
      console.error('Erreur lors de la mise à jour de la transaction:', transactionError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la transaction' },
        { status: 500 }
      );
    }

    // Mettre à jour la dépense
    const { data, error } = await supabase
      .from('depense')
      .update({
        date_depense: date,
        categorie_depense: categorie,
        description_depense: description,
        montant_depense: montant,
        tva_depense: tva,
        fournisseur_depense: fournisseur,
        mode_paiement_depense: modePaiement,
        statut_depense: statut
      })
      .eq('id_depense', id_depense)
      .eq('id_ecole', id_ecole)
      .select('id_depense')
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de la dépense:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la dépense' },
        { status: 500 }
      );
    }

    // Retourner la réponse avec l'ID de la dépense mise à jour
    return NextResponse.json({
      success: true,
      message: 'Dépense mise à jour avec succès',
      id_depense: data.id_depense
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
