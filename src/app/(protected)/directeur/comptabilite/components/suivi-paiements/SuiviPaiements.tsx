'use client';

import React, { useState } from 'react';
import { FiFilter, FiDownload, FiMail, FiEye, FiEdit, FiCheck, FiAlertTriangle } from 'react-icons/fi';

interface Paiement {
  id: string;
  eleve: string;
  formation: string;
  montant: number;
  datePaiement: string;
  dateEcheance: string;
  modePaiement: string;
  statut: 'payé' | 'en retard' | 'à venir' | 'annulé';
  commentaire?: string;
}

interface SuiviPaiementsProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const SuiviPaiements: React.FC<SuiviPaiementsProps> = () => {
  // Vérifier si nous sommes en environnement de production
  const [isProd, setIsProd] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Détecter l'environnement de production
  React.useEffect(() => {
    // Vérifier si nous sommes en production en fonction de l'URL
    const hostname = window.location.hostname;
    setIsProd(hostname.includes('autosoft.fr') || 
              hostname.includes('autosoft.com') || 
              hostname === 'autosoft-pi.vercel.app' || 
              !hostname.includes('localhost'));
  }, []);
  
  // Données fictives pour l'exemple
  const paiements: Paiement[] = [
    {
      id: 'P-001',
      eleve: 'Martin Sophie',
      formation: 'Permis B - Forfait 20h',
      montant: 1200.00,
      datePaiement: '2025-07-05',
      dateEcheance: '2025-07-05',
      modePaiement: 'Carte bancaire',
      statut: 'payé'
    },
    {
      id: 'P-002',
      eleve: 'Dubois Thomas',
      formation: 'Permis B - Accéléré',
      montant: 800.00,
      datePaiement: '2025-07-10',
      dateEcheance: '2025-07-10',
      modePaiement: 'Virement',
      statut: 'payé'
    },
    {
      id: 'P-003',
      eleve: 'Leroy Julie',
      formation: 'Code de la route',
      montant: 250.00,
      datePaiement: '',
      dateEcheance: '2025-07-15',
      modePaiement: 'Chèque',
      statut: 'en retard',
      commentaire: 'Relance effectuée le 18/07/2025'
    },
    {
      id: 'P-004',
      eleve: 'Moreau Lucas',
      formation: 'Permis B - Complet',
      montant: 600.00,
      datePaiement: '',
      dateEcheance: '2025-07-30',
      modePaiement: 'Espèces',
      statut: 'à venir'
    },
    {
      id: 'P-005',
      eleve: 'Petit Emma',
      formation: 'Heures supplémentaires',
      montant: 225.00,
      datePaiement: '2025-07-12',
      dateEcheance: '2025-07-15',
      modePaiement: 'Carte bancaire',
      statut: 'payé'
    },
    {
      id: 'P-006',
      eleve: 'Garcia Hugo',
      formation: 'Permis B - Forfait 20h',
      montant: 400.00,
      datePaiement: '',
      dateEcheance: '2025-07-01',
      modePaiement: 'Virement',
      statut: 'annulé',
      commentaire: 'Formation annulée par l\'élève'
    }
  ];
  
  // Si nous sommes en production, afficher le message "fonctionnalité en développement"
  if (isProd) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Suivi des paiements élèves</h2>
        </div>
        
        <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-md shadow-md">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-bold text-orange-700">Fonctionnalité en développement</h3>
          </div>
          
          <p className="text-orange-700 mb-4 text-lg">
            Le module de suivi des paiements est actuellement en cours de développement et sera disponible prochainement.
          </p>
          
          <p className="text-orange-600">
            Nous travaillons activement sur cette fonctionnalité pour vous offrir une expérience complète de gestion des paiements :
          </p>
          
