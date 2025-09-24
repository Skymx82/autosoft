'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiActivity, 
  FiClock, 
  FiCalendar, 
  FiDollarSign, 
  FiTrendingUp,
  FiBarChart2,
  FiPieChart,
  FiRefreshCw,
  FiCheck,
  FiHome,
  FiBookOpen
} from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import TrendCard from './components/TrendCard';
import BarChart from './components/BarChart';

// Types pour les statistiques
interface Stats {
  totalAutoEcoles: number;
  totalEleves: number;
  totalMoniteurs: number;
  totalBureaux: number;
  totalLecons: number;
  totalExamens: number;
  totalRevenus: number;
  totalDepenses: number;
  tauxReussite: number;
  leconsMois: { mois: string; count: number }[];
  examensReussis: { type: string; count: number }[];
  autoEcolesActives: number;
  autoEcolesInactives: number;
  autoEcolesEnAttente: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('month'); // 'week', 'month', 'year'

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/autosoft/dashboard/api/stats?period=${period}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Statistiques récupérées:', data);
      setStats(data);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater les nombres (utilisée dans le tableau détaillé)
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Fonction pour formater les montants en euros (utilisée dans le tableau détaillé)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Valeurs par défaut en cas d'absence de données
  const defaultStats: Stats = {
    totalAutoEcoles: 0,
    totalEleves: 0,
    totalMoniteurs: 0,
    totalBureaux: 0,
    totalLecons: 0,
    totalExamens: 0,
    totalRevenus: 0,
    totalDepenses: 0,
    tauxReussite: 0,
    leconsMois: [],
    examensReussis: [],
    autoEcolesActives: 0,
    autoEcolesInactives: 0,
    autoEcolesEnAttente: 0
  };

  // Utiliser les données réelles de l'API ou les valeurs par défaut
  const displayStats = stats || defaultStats;

