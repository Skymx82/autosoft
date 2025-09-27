import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Utiliser export const dynamic pour forcer le mode dynamique
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    // Récupérer les données du corps de la requête
    const formData = await request.formData();
    
    // Extraire les champs de base
    const id_recette = formData.get('id_recette') as string;
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
    if (!id_recette) {
      return NextResponse.json(
        { error: 'ID de recette manquant' },
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

    // Vérifier si la recette existe
    const { data: recetteData, error: recetteError } = await supabase
      .from('recette')
      .select('id_recette')
      .eq('id_recette', id_recette)
      .eq('id_ecole', id_ecole)
      .single();

    if (recetteError) {
      console.error('Erreur lors de la vérification de la recette:', recetteError);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification de la recette' },
        { status: 500 }
      );
    }

    if (!recetteData) {
      return NextResponse.json(
        { error: 'Recette non trouvée' },
        { status: 404 }
      );
    }
    
    // Note: Nous ne mettons plus à jour la table transactions car la table recette n'a plus de colonne id_transaction

    // Récupérer le fichier justificatif s'il existe
    const justificatif = formData.get('justificatif') as File | null;
    let justificatif_url = '';
    
    // Si un justificatif a été fourni, l'uploader dans Supabase Storage
    if (justificatif) {
      try {
        // Déterminer l'extension du fichier
        const fileExtension = justificatif.name.split('.').pop() || '';
        
        // Créer le chemin de stockage dans Supabase
        const storagePath = `${id_ecole}/recette/${id_recette}.${fileExtension}`;
        
        // Convertir le fichier en ArrayBuffer pour l'upload
        const fileBuffer = await justificatif.arrayBuffer();
        
        // Upload du fichier dans Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('documents') // Nom du bucket correct
          .upload(storagePath, fileBuffer, {
            contentType: justificatif.type,
            upsert: true // Remplacer si le fichier existe déjà
          });
        
        if (uploadError) {
          console.error('Erreur lors de l\'upload du justificatif:', uploadError);
        } else {
          // Construire l'URL publique du fichier
          const { data: publicUrlData } = supabase
            .storage
            .from('documents') // Même nom de bucket que ci-dessus
            .getPublicUrl(storagePath);
          
          // Mettre à jour l'URL du justificatif
          if (publicUrlData) {
            justificatif_url = publicUrlData.publicUrl;
          }
        }
      } catch (uploadError) {
        console.error('Erreur lors du traitement du justificatif:', uploadError);
      }
    }

    // Préparer l'objet de mise à jour
    const updateData: any = {
      date_recette: date,
      categorie_recette: categorie,
      description_recette: description,
      montant_recette: montant,
      tva_recette: tva,
      client_recette: client,
      mode_paiement_recette: modePaiement,
      statut_recette: statut
    };
    
    // Ajouter l'URL du justificatif si un nouveau fichier a été uploadé
    if (justificatif_url) {
      updateData.justificatif_url = justificatif_url;
    }
    
    // Mettre à jour la recette
    const { data, error } = await supabase
      .from('recette')
      .update(updateData)
      .eq('id_recette', id_recette)
      .eq('id_ecole', id_ecole)
      .select('id_recette')
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de la recette:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la recette' },
        { status: 500 }
      );
    }

    // Retourner la réponse avec l'ID de la recette mise à jour
    return NextResponse.json({
      success: true,
      message: 'Recette mise à jour avec succès',
      id_recette: data.id_recette,
      justificatif_url: justificatif_url || null
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
