import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Extraire les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau');
    
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

    // Transformer les données pour correspondre au format attendu par le composant VehicleSelector
    const formattedVehicules = vehicules.map(vehicule => ({
      id: vehicule.id_vehicule,
      name: `${vehicule.marque} ${vehicule.modele} (${vehicule.immatriculation})`,
      type: vehicule.type_vehicule,
      licenseCategories: [vehicule.categorie_permis],
      isAvailable: vehicule.statut === 'Disponible'
    }));

    return NextResponse.json({
      vehicules: formattedVehicules
    });
    
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