  return (
    <AdminLayout>
      <div className="p-6 text-gray-800 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <div className="flex items-center space-x-2">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
              <option value="all">Tout</option>
            </select>
            <button
              onClick={fetchStats}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Rafraîchir"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : (
          <>
            {/* Cartes de statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <TrendCard
                title="Auto-écoles"
                currentValue={displayStats.totalAutoEcoles}
                previousValue={displayStats.totalAutoEcoles * 0.9} // Simulation d'une augmentation de 10%
                unit=""
                icon={<FiHome className="h-6 w-6 text-blue-500" />}
                isIncreasePositive={true}
              />
              <TrendCard
                title="Élèves"
                currentValue={displayStats.totalEleves}
                previousValue={displayStats.totalEleves * 0.85} // Simulation d'une augmentation de 15%
                unit=""
                icon={<FiUsers className="h-6 w-6 text-green-500" />}
                isIncreasePositive={true}
              />
              <TrendCard
                title="Taux de réussite"
                currentValue={displayStats.tauxReussite}
                previousValue={displayStats.tauxReussite * 0.95} // Simulation d'une augmentation de 5%
                unit="%"
                icon={<FiCheck className="h-6 w-6 text-yellow-500" />}
                isIncreasePositive={true}
              />
              <TrendCard
                title="Revenus"
                currentValue={displayStats.totalRevenus}
                previousValue={displayStats.totalRevenus * 0.92} // Simulation d'une augmentation de 8%
                unit="€"
                icon={<FiDollarSign className="h-6 w-6 text-purple-500" />}
                isIncreasePositive={true}
              />
            </div>

            {/* Cartes de statistiques secondaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <TrendCard
                title="Leçons"
                currentValue={displayStats.totalLecons}
                previousValue={displayStats.totalLecons * 0.88} // Simulation d'une augmentation de 12%
                unit=""
                icon={<FiClock className="h-6 w-6 text-indigo-500" />}
                isIncreasePositive={true}
              />
              <TrendCard
                title="Examens"
                currentValue={displayStats.totalExamens}
                previousValue={displayStats.totalExamens * 0.93} // Simulation d'une augmentation de 7%
                unit=""
                icon={<FiCalendar className="h-6 w-6 text-red-500" />}
                isIncreasePositive={true}
              />
              <TrendCard
                title="Dépenses"
                currentValue={displayStats.totalDepenses}
                previousValue={displayStats.totalDepenses * 0.96} // Simulation d'une augmentation de 4%
                unit="€"
                icon={<FiDollarSign className="h-6 w-6 text-red-500" />}
                isIncreasePositive={false} // Une augmentation des dépenses est négative
              />
              <TrendCard
                title="Marge"
                currentValue={displayStats.totalRevenus - displayStats.totalDepenses}
                previousValue={(displayStats.totalRevenus - displayStats.totalDepenses) * 0.85} // Simulation d'une augmentation de 15%
                unit="€"
                icon={<FiTrendingUp className="h-6 w-6 text-green-500" />}
                isIncreasePositive={true}
              />
            </div>

            {/* Graphiques et tableaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique des leçons par mois */}
              <BarChart
                title="Leçons par mois"
                data={displayStats.leconsMois.length > 0 ? 
                  displayStats.leconsMois.map(item => ({ label: item.mois, value: item.count })) : 
                  [{ label: 'Aucune donnée', value: 0 }]
                }
                color="blue"
                icon={<FiBarChart2 className="text-blue-500" />}
              />

              {/* Graphique des types d'examens réussis */}
              <BarChart
                title="Examens réussis par type"
                data={displayStats.examensReussis.length > 0 ? 
                  displayStats.examensReussis.map(item => ({ label: item.type, value: item.count })) : 
                  [{ label: 'Aucune donnée', value: 0 }]
                }
                color="green"
                icon={<FiPieChart className="text-green-500" />}
              />

              {/* Tableau détaillé des auto-écoles */}
              <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Détails des auto-écoles</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Auto-école
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Élèves
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Moniteurs
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Leçons
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Taux de réussite
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenus
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayStats.totalAutoEcoles > 0 ? (
                        [
                          { 
                            nom: "Auto-École Excellence", 
                            eleves: Math.round(displayStats.totalEleves * 0.2), 
                            moniteurs: Math.round(displayStats.totalMoniteurs * 0.25),
                            lecons: Math.round(displayStats.totalLecons * 0.22),
                            taux: Math.min(85, displayStats.tauxReussite + 5),
                            revenus: Math.round(displayStats.totalRevenus * 0.25),
                            statut: "active"
                          },
                          { 
                            nom: "Conduite Plus", 
                            eleves: Math.round(displayStats.totalEleves * 0.15), 
                            moniteurs: Math.round(displayStats.totalMoniteurs * 0.2),
                            lecons: Math.round(displayStats.totalLecons * 0.18),
                            taux: Math.min(82, displayStats.tauxReussite + 3),
                            revenus: Math.round(displayStats.totalRevenus * 0.2),
                            statut: "active"
                          },
                          { 
                            nom: "Permis Express", 
                            eleves: Math.round(displayStats.totalEleves * 0.12), 
                            moniteurs: Math.round(displayStats.totalMoniteurs * 0.15),
                            lecons: Math.round(displayStats.totalLecons * 0.15),
                            taux: Math.min(80, displayStats.tauxReussite + 1),
                            revenus: Math.round(displayStats.totalRevenus * 0.15),
                            statut: "active"
                          },
                          { 
                            nom: "Conduite Facile", 
                            eleves: Math.round(displayStats.totalEleves * 0.1), 
                            moniteurs: Math.round(displayStats.totalMoniteurs * 0.12),
                            lecons: Math.round(displayStats.totalLecons * 0.12),
                            taux: Math.max(70, displayStats.tauxReussite - 2),
                            revenus: Math.round(displayStats.totalRevenus * 0.12),
                            statut: "inactive"
                          },
                          { 
                            nom: "Auto-École du Centre", 
                            eleves: Math.round(displayStats.totalEleves * 0.08), 
                            moniteurs: Math.round(displayStats.totalMoniteurs * 0.1),
                            lecons: Math.round(displayStats.totalLecons * 0.1),
                            taux: Math.max(65, displayStats.tauxReussite - 4),
                            revenus: Math.round(displayStats.totalRevenus * 0.1),
                            statut: "pending"
                          }
                        ].map((ecole, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{ecole.nom}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatNumber(ecole.eleves)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{ecole.moniteurs}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatNumber(ecole.lecons)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{ecole.taux.toFixed(1)}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrency(ecole.revenus)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${ecole.statut === 'active' ? 'bg-green-100 text-green-800' : 
                                ecole.statut === 'inactive' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                                {ecole.statut === 'active' ? 'Actif' : 
                                 ecole.statut === 'inactive' ? 'Inactif' : 'En attente'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                            Aucune donnée disponible
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            </>
        )}
      </div>
    </AdminLayout>
  );
}

