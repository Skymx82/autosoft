'use client';

import { useState, useEffect } from 'react';
import MoniteurLayout from '@/components/layout/MoniteurLayout';
import { FiClock, FiUser, FiMapPin, FiCheck } from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import JourneeApercu from './components/JourneeApercu';
import ListeLecons from './components/ListeLecons';

// Types pour les données
interface Lecon {
  id: number;
  heure_debut: string;
  heure_fin: string;
  eleve: {
    id: number;
    nom: string;
    prenom: string;
    photo?: string;
  };
  type_lecon: string;
  lieu_rdv: string;
  statut: 'à venir' | 'en cours' | 'terminée' | 'annulée';
}

export default function AujourdhuiPage() {
  const [lecons, setLecons] = useState<Lecon[]>([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Formater la date pour l'affichage
  const dateFormatee = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);

  // Récupérer les leçons du jour (simulation)
  useEffect(() => {
    // Simuler un appel API
    setTimeout(() => {
      // Données fictives pour la démo
      const leconsDemo: Lecon[] = [
        {
          id: 1,
          heure_debut: '08:00',
          heure_fin: '09:00',
          eleve: { id: 101, nom: 'Dupont', prenom: 'Marie' },
          type_lecon: 'Conduite',
          lieu_rdv: 'Bureau principal',
          statut: 'terminée'
        },
        {
          id: 2,
          heure_debut: '10:00',
          heure_fin: '11:00',
          eleve: { id: 102, nom: 'Martin', prenom: 'Lucas' },
          type_lecon: 'Conduite',
          lieu_rdv: 'Place de la République',
          statut: 'en cours'
        },
        {
          id: 3,
          heure_debut: '14:00',
          heure_fin: '15:00',
          eleve: { id: 103, nom: 'Bernard', prenom: 'Sophie' },
          type_lecon: 'Perfectionnement',
          lieu_rdv: 'Bureau principal',
          statut: 'à venir'
        },
        {
          id: 4,
          heure_debut: '16:00',
          heure_fin: '17:00',
          eleve: { id: 104, nom: 'Petit', prenom: 'Thomas' },
          type_lecon: 'Examen blanc',
          lieu_rdv: 'Centre d\'examen',
          statut: 'à venir'
        }
      ];
      
      setLecons(leconsDemo);
      setIsLoading(false);
    }, 800);
  }, []);

  // Obtenir l'heure actuelle pour mettre en évidence la leçon en cours
  const maintenant = new Date();
  const heureActuelle = maintenant.getHours();
  const minutesActuelles = maintenant.getMinutes();

  return (
    <MoniteurLayout>
      <div className="space-y-4 text-gray-800">
        
        {/* Vue rapide de la journée */}
        <JourneeApercu lecons={lecons} isLoading={isLoading} />
        
        {/* Liste des leçons */}
        <ListeLecons lecons={lecons} isLoading={isLoading} />
      </div>
    </MoniteurLayout>
  );
}
