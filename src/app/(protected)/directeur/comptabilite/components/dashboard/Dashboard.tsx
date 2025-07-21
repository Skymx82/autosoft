'use client';

import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiDollarSign, FiTrendingUp, FiArrowUp, FiArrowDown, FiLoader } from 'react-icons/fi';

interface Transaction {
  id_transaction: string;
  date_transaction: string;
  description_transaction: string;
  categorie_transaction: string;
  montant_transaction: number;
  type_transaction: 'recette' | 'depense';
}

interface StatistiqueFinanciere {
  montant: number;
  evolution: number;
}

interface DashboardData {
  transactionsRecentes: Transaction[];
  statistiques: {
    recettes: StatistiqueFinanciere;
    depenses: StatistiqueFinanciere;
    benefices: StatistiqueFinanciere;
  };
}

interface DashboardProps {
  id_ecole?: string;
  id_bureau?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ id_ecole: propIdEcole, id_bureau: propIdBureau }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [userInfo, setUserInfo] = useState<{ id_ecole: string; id_bureau: string }>({ id_ecole: '1', id_bureau: '0' });
  
  // Récupérer les informations utilisateur depuis le localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('autosoft_user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserInfo({
          id_ecole: propIdEcole || user.id_ecole,
          id_bureau: propIdBureau || user.id_bureau
        });
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des informations utilisateur:', err);
    }
  }, [propIdEcole, propIdBureau]);
  
  // Récupérer les données du tableau de bord
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construire l'URL avec les paramètres
        const url = `/directeur/comptabilite/components/dashboard/api?id_ecole=${userInfo.id_ecole}${userInfo.id_bureau !== '0' ? `&id_bureau=${userInfo.id_bureau}` : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des données: ${response.status}`);
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des données du tableau de bord:', err);
        setError('Impossible de charger les données du tableau de bord');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [userInfo.id_ecole, userInfo.id_bureau]);
  
  // Valeurs par défaut en cas de chargement ou d'erreur
  const recettesMoisCourant = dashboardData?.statistiques?.recettes?.montant || 0;
  const evolutionRecettes = dashboardData?.statistiques?.recettes?.evolution || 0;
  
  const depensesMoisCourant = dashboardData?.statistiques?.depenses?.montant || 0;
  const evolutionDepenses = dashboardData?.statistiques?.depenses?.evolution || 0;
  
  const beneficesMoisCourant = dashboardData?.statistiques?.benefices?.montant || 0;
  const evolutionBenefices = dashboardData?.statistiques?.benefices?.evolution || 0;
  
  const transactions = dashboardData?.transactionsRecentes || [];
  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-500 w-8 h-8 mb-4" />
        <p className="text-gray-500">Chargement des données financières...</p>
      </div>
    );
  }
  
  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tableau de bord comptabilité</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Carte de statistiques - Recettes */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Recettes (mois courant)</p>
              <p className="text-2xl font-bold text-blue-600">{recettesMoisCourant.toLocaleString('fr-FR')} €</p>
              <div className="flex items-center mt-1">
                {evolutionRecettes > 0 ? (
                  <>
                    <FiArrowUp className="text-green-500 w-3 h-3 mr-1" />
                    <span className="text-xs text-green-500">+{evolutionRecettes.toFixed(1)}% vs mois précédent</span>
                  </>
                ) : (
                  <>
                    <FiArrowDown className="text-red-500 w-3 h-3 mr-1" />
                    <span className="text-xs text-red-500">{evolutionRecettes.toFixed(1)}% vs mois précédent</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiTrendingUp className="text-blue-500 w-6 h-6" />
            </div>
          </div>
        </div>
        
        {/* Carte de statistiques - Dépenses */}
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dépenses (mois courant)</p>
              <p className="text-2xl font-bold text-red-600">{depensesMoisCourant.toLocaleString('fr-FR')} €</p>
              <div className="flex items-center mt-1">
                {evolutionDepenses > 0 ? (
                  <>
                    <FiArrowUp className="text-red-500 w-3 h-3 mr-1" />
                    <span className="text-xs text-red-500">+{evolutionDepenses.toFixed(1)}% vs mois précédent</span>
                  </>
                ) : (
                  <>
                    <FiArrowDown className="text-green-500 w-3 h-3 mr-1" />
                    <span className="text-xs text-green-500">{evolutionDepenses.toFixed(1)}% vs mois précédent</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FiDollarSign className="text-red-500 w-6 h-6" />
            </div>
          </div>
        </div>
        
        {/* Carte de statistiques - Bénéfices */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bénéfices (mois courant)</p>
              <p className="text-2xl font-bold text-green-600">{beneficesMoisCourant.toLocaleString('fr-FR')} €</p>
              <div className="flex items-center mt-1">
                {evolutionBenefices > 0 ? (
                  <>
                    <FiArrowUp className="text-green-500 w-3 h-3 mr-1" />
                    <span className="text-xs text-green-500">+{evolutionBenefices.toFixed(1)}% vs mois précédent</span>
                  </>
                ) : (
                  <>
                    <FiArrowDown className="text-red-500 w-3 h-3 mr-1" />
                    <span className="text-xs text-red-500">{evolutionBenefices.toFixed(1)}% vs mois précédent</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiBarChart2 className="text-green-500 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Graphique ou tableau récapitulatif */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Aperçu financier</h3>
        <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg bg-white">
          <p className="text-gray-500">Les graphiques seront affichés ici</p>
        </div>
      </div>
      
      {/* Transactions récentes */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Transactions récentes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id_transaction} className="hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-500">{new Date(transaction.date_transaction).toLocaleDateString('fr-FR')}</td>
                    <td className="py-2 px-4 text-sm text-gray-500">{transaction.description_transaction}</td>
                    <td className="py-2 px-4 text-sm text-gray-500">{transaction.categorie_transaction}</td>
                    <td className={`py-2 px-4 text-sm font-medium ${transaction.type_transaction === 'recette' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type_transaction === 'recette' ? '+' : '-'}{parseFloat(transaction.montant_transaction.toString()).toLocaleString('fr-FR')} €
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-gray-500 text-center">
                  <td colSpan={4} className="py-4">Aucune transaction récente</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
