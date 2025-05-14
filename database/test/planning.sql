-- Script d'insertion de données de test pour le planning
-- Création de leçons de conduite pour les bureaux 1 et 2 de l'auto-école 1
-- Avec des leçons réparties sur le mois actuel et le mois précédent

-- Définition des dates pour le mois actuel (mai 2025) et le mois précédent (avril 2025)

-- Insertion de leçons pour le bureau 1 (réalisées en mai 2025)
INSERT INTO planning (
  date, heure_debut, heure_fin, type_lecon, id_moniteur, id_eleve, 
  statut_lecon, id_bureau, id_ecole
) VALUES
  -- Semaine 1 de mai 2025
  ('2025-05-02', '09:00:00', '10:00:00', 'B manuelle', 1, 1, 'Réalisée', 1, 1),
  ('2025-05-02', '10:30:00', '11:30:00', 'B manuelle', 1, 2, 'Réalisée', 1, 1),
  ('2025-05-02', '14:00:00', '15:00:00', 'B manuelle', 1, 3, 'Réalisée', 1, 1),
  ('2025-05-03', '09:00:00', '10:00:00', 'B manuelle', 1, 1, 'Réalisée', 1, 1),
  ('2025-05-03', '10:30:00', '12:00:00', 'B manuelle', 1, 4, 'Réalisée', 1, 1),
  ('2025-05-03', '14:00:00', '15:30:00', 'A', 1, 5, 'Réalisée', 1, 1),
  
  -- Semaine 2 de mai 2025
  ('2025-05-06', '09:00:00', '10:30:00', 'B manuelle', 1, 1, 'Réalisée', 1, 1),
  ('2025-05-06', '11:00:00', '12:00:00', 'B manuelle', 1, 2, 'Réalisée', 1, 1),
  ('2025-05-06', '14:00:00', '15:00:00', 'B manuelle', 1, 3, 'Réalisée', 1, 1),
  ('2025-05-07', '09:00:00', '10:30:00', 'B manuelle', 1, 4, 'Réalisée', 1, 1),
  ('2025-05-07', '11:00:00', '12:30:00', 'B manuelle', 1, 5, 'Réalisée', 1, 1),
  ('2025-05-07', '14:00:00', '15:00:00', 'A', 1, 3, 'Réalisée', 1, 1),
  
  -- Quelques leçons non réalisées ou prévues (ne devraient pas être comptées)
  ('2025-05-08', '09:00:00', '10:00:00', 'B manuelle', 1, 1, 'Annulée', 1, 1),
  ('2025-05-09', '10:00:00', '11:00:00', 'B manuelle', 1, 2, 'Prévue', 1, 1),
  ('2025-05-10', '14:00:00', '15:00:00', 'B manuelle', 1, 3, 'Prévue', 1, 1);

-- Insertion de leçons pour le bureau 2 (réalisées en mai 2025)
INSERT INTO planning (
  date, heure_debut, heure_fin, type_lecon, id_moniteur, id_eleve, 
  statut_lecon, id_bureau, id_ecole
) VALUES
  -- Semaine 1 de mai 2025
  ('2025-05-02', '09:00:00', '10:00:00', 'B manuelle', 2, 6, 'Réalisée', 2, 1),
  ('2025-05-02', '10:30:00', '11:30:00', 'B manuelle', 2, 7, 'Réalisée', 2, 1),
  ('2025-05-02', '14:00:00', '15:00:00', 'A', 2, 8, 'Réalisée', 2, 1),
  ('2025-05-03', '09:00:00', '10:00:00', 'B manuelle', 2, 6, 'Réalisée', 2, 1),
  ('2025-05-03', '10:30:00', '12:00:00', 'B manuelle', 2, 7, 'Réalisée', 2, 1),
  
  -- Semaine 2 de mai 2025
  ('2025-05-06', '09:00:00', '10:30:00', 'B manuelle', 2, 6, 'Réalisée', 2, 1),
  ('2025-05-06', '11:00:00', '12:00:00', 'B manuelle', 2, 9, 'Réalisée', 2, 1),
  ('2025-05-07', '09:00:00', '10:30:00', 'B manuelle', 2, 7, 'Réalisée', 2, 1),
  ('2025-05-07', '11:00:00', '12:30:00', 'B manuelle', 2, 8, 'Réalisée', 2, 1);

