'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiFilter, FiDownload, FiEye, FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';

interface Facture {
  id: string;
  numero: string;
  date: string;
  client: string;
  montantHT: number;
  tauxTVA: number;
  montantTVA: number;
  montantTTC: number;
  statut: 'payée' | 'en attente' | 'en retard' | 'annulée';
  echeance: string;
}

interface FacturesProps {
  // Vous pouvez ajouter des props spécifiques ici
}

// Interface pour les données de l'API
interface ApiFacture {
  id_facture: string;
  date_facture: string;
  numero_facture: string;
  montant_facture: number;
  tva_facture: number;
  mode_paiement_facture: string;
  statut_facture: 'payée' | 'en attente' | 'en retard' | 'annulée';
  echeance_facture: string;
  eleves: {
    nom: string;
    prenom: string;
  };
}

const Factures: React.FC<FacturesProps> = () => {
  // Vérifier si nous sommes en environnement de production
  const [isProd, setIsProd] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<ApiFacture[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statut, setStatut] = useState<string>('tous');
  const [periode, setPeriode] = useState<string>('mois');
  
  // Détecter l'environnement de production
  useEffect(() => {
    // Vérifier si nous sommes en production en fonction de l'URL
    const hostname = window.location.hostname;
    setIsProd(hostname.includes('autosoft.fr') || 
              hostname.includes('autosoft.com') || 
              hostname === 'autosoft-pi.vercel.app' || 
              !hostname.includes('localhost'));
  }, []);
  
  // Fonction pour récupérer les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les informations utilisateur depuis le localStorage
        let id_ecole = '1'; // Valeur par défaut
        let id_bureau = '0'; // 0 = Tous les bureaux
        
        try {
          const userData = localStorage.getItem('autosoft_user');
          if (userData) {
            const user = JSON.parse(userData);
            id_ecole = user.id_ecole || id_ecole;
            id_bureau = user.id_bureau || id_bureau;
          }
        } catch (err) {
          console.error('Erreur lors de la récupération des informations utilisateur:', err);
        }
        
        // Construire l'URL avec les paramètres
        const url = `/directeur/comptabilite/components/factures/api?id_ecole=${id_ecole}&id_bureau=${id_bureau}&statut=${statut}&periode=${periode}&page=${page}&limit=10`;
        
        console.log(`Fetching factures data from: ${url}`);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des données: ${response.status}`);
        }
        
        const data = await response.json();
        setApiData(data.factures);
        setTotalPages(data.pagination.totalPages);
        
      } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error);
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [page, statut, periode]);
  
  // Convertir les données de l'API au format attendu par le composant
  const factures: Facture[] = apiData.map(item => ({
    id: item.id_facture,
    numero: item.numero_facture || `F-${item.id_facture}`,
    date: item.date_facture,
    client: `${item.eleves.prenom} ${item.eleves.nom}`,
    montantHT: parseFloat((item.montant_facture - item.tva_facture).toFixed(2)),
    tauxTVA: parseFloat(((item.tva_facture / (item.montant_facture - item.tva_facture)) * 100).toFixed(0)),
    montantTVA: parseFloat(item.tva_facture.toFixed(2)),
    montantTTC: parseFloat(item.montant_facture.toFixed(2)),
    statut: item.statut_facture,
    echeance: item.echeance_facture
  })) 
  
  // Si nous sommes en production, afficher le message "fonctionnalité en développement"
  if (isProd) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Factures</h2>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-md shadow-md">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-bold text-yellow-700">Fonctionnalité en développement</h3>
          </div>
          
          <p className="text-yellow-700 mb-4 text-lg">
            Le module de gestion des factures est actuellement en cours de développement et sera disponible prochainement.  
          </p>
          
          <p className="text-yellow-600">
            Nous travaillons activement sur cette fonctionnalité pour vous offrir une expérience complète de gestion de la facturation :
          </p>
          
          <ul className="mt-3 list-disc list-inside text-yellow-600 space-y-1 ml-4">
            <li>Création et gestion des factures</li>
            <li>Suivi des paiements</li>
            <li>Génération automatique de factures</li>
            <li>Exportation au format PDF</li>
            <li>Envoi par email</li>
          </ul>
        </div>
      </div>
    );
  }
  
  // Sinon, afficher le composant normal (en développement local)
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Factures</h2>
        
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
            <span>Créer une facture</span>
          </button>
        </div>
      </div>
      
      {/* Filtres avancés */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
              >
                <option value="tous">Tous les statuts</option>
                <option value="payée">Payée</option>
                <option value="en attente">En attente</option>
                <option value="en retard">En retard</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
              >
                <option value="jour">Aujourd'hui</option>
                <option value="semaine">Cette semaine</option>
                <option value="mois">Ce mois</option>
                <option value="trimestre">Ce trimestre</option>
                <option value="annee">Cette année</option>
              </select>
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
          
          <div className="mt-4 flex justify-end space-x-2">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
              onClick={() => {
                setStatut('tous');
                setPeriode('mois');
                setPage(1);
              }}
            >
              Réinitialiser
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
              onClick={() => setPage(1)} // Réinitialiser la page lors de l'application des filtres
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Appliquer les filtres'}
            </button>
          </div>
        </div>
      )}
      
      {/* Tableau des factures */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Facture</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant HT</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVA</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant TTC</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {factures.length > 0 ? (
              factures.map((facture, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{facture.numero}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(facture.date).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{facture.client}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{facture.montantHT.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{facture.montantTVA.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{facture.montantTTC.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={
                      `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        facture.statut === 'payée' ? 'bg-green-100 text-green-800' : 
                        facture.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                        facture.statut === 'en retard' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`
                    }>
                      {facture.statut.charAt(0).toUpperCase() + facture.statut.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Voir">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800" title="Éditer">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Supprimer">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">
                  Aucune facture enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* État de chargement */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <FiLoader className="animate-spin h-6 w-6 text-blue-500" />
          <span className="ml-2 text-gray-600">Chargement des factures...</span>
        </div>
      )}
      
      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4">
          <p>Erreur: {error}</p>
          <p className="text-sm">Veuillez réessayer ou contacter le support technique.</p>
        </div>
      )}
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {factures.length} factures
        </div>
        
        <div className="flex space-x-1">
          <button 
            className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" 
            disabled={page === 1 || loading}
            onClick={() => setPage(page - 1)}
          >
            Précédent
          </button>
          <span className="px-3 py-1 text-gray-600">
            Page {page} sur {totalPages}
          </span>
          <button 
            className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" 
            disabled={page >= totalPages || loading}
            onClick={() => setPage(page + 1)}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Factures;
