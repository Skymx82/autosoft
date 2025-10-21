import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Interface pour les véhicules
interface Vehicule {
  id_vehicule: number;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  type_vehicule: string;
  categorie_permis: string;
  boite_vitesse: string;
  carburant: string;
  date_mise_en_service: string;
  kilometrage_actuel: number;
  dernier_controle_technique: string;
  prochain_controle_technique: string;
  dernier_entretien: string;
  prochain_entretien_km: number;
  prochain_entretien_date: string;
  assurance_numero_contrat: string;
  assurance_date_expiration: string;
  cout_acquisition: number;
  cout_entretien_total: number;
  cout_carburant_total: number;
  consommation_moyenne: number;
  statut: string;
  id_bureau: number;
  id_ecole: number;
  bureau?: {
    id_bureau: number;
    nom: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de l'URL
    const searchParams = request.nextUrl.searchParams;
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau');

    // Validation des paramètres requis
    if (!id_ecole) {
      return NextResponse.json(
        { error: 'Le paramètre id_ecole est requis' },
        { status: 400 }
      );
    }

    // Construire la requête de base
    let query = supabase
      .from('vehicule')
      .select(`
        *,
        bureau (
          id_bureau,
          nom
        )
      `)
      .eq('id_ecole', parseInt(id_ecole));

    // Ajouter le filtre par bureau si spécifié et différent de 'all' ou '0'
    if (id_bureau && id_bureau !== 'all' && id_bureau !== '0') {
      query = query.eq('id_bureau', parseInt(id_bureau));
    }

    // Trier par immatriculation
    query = query.order('immatriculation', { ascending: true });

    // Exécuter la requête
    const { data, error } = await query;

    // Gérer les erreurs Supabase
    if (error) {
      console.error('Erreur Supabase lors de la récupération des véhicules:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des véhicules', details: error.message },
        { status: 500 }
      );
    }

    // Calculer les statistiques
    const vehicules = data || [];
    const statistiques = {
      total: vehicules.length,
      actifs: vehicules.filter((v: Vehicule) => v.statut === 'Actif').length,
      enCours: vehicules.filter((v: Vehicule) => v.statut === 'En cours').length,
      maintenance: vehicules.filter((v: Vehicule) => v.statut === 'Maintenance').length,
      horsService: vehicules.filter((v: Vehicule) => v.statut === 'Hors service').length,
      inactifs: vehicules.filter((v: Vehicule) => v.statut === 'Inactif').length,
    };

    // Retourner les données avec les statistiques
    return NextResponse.json({
      vehicules,
      statistiques,
      success: true
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la récupération des véhicules',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