          <ul className="mt-3 list-disc list-inside text-orange-600 space-y-1 ml-4">
            <li>Suivi en temps réel des paiements</li>
            <li>Relances automatiques</li>
            <li>Intégration avec les solutions de paiement en ligne</li>
            <li>Échéanciers personnalisés</li>
            <li>Tableaux de bord et statistiques</li>
          </ul>
        </div>
      </div>
    );
  }
  
  // Sinon, afficher le composant normal (en développement local)
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Suivi des paiements élèves</h2>
        
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
      
      {/* Cartes de statut */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Paiements reçus</h3>
          <p className="text-2xl font-bold text-gray-800">{paiements
            .filter(p => p.statut === 'payé')
            .reduce((sum, p) => sum + p.montant, 0)
            .toLocaleString('fr-FR')} €</p>
          <p className="text-xs text-gray-500 mt-1">{paiements.filter(p => p.statut === 'payé').length} paiements</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">En attente</h3>
          <p className="text-2xl font-bold text-gray-800">{paiements
            .filter(p => p.statut === 'à venir')
            .reduce((sum, p) => sum + p.montant, 0)
            .toLocaleString('fr-FR')} €</p>
          <p className="text-xs text-gray-500 mt-1">{paiements.filter(p => p.statut === 'à venir').length} paiements</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">En retard</h3>
          <p className="text-2xl font-bold text-gray-800">{paiements
            .filter(p => p.statut === 'en retard')
            .reduce((sum, p) => sum + p.montant, 0)
            .toLocaleString('fr-FR')} €</p>
          <p className="text-xs text-gray-500 mt-1">{paiements.filter(p => p.statut === 'en retard').length} paiements</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Total à percevoir</h3>
          <p className="text-2xl font-bold text-gray-800">{paiements
            .filter(p => p.statut === 'en retard' || p.statut === 'à venir')
            .reduce((sum, p) => sum + p.montant, 0)
            .toLocaleString('fr-FR')} €</p>
          <p className="text-xs text-gray-500 mt-1">Ce mois-ci</p>
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
                <option value="a_jour">À jour</option>
                <option value="a_venir">À venir</option>
                <option value="retard">En retard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les modes</option>
                <option value="cb">Carte bancaire</option>
                <option value="especes">Espèces</option>
                <option value="cheque">Chèque</option>
                <option value="virement">Virement</option>
                <option value="prelevement">Prélèvement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche élève</label>
              <input 
                type="text" 
                placeholder="Nom ou prénom de l'élève"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
      
      {/* Tableau des paiements */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élève</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de paiement</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'échéance</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paiements.length > 0 ? (
              paiements.map((paiement) => (
                <tr key={paiement.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{paiement.eleve}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{paiement.formation}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-700">{paiement.montant.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {paiement.datePaiement ? new Date(paiement.datePaiement).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(paiement.dateEcheance).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{paiement.modePaiement}</td>
                  <td className="py-3 px-4 text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        paiement.statut === 'payé' ? 'bg-green-100 text-green-800' : 
                        paiement.statut === 'à venir' ? 'bg-yellow-100 text-yellow-800' : 
                        paiement.statut === 'en retard' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {paiement.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Voir détails">
                        <FiEye className="w-4 h-4" />
                      </button>
                      {paiement.statut === 'en retard' && (
                        <button className="text-orange-600 hover:text-orange-800" title="Envoyer rappel">
                          <FiMail className="w-4 h-4" />
                        </button>
                      )}
                      {(paiement.statut === 'en retard' || paiement.statut === 'à venir') && (
                        <button className="text-green-600 hover:text-green-800" title="Marquer comme payé">
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-800" title="Modifier">
                        <FiEdit className="w-4 h-4" />
                      </button>
                    </div>
                    {paiement.commentaire && (
                      <div className="mt-1 flex items-center text-xs text-amber-600">
                        <FiAlertTriangle className="w-3 h-3 mr-1" />
                        <span title={paiement.commentaire}>Note</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">
                  Aucun paiement enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {paiements.length} paiements
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
    </div>
  );
};

export default SuiviPaiements;
