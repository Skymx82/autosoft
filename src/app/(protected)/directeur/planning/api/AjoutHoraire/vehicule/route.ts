import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Extraire les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau');
    const date = searchParams.get('date');
    const heure_debut = searchParams.get('heure_debut');
    const heure_fin = searchParams.get('heure_fin');
    
    // Vérifier que les paramètres nécessaires sont présents
    if (!id_ecole || !id_bureau) {
      return NextResponse.json(
        { error: 'Les paramètres id_bureau et id_ecole sont requis' },
        { status: 400 }
      );
    }

    // Récupérer les véhicules associés à l'auto-école
    let vehiculesQuery = supabase
      .from('vehicule')
      .select('id_vehicule, immatriculation, marque, modele, type_vehicule, categorie_permis, statut')
      .eq('id_ecole', id_ecole)
      .eq('statut', 'Actif')
      .order('immatriculation', { ascending: true });
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      vehiculesQuery = vehiculesQuery.eq('id_bureau', id_bureau);
    }
    
    const { data: vehicules, error } = await vehiculesQuery;

    if (error) {
      console.error('Erreur lors de la récupération des véhicules:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des véhicules' },
        { status: 500 }
      );
    }

    // Si date, heure_debut et heure_fin sont fournis, vérifier la disponibilité
    let vehiculesDisponibles = vehicules;
    
    if (date && heure_debut && heure_fin) {
      // Récupérer les plannings qui se chevauchent RÉELLEMENT avec le créneau demandé
      // Un véhicule est occupé si :
      // - Une leçon commence AVANT la fin du nouveau créneau ET
      // - Cette leçon se termine APRÈS le début du nouveau créneau
      // MAIS on exclut les cas où la leçon se termine exactement quand le nouveau créneau commence
      const { data: planningsOccupes, error: planningError } = await supabase
        .from('planning')
        .select('id_vehicule')
        .eq('date', date)
        .or(`and(heure_debut.lt.${heure_fin},heure_fin.gt.${heure_debut})`);

      if (planningError) {
        console.error('Erreur lors de la vérification des disponibilités:', planningError);
      } else {
        // Créer un Set des IDs de véhicules occupés
        const vehiculesOccupesIds = new Set(planningsOccupes?.map(p => p.id_vehicule) || []);
        
        // Filtrer les véhicules disponibles
        vehiculesDisponibles = vehicules.filter(v => !vehiculesOccupesIds.has(v.id_vehicule));
      }
    }

    // Transformer les données pour correspondre au format attendu par le composant VehicleSelector
    const formattedVehicules = vehiculesDisponibles.map(vehicule => ({
      id: vehicule.id_vehicule,
      name: `${vehicule.marque} ${vehicule.modele} (${vehicule.immatriculation})`,
      type: vehicule.type_vehicule,
      licenseCategories: [vehicule.categorie_permis],
      isAvailable: true // Tous les véhicules retournés sont disponibles
    }));

    return NextResponse.json({
      vehicules: formattedVehicules
    });
    
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
