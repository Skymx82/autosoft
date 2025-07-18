import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Récupérer les données du corps de la requête
    const data = await request.json();
    
    // Vérifier que toutes les données nécessaires sont présentes
    const { 
      date, 
      heure_debut, 
      heure_fin, 
      type_lecon, 
      id_moniteur, 
      id_eleve, 
      id_vehicule,
      id_bureau, 
      id_ecole,
      commentaire
    } = data;
    
    // Vérifier que les champs obligatoires sont présents
    if (!date || !heure_debut || !heure_fin || !id_moniteur || !id_ecole) {
      return NextResponse.json(
        { error: 'Données incomplètes. Veuillez fournir date, heure_debut, heure_fin, id_moniteur et id_ecole.' }, 
        { status: 400 }
      );
    }
    
    // Préparer les données à insérer
    const planningData = {
      date,
      heure_debut,
      heure_fin,
      type_lecon: type_lecon || null,
      id_moniteur,
      id_eleve: id_eleve || null,
      id_vehicule: id_vehicule || null,
      statut_lecon: 'Prévue',
      id_bureau: id_bureau || null,
      id_ecole,
      commentaire: commentaire || null
    };
    
    console.log('Enregistrement d\'un horaire dans le planning:', planningData);
    
    // Insérer les données dans la table planning
    const { data: insertedData, error } = await supabase
      .from('planning')
      .insert(planningData)
      .select();
    
    if (error) {
      console.error('Erreur lors de l\'insertion dans la table planning:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Horaire enregistré avec succès',
      data: insertedData
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'horaire:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'enregistrement de l\'horaire' }, 
      { status: 500 }
    );
  }
}
