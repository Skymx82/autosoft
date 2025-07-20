'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiSun, FiCloudRain, FiCloud, FiWind } from 'react-icons/fi';
import { MdDirectionsCar, MdAcUnit } from 'react-icons/md';
import { TbRoad } from 'react-icons/tb';

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

interface StatistiquesMoniteur {
  tauxReussite: number;
  heuresMois: number;
  elevesSuivis: number;
}

interface JourneeApercuProps {
  lecons: Lecon[];
  isLoading: boolean;
}

export default function JourneeApercu({ lecons, isLoading }: JourneeApercuProps) {
  const [stats, setStats] = useState<StatistiquesMoniteur | null>(null);
  const [tempsRestant, setTempsRestant] = useState<string>('');
  const [chargeJournee, setChargeJournee] = useState<'léger' | 'moyen' | 'chargé'>('moyen');
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  
  // Récupérer les statistiques du moniteur (simulation)
  useEffect(() => {
    // Simuler un appel API pour les statistiques
    setTimeout(() => {
      // Données fictives pour la démo
      setStats({
        tauxReussite: 85,
        heuresMois: 78,
        elevesSuivis: 24
      });
      setStatsLoading(false);
    }, 800);
  }, []);

  // Calculer la charge de la journée en fonction du nombre de leçons
  useEffect(() => {
    if (lecons.length <= 3) {
      setChargeJournee('léger');
    } else if (lecons.length <= 6) {
      setChargeJournee('moyen');
    } else {
      setChargeJournee('chargé');
    }
  }, [lecons]);

  // Trouver la prochaine leçon
  const prochaineLecon = lecons.find(lecon => lecon.statut === 'à venir');

  // Calculer le temps restant avant la prochaine leçon
  useEffect(() => {
    if (!prochaineLecon) return;
    
    const calculerTempsRestant = () => {
      const maintenant = new Date();
      const [heures, minutes] = prochaineLecon.heure_debut.split(':').map(Number);
      
      const heureLecon = new Date();
      heureLecon.setHours(heures, minutes, 0);
      
      // Si l'heure de la leçon est déjà passée, ne pas afficher de compte à rebours
      if (heureLecon <= maintenant) {
        setTempsRestant('Imminente');
        return;
      }
      
      const diffMs = heureLecon.getTime() - maintenant.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const heuresRestantes = Math.floor(diffMinutes / 60);
      const minutesRestantes = diffMinutes % 60;
      
      if (heuresRestantes > 0) {
        setTempsRestant(`${heuresRestantes}h ${minutesRestantes}min`);
      } else {
        setTempsRestant(`${minutesRestantes} min`);
      }
    };
    
    calculerTempsRestant();
    const intervalId = setInterval(calculerTempsRestant, 60000); // Mise à jour chaque minute
    
    return () => clearInterval(intervalId);
  }, [prochaineLecon]);

  // Obtenir la répartition des leçons par type
  const leconParType: Record<string, number> = {};
  lecons.forEach(lecon => {
    if (leconParType[lecon.type_lecon]) {
      leconParType[lecon.type_lecon]++;
    } else {
      leconParType[lecon.type_lecon] = 1;
    }
  });

  // Obtenir l'icône pour les statistiques
  const getStatsIcon = (type: 'reussite' | 'heures' | 'eleves') => {
    switch (type) {
      case 'reussite':
        return <FiCalendar className="h-6 w-6 text-green-600" />;
      case 'heures':
        return <FiClock className="h-6 w-6 text-blue-600" />;
      case 'eleves':
        return <MdDirectionsCar className="h-6 w-6 text-purple-600" />;
      default:
        return <FiCalendar className="h-6 w-6 text-blue-600" />;
    }
  };

  // Couleur pour l'indicateur de charge
  const getChargeColor = () => {
    switch (chargeJournee) {
      case 'léger':
        return 'bg-blue-50 text-blue-600';
      case 'moyen':
        return 'bg-yellow-50 text-yellow-600';
      case 'chargé':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div className="h-24 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <span className="p-1 mr-2">
            <FiCalendar className="h-5 w-5 text-gray-600" />
          </span>
          Vue rapide de la journée
        </h2>
        
        <div className="grid grid-cols-2 gap-4">

          
          {/* Heures ce mois */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Heures ce mois</h3>
                <p className="text-lg font-medium text-gray-900">
                  {statsLoading ? '--' : `${stats?.heuresMois}h`}
                </p>
                <p className="text-xs text-gray-500">
                  {statsLoading ? 'Chargement...' : 'Sur 120h max'}
                </p>
              </div>
              <div className="flex-shrink-0 p-3">
                {getStatsIcon('heures')}
              </div>
            </div>
          </div>
          
          {/* Compteur de leçons */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Leçons aujourd'hui</h3>
            <p className="text-lg font-medium text-gray-900">{lecons.length}</p>
            <div className="mt-1 text-xs text-gray-500">
              {Object.entries(leconParType).map(([type, count], index) => (
                <span key={type} className={index > 0 ? 'ml-2' : ''}>
                  {count} {type}
                </span>
              ))}
            </div>
          </div>
          
          {/* Prochaine leçon */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Prochaine leçon</h3>
            {prochaineLecon ? (
              <div className="flex justify-between items-center mt-1">
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {prochaineLecon.eleve.prenom} {prochaineLecon.eleve.nom}
                  </p>
                  <p className="text-xs text-gray-500">
                    {prochaineLecon.heure_debut} - {prochaineLecon.type_lecon}
                  </p>
                </div>
                <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center">
                  <FiClock className="mr-1 h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">{tempsRestant}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Aucune leçon à venir aujourd'hui</p>
            )}
          </div>
          
          {/* Indicateur de charge de travail */}
          <div className="col-span-2 flex items-center bg-gray-50 px-5 py-3 rounded-lg">
            <div className="mr-2 text-sm text-gray-500">Charge de travail:</div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getChargeColor()}`}>
              {chargeJournee.charAt(0).toUpperCase() + chargeJournee.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
