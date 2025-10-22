import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Récupère les élèves associés à une auto-école et éventuellement un bureau
 * GET /directeur/planning/components/ModalDetail/Eleve/api?id_ecole=1&id_bureau=1
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de l'URL
    const searchParams = request.nextUrl.searchParams;
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau');

    // Validation des paramètres
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'Le paramètre id_ecole est requis' },
        { status: 400 }
      );
    }

    // Construire la requête Supabase
    let query = supabase
      .from('eleves')
      .select('id_eleve, nom, prenom, mail, tel, categorie, id_bureau, id_ecole, statut_dossier')
      .eq('id_ecole', parseInt(id_ecole));

    // Ajouter le filtre id_bureau si fourni
    if (id_bureau) {
      query = query.eq('id_bureau', parseInt(id_bureau));
    }

    // Filtrer uniquement les élèves actifs (non archivés et statut "Actif")
    query = query
      .is('date_archivage', null)
      .eq('statut_dossier', 'Actif');

    // Trier par nom et prénom
    query = query.order('nom', { ascending: true }).order('prenom', { ascending: true });

    // Exécuter la requête
    const { data: eleves, error } = await query;

    // Gérer les erreurs Supabase
    if (error) {
      console.error('Erreur Supabase lors de la récupération des élèves:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des élèves', details: error.message },
        { status: 500 }
      );
    }

    // Retourner les élèves
    return NextResponse.json({
      eleves: eleves || [],
      success: true
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la récupération des élèves',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
