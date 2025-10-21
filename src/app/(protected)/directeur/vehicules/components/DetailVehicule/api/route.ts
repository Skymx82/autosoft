import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    // Récupérer les données du corps de la requête
    const body = await request.json();
    
    const {
      id_vehicule,
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
      statut
    } = body;

    // Validation des champs requis
    if (!id_vehicule) {
      return NextResponse.json(
        { error: 'Le paramètre id_vehicule est requis' },
        { status: 400 }
      );
    }

    // Préparer les données pour la mise à jour
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
      statut: statut || 'Actif'
    };

    // Mettre à jour le véhicule dans la base de données
    const { data, error } = await supabase
      .from('vehicule')
      .update(vehiculeData)
      .eq('id_vehicule', parseInt(id_vehicule))
      .select();

    // Gérer les erreurs Supabase
    if (error) {
      console.error('Erreur Supabase lors de la modification du véhicule:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la modification du véhicule', details: error.message },
        { status: 500 }
      );
    }

    // Retourner le véhicule modifié
    return NextResponse.json({
      vehicule: data?.[0],
      success: true,
      message: 'Véhicule modifié avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la modification du véhicule:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la modification du véhicule',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
