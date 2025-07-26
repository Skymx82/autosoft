'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiFilter, FiDownload, FiEye, FiEdit, FiTrash2, FiFileText, FiCheck, FiX, FiLoader, FiAlertTriangle } from 'react-icons/fi';

interface Eleve {
  nom: string;
  prenom: string;
}

interface Devis {
  id_devis: string;
  numero_devis: string;
  date_creation: string;
  date_expiration: string;
  id_eleve: string;
  eleves: Eleve;
  montant_ht: number;
  taux_tva: number;
  montant_tva: number;
  montant_ttc: number;
  statut: string;
  description: string;
}

interface Contrat {
  id_contrat: string;
  numero_contrat: string;
  date_debut: string;
  date_fin: string;
  id_eleve: string;
  eleves: Eleve;
  montant_ht: number;
  taux_tva: number;
  montant_tva: number;
  montant_ttc: number;
  statut: string;
  description: string;
}

interface StatistiquesDevis {
  nombre: {
    total: number;
    enAttente: number;
    acceptes: number;
    refuses: number;
    expires: number;
  };
  montants: {
    total: number;
    enAttente: number;
    acceptes: number;
  };
  tauxConversion: number;
}

interface StatistiquesContrats {
  nombre: {
    total: number;
    actifs: number;
    termines: number;
    resilies: number;
  };
  montants: {
    total: number;
    actifs: number;
  };
  dureeMoyenne: number;
}

interface ApiResponse {
  devis: Devis[];
  contrats: Contrat[];
  pagination: {
    page: number;
    limit: number;
    totalDevis: number;
    totalContrats: number;
    totalPages: number;
  };
  statistiques: {
    devis: StatistiquesDevis;
    contrats: StatistiquesContrats;
  };
}

interface DevisContratsProps {
  id_ecole?: string;
  id_bureau?: string;
}

