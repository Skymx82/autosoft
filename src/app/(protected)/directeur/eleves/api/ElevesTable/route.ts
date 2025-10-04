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
        id_forfait,
        bureau (
          id_bureau,
          nom
        ),
        forfait (
          id_forfait,
          nom,
          type_permis
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
    const formattedEleves = eleves.map(eleve => {
      // Utiliser uniquement la catégorie de permis du forfait
      // Si le forfait n'existe pas, on met "Non défini"
      let categoriePermis = "Non défini";
      
      // Vérifier si le forfait existe et contient type_permis
      if (eleve.forfait && typeof eleve.forfait === 'object') {
        // Utiliser une assertion de type pour éviter les erreurs TypeScript
        const forfait = eleve.forfait as { type_permis?: string };
        if (forfait.type_permis) {
          categoriePermis = forfait.type_permis;
        }
      }
      
      return {
        ...eleve,
        // Remplacer complètement la catégorie par celle du forfait
        categorie: categoriePermis
      };
    });

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

export async function PUT(req: NextRequest) {
  try {
    // Récupérer les données du corps de la requête
    const body = await req.json();
    const { id_eleves, status, id_ecole } = body;
    
    // Vérifier si les paramètres requis sont fournis
    if (!id_eleves || !Array.isArray(id_eleves) || id_eleves.length === 0) {
      return NextResponse.json(
        { error: "Les IDs des élèves sont requis" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Le statut est requis" },
        { status: 400 }
      );
    }

    if (!id_ecole) {
      return NextResponse.json(
        { error: "L'ID de l'auto-école est requis" },
        { status: 400 }
      );
    }

    // Vérifier que le statut est valide
    const validStatuses = ['Actif', 'En attente', 'Complet', 'Incomplet', 'Brouillon', 'Archivé'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Le statut fourni n'est pas valide" },
        { status: 400 }
      );
    }

    // Créer le client Supabase
    const cookieStore = cookies();

    // Vérifier que tous les élèves existent et appartiennent à l'école spécifiée
    const { data: elevesExistants, error: checkError } = await supabase
      .from('eleves')
      .select('id_eleve')
      .eq('id_ecole', id_ecole)
      .in('id_eleve', id_eleves);

    if (checkError) {
      return NextResponse.json(
        { error: "Erreur lors de la vérification des élèves" },
        { status: 500 }
      );
    }

    // Vérifier que tous les élèves demandés existent
    if (!elevesExistants || elevesExistants.length !== id_eleves.length) {
      return NextResponse.json(
        { error: "Certains élèves spécifiés n'existent pas ou n'appartiennent pas à cette auto-école" },
        { status: 404 }
      );
    }

    // Si le statut est "Archivé", ajouter une date d'archivage
    const updateData = status === 'Archivé' 
      ? { statut_dossier: status, date_archivage: new Date().toISOString() }
      : { statut_dossier: status };

    // Mettre à jour le statut des élèves
    const { error: updateError } = await supabase
      .from('eleves')
      .update(updateData)
      .in('id_eleve', id_eleves)
      .eq('id_ecole', id_ecole);

    // Gérer les erreurs de la mise à jour
    if (updateError) {
      console.error('Erreur lors de la mise à jour du statut des élèves:', updateError);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour du statut des élèves" },
        { status: 500 }
      );
    }

    // Retourner une réponse de succès
    return NextResponse.json({
      success: true,
      message: `Le statut de ${id_eleves.length} élève(s) a été mis à jour avec succès`
    });
  } catch (error) {
    console.error('Erreur inattendue lors de la mise à jour du statut:', error);
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
