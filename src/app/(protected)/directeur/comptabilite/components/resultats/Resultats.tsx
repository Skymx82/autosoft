'use client';

import React, { useState, useEffect } from 'react';
import { FiFilter, FiDownload, FiPrinter, FiArrowUp, FiArrowDown, FiCalendar, FiLoader } from 'react-icons/fi';

interface ResultatMensuel {
  mois: string;
  annee: number;
  chiffreAffaires: number;
  charges: number;
  resultat: number;
  evolution: number; // pourcentage d'évolution par rapport au mois précédent
}

interface ResultatsProps {
  id_ecole?: string;
  id_bureau?: string;
}

// Interface pour les totaux annuels
interface TotauxAnnuels {
  chiffreAffaires: number;
  charges: number;
  resultat: number;
  tauxMarge: number;
}

const Resultats: React.FC<ResultatsProps> = ({ id_ecole: propIdEcole, id_bureau: propIdBureau }) => {
  // Vérifier si nous sommes en environnement de production
  const [isProd, setIsProd] = useState<boolean>(false);
  const [periode, setPeriode] = useState('mensuel');
  const [showFilters, setShowFilters] = useState(false);
  const [resultats, setResultats] = useState<ResultatMensuel[]>([]);
  const [totauxAnnuels, setTotauxAnnuels] = useState<TotauxAnnuels>({ 
    chiffreAffaires: 0, 
    charges: 0, 
    resultat: 0, 
    tauxMarge: 0 
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [anneeActuelle] = useState<number>(new Date().getFullYear());
  
  // Détecter l'environnement de production
  useEffect(() => {
    // Vérifier si nous sommes en production en fonction de l'URL
    const hostname = window.location.hostname;
    setIsProd(hostname.includes('autosoft.fr') || 
              hostname.includes('autosoft.com') || 
              hostname === 'autosoft-pi.vercel.app' || 
              !hostname.includes('localhost'));
  }, []);

  // Effet pour charger les données depuis l'API
  useEffect(() => {
    const fetchResultats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les informations utilisateur depuis le localStorage ou les props
        let id_ecole = propIdEcole;
        let id_bureau = propIdBureau;
        
        if (!id_ecole || !id_bureau) {
          try {
            const userData = localStorage.getItem('autosoft_user');
            if (userData) {
              const user = JSON.parse(userData);
              id_ecole = id_ecole || user.id_ecole;
              id_bureau = id_bureau || user.id_bureau;
            }
          } catch (err) {
            console.error('Erreur lors de la récupération des informations utilisateur:', err);
          }
        }
        
        // Valeurs par défaut si toujours undefined
        id_ecole = id_ecole || '1';
        id_bureau = id_bureau || '0';
        
        // Construire l'URL avec les paramètres
        const url = `/directeur/comptabilite/components/resultats/api?id_ecole=${id_ecole}&id_bureau=${id_bureau}&periode=${periode}&annee=${anneeActuelle}`;
        
        console.log(`Récupération des résultats depuis: ${url}`);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des données: ${response.status}`);
        }
        
        const data = await response.json();
        setResultats(data.resultats);
        setTotauxAnnuels(data.totauxAnnuels);
        
      } catch (error: any) {
        setError(error.message);
        console.error('Erreur lors de la récupération des résultats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResultats();
  }, [propIdEcole, propIdBureau, periode, anneeActuelle]);

  // Si nous sommes en production, afficher le message "fonctionnalité en développement"
  if (isProd) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Résultats financiers</h2>
        </div>
        
        <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-md shadow-md">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-bold text-purple-700">Fonctionnalité en développement</h3>
          </div>
          
          <p className="text-purple-700 mb-4 text-lg">
            Le module d'analyse des résultats financiers est actuellement en cours de développement et sera disponible prochainement.
          </p>
          
          <p className="text-purple-600">
            Nous travaillons activement sur cette fonctionnalité pour vous offrir une expérience complète d'analyse financière :
          </p>
          
          <ul className="mt-3 list-disc list-inside text-purple-600 space-y-1 ml-4">
            <li>Tableaux de bord financiers interactifs</li>
            <li>Analyses comparatives par périodes</li>
            <li>Graphiques d'évolution des résultats</li>
            <li>Indicateurs de performance clés</li>
            <li>Export des rapports financiers</li>
          </ul>
        </div>
      </div>
    );
  }
  
  // Sinon, afficher le composant normal (en développement local)
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Résultats financiers</h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
            title="Filtres avancés"
          >
            <FiFilter className="w-5 h-5" />
          </button>

          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
            title="Exporter"
          >
            <FiDownload className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sélecteur de période */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <FiCalendar className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Période :</span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setPeriode('mensuel')}
            className={`px-4 py-2 rounded-md ${periode === 'mensuel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setPeriode('trimestriel')}
            className={`px-4 py-2 rounded-md ${periode === 'trimestriel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Trimestriel
          </button>
          <button
            onClick={() => setPeriode('annuel')}
            className={`px-4 py-2 rounded-md ${periode === 'annuel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Annuel
          </button>
        </div>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}

      {/* Cartes de résumé */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500">Chiffre d'affaires (mois en cours)</h3>
            <p className="text-2xl font-bold text-gray-800">
              {resultats.length > 0 ? resultats[0].chiffreAffaires.toLocaleString('fr-FR') : '0'} €
            </p>
            <p className="text-xs flex items-center text-gray-500 mt-1">
              {resultats.length > 0 ? (
                <>
                  {resultats[0].evolution > 0 ? (
                    <>
                      <FiArrowUp className="text-green-500 mr-1" />
                      <span className="text-green-500">{resultats[0].evolution}%</span>
                    </>
                  ) : resultats[0].evolution < 0 ? (
                    <>
                      <FiArrowDown className="text-red-500 mr-1" />
                      <span className="text-red-500">{Math.abs(resultats[0].evolution)}%</span>
                    </>
                  ) : (
                    <span>Stable</span>
                  )}
                  <span className="ml-1">vs mois précédent</span>
                </>
              ) : (
                <span>Données non disponibles</span>
              )}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500">Charges (mois en cours)</h3>
            <p className="text-2xl font-bold text-gray-800">
              {resultats.length > 0 ? resultats[0].charges.toLocaleString('fr-FR') : '0'} €
            </p>
            <p className="text-xs flex items-center text-gray-500 mt-1">
              {resultats.length > 1 ? (
                <>
                  {resultats[0].charges > 0 && resultats[1].charges > 0 ? (
                    <>
                      {((resultats[0].charges - resultats[1].charges) / resultats[1].charges * 100) > 0 ? (
                        <>
                          <FiArrowUp className="text-red-500 mr-1" />
                          <span className="text-red-500">
                            {Math.abs((resultats[0].charges - resultats[1].charges) / resultats[1].charges * 100).toFixed(1)}%
                          </span>
                        </>
                      ) : ((resultats[0].charges - resultats[1].charges) / resultats[1].charges * 100) < 0 ? (
                        <>
                          <FiArrowDown className="text-green-500 mr-1" />
                          <span className="text-green-500">
                            {Math.abs((resultats[0].charges - resultats[1].charges) / resultats[1].charges * 100).toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <span>Stable</span>
                      )}
                      <span className="ml-1">vs mois précédent</span>
                    </>
                  ) : (
                    <span>Calcul impossible</span>
                  )}
                </>
              ) : (
                <span>Données non disponibles</span>
              )}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500">Résultat (mois en cours)</h3>
            <p className="text-2xl font-bold text-gray-800">
              {resultats.length > 0 ? resultats[0].resultat.toLocaleString('fr-FR') : '0'} €
            </p>
            <p className="text-xs flex items-center text-gray-500 mt-1">
              {resultats.length > 0 ? (
                <>
                  {resultats[0].evolution > 0 ? (
                    <>
                      <FiArrowUp className="text-green-500 mr-1" />
                      <span className="text-green-500">{resultats[0].evolution}%</span>
                    </>
                  ) : resultats[0].evolution < 0 ? (
                    <>
                      <FiArrowDown className="text-red-500 mr-1" />
                      <span className="text-red-500">{Math.abs(resultats[0].evolution)}%</span>
                    </>
                  ) : (
                    <span>Stable</span>
                  )}
                  <span className="ml-1">vs mois précédent</span>
                </>
              ) : (
                <span>Données non disponibles</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Graphique d'évolution */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Évolution des résultats</h3>
        <div className="h-80 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Le graphique d'évolution sera affiché ici</p>
        </div>
      </div>

      {/* Tableau des résultats */}
      <div className="mt-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <FiLoader className="animate-spin text-blue-600 w-8 h-8" />
              <span className="ml-2 text-gray-600">Chargement des résultats...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              <p>Erreur: {error}</p>
              <p className="text-sm mt-2">Veuillez réessayer ultérieurement ou contacter le support.</p>
            </div>
          ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chiffre d'affaires</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charges</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultat</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Évolution</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {resultats.length > 0 ? (
                resultats.map((resultat, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {resultat.mois} {resultat.annee}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {resultat.chiffreAffaires.toLocaleString('fr-FR')} €
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {resultat.charges.toLocaleString('fr-FR')} €
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {resultat.resultat.toLocaleString('fr-FR')} €
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center">
                        {resultat.evolution > 0 ? (
                          <>
                            <FiArrowUp className="text-green-500 mr-1" />
                            <span className="text-green-500">+{resultat.evolution}%</span>
                          </>
                        ) : resultat.evolution < 0 ? (
                          <>
                            <FiArrowDown className="text-red-500 mr-1" />
                            <span className="text-red-500">-{Math.abs(resultat.evolution)}%</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Stable</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800" title="Voir détails">
                          <FiPrinter className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800" title="Télécharger">
                          <FiDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    Aucun résultat enregistré
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      {!loading && !error && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de {resultats.length} résultats
          </div>
          
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
              Précédent
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
              Suivant
            </button>
          </div>
        </div>
      )}
      
      {/* Graphique ou informations supplémentaires */}
      {!loading && !error && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Résumé annuel</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Chiffre d'affaires annuel ({anneeActuelle})</p>
              <p className="text-lg font-semibold text-gray-800">
                {totauxAnnuels.chiffreAffaires.toLocaleString('fr-FR')} €
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Charges annuelles ({anneeActuelle})</p>
              <p className="text-lg font-semibold text-gray-800">
                {totauxAnnuels.charges.toLocaleString('fr-FR')} €
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Résultat annuel ({anneeActuelle})</p>
              <p className="text-lg font-semibold text-gray-800">
                {totauxAnnuels.resultat.toLocaleString('fr-FR')} €
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Taux de marge moyen</p>
            <p className="text-lg font-semibold text-gray-800">
              {totauxAnnuels.tauxMarge}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resultats;
