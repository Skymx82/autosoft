'use client';

import React, { useState } from 'react';
import { FiFilter, FiDownload, FiPrinter, FiEye, FiFileText, FiCalendar } from 'react-icons/fi';

interface DeclarationTVA {
  id: string;
  periode: string;
  dateDeclaration: string;
  montantHT: number;
  tauxTVA: number;
  montantTVA: number;
  statut: 'à déclarer' | 'déclarée' | 'payée';
  dateEcheance: string;
  reference?: string;
}

interface TVAProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const TVA: React.FC<TVAProps> = () => {
  const [periode, setPeriode] = useState('trimestriel');
  const [showFilters, setShowFilters] = useState(false);

  const declarations: DeclarationTVA[] = [
    {
      id: 'TVA-2025-T1',
      periode: '1er trimestre 2025',
      dateDeclaration: '2025-04-15',
      montantHT: 24850.00,
      tauxTVA: 20,
      montantTVA: 4970.00,
      statut: 'payée',
      dateEcheance: '2025-04-30',
      reference: 'REF-25-04-123'
    },
    {
      id: 'TVA-2025-T2',
      periode: '2ème trimestre 2025',
      dateDeclaration: '2025-07-12',
      montantHT: 31200.00,
      tauxTVA: 20,
      montantTVA: 6240.00,
      statut: 'déclarée',
      dateEcheance: '2025-07-31'
    },
    {
      id: 'TVA-2025-T3',
      periode: '3ème trimestre 2025',
      dateDeclaration: '',
      montantHT: 28750.00,
      tauxTVA: 20,
      montantTVA: 5750.00,
      statut: 'à déclarer',
      dateEcheance: '2025-10-31'
    },
    {
      id: 'TVA-2024-T4',
      periode: '4ème trimestre 2024',
      dateDeclaration: '2025-01-14',
      montantHT: 22300.00,
      tauxTVA: 20,
      montantTVA: 4460.00,
      statut: 'payée',
      dateEcheance: '2025-01-31',
      reference: 'REF-25-01-089'
    },
    {
      id: 'TVA-2024-T3',
      periode: '3ème trimestre 2024',
      dateDeclaration: '2024-10-12',
      montantHT: 19800.00,
      tauxTVA: 20,
      montantTVA: 3960.00,
      statut: 'payée',
      dateEcheance: '2024-10-31',
      reference: 'REF-24-10-254'
    },
    {
      id: 'TVA-2024-T2',
      periode: '2ème trimestre 2024',
      dateDeclaration: '2024-07-15',
      montantHT: 26400.00,
      tauxTVA: 20,
      montantTVA: 5280.00,
      statut: 'payée',
      dateEcheance: '2024-07-31',
      reference: 'REF-24-07-178'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Déclaration de TVA</h2>
        
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
          <span className="text-sm font-medium text-gray-700">Période de déclaration :</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriode('mensuel')}
            className={`px-4 py-2 rounded-md ${periode === 'mensuel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Mensuelle
          </button>
          <button 
            onClick={() => setPeriode('trimestriel')}
            className={`px-4 py-2 rounded-md ${periode === 'trimestriel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Trimestrielle
          </button>
          <button 
            onClick={() => setPeriode('annuel')}
            className={`px-4 py-2 rounded-md ${periode === 'annuel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Annuelle
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">TVA du trimestre en cours</h3>
          <p className="text-2xl font-bold text-gray-800">
            {declarations
              .find(d => d.statut === 'à déclarer')?.montantTVA.toLocaleString('fr-FR') || '0'} €
          </p>
          <p className="text-xs text-gray-500 mt-1">
            À déclarer avant le {declarations
              .find(d => d.statut === 'à déclarer')?.dateEcheance
              ? new Date(declarations.find(d => d.statut === 'à déclarer')!.dateEcheance).toLocaleDateString('fr-FR')
              : '--/--/----'}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">TVA payée (année en cours)</h3>
          <p className="text-2xl font-bold text-gray-800">
            {declarations
              .filter(d => d.statut === 'payée' && d.dateDeclaration.startsWith('2025'))
              .reduce((sum, d) => sum + d.montantTVA, 0)
              .toLocaleString('fr-FR')} €
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Sur {declarations
              .filter(d => d.statut === 'payée' && d.dateDeclaration.startsWith('2025'))
              .reduce((sum, d) => sum + d.montantHT, 0)
              .toLocaleString('fr-FR')} € de CA HT
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Prochaine échéance</h3>
          <p className="text-2xl font-bold text-gray-800">
            {declarations
              .find(d => d.statut === 'à déclarer')?.dateEcheance
              ? new Date(declarations.find(d => d.statut === 'à déclarer')!.dateEcheance).toLocaleDateString('fr-FR')
              : '--/--/----'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Déclaration trimestrielle</p>
        </div>
      </div>
      
      {/* Tableau détaillé TVA collectée */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">TVA collectée (sur les ventes)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Taux de TVA</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Base HT</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Montant TVA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">20%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">10%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">5.5%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="py-4 px-4 text-sm text-gray-700">Total</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0,00 €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Tableau détaillé TVA déductible */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">TVA déductible (sur les achats)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Taux de TVA</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Base HT</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Montant TVA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">20%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">10%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">5.5%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="py-4 px-4 text-sm text-gray-700">Total</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0,00 €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Tableau des déclarations */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de déclaration</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant HT</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVA</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {declarations.length > 0 ? (
              declarations.map((declaration) => (
                <tr key={declaration.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{declaration.periode}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {declaration.dateDeclaration 
                      ? new Date(declaration.dateDeclaration).toLocaleDateString('fr-FR') 
                      : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{declaration.montantHT.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{declaration.montantTVA.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-4 text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        declaration.statut === 'payée' ? 'bg-green-100 text-green-800' : 
                        declaration.statut === 'déclarée' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {declaration.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(declaration.dateEcheance).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Voir détails">
                        <FiEye className="w-4 h-4" />
                      </button>
                      {declaration.statut === 'à déclarer' && (
                        <button className="text-green-600 hover:text-green-800" title="Déclarer">
                          <FiFileText className="w-4 h-4" />
                        </button>
                      )}
                      {declaration.statut !== 'à déclarer' && (
                        <button className="text-gray-600 hover:text-gray-800" title="Imprimer">
                          <FiPrinter className="w-4 h-4" />
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-800" title="Télécharger">
                        <FiDownload className="w-4 h-4" />
                      </button>
                    </div>
                    {declaration.reference && (
                      <div className="mt-1 text-xs text-gray-500">
                        Réf: {declaration.reference}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  Aucune déclaration enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Graphique ou informations supplémentaires */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Informations sur la TVA</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Total TVA année en cours</p>
            <p className="text-lg font-semibold text-gray-800">
              {declarations
                .filter(d => d.dateDeclaration.startsWith('2025') || (d.statut === 'à déclarer' && d.id.includes('2025')))
                .reduce((sum, d) => sum + d.montantTVA, 0)
                .toLocaleString('fr-FR')} €
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total TVA année précédente</p>
            <p className="text-lg font-semibold text-gray-800">
              {declarations
                .filter(d => d.dateDeclaration.startsWith('2024') || (d.id.includes('2024')))
                .reduce((sum, d) => sum + d.montantTVA, 0)
                .toLocaleString('fr-FR')} €
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Taux de TVA appliqué</p>
            <p className="text-lg font-semibold text-gray-800">{declarations[0]?.tauxTVA}%</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Les déclarations de TVA doivent être effectuées trimestriellement. Assurez-vous de respecter les délais pour éviter des pénalités.
        </p>
      </div>
      
      {/* Récapitulatif et actions */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-700">Récapitulatif de la période</h3>
          <div className="text-sm text-gray-500">
            {periode === 'trimestriel' ? '3ème trimestre 2025' : periode === 'mensuel' ? 'Juillet 2025' : 'Année 2025'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">TVA collectée</span>
              <span className="font-medium">0,00 €</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">TVA déductible</span>
              <span className="font-medium">0,00 €</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Crédit de TVA antérieur</span>
              <span className="font-medium">0,00 €</span>
            </div>
            <div className="flex justify-between py-2 mt-2">
              <span className="text-gray-800 font-medium">TVA à payer</span>
              <span className="text-lg font-bold text-purple-600">0,00 €</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-end">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Date limite de déclaration</p>
              <p className="font-medium">20 octobre 2025</p>
            </div>
            
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none flex-1">
                Prévisualiser
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex-1">
                Générer la déclaration
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {declarations.length} déclarations
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

export default TVA;
