import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // Récupérer les paramètres de la requête
    const searchParams = req.nextUrl.searchParams;
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau') || '0'; // 0 = Tous les bureaux
    
    // Vérifier si l'ID de l'école est fourni
    if (!id_ecole) {
      return NextResponse.json(
        { error: "L'ID de l'auto-école est requis" },
        { status: 400 }
      );
    }

    // Créer le client Supabase
    const cookieStore = cookies();

    // Construire la requête de base
    let query = supabase
      .from('eleves')
      .select(`
        id_eleve,
        nom,
        prenom,
        naiss,
        mail,
        tel,
        adresse,
        code_postal,
        ville,
        categorie,
        statut_dossier,
        date_inscription,
        id_bureau,
        bureau (
          id_bureau,
          nom
        )
      `)
      .eq('id_ecole', id_ecole);

    // Ajouter le filtre par bureau si spécifié et différent de 0 (tous les bureaux)
    if (id_bureau !== '0') {
      query = query.eq('id_bureau', id_bureau);
    }

    // Exécuter la requête
    const { data: eleves, error } = await query;

    // Gérer les erreurs de la requête
    if (error) {
      console.error('Erreur lors de la récupération des élèves:', error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des élèves" },
        { status: 500 }
      );
    }

    // Transformer les données pour correspondre à l'interface Eleve
    const formattedEleves = eleves.map(eleve => ({
      ...eleve
      // Pas besoin de transformation car la structure est déjà correcte
      // bureau est déjà présent dans les données retournées
    }));

    // Retourner les élèves
    return NextResponse.json(formattedEleves);
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: "Une erreur inattendue s'est produite" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Récupérer l'ID de l'élève à archiver depuis les paramètres de la requête
    const searchParams = req.nextUrl.searchParams;
    const id_eleve = searchParams.get('id_eleve');
    const id_ecole = searchParams.get('id_ecole');

    // Vérifier si les paramètres requis sont fournis
    if (!id_eleve) {
      return NextResponse.json(
        { error: "L'ID de l'élève est requis" },
        { status: 400 }
      );
    }

    if (!id_ecole) {
      return NextResponse.json(
        { error: "L'ID de l'auto-école est requis" },
        { status: 400 }
      );
    }

    // Créer le client Supabase
    const cookieStore = cookies();

    // Vérifier d'abord si l'élève existe et appartient à l'école spécifiée
    const { data: eleveExistant, error: checkError } = await supabase
      .from('eleves')
      .select('id_eleve, statut_dossier')
      .eq('id_eleve', id_eleve)
      .eq('id_ecole', id_ecole)
      .single();

    if (checkError || !eleveExistant) {
      return NextResponse.json(
        { error: "L'élève spécifié n'existe pas ou n'appartient pas à cette auto-école" },
        { status: 404 }
      );
    }
    
    // Vérifier si l'élève est déjà archivé
    if (eleveExistant.statut_dossier === 'Archivé') {
      return NextResponse.json(
        { error: "Cet élève est déjà archivé" },
        { status: 400 }
      );
    }

    // 1. Supprimer les documents associés à l'élève
    const { error: deleteDocumentsError } = await supabase
      .from('documents')
      .delete()
      .eq('id_eleve', id_eleve);
    
    if (deleteDocumentsError) {
      console.error('Erreur lors de la suppression des documents:', deleteDocumentsError);
      return NextResponse.json(
        { error: "Erreur lors de la suppression des documents de l'élève" },
        { status: 500 }
      );
    }
    
    // 2. Supprimer les fichiers du storage associés à l'élève
    // D'abord, lister tous les fichiers dans le dossier de l'élève
    const { data: storageFiles, error: storageListError } = await supabase
      .storage
      .from('documents')
      .list(`eleves/${id_eleve}`);
    
    if (storageListError && storageListError.message !== 'The resource was not found') {
      console.error('Erreur lors de la liste des fichiers:', storageListError);
      return NextResponse.json(
        { error: "Erreur lors de la suppression des fichiers de l'élève" },
        { status: 500 }
      );
    }
    
    // Si des fichiers existent, les supprimer
    if (storageFiles && storageFiles.length > 0) {
      const filePaths = storageFiles.map(file => `eleves/${id_eleve}/${file.name}`);
      const { error: storageDeleteError } = await supabase
        .storage
        .from('documents')
        .remove(filePaths);
      
      if (storageDeleteError) {
        console.error('Erreur lors de la suppression des fichiers:', storageDeleteError);
        return NextResponse.json(
          { error: "Erreur lors de la suppression des fichiers de l'élève" },
          { status: 500 }
        );
      }
    }
    
    // 3. Archiver l'élève en mettant à jour son statut
    const { error: updateEleveError } = await supabase
      .from('eleves')
      .update({ 
        statut_dossier: 'Archivé',
        date_archivage: new Date().toISOString() // Ajouter une date d'archivage
      })
      .eq('id_eleve', id_eleve)
      .eq('id_ecole', id_ecole);

    // Gérer les erreurs de la mise à jour
    if (updateEleveError) {
      console.error('Erreur lors de l\'archivage de l\'élève:', updateEleveError);
      return NextResponse.json(
        { error: "Erreur lors de l'archivage de l'élève" },
        { status: 500 }
      );
    }

    // Retourner une réponse de succès
    return NextResponse.json({
      success: true,
      message: "L'élève a été archivé avec succès"
    });
  } catch (error) {
    console.error('Erreur inattendue lors de la suppression:', error);
    return NextResponse.json(
      { error: "Une erreur inattendue s'est produite lors de la suppression" },
      { status: 500 }
    );
  }
}
