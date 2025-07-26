-- Base de données pour logiciel AutoSoft

-- Suppression des tables existantes si elles existent
DROP TABLE IF EXISTS competences_eleve CASCADE;
DROP TABLE IF EXISTS suivi_conduite_accompagnee CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS examen_resultats CASCADE;
DROP TABLE IF EXISTS accueil CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS utilisateur CASCADE;
DROP TABLE IF EXISTS statistique CASCADE;
DROP TABLE IF EXISTS devis CASCADE;
DROP TABLE IF EXISTS contrats CASCADE;
DROP TABLE IF EXISTS comptabilite CASCADE;
DROP TABLE IF EXISTS paiement CASCADE;
DROP TABLE IF EXISTS planning CASCADE;
DROP TABLE IF EXISTS notation CASCADE;
DROP TABLE IF EXISTS formation CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS disponibilite CASCADE;
DROP TABLE IF EXISTS representant_legal CASCADE;
DROP TABLE IF EXISTS eleves CASCADE;
DROP TABLE IF EXISTS enseignants CASCADE;
DROP TABLE IF EXISTS permis CASCADE;
DROP TABLE IF EXISTS forfait CASCADE;
DROP TABLE IF EXISTS bureau CASCADE;
DROP TABLE IF EXISTS auto_ecole CASCADE;


-- Table AutoEcole
CREATE TABLE auto_ecole (
  id_ecole SERIAL PRIMARY KEY,
  id_bureau INTEGER,
  nom VARCHAR(255) NOT NULL,
  adresse TEXT NOT NULL,
  siret VARCHAR(14),
  num_agrement VARCHAR(50),
  logo VARCHAR(255),
  presentation TEXT,
  coordonnees_bancaires TEXT,
  reseaux_sociaux JSONB
);

