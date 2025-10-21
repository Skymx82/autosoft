import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du corps de la requête
    const body = await request.json();
    
    const {
      immatriculation,
      marque,
      modele,
      annee,
      type_vehicule,
      categorie_permis,
      boite_vitesse,
      carburant,
      date_mise_en_service,
      kilometrage_actuel,
      prochain_controle_technique,
      prochain_entretien_date,
      prochain_entretien_km,
      assurance_numero_contrat,
      assurance_date_expiration,
      cout_acquisition,
      statut,
      id_ecole,
      id_bureau
    } = body;

    // Validation des champs requis
    if (!immatriculation || !marque || !modele || !id_ecole) {
      return NextResponse.json(
        { error: 'Les champs immatriculation, marque, modèle et id_ecole sont requis' },
        { status: 400 }
      );
    }

    // Préparer les données pour l'insertion
    const vehiculeData = {
      immatriculation,
      marque,
      modele,
      annee: annee || null,
      type_vehicule,
      categorie_permis,
      boite_vitesse: boite_vitesse || null,
      carburant: carburant || null,
      date_mise_en_service: date_mise_en_service || null,
      kilometrage_actuel: kilometrage_actuel || 0,
      prochain_controle_technique: prochain_controle_technique || null,
      prochain_entretien_date: prochain_entretien_date || null,
      prochain_entretien_km: prochain_entretien_km || null,
      assurance_numero_contrat: assurance_numero_contrat || null,
      assurance_date_expiration: assurance_date_expiration || null,
      cout_acquisition: cout_acquisition || null,
      cout_entretien_total: 0,
      cout_carburant_total: 0,
      consommation_moyenne: null,
      statut: statut || 'Actif',
      id_ecole: parseInt(id_ecole),
      id_bureau: id_bureau ? parseInt(id_bureau) : null
    };

    // Insérer le véhicule dans la base de données
    const { data, error } = await supabase
      .from('vehicule')
      .insert([vehiculeData])
      .select();

    // Gérer les erreurs Supabase
    if (error) {
      console.error('Erreur Supabase lors de l\'ajout du véhicule:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout du véhicule', details: error.message },
        { status: 500 }
      );
    }

    // Retourner le véhicule créé
    return NextResponse.json({
      vehicule: data?.[0],
      success: true,
      message: 'Véhicule ajouté avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout du véhicule:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de l\'ajout du véhicule',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
