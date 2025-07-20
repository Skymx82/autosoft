'use client';

import { useState } from 'react';
import { FiClock, FiMapPin, FiUser, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
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

interface ListeLeconsProps {
  lecons: Lecon[];
  isLoading: boolean;
}

export default function ListeLecons({ lecons, isLoading }: ListeLeconsProps) {
  const [filtreStatut, setFiltreStatut] = useState<string>('tous');
  
  // Filtrer les leçons par statut
  const leconsFiltrees = filtreStatut === 'tous' 
    ? lecons 
    : lecons.filter(lecon => lecon.statut === filtreStatut);
  
  // Obtenir l'icône pour le type de leçon
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'conduite':
        return <MdDirectionsCar className="h-5 w-5 text-blue-600" />;
      case 'code':
        return <TbRoad className="h-5 w-5 text-purple-600" />;
      default:
        return <FiUser className="h-5 w-5 text-gray-600" />;
    }
  };
  
  // Obtenir la couleur pour le statut
  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'à venir':
        return 'bg-blue-50 text-blue-600';
      case 'en cours':
        return 'bg-green-50 text-green-600';
      case 'terminée':
        return 'bg-gray-50 text-gray-600';
      case 'annulée':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };
  
  // Formater l'heure pour affichage
  const formaterHeure = (heure: string) => {
    return heure;
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h2 className="font-semibold text-lg p-4 border-b">Vos leçons</h2>
        <div className="p-8 text-center">
          <div className="animate-pulse flex justify-center">
            <div className="h-6 w-6 bg-blue-200 rounded-full"></div>
          </div>
          <p className="mt-2 text-gray-500">Chargement des leçons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold text-lg">Vos leçons</h2>
        
        {/* Filtres */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setFiltreStatut('tous')}
            className={`px-3 py-1 text-sm rounded-full ${
              filtreStatut === 'tous' 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Toutes
          </button>
          <button 
            onClick={() => setFiltreStatut('à venir')}
            className={`px-3 py-1 text-sm rounded-full ${
              filtreStatut === 'à venir' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            À venir
          </button>
          <button 
            onClick={() => setFiltreStatut('en cours')}
            className={`px-3 py-1 text-sm rounded-full ${
              filtreStatut === 'en cours' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            En cours
          </button>
        </div>
      </div>
      
      {leconsFiltrees.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Aucune leçon {filtreStatut !== 'tous' ? `${filtreStatut}` : ''} aujourd'hui</p>
        </div>
      ) : (
        <div className="divide-y">
          {leconsFiltrees.map((lecon) => (
            <div key={lecon.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3">
                    {getTypeIcon(lecon.type_lecon)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {lecon.eleve.prenom} {lecon.eleve.nom}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <FiClock className="mr-1 h-4 w-4" />
                      <span className="mr-3">{formaterHeure(lecon.heure_debut)} - {formaterHeure(lecon.heure_fin)}</span>
                      <FiMapPin className="mr-1 h-4 w-4" />
                      <span>{lecon.lieu_rdv}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatutStyle(lecon.statut)}`}>
                    {lecon.statut}
                  </span>
                  <div className="ml-4 flex space-x-2">
                    {lecon.statut === 'à venir' && (
                      <>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded-full">
                          <FiCheckCircle className="h-5 w-5" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded-full">
                          <FiXCircle className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
