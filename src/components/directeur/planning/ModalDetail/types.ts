export interface PlanningDetails {
  id_planning: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  type_lecon: string | null;
  id_moniteur: number | null;
  id_eleve: number | null;
  id_vehicule: number | null;
  statut_lecon: string;
  commentaire: string | null;
  id_notation_eleve: number | null;
  id_bureau: number | null;
  id_ecole: number | null;
  enseignants: {
    id_moniteur: number;
    nom: string;
    prenom: string;
    email: string;
    tel: string;
  } | null;
  eleves: {
    id_eleve: number;
    nom: string;
    prenom: string;
    mail: string;
    tel: string;
    categorie: string;
  } | null;
  vehicule: {
    id_vehicule: number;
    immatriculation: string;
    marque: string;
    modele: string;
    type_vehicule: string;
    categorie_permis: string;
    statut: string;
  } | null;
  bureau: {
    id_bureau: number;
    nom: string;
  } | null;
  auto_ecole: {
    id_ecole: number;
    nom: string;
  } | null;
  notation: any | null;
}