-- Table Bureau
CREATE TABLE bureau (
  id_bureau SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  adresse TEXT NOT NULL,
  telephone VARCHAR(20),
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Ajout de la contrainte de clé étrangère pour auto_ecole vers bureau
ALTER TABLE auto_ecole ADD CONSTRAINT fk_auto_ecole_bureau FOREIGN KEY (id_bureau) REFERENCES bureau(id_bureau) ON DELETE SET NULL;

-- Table Forfait améliorée
CREATE TABLE forfait (
  id_forfait SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  type_permis VARCHAR(10) NOT NULL,
  tarif_base DECIMAL(10,2) NOT NULL,
  nb_heures_incluses INTEGER NOT NULL,
  prix_heure_supp DECIMAL(10,2) NOT NULL, -- Prix d'une heure supplémentaire
  prix_presentation_examen DECIMAL(10,2), -- Prix de présentation à l'examen
  duree_validite_jours INTEGER, -- Durée de validité du forfait en jours
  frais_inscription DECIMAL(10,2), -- Frais d'inscription séparés
  paiement_fractionnable BOOLEAN, -- Possibilité de payer en plusieurs fois
  nb_max_echeances INTEGER, -- Nombre maximum d'échéances pour le paiement
  actif BOOLEAN DEFAULT true, -- Forfait actif ou archivé
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table Permis
CREATE TABLE permis (
  id_permis SERIAL PRIMARY KEY,
  id_eleve INTEGER REFERENCES eleves(id_eleve) ON DELETE CASCADE,
  num_permis VARCHAR(50),
  type_permis VARCHAR(10) NOT NULL,
  date_permis DATE,
  type_categorie VARCHAR(50),
  pays VARCHAR(100),
  dep VARCHAR(50),
  prefecture VARCHAR(100),
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table Enseignants (Moniteurs)
CREATE TABLE enseignants (
  id_moniteur SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  tel VARCHAR(20),
  num_enseignant VARCHAR(50),
  date_delivrance_num DATE,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
  id_utilisateur INTEGER REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- Table Elèves
CREATE TABLE eleves (
  id_eleve SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  nom_deux VARCHAR(100),
  nom_trois VARCHAR(100),
  prenom VARCHAR(100) NOT NULL,
  prenom_deux VARCHAR(100),
  prenom_trois VARCHAR(100),
  mail VARCHAR(255),
  tel VARCHAR(20),
  categorie VARCHAR(10),
  neph VARCHAR(50),
  genre VARCHAR(10),
  naiss DATE,
  pays_naiss VARCHAR(100),
  dep_naiss VARCHAR(50),
  ville_naiss VARCHAR(100),
  code BOOLEAN DEFAULT FALSE,
  interesse_code BOOLEAN DEFAULT FALSE,
  profession VARCHAR(100),
  type_financeur VARCHAR(100),
  adresse TEXT,
  code_postal VARCHAR(10),
  ville VARCHAR(100),
  pays VARCHAR(100),
  service_national BOOLEAN DEFAULT FALSE,
  journee_defense BOOLEAN DEFAULT FALSE,
  date_inscription DATE DEFAULT CURRENT_DATE,
  statut_dossier VARCHAR(50),
  id_forfait INTEGER REFERENCES forfait(id_forfait) ON DELETE SET NULL,
  id_moniteur INTEGER REFERENCES enseignants(id_moniteur) ON DELETE SET NULL,
  id_doc INTEGER,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table Représentant légal
CREATE TABLE representant_legal (
  id_representant SERIAL PRIMARY KEY,
  id_eleve INTEGER REFERENCES eleves(id_eleve) ON DELETE CASCADE,
  nom_rep VARCHAR(100) NOT NULL,
  nom_rep_deux VARCHAR(100),
  prenom_rep VARCHAR(100) NOT NULL,
  prenom_rep_deux VARCHAR(100),
  date_naiss DATE,
  genre VARCHAR(10),
  tel_rep VARCHAR(20),
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table Disponibilité
CREATE TABLE disponibilite (
  id_dispo SERIAL PRIMARY KEY,
  id_eleve INTEGER REFERENCES eleves(id_eleve) ON DELETE CASCADE,
  lundi VARCHAR(50),
  mardi VARCHAR(50),
  mercredi VARCHAR(50),
  jeudi VARCHAR(50),
  vendredi VARCHAR(50),
  samedi VARCHAR(50),
  dimanche VARCHAR(50),
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table Documents
CREATE TABLE documents (
  id_doc SERIAL PRIMARY KEY,
  id_eleve INTEGER REFERENCES eleves(id_eleve) ON DELETE CASCADE,
  type_doc VARCHAR(100),
  etat VARCHAR(50),
  lien_fichier VARCHAR(255),
  date_depot TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Ajout de la contrainte de clé étrangère pour eleves vers documents
ALTER TABLE eleves ADD CONSTRAINT fk_eleves_documents FOREIGN KEY (id_doc) REFERENCES documents(id_doc) ON DELETE SET NULL;

-- Table Formation
CREATE TABLE formation (
  id_formation SERIAL PRIMARY KEY,
  id_eleve INTEGER REFERENCES eleves(id_eleve) ON DELETE CASCADE,
  pourcentage_formation INTEGER DEFAULT 0,
  statut_contrat VARCHAR(50),
  date_debut_formation DATE,
  date_fin_formation_estimee DATE,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table Notation
CREATE TABLE notation (
  id_notation_eleve SERIAL PRIMARY KEY,
  notation_heure INTEGER CHECK (notation_heure BETWEEN 1 AND 10),
  sensation VARCHAR(100),
  id_moniteur INTEGER REFERENCES enseignants(id_moniteur) ON DELETE SET NULL,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table Planning
CREATE TABLE planning (
  id_planning SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  heure_debut TIME NOT NULL,
  heure_fin TIME NOT NULL,
  type_lecon VARCHAR(50),
  id_moniteur INTEGER REFERENCES enseignants(id_moniteur) ON DELETE CASCADE,
  id_eleve INTEGER REFERENCES eleves(id_eleve) ON DELETE CASCADE,
  id_vehicule INTEGER REFERENCES vehicule(id_vehicule) ON DELETE SET NULL,
  statut_lecon VARCHAR(50) DEFAULT 'Prévue',
  commentaire VARCHAR(255),
  id_notation_eleve INTEGER REFERENCES notation(id_notation_eleve) ON DELETE SET NULL,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

CREATE TABLE transactions (
  id_transaction SERIAL PRIMARY KEY,
  date_transaction DATE NOT NULL,
  description_transaction VARCHAR(255),
  categorie_transaction VARCHAR(50),
  montant_transaction DECIMAL(10, 2) NOT NULL,
  type_transaction TEXT NOT NULL CHECK (type_transaction IN ('recette', 'depense')),
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
)
  
CREATE TABLE depense (
  id_depense SERIAL PRIMARY KEY,
  date_depense DATE NOT NULL,
  description_depense VARCHAR(255),
  categorie_depense VARCHAR(50),
  montant_depense DECIMAL(10, 2) NOT NULL,
  tva_depense DECIMAL(10, 2) NOT NULL,
  fournisseur_depense VARCHAR(100),
  mode_paiement_depense VARCHAR(50),
  statut_depense VARCHAR(50) DEFAULT 'payé',
  id_transaction INTEGER REFERENCES transactions(id_transaction) ON DELETE SET NULL,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
)

CREATE TABLE recette (
  id_recette SERIAL PRIMARY KEY,
  date_recette DATE NOT NULL,
  description_recette VARCHAR(255),
  categorie_recette VARCHAR(50),
  montant_recette DECIMAL(10, 2) NOT NULL,
  tva_recette DECIMAL(10, 2) NOT NULL,
  client_recette INTEGER REFERENCES eleves(id_eleve) ON DELETE SET NULL,
  mode_paiement_recette VARCHAR(50),
  statut_recette TEXT NOT NULL CHECK (statut_recette IN ('encaissé', 'en attente', 'annulé')),
  id_transaction INTEGER REFERENCES transactions(id_transaction) ON DELETE SET NULL,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
)

CREATE TABLE facture (
  id_facture SERIAL PRIMARY KEY,
  date_facture DATE NOT NULL,
  numero_facture VARCHAR(255),
  id_client INTEGER REFERENCES eleves(id_eleve) ON DELETE SET NULL,
  montant_facture DECIMAL(10, 2) NOT NULL,
  tva_facture DECIMAL(10, 2) NOT NULL,
  mode_paiement_facture VARCHAR(50),
  statut_facture TEXT NOT NULL CHECK (statut_facture IN ('payée', 'en attente', 'en retard', 'annulée')),
  echeance_facture DATE NOT NULL,
  id_transaction INTEGER REFERENCES transactions(id_transaction) ON DELETE SET NULL,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
)

-- Table Statistique
CREATE TABLE statistique (
  id_stat SERIAL PRIMARY KEY,
  id_moniteur INTEGER REFERENCES enseignants(id_moniteur) ON DELETE SET NULL,
  periode VARCHAR(50),
  type VARCHAR(50),
  valeur VARCHAR(50),
  lieu VARCHAR(100),
  nb_eleve_forme INTEGER,
  nb_heures_real INTEGER,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table Utilisateur
CREATE TABLE utilisateur (
  id_utilisateur TEXT PRIMARY KEY, -- Utilise TEXT pour stocker les UUIDs de Supabase Auth
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER NOT NULL REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'directeur', 'moniteur', 'secretaire', 'comptable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Table Notifications
CREATE TABLE notifications (
  code_notif SERIAL PRIMARY KEY,
  type_notif VARCHAR(50),
  message_notif TEXT,
  date_notif TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_destinataire INTEGER,
  lu BOOLEAN DEFAULT FALSE,
  priorite VARCHAR(10),
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- NOUVELLES TABLES

-- Table CompetencesEleve pour le suivi des 4 compétences
CREATE TABLE competences_eleve (
  id_competence SERIAL PRIMARY KEY,
  id_eleve INTEGER REFERENCES eleves(id_eleve) ON DELETE CASCADE,
  c1_maitriser INTEGER DEFAULT 0,
  c2_apprehender INTEGER DEFAULT 0,
  c3_circuler INTEGER DEFAULT 0,
  c4_pratiquer INTEGER DEFAULT 0,
  date_evaluation DATE DEFAULT CURRENT_DATE,
  commentaire TEXT,
  id_moniteur INTEGER REFERENCES enseignants(id_moniteur) ON DELETE SET NULL,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table SuiviConduiteAccompagnee pour le suivi des trajets en conduite accompagnée
CREATE TABLE suivi_conduite_accompagnee (
  id_suivi SERIAL PRIMARY KEY,
  id_eleve INTEGER REFERENCES eleves(id_eleve) ON DELETE CASCADE,
  date_trajet DATE,
  km_parcourus INTEGER,
  duree_minutes INTEGER,
  commentaire TEXT,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table Certifications pour les labels et certifications de l'auto-école
CREATE TABLE certifications (
  id_certification SERIAL PRIMARY KEY,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  type_certification VARCHAR(100),
  date_obtention DATE,
  date_expiration DATE,
  fichier_justificatif VARCHAR(255)
);

-- Table ExamenResultats pour un meilleur suivi des résultats d'examens
CREATE TABLE examen_resultats (
  id_resultat SERIAL PRIMARY KEY,
  id_eleve INTEGER REFERENCES eleves(id_eleve) ON DELETE CASCADE,
  type_examen VARCHAR(50),
  date_examen DATE,
  resultat VARCHAR(20),
  nb_tentative INTEGER DEFAULT 1,
  commentaire TEXT,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table Véhicule pour la gestion du parc automobile
CREATE TABLE vehicule (
  id_vehicule SERIAL PRIMARY KEY,
  immatriculation VARCHAR(20) NOT NULL,
  marque VARCHAR(50) NOT NULL,
  modele VARCHAR(50) NOT NULL,
  annee INTEGER,
  type_vehicule VARCHAR(50) NOT NULL, -- Auto, Moto, Poids lourd, etc.
  categorie_permis VARCHAR(10) NOT NULL, -- B, A, C, etc.
  boite_vitesse VARCHAR(20), -- Manuelle, Automatique
  carburant VARCHAR(20), -- Essence, Diesel, Électrique, Hybride
  date_mise_en_service DATE,
  kilometrage_actuel INTEGER DEFAULT 0,
  dernier_controle_technique DATE,
  prochain_controle_technique DATE,
  dernier_entretien DATE,
  prochain_entretien_km INTEGER,
  prochain_entretien_date DATE,
  assurance_numero_contrat VARCHAR(50),
  assurance_date_expiration DATE,
  cout_acquisition DECIMAL(10, 2),
  cout_entretien_total DECIMAL(10, 2) DEFAULT 0,
  cout_carburant_total DECIMAL(10, 2) DEFAULT 0,
  consommation_moyenne DECIMAL(5, 2), -- L/100km
  statut VARCHAR(20) DEFAULT 'Actif', -- Actif, En maintenance, Hors service, Vendu
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table pour le suivi du kilométrage des véhicules
CREATE TABLE kilometrage_vehicule (
  id_kilometrage SERIAL PRIMARY KEY,
  id_vehicule INTEGER REFERENCES vehicule(id_vehicule) ON DELETE CASCADE,
  date_releve DATE NOT NULL,
  kilometrage INTEGER NOT NULL,
  id_moniteur INTEGER REFERENCES enseignants(id_moniteur) ON DELETE SET NULL,
  notes TEXT,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table pour les entretiens des véhicules
CREATE TABLE entretien_vehicule (
  id_entretien SERIAL PRIMARY KEY,
  id_vehicule INTEGER REFERENCES vehicule(id_vehicule) ON DELETE CASCADE,
  date_entretien DATE NOT NULL,
  type_entretien VARCHAR(50) NOT NULL, -- Révision, Réparation, Contrôle technique, etc.
  description TEXT,
  kilometrage INTEGER,
  cout DECIMAL(10, 2),
  prestataire VARCHAR(100),
  facture_reference VARCHAR(50),
  prochaine_echeance_km INTEGER,
  prochaine_echeance_date DATE,
  pieces_changees TEXT,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Table pour les dépenses liées aux véhicules (carburant, péages, etc.)
CREATE TABLE depense_vehicule (
  id_depense SERIAL PRIMARY KEY,
  id_vehicule INTEGER REFERENCES vehicule(id_vehicule) ON DELETE CASCADE,
  date_depense DATE NOT NULL,
  type_depense VARCHAR(50) NOT NULL, -- Carburant, Péage, Parking, etc.
  montant DECIMAL(10, 2) NOT NULL,
  quantite DECIMAL(10, 2), -- Pour le carburant en litres
  kilometrage INTEGER,
  lieu VARCHAR(100),
  id_moniteur INTEGER REFERENCES enseignants(id_moniteur) ON DELETE SET NULL,
  notes TEXT,
  id_bureau INTEGER REFERENCES bureau(id_bureau) ON DELETE SET NULL,
  id_ecole INTEGER REFERENCES auto_ecole(id_ecole) ON DELETE CASCADE
);

-- Commentaire de fin
-- Schéma de base de données terminé
