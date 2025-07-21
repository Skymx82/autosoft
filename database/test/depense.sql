-- Script d'insertion de données de test pour les dépenses
-- Création de dépenses pour les bureaux 1 et 2 de l'auto-école 1
-- Avec des dépenses réparties sur le mois actuel (juillet 2025) et le mois précédent (juin 2025)

-- Définition des dates pour le mois actuel (juillet 2025) et le mois précédent (juin 2025)
-- Mois actuel: juillet 2025
-- Mois précédent: juin 2025

-- Insertion de dépenses pour le bureau 1 (enregistrées en juillet 2025)
INSERT INTO depense (
  date_depense, description_depense, categorie_depense, 
  montant_depense, tva_depense, fournisseur_depense, 
  mode_paiement_depense, statut_depense, id_bureau, id_ecole
) VALUES
  ('2025-07-02', 'Achat fournitures de bureau', 'Fournitures', 
   120.50, 24.10, 'Bureau Plus', 
   'Carte bancaire', 'payé', 1, 1),
   
  ('2025-07-05', 'Carburant véhicule école', 'Carburant', 
   85.30, 17.06, 'Total Energies', 
   'Carte carburant', 'payé', 1, 1),
   
  ('2025-07-08', 'Maintenance logiciel gestion', 'Informatique', 
   350.00, 70.00, 'SoftTech Solutions', 
   'Virement', 'payé', 1, 1),
   
  ('2025-07-12', 'Assurance flotte véhicules', 'Assurance', 
   780.00, 0.00, 'AssurAuto Pro', 
   'Prélèvement', 'payé', 1, 1),
   
  ('2025-07-15', 'Réparation véhicule immatriculation AB-123-CD', 'Entretien véhicules', 
   420.75, 84.15, 'Garage Central', 
   'Chèque', 'payé', 1, 1),
   
  ('2025-07-18', 'Publicité réseaux sociaux', 'Marketing', 
   150.00, 30.00, 'SocialAds', 
   'Carte bancaire', 'payé', 1, 1),
   
  ('2025-07-22', 'Loyer bureau principal', 'Loyer', 
   1200.00, 240.00, 'SCI Immobilier', 
   'Virement', 'payé', 1, 1),
   
  ('2025-07-25', 'Facture téléphonie et internet', 'Télécommunications', 
   89.90, 17.98, 'Telecom Pro', 
   'Prélèvement', 'payé', 1, 1),
   
  ('2025-07-28', 'Achat matériel pédagogique', 'Matériel pédagogique', 
   230.45, 46.09, 'EducStore', 
   'Carte bancaire', 'en attente', 1, 1);

-- Insertion de dépenses pour le bureau 2 (enregistrées en juillet 2025)
INSERT INTO depense (
  date_depense, description_depense, categorie_depense, 
  montant_depense, tva_depense, fournisseur_depense, 
  mode_paiement_depense, statut_depense, id_bureau, id_ecole
) VALUES
  ('2025-07-03', 'Fournitures administratives', 'Fournitures', 
   95.20, 19.04, 'Office Depot', 
   'Carte bancaire', 'payé', 2, 1),
   
  ('2025-07-07', 'Carburant véhicules', 'Carburant', 
   110.50, 22.10, 'Shell', 
   'Carte carburant', 'payé', 2, 1),
   
  ('2025-07-10', 'Abonnement logiciel comptabilité', 'Informatique', 
   79.99, 16.00, 'ComptaSoft', 
   'Prélèvement', 'payé', 2, 1),
   
  ('2025-07-14', 'Entretien locaux', 'Entretien', 
   180.00, 36.00, 'CleanPro Services', 
   'Virement', 'payé', 2, 1),
   
  ('2025-07-17', 'Révision véhicule immatriculation EF-456-GH', 'Entretien véhicules', 
   320.30, 64.06, 'AutoMécanique', 
   'Chèque', 'payé', 2, 1),
   
  ('2025-07-20', 'Impression flyers publicitaires', 'Marketing', 
   135.80, 27.16, 'PrintExpress', 
   'Carte bancaire', 'payé', 2, 1),
   
  ('2025-07-23', 'Loyer annexe', 'Loyer', 
   850.00, 170.00, 'Immobilier Gestion', 
   'Virement', 'payé', 2, 1),
   
  ('2025-07-26', 'Facture électricité', 'Énergie', 
   145.60, 29.12, 'EDF Pro', 
   'Prélèvement', 'payé', 2, 1);

