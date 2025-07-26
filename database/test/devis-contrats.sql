-- Création de devis et contrats pour les bureaux 1 et 2 de l'auto-école 1
-- Avec des données réparties sur le mois actuel (juillet 2025) et le mois précédent (juin 2025)

-- Définition des dates pour le mois actuel (juillet 2025) et le mois précédent (juin 2025)
-- Mois actuel: juillet 2025
-- Mois précédent: juin 2025

-- Insertion de devis pour le bureau 1 (enregistrés en juillet 2025)
INSERT INTO devis (
  numero_devis, date_devis, id_client, 
  montant_devis, tva_devis, mode_paiement_devis, 
  statut_devis, date_expiration, id_bureau, id_ecole
) VALUES
  ('D-2025-001', '2025-07-02', 2, 
   320.00, 53.33, 'Carte bancaire', 
   'en attente', '2025-08-01', 1, 1),
   
  ('D-2025-002', '2025-07-05', 3, 
   980.00, 163.33, 'Virement', 
   'accepté', '2025-08-04', 1, 1),
   
  ('D-2025-003', '2025-07-08', 4, 
   290.00, 48.33, 'Chèque', 
   'en attente', '2025-08-07', 1, 1),
   
  ('D-2025-004', '2025-07-12', 5, 
   1460.00, 243.33, 'Espèces', 
   'refusé', '2025-08-11', 1, 1),
   
  ('D-2025-005', '2025-07-15', 6, 
   190.00, 31.67, 'Carte bancaire', 
   'en attente', '2025-08-14', 1, 1),
   
  ('D-2025-006', '2025-07-18', 7, 
   440.00, 73.33, 'Virement', 
   'expiré', '2025-07-25', 1, 1);

-- Insertion de devis pour le bureau 1 (enregistrés en juin 2025)
INSERT INTO devis (
  numero_devis, date_devis, id_client, 
  montant_devis, tva_devis, mode_paiement_devis, 
  statut_devis, date_expiration, id_bureau, id_ecole
) VALUES
  ('D-2025-007', '2025-06-05', 8, 
   560.00, 93.33, 'Carte bancaire', 
   'accepté', '2025-07-05', 1, 1),
   
  ('D-2025-008', '2025-06-10', 9, 
   1100.00, 183.33, 'Chèque', 
   'accepté', '2025-07-10', 1, 1),
   
  ('D-2025-009', '2025-06-15', 10, 
   380.00, 63.33, 'Espèces', 
   'accepté', '2025-07-15', 1, 1),
   
  ('D-2025-010', '2025-06-20', 11, 
   740.00, 123.33, 'Virement', 
   'refusé', '2025-07-20', 1, 1),
   
  ('D-2025-011', '2025-06-25', 12, 
   260.00, 43.33, 'Carte bancaire', 
   'expiré', '2025-07-25', 1, 1);

-- Insertion de devis pour le bureau 2 (enregistrés en juillet 2025)
INSERT INTO devis (
  numero_devis, date_devis, id_client, 
  montant_devis, tva_devis, mode_paiement_devis, 
  statut_devis, date_expiration, id_bureau, id_ecole
) VALUES
  ('D-2025-012', '2025-07-03', 13, 
   380.00, 63.33, 'Carte bancaire', 
   'accepté', '2025-08-02', 2, 1),
   
  ('D-2025-013', '2025-07-06', 14, 
   860.00, 143.33, 'Virement', 
   'accepté', '2025-08-05', 2, 1),
   
  ('D-2025-014', '2025-07-09', 15, 
   320.00, 53.33, 'Chèque', 
   'en attente', '2025-08-08', 2, 1),
   
  ('D-2025-015', '2025-07-14', 16, 
   1220.00, 203.33, 'Espèces', 
   'accepté', '2025-08-13', 2, 1),
   
  ('D-2025-016', '2025-07-17', 17, 
   230.00, 38.33, 'Carte bancaire', 
   'en attente', '2025-08-16', 2, 1);

