-- Insertion de données de test pour la table comptabilite
-- Ce script insère des transactions financières pour le mois actuel et le mois précédent

-- Supprimer les données existantes pour éviter les doublons
DELETE FROM comptabilite WHERE id_ecole = 1;

-- Mois précédent - Transactions (avril 2025) - Total recettes: 7,856 €

-- Bureau 1 - Recettes
INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (1, 'Recette', 1200.00, '2025-04-05', 'Inscription', 1, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (2, 'Recette', 850.00, '2025-04-12', 'Leçon', 1, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (3, 'Recette', 1100.00, '2025-04-18', 'Inscription', 1, 1);

-- Bureau 2 - Recettes
INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (6, 'Recette', 1200.00, '2025-04-03', 'Inscription', 2, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (7, 'Recette', 950.00, '2025-04-10', 'Leçon', 2, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (8, 'Recette', 1256.00, '2025-04-15', 'Inscription', 2, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (9, 'Recette', 1300.00, '2025-04-22', 'Inscription', 2, 1);

-- Bureau 1 - Dépenses
INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (NULL, 'Dépense', 500.00, '2025-04-08', 'Fournitures', 1, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (NULL, 'Dépense', 1200.00, '2025-04-16', 'Loyer', 1, 1);

-- Bureau 2 - Dépenses
INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (NULL, 'Dépense', 450.00, '2025-04-05', 'Fournitures', 2, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (NULL, 'Dépense', 800.00, '2025-04-20', 'Maintenance', 2, 1);

-- Mois actuel - Transactions (mai 2025) - Total recettes: 8,540 € (environ +8.7%)

-- Bureau 1 - Recettes
INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (1, 'Recette', 1300.00, '2025-05-02', 'Inscription', 1, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (2, 'Recette', 900.00, '2025-05-07', 'Leçon', 1, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (3, 'Recette', 1200.00, '2025-05-12', 'Inscription', 1, 1);

-- Bureau 2 - Recettes
INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (6, 'Recette', 1350.00, '2025-05-03', 'Inscription', 2, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (7, 'Recette', 1000.00, '2025-05-08', 'Leçon', 2, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (8, 'Recette', 1290.00, '2025-05-10', 'Inscription', 2, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (9, 'Recette', 1500.00, '2025-05-14', 'Inscription', 2, 1);

-- Bureau 1 - Dépenses
INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (NULL, 'Dépense', 550.00, '2025-05-05', 'Fournitures', 1, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (NULL, 'Dépense', 1200.00, '2025-05-15', 'Loyer', 1, 1);

-- Bureau 2 - Dépenses
INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (NULL, 'Dépense', 480.00, '2025-05-04', 'Fournitures', 2, 1);

INSERT INTO comptabilite (id_eleve, type_transaction, montant, date_transaction, categorie_depense, id_bureau, id_ecole)
VALUES (NULL, 'Dépense', 850.00, '2025-05-12', 'Maintenance', 2, 1);