-- Insertion de dépenses pour le bureau 1 (enregistrées en juin 2025)
INSERT INTO depense (
  date_depense, description_depense, categorie_depense, 
  montant_depense, tva_depense, fournisseur_depense, 
  mode_paiement_depense, statut_depense, id_bureau, id_ecole
) VALUES
  ('2025-06-04', 'Achat papeterie', 'Fournitures', 
   75.30, 15.06, 'Bureau Plus', 
   'Carte bancaire', 'payé', 1, 1),
   
  ('2025-06-08', 'Carburant véhicules école', 'Carburant', 
   92.40, 18.48, 'Total Energies', 
   'Carte carburant', 'payé', 1, 1),
   
  ('2025-06-12', 'Maintenance site web', 'Informatique', 
   250.00, 50.00, 'WebDev Agency', 
   'Virement', 'payé', 1, 1),
   
  ('2025-06-15', 'Assurance responsabilité civile', 'Assurance', 
   450.00, 0.00, 'AssurPro', 
   'Prélèvement', 'payé', 1, 1),
   
  ('2025-06-18', 'Remplacement pneus véhicule immatriculation AB-123-CD', 'Entretien véhicules', 
   380.00, 76.00, 'PneuExpress', 
   'Carte bancaire', 'payé', 1, 1),
   
  ('2025-06-22', 'Loyer bureau principal', 'Loyer', 
   1200.00, 240.00, 'SCI Immobilier', 
   'Virement', 'payé', 1, 1),
   
  ('2025-06-25', 'Facture téléphonie et internet', 'Télécommunications', 
   89.90, 17.98, 'Telecom Pro', 
   'Prélèvement', 'payé', 1, 1),
   
  ('2025-06-28', 'Formation continue moniteurs', 'Formation', 
   550.00, 110.00, 'FormaPro', 
   'Virement', 'en attente', 1, 1);

-- Insertion de dépenses pour le bureau 2 (enregistrées en juin 2025)
INSERT INTO depense (
  date_depense, description_depense, categorie_depense, 
  montant_depense, tva_depense, fournisseur_depense, 
  mode_paiement_depense, statut_depense, id_bureau, id_ecole
) VALUES
  ('2025-06-05', 'Fournitures bureau', 'Fournitures', 
   68.75, 13.75, 'Office Depot', 
   'Carte bancaire', 'payé', 2, 1),
   
  ('2025-06-09', 'Carburant', 'Carburant', 
   105.20, 21.04, 'Shell', 
   'Carte carburant', 'payé', 2, 1),
   
  ('2025-06-14', 'Abonnement logiciel planning', 'Informatique', 
   59.99, 12.00, 'PlanningPro', 
   'Prélèvement', 'payé', 2, 1),
   
  ('2025-06-17', 'Entretien climatisation', 'Entretien', 
   220.00, 44.00, 'ClimaService', 
   'Chèque', 'payé', 2, 1),
   
  ('2025-06-20', 'Contrôle technique véhicule immatriculation EF-456-GH', 'Entretien véhicules', 
   85.00, 17.00, 'ControlAuto', 
   'Carte bancaire', 'payé', 2, 1),
   
  ('2025-06-23', 'Loyer annexe', 'Loyer', 
   850.00, 170.00, 'Immobilier Gestion', 
   'Virement', 'payé', 2, 1),
   
  ('2025-06-26', 'Facture eau', 'Énergie', 
   65.40, 3.27, 'Eau Services', 
   'Prélèvement', 'payé', 2, 1),
   
  ('2025-06-29', 'Achat matériel examen', 'Matériel pédagogique', 
   175.50, 35.10, 'EducStore', 
   'Carte bancaire', 'payé', 2, 1);
