'use client';

import { useState } from 'react';
import { FiUsers, FiEdit2, FiTrash2, FiMail, FiPhone, FiCalendar, FiUser, FiMapPin } from 'react-icons/fi';
import { PersonnelMember, Bureau } from '../api';

interface UserListProps {
  personnel: PersonnelMember[];
  loading: boolean;
  onEdit: (member: PersonnelMember) => void;
  onDelete: (member: PersonnelMember) => void;
  searchTerm: string;
  filterRole: string;
  filterBureau: number | 'all';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  bureaux: Bureau[];
}

// Fonctions utilitaires pour le formatage
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'directeur':
      return 'bg-purple-100 text-purple-800';
    case 'moniteur':
      return 'bg-blue-100 text-blue-800';
    case 'secretaire':
      return 'bg-green-100 text-green-800';
    case 'comptable':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatRoleName = (role: string) => {
  switch (role) {
    case 'directeur':
      return 'Directeur';
    case 'moniteur':
      return 'Moniteur';
    case 'secretaire':
      return 'Secrétaire';
    case 'comptable':
      return 'Comptable';
    default:
      return role;
  }
};

export default function UserList({
  personnel,
  loading,
  onEdit,
  onDelete,
  searchTerm,
  filterRole,
  filterBureau,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  bureaux
}: UserListProps) {
  
  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Liste du personnel
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Tous les membres du personnel de votre auto-école
        </p>
      </div>
      
      {personnel.length === 0 ? (
        <div className="text-center py-12">
          <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun membre du personnel</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter un membre du personnel pour votre auto-école.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    if (sortBy === 'nom') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('nom');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Nom
                  {sortBy === 'nom' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    if (sortBy === 'role') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('role');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Rôle
                  {sortBy === 'role' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bureau
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Détails
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {personnel.map((member) => (
                <tr key={`${member.type}-${member.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FiUser className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.prenom} {member.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.type === 'enseignant' ? 
                            (member.details?.actif !== undefined ? 'Moniteur' : 'Enseignant') : 
                            'Utilisateur système'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FiMail className="mr-1 h-4 w-4 text-gray-500" />
                      {member.email || '-'}
                    </div>
                    {member.tel && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiPhone className="mr-1 h-4 w-4 text-gray-500" />
                        {member.tel}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(member.role)}`}>
                      {formatRoleName(member.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.bureau ? (
                      <div className="flex items-center">
                        <FiMapPin className="mr-1 h-4 w-4" />
                        {member.bureau.nom}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col space-y-1">
                      {/* Afficher le numéro d'enseignant et la date de délivrance si disponible */}
                      {member.details?.num_enseignant && (
                        <div>
                          <div>N° {member.details.num_enseignant}</div>
                          {member.details.date_delivrance_num && (
                            <div className="flex items-center text-xs text-gray-400">
                              <FiCalendar className="mr-1 h-3 w-3" />
                              {formatDate(member.details.date_delivrance_num)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Afficher le statut actif/inactif si disponible */}
                      {member.details?.actif !== undefined && (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.details.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {member.details.actif ? 'Actif' : 'Inactif'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(member)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(member)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}        
    </div>
  );
}
