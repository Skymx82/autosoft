import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Définition des types
type AvailableSlot = {
  time: string;
  availableTeachers: number;
  teacherIds: number[];
  // Ajouter des informations de disponibilité par durée
  availabilityByDuration?: Record<string, number[]>;
};

/**
 * Récupère les créneaux horaires disponibles pour une date donnée
 * @route GET /api/directeur/planning/disponibilites
 */
export async function GET(request: NextRequest) {
  try {
    // Extraire les paramètres de la requête
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    let id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau');
    
    // Vérifier que les paramètres requis sont présents
    if (!date) {
      return NextResponse.json(
        { error: 'Le paramètre date est requis' },
        { status: 400 }
      );
    }
    
    // Si id_ecole est 0 ou non spécifié, utiliser une valeur par défaut
    if (!id_ecole || id_ecole === '0') {
      // Pour l'exemple, nous allons utiliser l'ID 1 comme valeur par défaut
      console.log('ID école non spécifié ou égal à 0, utilisation de la valeur par défaut 1');
      id_ecole = '1';
    }

    // 1. Récupérer tous les moniteurs disponibles pour cette école
    let query = supabase
      .from('enseignants')
      .select('id_moniteur, nom, prenom, id_bureau')
      .eq('id_ecole', id_ecole);
    
    // Filtrer par bureau si nécessaire (id_bureau = 0 signifie "tous les bureaux")
    if (id_bureau && id_bureau !== '0') {
      query = query.eq('id_bureau', parseInt(id_bureau));
    }
    
    console.log('Requête moniteurs:', { id_ecole, id_bureau });
    
    const { data: moniteurs, error: moniteursError } = await query;
    
    if (moniteursError) {
      console.error('Erreur lors de la récupération des moniteurs:', moniteursError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des moniteurs' },
        { status: 500 }
      );
    }
    
    if (!moniteurs || moniteurs.length === 0) {
      console.error('Aucun moniteur trouvé pour l\'école:', id_ecole);
      // Au lieu de renvoyer une erreur 404, renvoyons une liste vide de créneaux disponibles
      return NextResponse.json({
        date,
        availableSlots: [],
        moniteurs: {}
      });
    }
    
    // Filtrer les moniteurs par bureau si nécessaire
    let moniteursFiltres = moniteurs;
    if (id_bureau && id_bureau !== '0') {
      const bureauId = parseInt(id_bureau);
      moniteursFiltres = moniteurs.filter(m => m.id_bureau === bureauId);
      console.log(`Après filtrage par bureau ${id_bureau}: ${moniteursFiltres.length} moniteurs`);
      
      // Afficher les moniteurs filtrés pour le débogage
      if (moniteursFiltres.length > 0) {
        console.log('Moniteurs filtrés par bureau:', 
          moniteursFiltres.map(m => ({ id: m.id_moniteur, nom: m.nom, prenom: m.prenom, bureau: m.id_bureau })));
      }
      
      // Si aucun moniteur n'est trouvé après filtrage, utiliser tous les moniteurs de l'école
      if (moniteursFiltres.length === 0) {
        console.log('Aucun moniteur trouvé pour ce bureau, utilisation de tous les moniteurs de l\'école');
        moniteursFiltres = moniteurs;
      }
    }
    
    // Extraire les IDs des moniteurs
    const moniteurIds = moniteursFiltres.map(m => m.id_moniteur);
    
    // Créer un dictionnaire des moniteurs pour accès rapide
    const moniteursMap = new Map(moniteursFiltres.map(m => [m.id_moniteur, m]));
    
    console.log(`${moniteursFiltres.length} moniteurs trouvés pour l'école ${id_ecole}`);
    
    // Afficher les moniteurs trouvés pour le débogage
    if (moniteursFiltres && moniteursFiltres.length > 0) {
      console.log(`${moniteursFiltres.length} moniteurs trouvés:`, 
        moniteursFiltres.map(m => ({ id: m.id_moniteur, nom: m.nom, prenom: m.prenom, bureau: m.id_bureau })));
    }
    
    // 2. Récupérer tous les créneaux déjà réservés pour cette date
    // Note: On récupère TOUS les plannings pour cette date et cette école, pas seulement ceux des moniteurs filtrés
    // Cela permet de voir tous les créneaux occupés et d'éviter les conflits
    let planningQuery = supabase
      .from('planning')
      .select('id_planning, heure_debut, heure_fin, id_moniteur, id_bureau')
      .eq('date', date)
      .eq('id_ecole', id_ecole);
      
    // Si un bureau spécifique est sélectionné, filtrer les plannings par bureau
    if (id_bureau && id_bureau !== '0') {
      planningQuery = planningQuery.eq('id_bureau', parseInt(id_bureau));
    }
    
    const { data: plannings, error: planningsError } = await planningQuery;
    
    if (planningsError) {
      console.error('Erreur lors de la récupération des plannings:', planningsError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des plannings' },
        { status: 500 }
      );
    }
    
    // 3. Générer les créneaux horaires disponibles
    // Définir les heures de travail (de 7h à 20h par tranches de 30 minutes)
    const workingHours = [];
    for (let hour = 7; hour < 20; hour++) {
      workingHours.push(`${hour.toString().padStart(2, '0')}:00`);
      workingHours.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    // Pour chaque créneau, vérifier quels moniteurs sont disponibles
    const availableSlots: AvailableSlot[] = [];
    
    // Durations possibles en minutes (pour vérifier les disponibilités)
    const possibleDurations = [30, 45, 60, 90, 120];
    
    workingHours.forEach(timeSlot => {
      // Convertir le créneau en minutes depuis minuit pour faciliter les comparaisons
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const slotMinutes = hours * 60 + minutes;
      
      // Trouver les moniteurs disponibles pour ce créneau pour chaque durée possible
      const availableTeachersByDuration: Record<number, number[]> = {};
      
      // Vérifier la disponibilité pour chaque durée possible
      possibleDurations.forEach(duration => {
        const slotEndMinutes = slotMinutes + duration;
        
        // Trouver les moniteurs disponibles pour cette durée
        const availableForDuration = moniteurIds.filter(moniteurId => {
          // Vérifier si le moniteur a déjà une leçon qui chevauche ce créneau
          const hasOverlappingLesson = plannings?.some(planning => {
            // Ne vérifier que les plannings du moniteur actuel
            if (planning.id_moniteur !== moniteurId) return false;
            
            // Convertir les heures de début et de fin en minutes
            const [startHours, startMinutes] = planning.heure_debut.split(':').map(Number);
            const [endHours, endMinutes] = planning.heure_fin.split(':').map(Number);
            
            const lessonStartMinutes = startHours * 60 + startMinutes;
            const lessonEndMinutes = endHours * 60 + endMinutes;
            
            // Vérifier si le créneau chevauche la leçon
            return (
              // Le début du créneau est pendant la leçon
              (slotMinutes >= lessonStartMinutes && slotMinutes < lessonEndMinutes) ||
              // La fin du créneau est pendant la leçon
              (slotEndMinutes > lessonStartMinutes && slotEndMinutes <= lessonEndMinutes) ||
              // Le créneau englobe complètement la leçon
              (slotMinutes <= lessonStartMinutes && slotEndMinutes >= lessonEndMinutes)
            );
          });
          
          return !hasOverlappingLesson;
        });
        
        availableTeachersByDuration[duration] = availableForDuration;
      });
      
      // Utiliser la disponibilité pour la durée de 60 minutes (standard)
      const availableTeachers = availableTeachersByDuration[60] || [];
      
      if (availableTeachers.length > 0) {
        // Convertir les disponibilités par durée en format plus lisible
        const availabilityByDuration: Record<string, number[]> = {};
        possibleDurations.forEach(duration => {
          const availableIds = availableTeachersByDuration[duration] || [];
          availabilityByDuration[`${duration}min`] = availableIds;
          
          // Ajouter des logs pour le débogage des disponibilités
          if (availableIds.length > 0 && timeSlot === '14:00') { // Limiter les logs pour éviter de surcharger la console
            const moniteurDetails = availableIds.map(id => {
              const m = moniteursMap.get(id);
              return m ? `${m.prenom} ${m.nom} (Bureau: ${m.id_bureau})` : `ID: ${id}`;
            });
            console.log(`Bureau ${id_bureau}, créneau ${timeSlot}, durée ${duration}min: ${moniteurDetails.join(', ')}`);
          }
        });
        
        availableSlots.push({
          time: timeSlot,
          availableTeachers: availableTeachers.length,
          teacherIds: availableTeachers,
          availabilityByDuration
        });
      }
    });
    
    // 4. Retourner les créneaux disponibles
    return NextResponse.json({
      date,
      availableSlots,
      moniteurs: moniteurs.reduce((acc: Record<number, { nom: string, prenom: string }>, m) => {
        acc[m.id_moniteur] = { nom: m.nom, prenom: m.prenom };
        return acc;
      }, {})
    });
    
    
  } catch (error) {
    console.error('Erreur lors de la récupération des disponibilités:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des disponibilités' },
      { status: 500 }
    );
  }
}
