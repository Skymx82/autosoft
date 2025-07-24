-- Script d'insertion de données de test pour les recettes
-- Création de recettes pour les bureaux 1 et 2 de l'auto-école 1
-- Avec des recettes réparties sur le mois actuel (juillet 2025) et le mois précédent (juin 2025)

-- Définition des dates pour le mois actuel (juillet 2025) et le mois précédent (juin 2025)
-- Mois actuel: juillet 2025
-- Mois précédent: juin 2025

-- Insertion de recettes pour le bureau 1 (enregistrées en juillet 2025)
INSERT INTO recette (
  date_recette, description_recette, categorie_recette, 
  montant_recette, tva_recette, client_recette, 
  mode_paiement_recette, statut_recette, id_bureau, id_ecole
) VALUES
  ('2025-07-02', 'Forfait code de la route', 'Forfait code', 
   250.00, 50.00, 2, 
   'Carte bancaire', 'encaissé', 1, 1),
   
  ('2025-07-05', 'Forfait 20h de conduite', 'Forfait conduite', 
   800.00, 160.00, 2, 
   'Virement', 'encaissé', 1, 1),
   
  ('2025-07-08', '5 heures supplémentaires', 'Heures supplémentaires', 
   225.00, 45.00, 3, 
   'Chèque', 'en attente', 1, 1),
   
  ('2025-07-12', 'Permis B complet', 'Forfait complet', 
   1200.00, 240.00, 4, 
   'Espèces', 'encaissé', 1, 1),
   
  ('2025-07-15', 'Présentation à lexamen', 'Examen pratique', 
   70.00, 14.00, 5, 
   'Carte bancaire', 'encaissé', 1, 1),
   
  ('2025-07-18', 'Stage intensif permis B', 'Forfait accéléré', 
   1500.00, 300.00, 6, 
   'Virement', 'en attente', 1, 1),
   
  ('2025-07-22', 'Évaluation de conduite', 'Évaluation', 
   45.00, 9.00, 7, 
   'Carte bancaire', 'encaissé', 1, 1),
   
  ('2025-07-25', 'Renouvellement code', 'Renouvellement', 
   120.00, 24.00, 8, 
   'Chèque', 'encaissé', 1, 1),
   
  ('2025-07-28', 'Accompagnement examen code', 'Accompagnement', 
   35.00, 7.00, 9, 
   'Espèces', 'encaissé', 1, 1);

-- Insertion de recettes pour le bureau 2 (enregistrées en juillet 2025)
INSERT INTO recette (
  date_recette, description_recette, categorie_recette, 
  montant_recette, tva_recette, client_recette, 
  mode_paiement_recette, statut_recette, id_bureau, id_ecole
) VALUES
  ('2025-07-03', 'Forfait code en ligne', 'Forfait code', 
   180.00, 36.00, 10, 
   'Carte bancaire', 'encaissé', 2, 1),
   
  ('2025-07-07', 'Forfait 15h de conduite', 'Forfait conduite', 
   650.00, 130.00, 11, 
   'Virement', 'encaissé', 2, 1),
   
  ('2025-07-10', '3 heures supplémentaires', 'Heures supplémentaires', 
   135.00, 27.00, 12, 
   'Carte bancaire', 'encaissé', 2, 1),
   
  ('2025-07-14', 'Permis A2 complet', 'Forfait complet', 
   950.00, 190.00, 13, 
   'Chèque', 'encaissé', 2, 1),
   
  ('2025-07-17', 'Présentation à lexamen moto', 'Examen pratique', 
   80.00, 16.00, 14, 
   'Carte bancaire', 'encaissé', 2, 1),
   
  ('2025-07-20', 'Stage code intensif', 'Stage', 
   320.00, 64.00, 15, 
   'Virement', 'en attente', 2, 1),
   
  ('2025-07-23', 'Passerelle A2 vers A', 'Formation complémentaire', 
   390.00, 78.00, 16, 
   'Carte bancaire', 'encaissé', 2, 1),
   
  ('2025-07-26', 'Renouvellement code moto', 'Renouvellement', 
   110.00, 22.00, 17, 
   'Espèces', 'encaissé', 2, 1);

