'use client';

import React, { useState, useEffect } from 'react';
import { FiFilter, FiDownload, FiCalendar, FiInfo, FiLoader, FiRefreshCw } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Cache pour stocker les données du chiffre d'affaires
const CACHE_KEY = 'autosoft_chiffre_affaires_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

interface CategorieCA {
  nom: string;
  montantHT: number;
  tauxTVA: number;
  montantTVA: number;
  montantTTC: number;
  pourcentage: number;
}

interface DonneeGraphique {
  mois: string;
  montant: number;
  annee: number;
}

interface ChiffreAffairesProps {
  id_ecole?: string;
  id_bureau?: string;
}

interface CacheData {
  categories: CategorieCA[];
  graphique: DonneeGraphique[];
  statistiques: any;
  timestamp: number;
  id_ecole: string;
  id_bureau: string;
  periode: string;
  annee: number;
}

const ChiffreAffaires: React.FC<ChiffreAffairesProps> = ({ id_ecole: propIdEcole, id_bureau: propIdBureau }) => {
  const [periode, setPeriode] = useState('mensuel');
  const [showFilters, setShowFilters] = useState(false);
  const [anneeSelectionnee, setAnneeSelectionnee] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les données récupérées depuis l'API
  const [categoriesCA, setCategoriesCA] = useState<CategorieCA[]>([]);
  const [donneesGraphique, setDonneesGraphique] = useState<DonneeGraphique[]>([]);
  const [statistiques, setStatistiques] = useState({ totalHT: 0, totalTVA: 0, totalTTC: 0 });
  
  // Récupérer les informations utilisateur depuis le localStorage ou les props
  const getUserInfo = () => {
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
    
    return { id_ecole, id_bureau };
  };
  
  // Fonction pour récupérer les données du chiffre d'affaires
  const fetchChiffreAffaires = async (forceRefresh: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupérer les identifiants
      const { id_ecole, id_bureau } = getUserInfo();
      
      if (!id_ecole) {
        setError("ID de l'école non disponible");
        setLoading(false);
        return;
      }
      
      // Vérifier si des données en cache existent et sont valides (sauf si forceRefresh)
      if (!forceRefresh) {
        const cachedDataStr = localStorage.getItem(CACHE_KEY);
        if (cachedDataStr) {
          try {
            const cachedData: CacheData = JSON.parse(cachedDataStr);
            const now = Date.now();
            
            // Vérifier si le cache est valide (même école/bureau/période/année et pas expiré)
            if (
              cachedData.id_ecole === id_ecole &&
              cachedData.id_bureau === id_bureau &&
              cachedData.periode === periode &&
              cachedData.annee === anneeSelectionnee &&
              (now - cachedData.timestamp) < CACHE_DURATION
            ) {
              console.log('📦 Utilisation des données en cache (chiffre d\'affaires)');
              setCategoriesCA(cachedData.categories);
              setDonneesGraphique(cachedData.graphique);
              setStatistiques(cachedData.statistiques);
              setLoading(false);
              return; // Sortir de la fonction, pas besoin de fetch
            } else {
              console.log('🔄 Cache expiré ou paramètres différents, récupération des nouvelles données');
            }
          } catch (err) {
            console.error('Erreur lors de la lecture du cache:', err);
            // Continuer avec le fetch normal si erreur de lecture du cache
          }
        }
      }
      
      // Construire l'URL avec les paramètres
      const url = `/directeur/comptabilite/components/chiffre-affaires/api?id_ecole=${id_ecole}&id_bureau=${id_bureau}&periode=${periode}&annee=${anneeSelectionnee}`;
      
      console.log(`🌐 Fetching chiffre d'affaires data from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mettre à jour les états avec les données de l'API
      console.log('Données reçues de l\'API:', data);
      console.log('Données graphique:', data.graphique);
      
      setCategoriesCA(data.categories);
      setDonneesGraphique(data.graphique);
      setStatistiques(data.statistiques);
      
      // Sauvegarder les données dans le cache
      const cacheData: CacheData = {
        categories: data.categories,
        graphique: data.graphique,
        statistiques: data.statistiques,
        timestamp: Date.now(),
        id_ecole: id_ecole,
        id_bureau: id_bureau,
        periode: periode,
        annee: anneeSelectionnee
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 Données sauvegardées en cache (chiffre d\'affaires)');
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération du chiffre d\'affaires:', err);
      setError('Impossible de charger les données du chiffre d\'affaires');
      setLoading(false);
    }
  };
  
  // Appeler l'API lorsque les dépendances changent
  useEffect(() => {
    fetchChiffreAffaires();
  }, [propIdEcole, propIdBureau, periode, anneeSelectionnee]);
  
  // Extraire les totaux des statistiques
  const { totalHT, totalTVA, totalTTC } = statistiques;
  
  // Afficher un spinner pendant le chargement
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-500 w-8 h-8 mb-4" />
        <p className="text-gray-500">Chargement du chiffre d'affaires...</p>
      </div>
    );
  }
  
  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => fetchChiffreAffaires()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <FiRefreshCw className="mr-2" /> Réessayer
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Chiffre d'affaires</h2>
        
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Toutes les catégories</option>
                <option value="formation">Formation</option>
                <option value="examen">Examen</option>
                <option value="vente">Vente de produits</option>
                <option value="autres">Autres</option>
              </select>
            </div>
            
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
      
      {/* Graphique du chiffre d'affaires */}
      <div className="mb-8">
        <div className="border border-gray-200 rounded-lg bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Évolution du chiffre d'affaires {periode === 'mensuel' ? 'mensuel' : periode === 'trimestriel' ? 'trimestriel' : 'annuel'}</h3>
            <div className="flex items-center">
              {periode === 'mensuel' && (
                <select 
                  className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm"
                  value={anneeSelectionnee}
                  onChange={(e) => setAnneeSelectionnee(parseInt(e.target.value))}
                >
                  <option value={anneeSelectionnee - 2}>{anneeSelectionnee - 2}</option>
                  <option value={anneeSelectionnee - 1}>{anneeSelectionnee - 1}</option>
                  <option value={anneeSelectionnee}>{anneeSelectionnee}</option>
                </select>
              )}
              <button className="ml-2 p-1 text-gray-500 hover:text-gray-700" title="Informations sur le graphique">
                <FiInfo className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="h-64">
            {donneesGraphique && donneesGraphique.length > 0 ? (
              <Bar 
                data={{
                  labels: donneesGraphique.map(item => item.mois),
                  datasets: [
                    {
                      label: 'Chiffre d\'affaires',
                      data: donneesGraphique.map(item => item.montant || 0),
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                      borderColor: 'rgb(53, 162, 235)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${context.parsed.y.toLocaleString('fr-FR')} €`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return value + ' €';
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">Aucune donnée disponible pour cette période</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-500 text-center">
            Total {periode === 'mensuel' ? 'annuel' : periode === 'trimestriel' ? 'annuel' : 'sur 3 ans'}: 
            <span className="font-medium ml-1">
              {donneesGraphique && donneesGraphique.length > 0 
                ? donneesGraphique.reduce((sum, item) => sum + (item.montant || 0), 0).toLocaleString('fr-FR') 
                : '0'} €
            </span>
          </div>
        </div>
      </div>
      
      {/* Tableau récapitulatif */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Récapitulatif par catégorie</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Catégorie</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Montant HT</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">TVA</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Montant TTC</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">% du CA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categoriesCA.map((categorie, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-500">{categorie.nom}</td>
                  <td className="py-4 px-4 text-sm text-gray-500 text-right">{categorie.montantHT.toLocaleString('fr-FR')} €</td>
                  <td className="py-4 px-4 text-sm text-gray-500 text-right">{categorie.montantTVA.toLocaleString('fr-FR')} €</td>
                  <td className="py-4 px-4 text-sm text-gray-500 text-right">{categorie.montantTTC.toLocaleString('fr-FR')} €</td>
                  <td className="py-4 px-4 text-sm text-gray-500 text-right">{categorie.pourcentage.toFixed(2)}%</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td className="py-4 px-4 text-sm text-gray-700">Total</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">{totalHT.toLocaleString('fr-FR')} €</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">{totalTVA.toLocaleString('fr-FR')} €</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">{totalTTC.toLocaleString('fr-FR')} €</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChiffreAffaires;
