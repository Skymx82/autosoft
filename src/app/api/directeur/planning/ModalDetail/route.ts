import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Récupère les détails complets d'un horaire de planning par son ID
 * GET /api/directeur/planning/ModalDetail?id_planning=123
 */
export async function GET(request: Request) {
  try {
    // Récupérer l'ID du planning depuis les paramètres de requête
    const { searchParams } = new URL(request.url);
    const id_planning = searchParams.get('id_planning');

    // Vérifier que l'ID du planning est fourni
    if (!id_planning) {
      return NextResponse.json(
        { error: 'ID du planning manquant' },
        { status: 400 }
      );
    }

    // Récupérer les détails du planning
    const { data: planning, error: planningError } = await supabase
      .from('planning')
      .select(`
        *,
        enseignants:id_moniteur(id_moniteur, nom, prenom, email, tel),
        eleves:id_eleve(id_eleve, nom, prenom, mail, tel, categorie),
        vehicule:id_vehicule(id_vehicule, immatriculation, marque, modele, type_vehicule, categorie_permis, statut),
        bureau:id_bureau(id_bureau, nom),
        auto_ecole:id_ecole(id_ecole, nom)
      `)
      .eq('id_planning', id_planning)
      .single();

    if (planningError) {
      console.error('Erreur lors de la récupération du planning:', planningError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du planning' },
        { status: 500 }
      );
    }

    if (!planning) {
      return NextResponse.json(
        { error: 'Planning non trouvé' },
        { status: 404 }
      );
    }

    // Si le planning a une notation, récupérer les détails
    let notation = null;
    if (planning.id_notation_eleve) {
      const { data: notationData, error: notationError } = await supabase
        .from('notation')
        .select('*')
        .eq('id_notation_eleve', planning.id_notation_eleve)
        .single();

      if (!notationError) {
        notation = notationData;
      }
    }

    // Construire la réponse avec toutes les informations
    const response = {
      ...planning,
      notation
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * Met à jour les informations d'un horaire de planning
 * PATCH /api/directeur/planning/ModalDetail
 */
export async function PATCH(request: Request) {
  try {
    // Récupérer les données du corps de la requête
    const data = await request.json();
    
    // Vérifier que l'ID du planning est fourni
    if (!data.id_planning) {
      return NextResponse.json(
        { error: 'ID du planning manquant' },
        { status: 400 }
      );
    }
    
    // Extraire l'ID du planning
    const { id_planning, ...updateData } = data;
    
    // Mettre à jour les données du planning
    const { data: updatedPlanning, error } = await supabase
      .from('planning')
      .update(updateData)
      .eq('id_planning', id_planning)
      .select(`
        *,
        enseignants:id_moniteur(id_moniteur, nom, prenom, email, tel),
        eleves:id_eleve(id_eleve, nom, prenom, mail, tel, categorie),
        vehicule:id_vehicule(id_vehicule, immatriculation, marque, modele, type_vehicule, categorie_permis, statut),
        bureau:id_bureau(id_bureau, nom),
        auto_ecole:id_ecole(id_ecole, nom)
      `)
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour du planning:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du planning' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedPlanning);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
