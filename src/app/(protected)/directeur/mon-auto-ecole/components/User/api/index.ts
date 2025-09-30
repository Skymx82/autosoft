// Export all API functions from this folder
export * from './utilisateursApi';

// Export from enseignantsApi with renamed types to avoid conflicts
import { 
  Enseignant,
  fetchEnseignants,
  addEnseignant,
  updateEnseignant,
  deleteEnseignant
} from './enseignantsApi';

export type { Enseignant };
export {
  fetchEnseignants,
  addEnseignant,
  updateEnseignant,
  deleteEnseignant
};

// Export from bureauxApi (this will take precedence over enseignantsApi for Bureau and fetchBureaux)
export * from './bureauxApi';

// Export personnel unified API
export * from './personnelApi';
