import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../../../../../lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du corps de la requête
    const formData = await request.formData();
    
    // Extraire les champs de base
    const id_ecole = formData.get('id_ecole') as string;
    const id_bureau = formData.get('id_bureau') as string || '0';
    const date = formData.get('date') as string;
    const categorie = formData.get('categorie') as string;
    const description = formData.get('description') as string;
    const montant = parseFloat(formData.get('montant') as string);
    const tva = parseFloat(formData.get('tva') as string);
    const client = formData.get('client') as string;
    const modePaiement = formData.get('modePaiement') as string;
    const statut = formData.get('statut') as string;
    
    // Vérifier que les paramètres requis sont présents
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'id_ecole est requis' },
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

    // Désactivé temporairement pour débogage
    // Récupérer le fichier justificatif s'il existe
    // const justificatif = formData.get('justificatif') as File | null;
    let justificatif_url = '';

    // Vérifier si id_bureau est valide (différent de '0')
    if (id_bureau === '0') {
      return NextResponse.json(
        { error: 'Veuillez sélectionner un bureau valide avant d\'ajouter une recette.' },
        { status: 400 }
      );
    }
    
    // Créer d'abord la transaction
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          id_ecole,
          id_bureau,
          date_transaction: date,
          description_transaction: description,
          categorie_transaction: categorie,
          montant_transaction: montant + tva, // Montant total TTC
          type_transaction: 'recette'
        }
      ])
      .select('id_transaction')
      .single();

    if (transactionError) {
      console.error('Erreur lors de la création de la transaction:', transactionError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la transaction' },
        { status: 500 }
      );
    }

    // Récupérer l'ID de la transaction créée
    const id_transaction = transactionData.id_transaction;

    // Insérer la recette dans la base de données avec la référence à la transaction
    const { data, error } = await supabase
      .from('recette')
      .insert([
        {
          id_ecole,
          id_bureau,
          date_recette: date,
          categorie_recette: categorie,
          description_recette: description,
          montant_recette: montant,
          tva_recette: tva,
          client_recette: client,
          mode_paiement_recette: modePaiement,
          statut_recette: statut,
          justificatif_url: justificatif_url,
          id_transaction: id_transaction // Lier la recette à la transaction
        }
      ])
      .select('id_recette')
      .single();

    if (error) {
      console.error('Erreur lors de l\'ajout de la recette:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout de la recette' },
        { status: 500 }
      );
    }

    // Retourner la réponse avec l'ID de la recette créée
    return NextResponse.json({
      success: true,
      message: 'Recette ajoutée avec succès',
      id_recette: data.id_recette
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
