-- Script d'insertion de données de test pour le planning
-- Création de leçons de conduite pour les bureaux 1 et 2 de l'auto-école 1

-- Supprimer les données existantes pour éviter les doublons
DELETE FROM planning WHERE id_ecole = 1;

-- Définition des dates pour le mois actuel (mai 2025)

-- BUREAU 1 - MONITEURS 1 et 3
-- BUREAU 2 - MONITEURS 4, 5 et 6

-- Insertion de leçons pour le bureau 1 (moniteur 1)
INSERT INTO planning (
  date, heure_debut, heure_fin, type_lecon, id_moniteur, id_eleve, 
  statut_lecon, id_bureau, id_ecole
) VALUES
  -- 6 mai 2025 - Moniteur 1 (bureau 1) - Journée partiellement occupée
  ('2025-05-06', '09:00:00', '10:30:00', 'B manuelle', 1, 1, 'Prévue', 1, 1),
  ('2025-05-06', '11:00:00', '12:00:00', 'B manuelle', 1, 2, 'Prévue', 1, 1),
  ('2025-05-06', '14:00:00', '15:00:00', 'B manuelle', 1, 3, 'Prévue', 1, 1),
  
  -- 6 mai 2025 - Moniteur 3 (bureau 1) - Journée complètement occupée
  ('2025-05-06', '08:00:00', '09:30:00', 'B manuelle', 3, 4, 'Prévue', 1, 1),
  ('2025-05-06', '10:00:00', '11:30:00', 'B manuelle', 3, 5, 'Prévue', 1, 1),
  ('2025-05-06', '12:00:00', '13:30:00', 'B manuelle', 3, 6, 'Prévue', 1, 1),
  ('2025-05-06', '14:00:00', '15:30:00', 'B manuelle', 3, 7, 'Prévue', 1, 1),
  ('2025-05-06', '16:00:00', '17:30:00', 'B manuelle', 3, 8, 'Prévue', 1, 1),
  ('2025-05-06', '18:00:00', '19:30:00', 'B manuelle', 3, 9, 'Prévue', 1, 1);

-- Insertion de leçons pour le bureau 2 (moniteurs 4, 5, 6)
INSERT INTO planning (
  date, heure_debut, heure_fin, type_lecon, id_moniteur, id_eleve, 
  statut_lecon, id_bureau, id_ecole
) VALUES
  -- 6 mai 2025 - Moniteur 4 (bureau 2) - Journée partiellement occupée
  ('2025-05-06', '09:00:00', '10:30:00', 'B manuelle', 4, 10, 'Prévue', 2, 1),
  ('2025-05-06', '11:00:00', '12:00:00', 'B manuelle', 4, 11, 'Prévue', 2, 1),
  
  -- 6 mai 2025 - Moniteur 5 (bureau 2) - Journée partiellement occupée (matin)
  ('2025-05-06', '08:00:00', '09:30:00', 'B manuelle', 5, 12, 'Prévue', 2, 1),
  ('2025-05-06', '10:00:00', '11:30:00', 'B manuelle', 5, 13, 'Prévue', 2, 1),
  ('2025-05-06', '12:00:00', '13:00:00', 'B manuelle', 5, 14, 'Prévue', 2, 1),
  
  -- 6 mai 2025 - Moniteur 6 (bureau 2) - Journée partiellement occupée (après-midi)
  ('2025-05-06', '14:00:00', '15:30:00', 'B manuelle', 6, 15, 'Prévue', 2, 1),
  ('2025-05-06', '16:00:00', '17:30:00', 'B manuelle', 6, 16, 'Prévue', 2, 1);

