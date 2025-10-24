import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createNotification, createNotificationForMultipleUsers } from '@/lib/notifications';

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
      commentaire,
      id_createur // ID de la personne qui crée l'horaire
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
    
    // 🔔 CRÉER LES NOTIFICATIONS
    try {
      // Récupérer les infos de l'élève si présent
      let eleveName = 'un élève';
      if (id_eleve) {
        const { data: eleveData } = await supabase
          .from('eleves')
          .select('nom, prenom')
          .eq('id_eleve', id_eleve)
          .single();
        
        if (eleveData) {
          eleveName = `${eleveData.prenom} ${eleveData.nom}`;
        }
      }
      
      // Formater la date
      const dateFormatted = new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
      
      // Notification pour le moniteur
      await createNotification({
        type: 'info',
        message: `Nouvelle leçon programmée avec ${eleveName} le ${dateFormatted} à ${heure_debut}`,
        id_destinataire: id_moniteur,
        id_ecole,
        id_bureau,
        priorite: 'normale'
      });
      
      // Notification pour l'élève si présent
      if (id_eleve) {
        await createNotification({
          type: 'success',
          message: `Votre leçon a été programmée le ${dateFormatted} à ${heure_debut}`,
          id_destinataire: id_eleve,
          id_ecole,
          id_bureau,
          priorite: 'normale'
        });
      }
      
      // Notification pour la personne qui a créé l'horaire (confirmation)
      if (id_createur) {
        await createNotification({
          type: 'success',
          message: `Leçon créée avec succès : ${eleveName} le ${dateFormatted} à ${heure_debut}`,
          id_destinataire: id_createur,
          id_ecole,
          id_bureau,
          priorite: 'normale'
        });
      }
      
      console.log('✅ Notifications créées avec succès');
    } catch (notifError) {
      console.error('⚠️ Erreur lors de la création des notifications:', notifError);
      // Ne pas bloquer l'enregistrement si les notifications échouent
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
