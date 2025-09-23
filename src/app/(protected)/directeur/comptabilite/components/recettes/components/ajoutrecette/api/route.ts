import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du corps de la requête
    const formData = await request.formData();
    
    // Extraire les champs de base et les valider
    const id_ecole_raw = formData.get('id_ecole');
    const id_bureau_raw = formData.get('id_bureau');
    
    // S'assurer que id_ecole est un entier valide
    if (!id_ecole_raw || id_ecole_raw === '') {
      return NextResponse.json(
        { error: 'id_ecole est requis et ne peut pas être vide' },
        { status: 400 }
      );
    }
    const id_ecole = id_ecole_raw.toString();
    
    // S'assurer que id_bureau est un entier valide ou '0'
    let id_bureau = '0';
    if (id_bureau_raw && id_bureau_raw !== '') {
      id_bureau = id_bureau_raw.toString();
    }
    
    const date = formData.get('date') as string;
    const categorie = formData.get('categorie') as string;
    const description = formData.get('description') as string;
    
    // Valider et convertir les montants
    const montant_raw = formData.get('montant');
    const tva_raw = formData.get('tva');
    
    // Valider le montant
    if (!montant_raw || montant_raw === '') {
      return NextResponse.json(
        { error: 'Le montant est requis' },
        { status: 400 }
      );
    }
    const montant = parseFloat(montant_raw.toString());
    
    // Valider la TVA
    if (!tva_raw || tva_raw === '') {
      return NextResponse.json(
        { error: 'La TVA est requise' },
        { status: 400 }
      );
    }
    const tva = parseFloat(tva_raw.toString());
    
    // Gérer le champ client comme une clé étrangère
    const client_raw = formData.get('client');
    let client_id = null; // Par défaut, utiliser NULL pour une clé étrangère non spécifiée
    
    // Si une valeur est fournie, essayer de la convertir en nombre
    if (client_raw && client_raw !== '') {
      const parsed = parseInt(client_raw.toString());
      // Vérifier si la conversion a réussi
      if (!isNaN(parsed)) {
        client_id = parsed;
      }
    }
    
    const modePaiement = formData.get('modePaiement') as string || 'Carte bancaire';
    const statut = formData.get('statut') as string || 'encaissé';
    
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
        { error: 'bureau_required', message: 'Veuillez sélectionner un bureau valide avant d\'ajouter une recette.' },
        { status: 400 }
      );
    }
    
    // Convertir les ID en nombres pour la base de données
    const id_ecole_num = parseInt(id_ecole);
    const id_bureau_num = parseInt(id_bureau);
    
    // Vérifier que les conversions sont valides
    if (isNaN(id_ecole_num)) {
      return NextResponse.json(
        { error: 'id_ecole doit être un nombre valide' },
        { status: 400 }
      );
    }
    
    if (isNaN(id_bureau_num)) {
      return NextResponse.json(
        { error: 'id_bureau doit être un nombre valide' },
        { status: 400 }
      );
    }

    // Insérer la recette dans la base de données
    const { data, error } = await supabase
      .from('recette')
      .insert([
        {
          id_ecole: id_ecole_num,
          id_bureau: id_bureau_num,
          date_recette: date,
          categorie_recette: categorie,
          description_recette: description,
          montant_recette: montant,
          tva_recette: tva,
          client_recette: client_id, // Utiliser la valeur convertie ou null
          mode_paiement_recette: modePaiement,
          statut_recette: statut,
          justificatif_url: justificatif_url
          // La colonne id_transaction a été supprimée
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
