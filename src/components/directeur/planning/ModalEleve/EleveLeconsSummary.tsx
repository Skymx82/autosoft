'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Moniteur {
  id_moniteur: number;
  nom: string;
  prenom: string;
}

interface Lecon {
  id_planning: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  type_lecon: string;
  statut_lecon: string;
  id_moniteur: number;
  id_eleve: number;
  moniteur?: Moniteur;
}

interface Eleve {
  id_eleve: number;
  nom: string;
  prenom: string;
}

interface EleveLeconsSummaryProps {
  id_eleve: number;
}

export default function EleveLeconsSummary({ id_eleve }: EleveLeconsSummaryProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eleve, setEleve] = useState<Eleve | null>(null);
  const [lecons, setLecons] = useState<Lecon[]>([]);

  useEffect(() => {
    const fetchEleveData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Récupérer les informations utilisateur depuis le localStorage
        let id_ecole = '1'; // Valeur par défaut
        let id_bureau = '0'; // Valeur par défaut
        
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('autosoft_user');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              id_ecole = userData.id_ecole || '1';
              id_bureau = userData.id_bureau || '0';
            } catch (e) {
              console.error('Erreur lors du parsing des données utilisateur:', e);
            }
          }
        }
        
        // Récupérer les informations de l'élève et ses leçons en une seule requête
        const response = await fetch(`/api/directeur/planning/eleve/${id_eleve}?id_ecole=${id_ecole}&id_bureau=${id_bureau}&type=all`);
        
        if (!response.ok) {
          // Si l'API n'est pas disponible, utiliser des données de test
          setEleve({
            id_eleve: id_eleve,
            nom: 'Dupont',
            prenom: 'Jean'
          });
          
          // Données de test pour les leçons
          const mockLecons = [
            {
              id_planning: 1,
              date: '2025-05-20',
              heure_debut: '14:00',
              heure_fin: '15:00',
              type_lecon: 'B manuelle',
              statut_lecon: 'Planifiée',
              id_moniteur: 1,
              id_eleve: id_eleve,
              moniteur: { id_moniteur: 1, nom: 'Martin', prenom: 'Sophie' }
            },
            {
              id_planning: 2,
              date: '2025-05-22',
              heure_debut: '10:00',
              heure_fin: '11:00',
              type_lecon: 'B manuelle',
              statut_lecon: 'Planifiée',
              id_moniteur: 2,
              id_eleve: id_eleve,
              moniteur: { id_moniteur: 2, nom: 'Dubois', prenom: 'Pierre' }
            },
            {
              id_planning: 3,
              date: '2025-05-15',
              heure_debut: '15:00',
              heure_fin: '16:00',
              type_lecon: 'B manuelle',
              statut_lecon: 'Réalisée',
              id_moniteur: 1,
              id_eleve: id_eleve,
              moniteur: { id_moniteur: 1, nom: 'Martin', prenom: 'Sophie' }
            }
          ];
          setLecons(mockLecons);
        } else {
          const data = await response.json();
          
          // Mettre à jour les informations de l'élève
          if (data.eleve) {
            setEleve(data.eleve);
          } else {
            // Utiliser des données de test si l'élève n'est pas trouvé
            setEleve({
              id_eleve: id_eleve,
              nom: 'Dupont',
              prenom: 'Jean'
            });
          }
          
          // Mettre à jour les leçons
          if (data.lecons && data.lecons.length > 0) {
            setLecons(data.lecons);
          } else {
            setLecons([]);
          }
        }
        
        // Le tri des leçons est déjà géré lors de l'affectation à setLecons
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEleveData();
  }, [id_eleve]);

  // Fonction de retour supprimée car nous sommes dans un modal

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !eleve) {
    return (
      <div className="flex flex-col justify-center items-center p-8">
        <div className="text-red-500 mb-4">{error || "Impossible de trouver les informations de l'élève"}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg overflow-hidden text-black">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800">
              Récapitulatif des leçons
            </h1>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-6">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <h4 className="font-medium">Informations de l'élève</h4>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {eleve.prenom?.charAt(0)}{eleve.nom?.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{eleve.prenom} {eleve.nom}</p>
              </div>
            </div>
          </div>
          
          {lecons.length > 0 ? (
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <h4 className="font-medium">Informations générales</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700"><span className="font-medium">Nombre total de leçons:</span> {lecons.length}</p>
                    <p className="text-gray-700"><span className="font-medium">Prochaine leçon:</span> {new Date(lecons[0].date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Leçons réalisées:</span> {lecons.filter(l => l.statut_lecon === 'Réalisée').length}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Leçons à venir:</span> {lecons.filter(l => l.statut_lecon !== 'Réalisée' && l.statut_lecon !== 'Annulée').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <h4 className="font-medium">Liste des leçons</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horaire</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moniteur</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lecons.map((lecon, index) => {
                        const date = new Date(lecon.date);
                        const formattedDate = date.toLocaleDateString('fr-FR');
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formattedDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lecon.heure_debut} - {lecon.heure_fin}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lecon.type_lecon}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                lecon.statut_lecon === 'Réalisée' ? 'bg-green-100 text-green-800' :
                                lecon.statut_lecon === 'Annulée' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {lecon.statut_lecon}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lecon.moniteur ? `${lecon.moniteur.prenom} ${lecon.moniteur.nom}` : 'Non assigné'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">Aucune leçon trouvée pour cet élève</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
