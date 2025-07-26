-- Données de test pour la table vehicule (auto-école id 1, bureaux 1 et 2)

-- Véhicules pour le bureau 1
INSERT INTO vehicule (
  immatriculation, marque, modele, annee, type_vehicule, categorie_permis, 
  boite_vitesse, carburant, date_mise_en_service, 
  kilometrage_actuel, dernier_controle_technique, prochain_controle_technique,
  dernier_entretien, prochain_entretien_km, prochain_entretien_date,
  assurance_numero_contrat, assurance_date_expiration,
  cout_acquisition, cout_entretien_total, cout_carburant_total, consommation_moyenne,
  statut, id_bureau, id_ecole
) VALUES 
-- Voitures (catégorie B)
('AB-123-CD', 'Renault', 'Clio', 2022, 'Auto', 'B', 
 'Manuelle', 'Essence', '2022-01-20', 
 15000, '2022-01-10', '2024-01-10',
 '2023-06-15', 25000, '2024-06-15',
 'ASS-12345', '2025-01-10',
 18500.00, 850.00, 1200.00, 5.8,
 'Actif', 1, 1),

('EF-456-GH', 'Peugeot', '208', 2021, 'Auto', 'B', 
 'Manuelle', 'Diesel', '2021-06-15', 
 25000, '2021-06-05', '2023-06-05',
 '2023-12-10', 35000, '2024-12-10',
 'ASS-23456', '2024-06-05',
 17800.00, 620.00, 950.00, 4.9,
 'Actif', 1, 1),

('IJ-789-KL', 'Citroën', 'C3', 2023, 'Auto', 'B', 
 'Automatique', 'Hybride', '2023-03-25', 
 8000, '2023-03-15', '2025-03-15',
 '2023-09-25', 18000, '2024-09-25',
 'ASS-34567', '2025-03-15',
 19200.00, 320.00, 580.00, 4.2,
 'Actif', 1, 1),

-- Motos (catégories A, A1, A2)
('MN-012-OP', 'Yamaha', 'MT-07', 2022, 'Moto', 'A2', 
 'Manuelle', 'Essence', '2022-04-15', 
 10000, '2022-04-05', '2024-04-05',
 '2023-10-15', 15000, '2024-10-15',
 'ASS-45678', '2024-04-05',
 9500.00, 450.00, 650.00, 3.9,
 'Actif', 1, 1),

('QR-345-ST', 'Honda', 'CB500F', 2021, 'Moto', 'A2', 
 'Manuelle', 'Essence', '2021-07-25', 
 15000, '2021-07-15', '2023-07-15',
 '2023-11-25', 20000, '2024-11-25',
 'ASS-56789', '2023-07-15',
 8900.00, 780.00, 720.00, 4.1,
 'En maintenance', 1, 1),

-- Poids lourd (catégorie C)
('UV-678-WX', 'Renault', 'Trucks D', 2020, 'Poids lourd', 'C', 
 'Manuelle', 'Diesel', '2020-09-10', 
 50000, '2022-09-01', '2023-09-01',
 '2023-03-10', 60000, '2024-03-10',
 'ASS-67890', '2023-09-01',
 65000.00, 3500.00, 9800.00, 28.5,
 'Actif', 1, 1);

-- Véhicules pour le bureau 2
INSERT INTO vehicule (
  immatriculation, marque, modele, annee, type_vehicule, categorie_permis, 
  boite_vitesse, carburant, date_mise_en_service, 
  kilometrage_actuel, dernier_controle_technique, prochain_controle_technique,
  dernier_entretien, prochain_entretien_km, prochain_entretien_date,
  assurance_numero_contrat, assurance_date_expiration,
  cout_acquisition, cout_entretien_total, cout_carburant_total, consommation_moyenne,
  statut, id_bureau, id_ecole
) VALUES 
-- Voitures (catégorie B)
('YZ-901-AB', 'Volkswagen', 'Golf', 2022, 'Auto', 'B', 
 'Manuelle', 'Diesel', '2022-02-15', 
 18000, '2022-02-05', '2024-02-05',
 '2023-08-15', 28000, '2024-08-15',
 'ASS-78901', '2024-02-05',
 22500.00, 920.00, 1350.00, 5.2,
 'Actif', 2, 1),

('CD-234-EF', 'Toyota', 'Yaris', 2023, 'Auto', 'B', 
 'Automatique', 'Hybride', '2023-01-20', 
 7500, '2023-01-10', '2025-01-10',
 '2023-07-20', 17500, '2024-07-20',
 'ASS-89012', '2025-01-10',
 21000.00, 280.00, 420.00, 3.8,
 'Actif', 2, 1),

('GH-567-IJ', 'Dacia', 'Sandero', 2021, 'Auto', 'B', 
 'Manuelle', 'GPL', '2021-11-25', 
 22000, '2021-11-15', '2023-11-15',
 '2023-05-25', 32000, '2024-05-25',
 'ASS-90123', '2023-11-15',
 14500.00, 580.00, 820.00, 6.1,
 'Actif', 2, 1),

-- Motos (catégories A, A1, A2)
('KL-890-MN', 'Kawasaki', 'Z650', 2022, 'Moto', 'A2', 
 'Manuelle', 'Essence', '2022-05-20', 
 9000, '2022-05-10', '2024-05-10',
 '2023-11-20', 14000, '2024-11-20',
 'ASS-01234', '2024-05-10',
 8800.00, 390.00, 580.00, 4.0,
 'Actif', 2, 1),

-- Scooter (catégorie AM)
('OP-123-QR', 'Piaggio', 'Liberty', 2023, 'Scooter', 'AM', 
 'Automatique', 'Essence', '2023-03-01', 
 3000, '2023-02-20', '2025-02-20',
 '2023-09-01', 8000, '2024-09-01',
 'ASS-12345', '2025-02-20',
 3500.00, 180.00, 220.00, 2.8,
 'Actif', 2, 1);