const DevisContrats: React.FC<DevisContratsProps> = ({ id_ecole: propIdEcole, id_bureau: propIdBureau }) => {
  // États
  const [activeTab, setActiveTab] = useState<'devis' | 'contrats'>('devis');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Récupération des données
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Récupération des informations utilisateur depuis le localStorage ou les props
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

      // Construction de l'URL avec les paramètres
      const url = `/directeur/comptabilite/components/devis-contrats/api?type=${activeTab}&page=${page}&limit=${limit}&id_ecole=${id_ecole}&id_bureau=${id_bureau}`;
      
      console.log(`Fetching devis-contrats data from: ${url}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des données: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la récupération des données');
      console.error('Erreur lors de la récupération des données:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour réessayer en cas d'erreur
  const handleRetry = () => {
    fetchData();
  };

  // Chargement initial et lors des changements d'onglet, page, etc.
  useEffect(() => {
    fetchData();
  }, [activeTab, page, limit]);

  // Changement d'onglet
  const handleTabChange = (tab: 'devis' | 'contrats') => {
    setActiveTab(tab);
    setPage(1); // Réinitialiser la page lors du changement d'onglet
  };

  // Pagination
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = data?.pagination?.totalPages || 1;
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Données à afficher (depuis l'API ou vides si en chargement)
  const devisData = data?.devis || [];
  const contratsData = data?.contrats || [];

  // Statistiques
  const statsDevis = data?.statistiques?.devis || {
    nombre: { total: 0, enAttente: 0, acceptes: 0, refuses: 0, expires: 0 },
    montants: { total: 0, enAttente: 0, acceptes: 0 },
    tauxConversion: 0
  };
  
  const statsContrats = data?.statistiques?.contrats || {
    nombre: { total: 0, actifs: 0, termines: 0, resilies: 0 },
    montants: { total: 0, actifs: 0 },
    dureeMoyenne: 0
  };
  
  // Pagination
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    totalDevis: 0,
    totalContrats: 0,
    totalPages: 0
  };
  
  // État déjà défini plus haut

  // Afficher un spinner pendant le chargement
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-500 w-8 h-8 mb-4" />
        <p className="text-gray-500">Chargement des devis et contrats...</p>
      </div>
    );
  }
  
  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64">
        <FiAlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-gray-800">
      
      {!isLoading && !error && (
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Devis et Contrats</h2>
        
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
          
          <button 
            className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none flex items-center"
          >
            <FiPlus className="w-5 h-5 mr-1" />
            <span>Créer {activeTab === 'devis' ? 'un devis' : 'un contrat'}</span>
          </button>
        </div>
      </div>
      )}
      
      {/* Sous-onglets */}
      <div className="border-b mb-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleTabChange('devis')}
            className={`px-4 py-2 rounded-md ${activeTab === 'devis' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Devis
          </button>
          <button
            onClick={() => handleTabChange('contrats')}
            className={`px-4 py-2 rounded-md ${activeTab === 'contrats' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Contrats
          </button>
        </div>
      </div>

      
      {/* Filtres avancés */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les statuts</option>
                {activeTab === 'devis' ? (
                  <>
                    <option value="en_attente">En attente</option>
                    <option value="accepte">Accepté</option>
                    <option value="refuse">Refusé</option>
                    <option value="expire">Expiré</option>
                  </>
                ) : (
                  <>
                    <option value="actif">Actif</option>
                    <option value="termine">Terminé</option>
                    <option value="resilie">Résilié</option>
                  </>
                )}
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input 
                type="text" 
                placeholder="Nom du client"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant minimum</label>
              <input 
                type="number" 
                placeholder="0,00 €"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant maximum</label>
              <input 
                type="number" 
                placeholder="0,00 €"
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
      
      {/* Tableau des devis ou contrats */}
      {activeTab === 'devis' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="py-2 px-3 text-left">N° Devis</th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Client</th>
                <th className="py-2 px-3 text-right">Montant HT</th>
                <th className="py-2 px-3 text-right">TVA</th>
                <th className="py-2 px-3 text-right">Montant TTC</th>
                <th className="py-2 px-3 text-center">Statut</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {devisData.length > 0 ? (
                devisData.map((item: Devis) => (
                  <tr key={item.id_devis} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">{item.numero_devis}</td>
                    <td className="py-2 px-3">{item.date_creation}</td>
                    <td className="py-2 px-3">{item.eleves?.nom} {item.eleves?.prenom}</td>
                    <td className="py-2 px-3 text-right">{item.montant_ht ? item.montant_ht.toFixed(2) : "0.00"} €</td>
                    <td className="py-2 px-3 text-right">{item.montant_tva ? item.montant_tva.toFixed(2) : "0.00"} €</td>
                    <td className="py-2 px-3 text-right">{item.montant_ttc ? item.montant_ttc.toFixed(2) : "0.00"} €</td>
                    <td className="py-2 px-3 text-center">
                      <span 
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${item.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                                                                                       item.statut === 'accepté' ? 'bg-green-100 text-green-800' : 
                                                                                       item.statut === 'refusé' ? 'bg-red-100 text-red-800' : 
                                                                                       'bg-gray-100 text-gray-800'}`}
                      >
                        {item.statut}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button className="text-blue-500 hover:text-blue-700" title="Voir">
                          <FiEye size={18} />
                        </button>
                        <button className="text-green-500 hover:text-green-700" title="Éditer">
                          <FiEdit size={18} />
                        </button>
                        <button className="text-red-500 hover:text-red-700" title="Supprimer">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    Aucun devis trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="py-2 px-3 text-left">N° Contrat</th>
                <th className="py-2 px-3 text-left">Date début</th>
                <th className="py-2 px-3 text-left">Date fin</th>
                <th className="py-2 px-3 text-left">Client</th>
                <th className="py-2 px-3 text-right">Montant HT</th>
                <th className="py-2 px-3 text-right">TVA</th>
                <th className="py-2 px-3 text-right">Montant TTC</th>
                <th className="py-2 px-3 text-center">Statut</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {contratsData.length > 0 ? (
                contratsData.map((item: Contrat) => (
                  <tr key={item.id_contrat} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">{item.numero_contrat}</td>
                    <td className="py-2 px-3">{item.date_debut}</td>
                    <td className="py-2 px-3">{item.date_fin}</td>
                    <td className="py-2 px-3">{item.eleves?.nom} {item.eleves?.prenom}</td>
                    <td className="py-2 px-3 text-right">{item.montant_ht ? item.montant_ht.toFixed(2) : "0.00"} €</td>
                    <td className="py-2 px-3 text-right">{item.montant_tva ? item.montant_tva.toFixed(2) : "0.00"} €</td>
                    <td className="py-2 px-3 text-right">{item.montant_ttc ? item.montant_ttc.toFixed(2) : "0.00"} €</td>
                    <td className="py-2 px-3 text-center">
                      <span 
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${item.statut === 'actif' ? 'bg-green-100 text-green-800' : 
                                                                                       item.statut === 'terminé' ? 'bg-blue-100 text-blue-800' : 
                                                                                       'bg-red-100 text-red-800'}`}
                      >
                        {item.statut}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button className="text-blue-500 hover:text-blue-700" title="Voir">
                          <FiEye size={18} />
                        </button>
                        <button className="text-green-500 hover:text-green-700" title="Éditer">
                          <FiEdit size={18} />
                        </button>
                        <button className="text-red-500 hover:text-red-700" title="Supprimer">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-4 text-center text-gray-500">
                    Aucun contrat trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {activeTab === 'devis' ? (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Total devis</h3>
              <p className="text-2xl font-semibold">{statsDevis.nombre.total}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Montant total</h3>
              <p className="text-2xl font-semibold">{statsDevis.montants.total.toFixed(2)} €</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">En attente</h3>
              <p className="text-2xl font-semibold">{statsDevis.nombre.enAttente}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Taux de conversion</h3>
              <p className="text-2xl font-semibold">{statsDevis.tauxConversion}%</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Total contrats</h3>
              <p className="text-2xl font-semibold">{statsContrats.nombre.total}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Montant total</h3>
              <p className="text-2xl font-semibold">{statsContrats.montants.total.toFixed(2)} €</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Contrats actifs</h3>
              <p className="text-2xl font-semibold">{statsContrats.nombre.actifs}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Durée moyenne</h3>
              <p className="text-2xl font-semibold">{statsContrats.dureeMoyenne} jours</p>
            </div>
          </>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          Affichage de {activeTab === 'devis' ? devisData.length : contratsData.length} sur {activeTab === 'devis' ? pagination.totalDevis : pagination.totalContrats} résultats
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handlePreviousPage}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={page <= 1}
          >
            Précédent
          </button>
          <button
            onClick={handleNextPage}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={page >= pagination.totalPages}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevisContrats;
