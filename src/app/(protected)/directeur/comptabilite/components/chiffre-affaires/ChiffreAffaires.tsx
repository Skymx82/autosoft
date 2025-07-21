'use client';

import React, { useState } from 'react';
import { FiFilter, FiDownload, FiCalendar, FiInfo } from 'react-icons/fi';

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
  // Vous pouvez ajouter des props spécifiques ici
}

const ChiffreAffaires: React.FC<ChiffreAffairesProps> = () => {
  const [periode, setPeriode] = useState('mensuel');
  const [showFilters, setShowFilters] = useState(false);
  const [anneeSelectionnee, setAnneeSelectionnee] = useState(2025);
  
  // Données fictives pour le chiffre d'affaires par catégorie
  const categoriesCA: CategorieCA[] = [
    {
      nom: 'Formation',
      montantHT: 21250.00,
      tauxTVA: 20,
      montantTVA: 4250.00,
      montantTTC: 25500.00,
      pourcentage: 73.91
    },
    {
      nom: 'Examen',
      montantHT: 5000.00,
      tauxTVA: 20,
      montantTVA: 1000.00,
      montantTTC: 6000.00,
      pourcentage: 17.39
    },
    {
      nom: 'Vente de produits',
      montantHT: 2083.33,
      tauxTVA: 20,
      montantTVA: 416.67,
      montantTTC: 2500.00,
      pourcentage: 7.25
    },
    {
      nom: 'Autres',
      montantHT: 416.67,
      tauxTVA: 20,
      montantTVA: 83.33,
      montantTTC: 500.00,
      pourcentage: 1.45
    }
  ];
  
  // Calcul des totaux
  const totalHT = categoriesCA.reduce((sum, cat) => sum + cat.montantHT, 0);
  const totalTVA = categoriesCA.reduce((sum, cat) => sum + cat.montantTVA, 0);
  const totalTTC = categoriesCA.reduce((sum, cat) => sum + cat.montantTTC, 0);
  
  // Données fictives pour le graphique mensuel
  const donneesGraphiqueMensuel: DonneeGraphique[] = [
    { mois: 'Janvier', montant: 28500, annee: 2025 },
    { mois: 'Février', montant: 32000, annee: 2025 },
    { mois: 'Mars', montant: 29800, annee: 2025 },
    { mois: 'Avril', montant: 31200, annee: 2025 },
    { mois: 'Mai', montant: 33500, annee: 2025 },
    { mois: 'Juin', montant: 34500, annee: 2025 },
    { mois: 'Juillet', montant: 30000, annee: 2025 },
    { mois: 'Août', montant: 27500, annee: 2025 },
    { mois: 'Septembre', montant: 32800, annee: 2025 },
    { mois: 'Octobre', montant: 34200, annee: 2025 },
    { mois: 'Novembre', montant: 35000, annee: 2025 },
    { mois: 'Décembre', montant: 36500, annee: 2025 }
  ];
  
  // Données fictives pour le graphique trimestriel
  const donneesGraphiqueTrimestriel = [
    { mois: 'T1', montant: 90300, annee: 2025 },
    { mois: 'T2', montant: 99200, annee: 2025 },
    { mois: 'T3', montant: 90300, annee: 2025 },
    { mois: 'T4', montant: 105700, annee: 2025 }
  ];
  
  // Données fictives pour le graphique annuel
  const donneesGraphiqueAnnuel = [
    { mois: '2023', montant: 320000, annee: 2023 },
    { mois: '2024', montant: 365000, annee: 2024 },
    { mois: '2025', montant: 385500, annee: 2025 }
  ];
  
  // Sélection des données selon la période
  const donneesGraphique = 
    periode === 'mensuel' ? donneesGraphiqueMensuel :
    periode === 'trimestriel' ? donneesGraphiqueTrimestriel :
    donneesGraphiqueAnnuel;
  
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
        <div className="h-80 border border-gray-200 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Évolution du chiffre d'affaires {periode === 'mensuel' ? 'mensuel' : periode === 'trimestriel' ? 'trimestriel' : 'annuel'}</h3>
            <div className="flex items-center">
              {periode === 'mensuel' && (
                <select 
                  className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm"
                  value={anneeSelectionnee}
                  onChange={(e) => setAnneeSelectionnee(parseInt(e.target.value))}
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              )}
              <button className="ml-2 p-1 text-gray-500 hover:text-gray-700" title="Informations sur le graphique">
                <FiInfo className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="relative h-60">
            {/* Axe Y */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
              {[0, 25, 50, 75, 100].map((percent, i) => (
                <div key={i} className="flex items-center">
                  <span className="pr-1">{percent}%</span>
                  <div className="border-t border-gray-200 w-full absolute right-0" style={{width: 'calc(100% - 24px)', left: '24px'}}></div>
                </div>
              ))}
            </div>
            
            {/* Barres du graphique */}
            <div className="ml-12 h-full flex items-end justify-between">
              {donneesGraphique.map((donnee, index) => {
                // Calculer la hauteur relative de la barre (max = 100%)
                const maxMontant = Math.max(...donneesGraphique.map(d => d.montant));
                const hauteurRelative = (donnee.montant / maxMontant) * 100;
                
                return (
                  <div key={index} className="flex flex-col items-center" style={{width: `${100 / donneesGraphique.length - 2}%`}}>
                    <div 
                      className="w-full bg-blue-500 hover:bg-blue-600 transition-all rounded-t"
                      style={{height: `${hauteurRelative}%`}}
                      title={`${donnee.mois} ${donnee.annee}: ${donnee.montant.toLocaleString('fr-FR')} €`}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">{donnee.mois}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Total {periode === 'mensuel' ? 'annuel' : periode === 'trimestriel' ? 'annuel' : 'sur 3 ans'}: 
            <span className="font-medium ml-1">
              {donneesGraphique.reduce((sum, item) => sum + item.montant, 0).toLocaleString('fr-FR')} €
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
