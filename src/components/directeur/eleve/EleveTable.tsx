'use client';

import { useState } from 'react';
import { FiEdit, FiTrash2, FiEye, FiCheck, FiX } from 'react-icons/fi';

interface Eleve {
  id_eleve: number;
  nom: string;
  prenom: string;
  naiss?: string; // date de naissance
  mail?: string;
  tel?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  categorie?: string;
  statut_dossier?: string; // statut du dossier
  date_inscription?: string;
  id_bureau?: number;
  bureau?: { nom: string };
}

interface EleveTableProps {
  eleves: Eleve[];
  selectedEleves: number[];
  toggleEleveSelection: (id_eleve: number) => void;
  toggleAllEleves: () => void;
}

export default function EleveTable({ 
  eleves, 
  selectedEleves, 
  toggleEleveSelection, 
  toggleAllEleves 
}: EleveTableProps) {
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Calculer les indices des élèves à afficher
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEleves = eleves.slice(indexOfFirstItem, indexOfLastItem);
  
  // Fonction pour formater une date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  // Fonction pour calculer l'âge à partir de la date de naissance
  const calculateAge = (dateString?: string) => {
    if (!dateString) return '-';
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  // Fonction pour changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={selectedEleves.length === eleves.length && eleves.length > 0}
                  onChange={toggleAllEleves}
                />
              </div>
            </th>
            <th scope="col" className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th scope="col" className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prénom
            </th>
            {/* Priorité 3 - Visible sur md et plus */}
            <th scope="col" className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Âge
            </th>
            {/* Priorité 4 - Visible sur lg et plus */}
            <th scope="col" className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            {/* Priorité 3 - Visible sur md et plus */}
            <th scope="col" className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Téléphone
            </th>
            {/* Priorité 2 - Visible sur sm et plus */}
            <th scope="col" className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catégorie
            </th>
            {/* Priorité 1 - Toujours visible */}
            <th scope="col" className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            {/* Colonne Bureau supprimée */}
            {/* Priorité 4 - Visible sur lg et plus */}
            <th scope="col" className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date d'inscription
            </th>
            {/* Priorité 1 - Toujours visible */}
            <th scope="col" className="px-2 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentEleves.length > 0 ? (
            currentEleves.map((eleve) => (
              <tr key={eleve.id_eleve} className={selectedEleves.includes(eleve.id_eleve) ? 'bg-blue-50' : ''}>
                <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedEleves.includes(eleve.id_eleve)}
                      onChange={() => toggleEleveSelection(eleve.id_eleve)}
                    />
                  </div>
                </td>
                <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{eleve.nom}</div>
                </td>
                <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{eleve.prenom}</div>
                </td>
                {/* Priorité 3 - Visible sur md et plus */}
                <td className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{calculateAge(eleve.naiss)}</div>
                </td>
                {/* Priorité 4 - Visible sur lg et plus */}
                <td className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{eleve.mail || '-'}</div>
                </td>
                {/* Priorité 3 - Visible sur md et plus */}
                <td className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{eleve.tel || '-'}</div>
                </td>
                {/* Priorité 2 - Visible sur sm et plus */}
                <td className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{eleve.categorie || '-'}</div>
                </td>
                {/* Priorité 1 - Toujours visible */}
                <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    eleve.statut_dossier === 'Actif' ? 'bg-green-100 text-green-800' :
                    eleve.statut_dossier === 'Inactif' ? 'bg-red-100 text-red-800' :
                    eleve.statut_dossier === 'En formation' ? 'bg-blue-100 text-blue-800' :
                    eleve.statut_dossier === 'Terminé' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {eleve.statut_dossier || 'Non défini'}
                  </span>
                </td>
                {/* Cellule Bureau supprimée */}
                {/* Priorité 4 - Visible sur lg et plus */}
                <td className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(eleve.date_inscription)}</div>
                </td>
                {/* Priorité 1 - Toujours visible */}
                <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900" title="Voir les détails">
                      <FiEye />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                      <FiEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-900" title="Supprimer">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="px-2 sm:px-4 md:px-6 py-4 text-center text-sm text-gray-500">
                Aucun élève trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Pagination */}
      {eleves.length > itemsPerPage && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Précédent
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastItem >= eleves.length}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                indexOfLastItem >= eleves.length ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, eleves.length)}</span> sur{' '}
                <span className="font-medium">{eleves.length}</span> élèves
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Précédent</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: Math.ceil(eleves.length / itemsPerPage) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === i + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastItem >= eleves.length}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    indexOfLastItem >= eleves.length ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Suivant</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
