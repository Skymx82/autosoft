-- Script d'insertion de données de test pour les moniteurs (enseignants)
-- Création de moniteurs pour les bureaux 1 et 2 de l'auto-école 1

-- Insertion de moniteurs pour le bureau 1
INSERT INTO enseignants (
  id_moniteur, nom, prenom, email, tel, num_enseignant, date_delivrance_num, id_ecole
) VALUES
  (1, 'Dubois', 'Pierre', 'pierre.dubois@autosoft.fr', '0612345678', 'ENS-001', '2020-05-15', 1),
  (2, 'Martin', 'Sophie', 'sophie.martin@autosoft.fr', '0623456789', 'ENS-002', '2019-03-10', 1),
  (3, 'Leroy', 'Thomas', 'thomas.leroy@autosoft.fr', '0634567890', 'ENS-003', '2021-07-22', 1);

-- Insertion de moniteurs pour le bureau 2
INSERT INTO enseignants (
  id_moniteur, nom, prenom, email, tel, num_enseignant, date_delivrance_num, id_ecole
) VALUES
  (4, 'Moreau', 'Julie', 'julie.moreau@autosoft.fr', '0645678901', 'ENS-004', '2018-11-05', 1),
  (5, 'Petit', 'Nicolas', 'nicolas.petit@autosoft.fr', '0656789012', 'ENS-005', '2022-01-18', 1),
  (6, 'Roux', 'Camille', 'camille.roux@autosoft.fr', '0667890123', 'ENS-006', '2020-09-30', 1);

-- Mise à jour des moniteurs pour les associer à leurs bureaux respectifs
UPDATE enseignants SET id_bureau = 1 WHERE id_moniteur IN (1, 2, 3);
UPDATE enseignants SET id_bureau = 2 WHERE id_moniteur IN (4, 5, 6);
