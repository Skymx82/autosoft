-- Données de test pour la table vehicule (auto-école id 1, bureaux 1 et 2)

-- Véhicules pour le bureau 1
INSERT INTO vehicule (
  immatriculation, marque, modele, annee, type_vehicule, categorie_permis, 
  boite_vitesse, carburant, date_acquisition, date_mise_en_service, 
  kilometrage_actuel, dernier_controle_technique, prochain_controle_technique,
  statut, equipements, id_bureau, id_ecole
) VALUES 
-- Voitures (catégorie B)
('AB-123-CD', 'Renault', 'Clio', 2022, 'Auto', 'B', 
 'Manuelle', 'Essence', '2022-01-15', '2022-01-20', 
 15000, '2022-01-10', '2024-01-10',
 'Actif', 'Double commande, caméra de recul', 1, 1),

('EF-456-GH', 'Peugeot', '208', 2021, 'Auto', 'B', 
 'Manuelle', 'Diesel', '2021-06-10', '2021-06-15', 
 25000, '2021-06-05', '2023-06-05',
 'Actif', 'Double commande, GPS intégré', 1, 1),

('IJ-789-KL', 'Citroën', 'C3', 2023, 'Auto', 'B', 
 'Automatique', 'Hybride', '2023-03-20', '2023-03-25', 
 8000, '2023-03-15', '2025-03-15',
 'Actif', 'Double commande, aide au stationnement', 1, 1),

-- Motos (catégories A, A1, A2)
('MN-012-OP', 'Yamaha', 'MT-07', 2022, 'Moto', 'A2', 
 'Manuelle', 'Essence', '2022-04-10', '2022-04-15', 
 10000, '2022-04-05', '2024-04-05',
 'Actif', 'Système de communication instructeur-élève', 1, 1),

('QR-345-ST', 'Honda', 'CB500F', 2021, 'Moto', 'A2', 
 'Manuelle', 'Essence', '2021-07-20', '2021-07-25', 
 15000, '2021-07-15', '2023-07-15',
 'En maintenance', 'Système de communication instructeur-élève', 1, 1),

-- Poids lourd (catégorie C)
('UV-678-WX', 'Renault', 'Trucks D', 2020, 'Poids lourd', 'C', 
 'Manuelle', 'Diesel', '2020-09-05', '2020-09-10', 
 50000, '2022-09-01', '2023-09-01',
 'Actif', 'Double commande, caméras de recul', 1, 1);

-- Véhicules pour le bureau 2
INSERT INTO vehicule (
  immatriculation, marque, modele, annee, type_vehicule, categorie_permis, 
  boite_vitesse, carburant, date_acquisition, date_mise_en_service, 
  kilometrage_actuel, dernier_controle_technique, prochain_controle_technique,
  statut, equipements, id_bureau, id_ecole
) VALUES 
-- Voitures (catégorie B)
('YZ-901-AB', 'Volkswagen', 'Golf', 2022, 'Auto', 'B', 
 'Manuelle', 'Diesel', '2022-02-10', '2022-02-15', 
 18000, '2022-02-05', '2024-02-05',
 'Actif', 'Double commande, système d\'aide à la conduite', 2, 1),

('CD-234-EF', 'Toyota', 'Yaris', 2023, 'Auto', 'B', 
 'Automatique', 'Hybride', '2023-01-15', '2023-01-20', 
 7500, '2023-01-10', '2025-01-10',
 'Actif', 'Double commande, caméra 360°', 2, 1),

('GH-567-IJ', 'Dacia', 'Sandero', 2021, 'Auto', 'B', 
 'Manuelle', 'GPL', '2021-11-20', '2021-11-25', 
 22000, '2021-11-15', '2023-11-15',
 'Actif', 'Double commande', 2, 1),

-- Motos (catégories A, A1, A2)
('KL-890-MN', 'Kawasaki', 'Z650', 2022, 'Moto', 'A2', 
 'Manuelle', 'Essence', '2022-05-15', '2022-05-20', 
 9000, '2022-05-10', '2024-05-10',
 'Actif', 'Système de communication instructeur-élève', 2, 1),

-- Scooter (catégorie AM)
('OP-123-QR', 'Piaggio', 'Liberty', 2023, 'Scooter', 'AM', 
 'Automatique', 'Essence', '2023-02-25', '2023-03-01', 
 3000, '2023-02-20', '2025-02-20',
 'Actif', 'Système de communication instructeur-élève', 2, 1);
