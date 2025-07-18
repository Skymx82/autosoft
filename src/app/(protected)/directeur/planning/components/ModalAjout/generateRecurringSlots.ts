import { FormState, RecurrencePattern, CustomTimeSlot } from './types';

interface RecurringSlot {
  date: string;
  startTime: string;
  endTime: string;
}

/**
 * Génère tous les créneaux horaires en fonction des options de récurrence
 * @param formState État du formulaire contenant les informations de base
 * @returns Un tableau de créneaux horaires (date, heure de début, heure de fin)
 */
export function generateRecurringSlots(formState: FormState): RecurringSlot[] {
  // Vérifier que formState est valide
  if (!formState) {
    console.error('formState est undefined ou null');
    return [];
  }
  
  // Vérifier que la date est valide
  if (!formState.date) {
    console.error('formState.date est undefined ou null');
    return [];
  }

  // Si pas de récurrence, retourner uniquement le créneau de base
  if (!formState.isRecurring || !formState.recurrencePattern) {
    return [{
      date: formState.date,
      startTime: formState.startTime,
      endTime: formState.endTime
    }];
  }

  const pattern = formState.recurrencePattern;
  const slots: RecurringSlot[] = [];

  // Cas des horaires personnalisés
  if (pattern.frequency === 'custom' && pattern.customTimeSlots && pattern.customTimeSlots.length > 0) {
    console.log('Génération de créneaux personnalisés:', pattern.customTimeSlots);
    return pattern.customTimeSlots.map(slot => ({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime
    }));
  }

  // Cas des récurrences régulières (hebdomadaire, bi-hebdomadaire, mensuelle)
  try {
    // Vérifier que les dates sont valides
    if (!pattern.endDate) {
      console.error('pattern.endDate est undefined ou null');
      return [{
        date: formState.date,
        startTime: formState.startTime,
        endTime: formState.endTime
      }];
    }
    
    const startDate = new Date(formState.date);
    const endDate = new Date(pattern.endDate);
    
    // Vérifier que les dates sont valides
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Dates invalides:', { startDate, endDate });
      return [{
        date: formState.date,
        startTime: formState.startTime,
        endTime: formState.endTime
      }];
    }

    // Ajouter le créneau initial
    slots.push({
      date: formState.date,
      startTime: formState.startTime,
      endTime: formState.endTime
    });

    // Si la date de fin est antérieure à la date de début, retourner uniquement le créneau initial
    if (endDate < startDate) {
      console.warn('La date de fin est antérieure à la date de début');
      return slots;
    }

    const startDayOfWeek = startDate.getDay(); // 0 = dimanche, 1 = lundi, etc.
    
    // Déterminer l'intervalle en jours selon la fréquence
    let intervalDays: number;
    switch (pattern.frequency) {
      case 'weekly':
        intervalDays = 7;
        break;
      case 'biweekly':
        intervalDays = 14;
        break;
      case 'monthly':
        intervalDays = 0; // Cas spécial traité différemment
        break;
      default:
        console.warn('Fréquence non reconnue:', pattern.frequency);
        return slots; // Ne devrait pas arriver
    }

    console.log('Génération de créneaux récurrents:', {
      frequency: pattern.frequency,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      daysOfWeek: pattern.daysOfWeek
    });

    // Pour les récurrences hebdomadaires et bi-hebdomadaires avec jours spécifiques
    if ((pattern.frequency === 'weekly' || pattern.frequency === 'biweekly') && 
        pattern.daysOfWeek && 
        pattern.daysOfWeek.length > 0) {
      
      const currentDate = new Date(startDate);
      let safetyCounter = 0; // Compteur de sécurité pour éviter les boucles infinies
      const maxIterations = 100; // Nombre maximum d'itérations
      
      // Boucle jusqu'à la date de fin
      while (currentDate <= endDate && safetyCounter < maxIterations) {
        safetyCounter++;
        
        // Pour chaque jour de la semaine sélectionné
        for (const dayOfWeek of pattern.daysOfWeek) {
          // Vérifier que le jour de la semaine est valide
          if (dayOfWeek < 0 || dayOfWeek > 6) {
            console.warn('Jour de la semaine invalide:', dayOfWeek);
            continue;
          }
          
          // Calculer le nombre de jours à ajouter pour atteindre ce jour de la semaine
          const daysToAdd = (dayOfWeek - startDayOfWeek + 7) % 7;
          
          if (daysToAdd === 0 && currentDate.getTime() === startDate.getTime()) {
            // Éviter de dupliquer le créneau initial
            continue;
          }
          
          // Créer une nouvelle date pour ce jour de la semaine
          const slotDate = new Date(currentDate);
          slotDate.setDate(currentDate.getDate() + daysToAdd);
          
          // Vérifier que cette date ne dépasse pas la date de fin
          if (slotDate <= endDate) {
            slots.push({
              date: slotDate.toISOString().split('T')[0],
              startTime: formState.startTime,
              endTime: formState.endTime
            });
          }
        }
        
        // Passer à la semaine suivante (ou deux semaines pour bi-hebdomadaire)
        currentDate.setDate(currentDate.getDate() + intervalDays);
      }
      
      if (safetyCounter >= maxIterations) {
        console.warn('Nombre maximum d\'itérations atteint pour la génération des créneaux récurrents');
      }
    } 
    // Pour les récurrences mensuelles
    else if (pattern.frequency === 'monthly') {
      const currentDate = new Date(startDate);
      const dayOfMonth = currentDate.getDate(); // Jour du mois (1-31)
      let safetyCounter = 0; // Compteur de sécurité pour éviter les boucles infinies
      const maxIterations = 36; // Maximum 3 ans (36 mois)
      
      // Passer au mois suivant
      currentDate.setMonth(currentDate.getMonth() + 1);
      
      // Boucle jusqu'à la date de fin
      while (currentDate <= endDate && safetyCounter < maxIterations) {
        safetyCounter++;
        
        try {
          // Ajuster le jour du mois (gérer les cas comme le 31 qui n'existe pas dans tous les mois)
          const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
          currentDate.setDate(Math.min(dayOfMonth, daysInMonth));
          
          slots.push({
            date: currentDate.toISOString().split('T')[0],
            startTime: formState.startTime,
            endTime: formState.endTime
          });
          
          // Passer au mois suivant
          currentDate.setMonth(currentDate.getMonth() + 1);
        } catch (error) {
          console.error('Erreur lors de la génération d\'un créneau mensuel:', error);
          // Passer au mois suivant malgré l'erreur
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }
      
      if (safetyCounter >= maxIterations) {
        console.warn('Nombre maximum d\'itérations atteint pour la génération des créneaux mensuels');
      }
    }
    // Pour les récurrences hebdomadaires et bi-hebdomadaires sans jours spécifiques
    else if (pattern.frequency === 'weekly' || pattern.frequency === 'biweekly') {
      const currentDate = new Date(startDate);
      let safetyCounter = 0; // Compteur de sécurité pour éviter les boucles infinies
      const maxIterations = 52; // Maximum 1 an (52 semaines)
      
      // Passer à la période suivante
      currentDate.setDate(currentDate.getDate() + intervalDays);
      
      // Boucle jusqu'à la date de fin
      while (currentDate <= endDate && safetyCounter < maxIterations) {
        safetyCounter++;
        
        slots.push({
          date: currentDate.toISOString().split('T')[0],
          startTime: formState.startTime,
          endTime: formState.endTime
        });
        
        // Passer à la période suivante
        currentDate.setDate(currentDate.getDate() + intervalDays);
      }
      
      if (safetyCounter >= maxIterations) {
        console.warn('Nombre maximum d\'itérations atteint pour la génération des créneaux hebdomadaires');
      }
    }
  } catch (error) {
    console.error('Erreur lors de la génération des créneaux récurrents:', error);
    // En cas d'erreur, retourner uniquement le créneau initial
    return [{
      date: formState.date,
      startTime: formState.startTime,
      endTime: formState.endTime
    }];
  }

  return slots;
}

/**
 * Obtient le nombre de jours dans un mois donné
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