-- Insertion de recettes pour le bureau 1 (enregistrées en juin 2025)
INSERT INTO recette (
  date_recette, description_recette, categorie_recette, 
  montant_recette, tva_recette, client_recette, 
  mode_paiement_recette, statut_recette, id_bureau, id_ecole
) VALUES
  ('2025-06-04', 'Forfait code de la route', 'Forfait code', 
   250.00, 50.00, 2, 
   'Carte bancaire', 'encaissé', 1, 1),
   
  ('2025-06-08', 'Forfait 20h de conduite', 'Forfait conduite', 
   800.00, 160.00, 2, 
   'Virement', 'encaissé', 1, 1),
   
  ('2025-06-12', 'Permis B complet', 'Forfait complet', 
   1200.00, 240.00, 3, 
   'Chèque', 'encaissé', 1, 1),
   
  ('2025-06-16', 'Présentation à lexamen', 'Examen pratique', 
   70.00, 14.00, 4, 
   'Carte bancaire', 'encaissé', 1, 1),
   
  ('2025-06-20', 'Stage intensif permis B', 'Forfait accéléré', 
   1500.00, 300.00, 5, 
   'Virement', 'encaissé', 1, 1),
   
  ('2025-06-24', 'Évaluation de conduite', 'Évaluation', 
   45.00, 9.00, 6, 
   'Carte bancaire', 'encaissé', 1, 1),
   
  ('2025-06-28', 'Renouvellement code', 'Renouvellement', 
   120.00, 24.00, 7, 
   'Chèque', 'encaissé', 1, 1);

-- Insertion de recettes pour le bureau 2 (enregistrées en juin 2025)
INSERT INTO recette (
  date_recette, description_recette, categorie_recette, 
  montant_recette, tva_recette, client_recette, 
  mode_paiement_recette, statut_recette, id_bureau, id_ecole
) VALUES
  ('2025-06-05', 'Forfait code en ligne', 'Forfait code', 
   180.00, 36.00, 8, 
   'Carte bancaire', 'encaissé', 2, 1),
   
  ('2025-06-09', 'Forfait 15h de conduite', 'Forfait conduite', 
   650.00, 130.00, 9, 
   'Virement', 'encaissé', 2, 1),
   
  ('2025-06-13', 'Permis A2 complet', 'Forfait complet', 
   950.00, 190.00, 10, 
   'Chèque', 'encaissé', 2, 1),
   
  ('2025-06-17', 'Présentation à lexamen moto', 'Examen pratique', 
   80.00, 16.00, 11, 
   'Carte bancaire', 'encaissé', 2, 1),
   
  ('2025-06-21', 'Stage code intensif', 'Stage', 
   320.00, 64.00, 12, 
   'Virement', 'encaissé', 2, 1),
   
  ('2025-06-25', 'Passerelle A2 vers A', 'Formation complémentaire', 
   390.00, 78.00, 13, 
   'Carte bancaire', 'encaissé', 2, 1);

-- Insertion de quelques recettes annulées pour tester le filtre par statut
INSERT INTO recette (
  date_recette, description_recette, categorie_recette, 
  montant_recette, tva_recette, client_recette, 
  mode_paiement_recette, statut_recette, id_bureau, id_ecole
) VALUES
  ('2025-07-19', 'Forfait code annulé', 'Forfait code', 
   250.00, 50.00, 14, 
   'Carte bancaire', 'annulé', 1, 1),
   
  ('2025-07-21', 'Forfait conduite annulé', 'Forfait conduite', 
   800.00, 160.00, 15, 
   'Virement', 'annulé', 2, 1),
   
  ('2025-06-22', 'Examen pratique annulé', 'Examen pratique', 
   70.00, 14.00, 16, 
   'Carte bancaire', 'annulé', 1, 1);
