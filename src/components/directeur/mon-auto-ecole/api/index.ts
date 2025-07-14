// Export de toutes les API pour faciliter l'importation
export * from './ApiBureaux';
export * from './ApiUtilisateurs';
export * from './ApiEnseignants';
export * from './ApiForfaits';
export * from './ApiInfoGenerales';
export * from './ApiParametres';

// Fonction utilitaire commune pour récupérer l'ID de l'école
export const getIdEcole = (): number => {
  if (typeof window !== 'undefined') {
    const userDataStr = localStorage.getItem('autosoft_user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      return userData.id_ecole || 0;
    }
  }
  return 0;
};