-- Insertion de leçons pour le bureau 1 (réalisées en avril 2025)
INSERT INTO planning (
  date, heure_debut, heure_fin, type_lecon, id_moniteur, id_eleve, 
  statut_lecon, id_bureau, id_ecole
) VALUES
  -- Semaine 1 d'avril 2025
  ('2025-04-02', '09:00:00', '10:00:00', 'B manuelle', 1, 10, 'Réalisée', 1, 1),
  ('2025-04-02', '10:30:00', '11:30:00', 'B manuelle', 1, 11, 'Réalisée', 1, 1),
  ('2025-04-02', '14:00:00', '15:00:00', 'B manuelle', 1, 12, 'Réalisée', 1, 1),
  ('2025-04-03', '09:00:00', '10:00:00', 'B manuelle', 1, 10, 'Réalisée', 1, 1),
  ('2025-04-03', '10:30:00', '12:00:00', 'B manuelle', 1, 11, 'Réalisée', 1, 1),
  
  -- Semaine 2 d'avril 2025
  ('2025-04-09', '09:00:00', '10:30:00', 'B manuelle', 1, 10, 'Réalisée', 1, 1),
  ('2025-04-09', '11:00:00', '12:00:00', 'B manuelle', 1, 13, 'Réalisée', 1, 1),
  ('2025-04-10', '09:00:00', '10:30:00', 'B manuelle', 1, 14, 'Réalisée', 1, 1),
  ('2025-04-10', '11:00:00', '12:30:00', 'B manuelle', 1, 15, 'Réalisée', 1, 1),
  
  -- Semaine 3 d'avril 2025
  ('2025-04-16', '09:00:00', '10:00:00', 'B manuelle', 1, 10, 'Réalisée', 1, 1),
  ('2025-04-16', '10:30:00', '11:30:00', 'B manuelle', 1, 11, 'Réalisée', 1, 1),
  ('2025-04-17', '09:00:00', '10:00:00', 'B manuelle', 1, 12, 'Réalisée', 1, 1),
  ('2025-04-17', '10:30:00', '12:00:00', 'B manuelle', 1, 13, 'Réalisée', 1, 1);

-- Insertion de leçons pour le bureau 2 (réalisées en avril 2025)
INSERT INTO planning (
  date, heure_debut, heure_fin, type_lecon, id_moniteur, id_eleve, 
  statut_lecon, id_bureau, id_ecole
) VALUES
  -- Semaine 1 d'avril 2025
  ('2025-04-02', '09:00:00', '10:00:00', 'B manuelle', 2, 16, 'Réalisée', 2, 1),
  ('2025-04-02', '10:30:00', '11:30:00', 'B manuelle', 2, 17, 'Réalisée', 2, 1),
  ('2025-04-03', '09:00:00', '10:00:00', 'B manuelle', 2, 16, 'Réalisée', 2, 1),
  ('2025-04-03', '10:30:00', '12:00:00', 'B manuelle', 2, 17, 'Réalisée', 2, 1),
  
  -- Semaine 2 d'avril 2025
  ('2025-04-09', '09:00:00', '10:30:00', 'B manuelle', 2, 16, 'Réalisée', 2, 1),
  ('2025-04-09', '11:00:00', '12:00:00', 'B manuelle', 2, 18, 'Réalisée', 2, 1),
  ('2025-04-10', '09:00:00', '10:30:00', 'A', 2, 19, 'Réalisée', 2, 1),
  ('2025-04-10', '11:00:00', '12:30:00', 'B manuelle', 2, 20, 'Réalisée', 2, 1);
