-- Script d'insertion de données de test pour les élèves
-- Création d'élèves pour les bureaux 1 et 2 de l'auto-école 1
-- Avec des inscriptions réparties sur le mois actuel et le mois précédent

-- Définition des dates pour le mois actuel (mai 2025) et le mois précédent (avril 2025)
-- Mois actuel: mai 2025
-- Mois précédent: avril 2025

-- Insertion d'élèves pour le bureau 1 (inscrits en mai 2025)
INSERT INTO eleves (
  nom, prenom, mail, tel, categorie, neph, genre, naiss, 
  pays_naiss, dep_naiss, ville_naiss, code, interesse_code, 
  profession, type_financeur, adresse, code_postal, ville, pays,
  service_national, journee_defense, date_inscription, statut_dossier,
  id_bureau, id_ecole
) VALUES
  ('Dupont', 'Jean', 'jean.dupont@email.com', '0612345678', 'B', 'NEPH123456', 'Homme', '2000-05-15', 
   'France', '75', 'Paris', TRUE, FALSE, 'Étudiant', 'CPF', '1 rue de Paris', '75001', 'Paris', 'France',
   TRUE, TRUE, '2025-05-02', 'Complet', 1, 1),
   
  ('Martin', 'Sophie', 'sophie.martin@email.com', '0623456789', 'B', 'NEPH234567', 'Femme', '1998-07-20', 
   'France', '75', 'Paris', FALSE, TRUE, 'Employée', 'Personnel', '2 avenue des Champs', '75008', 'Paris', 'France',
   FALSE, TRUE, '2025-05-05', 'En attente', 1, 1),
   
  ('Petit', 'Thomas', 'thomas.petit@email.com', '0634567890', 'A', 'NEPH345678', 'Homme', '2002-03-10', 
   'France', '92', 'Nanterre', TRUE, FALSE, 'Étudiant', 'CPF', '3 rue de Nanterre', '92000', 'Nanterre', 'France',
   TRUE, TRUE, '2025-05-08', 'Complet', 1, 1),
   
  ('Leroy', 'Emma', 'emma.leroy@email.com', '0645678901', 'B', 'NEPH456789', 'Femme', '1995-11-25', 
   'France', '75', 'Paris', TRUE, FALSE, 'Cadre', 'Entreprise', '4 boulevard Haussmann', '75009', 'Paris', 'France',
   FALSE, TRUE, '2025-05-10', 'Complet', 1, 1),
   
  ('Moreau', 'Lucas', 'lucas.moreau@email.com', '0656789012', 'B', 'NEPH567890', 'Homme', '1999-08-30', 
   'France', '94', 'Créteil', FALSE, TRUE, 'Étudiant', 'Personnel', '5 avenue de Créteil', '94000', 'Créteil', 'France',
   TRUE, TRUE, '2025-05-12', 'Incomplet', 1, 1);

-- Insertion d'élèves pour le bureau 2 (inscrits en mai 2025)
INSERT INTO eleves (
  nom, prenom, mail, tel, categorie, neph, genre, naiss, 
  pays_naiss, dep_naiss, ville_naiss, code, interesse_code, 
  profession, type_financeur, adresse, code_postal, ville, pays,
  service_national, journee_defense, date_inscription, statut_dossier,
  id_bureau, id_ecole
) VALUES
  ('Dubois', 'Chloé', 'chloe.dubois@email.com', '0667890123', 'B', 'NEPH678901', 'Femme', '2001-02-14', 
   'France', '78', 'Versailles', TRUE, FALSE, 'Étudiante', 'CPF', '6 rue de Versailles', '78000', 'Versailles', 'France',
   FALSE, TRUE, '2025-05-03', 'Complet', 2, 1),
   
  ('Bernard', 'Antoine', 'antoine.bernard@email.com', '0678901234', 'B', 'NEPH789012', 'Homme', '1997-09-05', 
   'France', '91', 'Évry', FALSE, TRUE, 'Employé', 'Pôle Emploi', '7 boulevard d''Évry', '91000', 'Évry', 'France',
   TRUE, TRUE, '2025-05-07', 'En attente', 2, 1),
   
  ('Thomas', 'Léa', 'lea.thomas@email.com', '0689012345', 'A', 'NEPH890123', 'Femme', '2000-12-18', 
   'France', '77', 'Melun', TRUE, FALSE, 'Étudiante', 'Personnel', '8 avenue de Melun', '77000', 'Melun', 'France',
   FALSE, TRUE, '2025-05-09', 'Complet', 2, 1),
   
  ('Robert', 'Hugo', 'hugo.robert@email.com', '0690123456', 'B', 'NEPH901234', 'Homme', '1996-04-22', 
   'France', '95', 'Cergy', TRUE, FALSE, 'Employé', 'CPF', '9 rue de Cergy', '95000', 'Cergy', 'France',
   TRUE, TRUE, '2025-05-11', 'Complet', 2, 1);

