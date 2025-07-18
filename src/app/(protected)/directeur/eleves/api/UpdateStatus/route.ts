import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

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
      { error: "Une erreur inattendue s'est produite lors de la mise à jour du statut" },
      { status: 500 }
    );
  }
}
