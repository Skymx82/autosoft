import { UtilisateurAffichage } from './utilisateursApi';
import { Enseignant } from './enseignantsApi';

// Type unifié pour représenter un membre du personnel
export interface PersonnelMember {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  tel?: string;
  role: string;
  type: 'utilisateur' | 'enseignant';
  bureau?: {
    id_bureau: number;
    nom: string;
  };
  details?: {
    num_enseignant?: string;
    date_delivrance_num?: string;
    actif?: boolean;
  };
  // Champs originaux pour faciliter les opérations CRUD
  original?: UtilisateurAffichage | Enseignant;
}

/**
 * Convertit un utilisateur en membre du personnel unifié
 */
export const convertUtilisateurToPersonnel = (utilisateur: UtilisateurAffichage): PersonnelMember => {
  return {
    id: utilisateur.id_utilisateur,
    nom: utilisateur.nom || '',
    prenom: utilisateur.prenom || '',
    email: utilisateur.email,
    role: utilisateur.role,
    type: 'utilisateur',
    bureau: utilisateur.bureau ? {
      id_bureau: utilisateur.bureau.id_bureau,
      nom: utilisateur.bureau.nom
    } : undefined,
    details: {
      actif: utilisateur.actif
    },
    original: utilisateur
  };
};

/**
 * Convertit un enseignant en membre du personnel unifié
 */
export const convertEnseignantToPersonnel = (enseignant: Enseignant): PersonnelMember => {
  return {
    id: enseignant.id_moniteur.toString(),
    nom: enseignant.nom,
    prenom: enseignant.prenom,
    email: enseignant.email || '',
    tel: enseignant.tel,
    role: 'moniteur',
    type: 'enseignant',
    bureau: enseignant.bureau ? {
      id_bureau: enseignant.id_bureau,
      nom: enseignant.bureau.nom
    } : undefined,
    details: {
      num_enseignant: enseignant.num_enseignant,
      date_delivrance_num: enseignant.date_delivrance_num
    },
    original: enseignant
  };
};

/**
 * Combine les utilisateurs et les enseignants en une liste unifiée de membres du personnel
 */
export const combinePersonnel = (
  utilisateurs: UtilisateurAffichage[],
  enseignants: Enseignant[]
): PersonnelMember[] => {
  const personnelUtilisateurs = utilisateurs.map(convertUtilisateurToPersonnel);
  const personnelEnseignants = enseignants.map(convertEnseignantToPersonnel);
  
  return [...personnelUtilisateurs, ...personnelEnseignants];
};

/**
 * Filtre la liste du personnel en fonction des critères de recherche et des filtres
 */
export const filterPersonnel = (
  personnel: PersonnelMember[],
  searchTerm: string,
  filterRole: string,
  filterBureau: number | 'all'
): PersonnelMember[] => {
  return personnel.filter(member => {
    // Filtrer par terme de recherche
    const searchMatch = searchTerm === '' || 
      member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.tel && member.tel.includes(searchTerm));
    
    // Filtrer par rôle
    const roleMatch = filterRole === 'all' || member.role === filterRole;
    
    // Filtrer par bureau
    const bureauMatch = filterBureau === 'all' || 
      (member.bureau && member.bureau.id_bureau === filterBureau);
    
    return searchMatch && roleMatch && bureauMatch;
  });
};

/**
 * Trie la liste du personnel par nom, prénom, rôle, etc.
 */
export const sortPersonnel = (
  personnel: PersonnelMember[],
  sortBy: string = 'nom',
  sortOrder: 'asc' | 'desc' = 'asc'
): PersonnelMember[] => {
  return [...personnel].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'nom':
        comparison = a.nom.localeCompare(b.nom);
        break;
      case 'prenom':
        comparison = a.prenom.localeCompare(b.prenom);
        break;
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'role':
        comparison = a.role.localeCompare(b.role);
        break;
      default:
        comparison = a.nom.localeCompare(b.nom);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
};