-- Insertion d'élèves pour le bureau 1 (inscrits en avril 2025)
INSERT INTO eleves (
  nom, prenom, mail, tel, categorie, neph, genre, naiss, 
  pays_naiss, dep_naiss, ville_naiss, code, interesse_code, 
  profession, type_financeur, adresse, code_postal, ville, pays,
  service_national, journee_defense, date_inscription, statut_dossier,
  id_bureau, id_ecole
) VALUES
  ('Richard', 'Camille', 'camille.richard@email.com', '0601234567', 'B', 'NEPH012345', 'Femme', '1999-01-10', 
   'France', '75', 'Paris', TRUE, FALSE, 'Étudiante', 'Personnel', '10 rue de Rivoli', '75004', 'Paris', 'France',
   FALSE, TRUE, '2025-04-05', 'Complet', 1, 1),
   
  ('Durand', 'Maxime', 'maxime.durand@email.com', '0612345670', 'B', 'NEPH123450', 'Homme', '1998-06-15', 
   'France', '92', 'Boulogne', FALSE, TRUE, 'Employé', 'Entreprise', '11 avenue de Boulogne', '92100', 'Boulogne', 'France',
   TRUE, TRUE, '2025-04-10', 'En attente', 1, 1),
   
  ('Laurent', 'Julie', 'julie.laurent@email.com', '0623456780', 'A', 'NEPH234560', 'Femme', '2002-08-20', 
   'France', '93', 'Saint-Denis', TRUE, FALSE, 'Étudiante', 'CPF', '12 rue de Saint-Denis', '93200', 'Saint-Denis', 'France',
   FALSE, TRUE, '2025-04-15', 'Complet', 1, 1),
   
  ('Simon', 'Alexandre', 'alexandre.simon@email.com', '0634567890', 'B', 'NEPH345670', 'Homme', '1997-03-25', 
   'France', '94', 'Vincennes', TRUE, FALSE, 'Cadre', 'Personnel', '13 avenue de Vincennes', '94300', 'Vincennes', 'France',
   TRUE, TRUE, '2025-04-20', 'Complet', 1, 1),
   
  ('Michel', 'Manon', 'manon.michel@email.com', '0645678900', 'B', 'NEPH456780', 'Femme', '2000-10-30', 
   'France', '75', 'Paris', FALSE, TRUE, 'Étudiante', 'Pôle Emploi', '14 boulevard Saint-Michel', '75005', 'Paris', 'France',
   FALSE, TRUE, '2025-04-25', 'Incomplet', 1, 1),
   
  ('Lefebvre', 'Nicolas', 'nicolas.lefebvre@email.com', '0656789010', 'B', 'NEPH567890', 'Homme', '1996-12-05', 
   'France', '91', 'Massy', TRUE, FALSE, 'Employé', 'CPF', '15 rue de Massy', '91300', 'Massy', 'France',
   TRUE, TRUE, '2025-04-28', 'Complet', 1, 1);

-- Insertion d'élèves pour le bureau 2 (inscrits en avril 2025)
INSERT INTO eleves (
  nom, prenom, mail, tel, categorie, neph, genre, naiss, 
  pays_naiss, dep_naiss, ville_naiss, code, interesse_code, 
  profession, type_financeur, adresse, code_postal, ville, pays,
  service_national, journee_defense, date_inscription, statut_dossier,
  id_bureau, id_ecole
) VALUES
  ('Fournier', 'Lucie', 'lucie.fournier@email.com', '0667890120', 'B', 'NEPH678901', 'Femme', '2001-05-12', 
   'France', '78', 'Saint-Germain', TRUE, FALSE, 'Étudiante', 'Personnel', '16 rue de Saint-Germain', '78100', 'Saint-Germain', 'France',
   FALSE, TRUE, '2025-04-03', 'Complet', 2, 1),
   
  ('Girard', 'Théo', 'theo.girard@email.com', '0678901230', 'B', 'NEPH789012', 'Homme', '1999-07-18', 
   'France', '95', 'Argenteuil', FALSE, TRUE, 'Étudiant', 'CPF', '17 avenue d''Argenteuil', '95100', 'Argenteuil', 'France',
   TRUE, TRUE, '2025-04-08', 'En attente', 2, 1),
   
  ('Bonnet', 'Clara', 'clara.bonnet@email.com', '0689012340', 'A', 'NEPH890123', 'Femme', '2000-09-22', 
   'France', '77', 'Meaux', TRUE, FALSE, 'Étudiante', 'Personnel', '18 boulevard de Meaux', '77100', 'Meaux', 'France',
   FALSE, TRUE, '2025-04-12', 'Complet', 2, 1),
   
  ('Rousseau', 'Mathis', 'mathis.rousseau@email.com', '0690123450', 'B', 'NEPH901234', 'Homme', '1998-11-28', 
   'France', '91', 'Palaiseau', TRUE, FALSE, 'Employé', 'Entreprise', '19 rue de Palaiseau', '91120', 'Palaiseau', 'France',
   TRUE, TRUE, '2025-04-18', 'Complet', 2, 1),
   
  ('Mercier', 'Inès', 'ines.mercier@email.com', '0601234560', 'B', 'NEPH012345', 'Femme', '2002-01-15', 
   'France', '92', 'Neuilly', FALSE, TRUE, 'Étudiante', 'CPF', '20 avenue de Neuilly', '92200', 'Neuilly', 'France',
   FALSE, TRUE, '2025-04-23', 'Incomplet', 2, 1);