-- Insertion de devis pour le bureau 2 (enregistrés en juin 2025)
INSERT INTO devis (
  numero_devis, date_devis, id_client, 
  montant_devis, tva_devis, mode_paiement_devis, 
  statut_devis, date_expiration, id_bureau, id_ecole
) VALUES
  ('D-2025-017', '2025-06-04', 18, 
   500.00, 83.33, 'Carte bancaire', 
   'accepté', '2025-07-04', 2, 1),
   
  ('D-2025-018', '2025-06-11', 19, 
   920.00, 153.33, 'Chèque', 
   'accepté', '2025-07-11', 2, 1),
   
  ('D-2025-019', '2025-06-16', 20, 
   350.00, 58.33, 'Espèces', 
   'refusé', '2025-07-16', 2, 1),
   
  ('D-2025-020', '2025-06-21', 2, 
   680.00, 113.33, 'Virement', 
   'accepté', '2025-07-21', 2, 1),
   
  ('D-2025-021', '2025-06-26', 3, 
   290.00, 48.33, 'Carte bancaire', 
   'expiré', '2025-07-26', 2, 1);

-- Insertion de contrats pour le bureau 1 (enregistrés en juillet 2025)
INSERT INTO contrats (
  numero_contrat, date_debut, date_fin, id_client, 
  montant_contrat, tva_contrat, mode_paiement_contrat, 
  statut_contrat, id_bureau, id_ecole
) VALUES
  ('C-2025-001', '2025-07-02', '2026-07-01', 2, 
   1200.00, 200.00, 'Carte bancaire', 
   'actif', 1, 1),
   
  ('C-2025-002', '2025-07-05', '2026-01-04', 3, 
   1800.00, 300.00, 'Virement', 
   'actif', 1, 1),
   
  ('C-2025-003', '2025-07-10', '2025-10-09', 4, 
   900.00, 150.00, 'Chèque', 
   'actif', 1, 1),
   
  ('C-2025-004', '2025-07-15', '2026-07-14', 5, 
   1500.00, 250.00, 'Espèces', 
   'actif', 1, 1);

-- Insertion de contrats pour le bureau 1 (enregistrés en juin 2025)
INSERT INTO contrats (
  numero_contrat, date_debut, date_fin, id_client, 
  montant_contrat, tva_contrat, mode_paiement_contrat, 
  statut_contrat, id_bureau, id_ecole
) VALUES
  ('C-2025-005', '2025-06-05', '2026-06-04', 6, 
   1350.00, 225.00, 'Carte bancaire', 
   'actif', 1, 1),
   
  ('C-2025-006', '2025-06-12', '2025-12-11', 7, 
   1050.00, 175.00, 'Virement', 
   'terminé', 1, 1),
   
  ('C-2025-007', '2025-06-18', '2026-06-17', 8, 
   1620.00, 270.00, 'Chèque', 
   'résilié', 1, 1);

-- Insertion de contrats pour le bureau 2 (enregistrés en juillet 2025)
INSERT INTO contrats (
  numero_contrat, date_debut, date_fin, id_client, 
  montant_contrat, tva_contrat, mode_paiement_contrat, 
  statut_contrat, id_bureau, id_ecole
) VALUES
  ('C-2025-008', '2025-07-03', '2026-07-02', 9, 
   1440.00, 240.00, 'Carte bancaire', 
   'actif', 2, 1),
   
  ('C-2025-009', '2025-07-08', '2026-01-07', 10, 
   1080.00, 180.00, 'Virement', 
   'actif', 2, 1),
   
  ('C-2025-010', '2025-07-14', '2025-10-13', 11, 
   720.00, 120.00, 'Chèque', 
   'actif', 2, 1),
   
  ('C-2025-011', '2025-07-20', '2026-07-19', 12, 
   1680.00, 280.00, 'Espèces', 
   'actif', 2, 1);

-- Insertion de contrats pour le bureau 2 (enregistrés en juin 2025)
INSERT INTO contrats (
  numero_contrat, date_debut, date_fin, id_client, 
  montant_contrat, tva_contrat, mode_paiement_contrat, 
  statut_contrat, id_bureau, id_ecole
) VALUES
  ('C-2025-012', '2025-06-06', '2026-06-05', 13, 
   1260.00, 210.00, 'Carte bancaire', 
   'actif', 2, 1),
   
  ('C-2025-013', '2025-06-13', '2025-12-12', 14, 
   990.00, 165.00, 'Virement', 
   'terminé', 2, 1),
   
  ('C-2025-014', '2025-06-19', '2026-06-18', 15, 
   1530.00, 255.00, 'Chèque', 
   'résilié', 2, 1);
