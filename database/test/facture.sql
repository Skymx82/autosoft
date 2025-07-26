-- Création de factures pour les bureaux 1 et 2 de l'auto-école 1
-- Avec des factures réparties sur le mois actuel (juillet 2025) et le mois précédent (juin 2025)

-- Définition des dates pour le mois actuel (juillet 2025) et le mois précédent (juin 2025)
-- Mois actuel: juillet 2025
-- Mois précédent: juin 2025

-- Insertion de factures pour le bureau 1 (enregistrées en juillet 2025)
INSERT INTO facture (
  date_facture, numero_facture, id_client, 
  montant_facture, tva_facture, mode_paiement_facture, 
  statut_facture, echeance_facture, id_bureau, id_ecole
) VALUES
  ('2025-07-02', 'F-2025-001', 2, 
   300.00, 50.00, 'Carte bancaire', 
   'payée', '2025-07-16', 1, 1),
   
  ('2025-07-05', 'F-2025-002', 2, 
   960.00, 160.00, 'Virement', 
   'payée', '2025-07-19', 1, 1),
   
  ('2025-07-08', 'F-2025-003', 3, 
   270.00, 45.00, 'Chèque', 
   'en attente', '2025-07-22', 1, 1),
   
  ('2025-07-12', 'F-2025-004', 4, 
   1440.00, 240.00, 'Espèces', 
   'payée', '2025-07-26', 1, 1),
   
  ('2025-07-15', 'F-2025-005', 5, 
   180.00, 30.00, 'Carte bancaire', 
   'en attente', '2025-07-29', 1, 1),
   
  ('2025-07-18', 'F-2025-006', 6, 
   420.00, 70.00, 'Virement', 
   'en retard', '2025-07-10', 1, 1);

-- Insertion de factures pour le bureau 1 (enregistrées en juin 2025)
INSERT INTO facture (
  date_facture, numero_facture, id_client, 
  montant_facture, tva_facture, mode_paiement_facture, 
  statut_facture, echeance_facture, id_bureau, id_ecole
) VALUES
  ('2025-06-05', 'F-2025-007', 7, 
   540.00, 90.00, 'Carte bancaire', 
   'payée', '2025-06-19', 1, 1),
   
  ('2025-06-10', 'F-2025-008', 8, 
   1080.00, 180.00, 'Chèque', 
   'payée', '2025-06-24', 1, 1),
   
  ('2025-06-15', 'F-2025-009', 9, 
   360.00, 60.00, 'Espèces', 
   'payée', '2025-06-29', 1, 1),
   
  ('2025-06-20', 'F-2025-010', 10, 
   720.00, 120.00, 'Virement', 
   'en retard', '2025-06-15', 1, 1),
   
  ('2025-06-25', 'F-2025-011', 11, 
   240.00, 40.00, 'Carte bancaire', 
   'annulée', '2025-07-09', 1, 1);

-- Insertion de factures pour le bureau 2 (enregistrées en juillet 2025)
INSERT INTO facture (
  date_facture, numero_facture, id_client, 
  montant_facture, tva_facture, mode_paiement_facture, 
  statut_facture, echeance_facture, id_bureau, id_ecole
) VALUES
  ('2025-07-03', 'F-2025-012', 12, 
   360.00, 60.00, 'Carte bancaire', 
   'payée', '2025-07-17', 2, 1),
   
  ('2025-07-06', 'F-2025-013', 13, 
   840.00, 140.00, 'Virement', 
   'payée', '2025-07-20', 2, 1),
   
  ('2025-07-09', 'F-2025-014', 14, 
   300.00, 50.00, 'Chèque', 
   'en attente', '2025-07-23', 2, 1),
   
  ('2025-07-14', 'F-2025-015', 15, 
   1200.00, 200.00, 'Espèces', 
   'payée', '2025-07-28', 2, 1),
   
  ('2025-07-17', 'F-2025-016', 16, 
   210.00, 35.00, 'Carte bancaire', 
   'en attente', '2025-07-31', 2, 1);

-- Insertion de factures pour le bureau 2 (enregistrées en juin 2025)
INSERT INTO facture (
  date_facture, numero_facture, id_client, 
  montant_facture, tva_facture, mode_paiement_facture, 
  statut_facture, echeance_facture, id_bureau, id_ecole
) VALUES
  ('2025-06-04', 'F-2025-017', 17, 
   480.00, 80.00, 'Carte bancaire', 
   'payée', '2025-06-18', 2, 1),
   
  ('2025-06-11', 'F-2025-018', 18, 
   900.00, 150.00, 'Chèque', 
   'payée', '2025-06-25', 2, 1),
   
  ('2025-06-16', 'F-2025-019', 19, 
   330.00, 55.00, 'Espèces', 
   'en retard', '2025-06-10', 2, 1),
   
  ('2025-06-21', 'F-2025-020', 2, 
   660.00, 110.00, 'Virement', 
   'payée', '2025-07-05', 2, 1),
   
  ('2025-06-26', 'F-2025-021', 3, 
   270.00, 45.00, 'Carte bancaire', 
   'annulée', '2025-07-10', 2, 1);

-- Insertion de factures supplémentaires pour le bureau 2 (enregistrées en juillet 2025)
INSERT INTO facture (
  date_facture, numero_facture, id_client, 
  montant_facture, tva_facture, mode_paiement_facture, 
  statut_facture, echeance_facture, id_bureau, id_ecole
) VALUES
  ('2025-07-01', 'F-2025-022', 24, 
   420.00, 70.00, 'Carte bancaire', 
   'payée', '2025-07-15', 2, 1),
   
  ('2025-07-07', 'F-2025-023', 25, 
   780.00, 130.00, 'Virement', 
   'payée', '2025-07-21', 2, 1),
   
  ('2025-07-13', 'F-2025-024', 26, 
   390.00, 65.00, 'Chèque', 
   'en attente', '2025-07-27', 2, 1),
   
  ('2025-07-19', 'F-2025-025', 27, 
   1080.00, 180.00, 'Espèces', 
   'payée', '2025-08-02', 2, 1),
   
  ('2025-06-02', 'F-2025-026', 24, 
   510.00, 85.00, 'Carte bancaire', 
   'payée', '2025-06-16', 2, 1),
   
  ('2025-06-08', 'F-2025-027', 25, 
   870.00, 145.00, 'Virement', 
   'en retard', '2025-06-03', 2, 1),
   
  ('2025-06-14', 'F-2025-028', 26, 
   450.00, 75.00, 'Chèque', 
   'payée', '2025-06-28', 2, 1),
   
  ('2025-06-20', 'F-2025-029', 27, 
   1140.00, 190.00, 'Espèces', 
   'annulée', '2025-07-04', 2, 1);