-- 7 mai 2025 - Tous les moniteurs sont complètement occupés
INSERT INTO planning (
  date, heure_debut, heure_fin, type_lecon, id_moniteur, id_eleve, 
  statut_lecon, id_bureau, id_ecole
) VALUES
  -- Moniteur 1 (bureau 1)
  ('2025-05-07', '08:00:00', '09:30:00', 'B manuelle', 1, 1, 'Prévue', 1, 1),
  ('2025-05-07', '10:00:00', '11:30:00', 'B manuelle', 1, 2, 'Prévue', 1, 1),
  ('2025-05-07', '12:00:00', '13:30:00', 'B manuelle', 1, 3, 'Prévue', 1, 1),
  ('2025-05-07', '14:00:00', '15:30:00', 'B manuelle', 1, 4, 'Prévue', 1, 1),
  ('2025-05-07', '16:00:00', '17:30:00', 'B manuelle', 1, 5, 'Prévue', 1, 1),
  ('2025-05-07', '18:00:00', '19:30:00', 'B manuelle', 1, 6, 'Prévue', 1, 1),
  
  -- Moniteur 3 (bureau 1)
  ('2025-05-07', '08:00:00', '09:30:00', 'B manuelle', 3, 7, 'Prévue', 1, 1),
  ('2025-05-07', '10:00:00', '11:30:00', 'B manuelle', 3, 8, 'Prévue', 1, 1),
  ('2025-05-07', '12:00:00', '13:30:00', 'B manuelle', 3, 9, 'Prévue', 1, 1),
  ('2025-05-07', '14:00:00', '15:30:00', 'B manuelle', 3, 10, 'Prévue', 1, 1),
  ('2025-05-07', '16:00:00', '17:30:00', 'B manuelle', 3, 11, 'Prévue', 1, 1),
  ('2025-05-07', '18:00:00', '19:30:00', 'B manuelle', 3, 12, 'Prévue', 1, 1),
  
  -- Moniteur 4 (bureau 2)
  ('2025-05-07', '08:00:00', '09:30:00', 'B manuelle', 4, 13, 'Prévue', 2, 1),
  ('2025-05-07', '10:00:00', '11:30:00', 'B manuelle', 4, 14, 'Prévue', 2, 1),
  ('2025-05-07', '12:00:00', '13:30:00', 'B manuelle', 4, 15, 'Prévue', 2, 1),
  ('2025-05-07', '14:00:00', '15:30:00', 'B manuelle', 4, 16, 'Prévue', 2, 1),
  ('2025-05-07', '16:00:00', '17:30:00', 'B manuelle', 4, 17, 'Prévue', 2, 1),
  ('2025-05-07', '18:00:00', '19:30:00', 'B manuelle', 4, 18, 'Prévue', 2, 1),
  
  -- Moniteur 5 (bureau 2)
  ('2025-05-07', '08:00:00', '09:30:00', 'B manuelle', 5, 19, 'Prévue', 2, 1),
  ('2025-05-07', '10:00:00', '11:30:00', 'B manuelle', 5, 20, 'Prévue', 2, 1),
  ('2025-05-07', '12:00:00', '13:30:00', 'B manuelle', 5, 1, 'Prévue', 2, 1),
  ('2025-05-07', '14:00:00', '15:30:00', 'B manuelle', 5, 2, 'Prévue', 2, 1),
  ('2025-05-07', '16:00:00', '17:30:00', 'B manuelle', 5, 3, 'Prévue', 2, 1),
  ('2025-05-07', '18:00:00', '19:30:00', 'B manuelle', 5, 4, 'Prévue', 2, 1),
  
  -- Moniteur 6 (bureau 2)
  ('2025-05-07', '08:00:00', '09:30:00', 'B manuelle', 6, 5, 'Prévue', 2, 1),
  ('2025-05-07', '10:00:00', '11:30:00', 'B manuelle', 6, 6, 'Prévue', 2, 1),
  ('2025-05-07', '12:00:00', '13:30:00', 'B manuelle', 6, 7, 'Prévue', 2, 1),
  ('2025-05-07', '14:00:00', '15:30:00', 'B manuelle', 6, 8, 'Prévue', 2, 1),
  ('2025-05-07', '16:00:00', '17:30:00', 'B manuelle', 6, 9, 'Prévue', 2, 1),
  ('2025-05-07', '18:00:00', '19:30:00', 'B manuelle', 6, 10, 'Prévue', 2, 1);

-- 8 mai 2025 - Aucun moniteur n'est occupé (jour férié)

-- 9 mai 2025 - Quelques moniteurs sont partiellement occupés
INSERT INTO planning (
  date, heure_debut, heure_fin, type_lecon, id_moniteur, id_eleve, 
  statut_lecon, id_bureau, id_ecole
) VALUES
  -- Moniteur 1 (bureau 1) - Matin seulement
  ('2025-05-09', '08:00:00', '09:30:00', 'B manuelle', 1, 1, 'Prévue', 1, 1),
  ('2025-05-09', '10:00:00', '11:30:00', 'B manuelle', 1, 2, 'Prévue', 1, 1),
  
  -- Moniteur 4 (bureau 2) - Après-midi seulement
  ('2025-05-09', '14:00:00', '15:30:00', 'B manuelle', 4, 13, 'Prévue', 2, 1),
  ('2025-05-09', '16:00:00', '17:30:00', 'B manuelle', 4, 14, 'Prévue', 2, 1);
