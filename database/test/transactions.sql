-- Script d'insertion de données de test pour les transactions
-- Création de transactions uniquement pour les bureaux 1 et 2 de l'auto-école 1
-- Avec des transactions réparties sur le mois actuel et le mois précédent

-- Définition des dates pour le mois actuel (juillet 2025) et le mois précédent (juin 2025)
-- Mois actuel: juillet 2025
-- Mois précédent: juin 2025

-- Insertion de transactions pour le bureau 1 (mois actuel - juillet 2025)
INSERT INTO transactions (
  date_transaction, description_transaction, categorie_transaction, 
  montant_transaction, type_transaction, id_bureau, id_ecole
) VALUES
  -- Recettes bureau 1 (juillet 2025)
  ('2025-07-02', 'Inscription Jean Dupont', 'Inscription', 1200.00, 'recette', 1, 1),
  ('2025-07-05', 'Forfait 20h Sophie Martin', 'Forfait conduite', 800.00, 'recette', 1, 1),
  ('2025-07-08', 'Examen code Thomas Petit', 'Examen', 30.00, 'recette', 1, 1),
  ('2025-07-10', 'Heures supplémentaires Marie Leroy', 'Heures supplémentaires', 150.00, 'recette', 1, 1),
  ('2025-07-15', 'Inscription Lucas Bernard', 'Inscription', 1200.00, 'recette', 1, 1),
  ('2025-07-18', 'Forfait accéléré Emma Dubois', 'Forfait conduite', 1500.00, 'recette', 1, 1),
  
  -- Dépenses bureau 1 (juillet 2025)
  ('2025-07-03', 'Carburant véhicule 1', 'Carburant', 80.00, 'depense', 1, 1),
  ('2025-07-07', 'Entretien véhicule 2', 'Entretien', 150.00, 'depense', 1, 1),
  ('2025-07-12', 'Fournitures de bureau', 'Fournitures', 45.00, 'depense', 1, 1),
  ('2025-07-16', 'Assurance flotte', 'Assurance', 350.00, 'depense', 1, 1),
  ('2025-07-20', 'Salaire moniteur Pierre', 'Salaire', 1800.00, 'depense', 1, 1);

-- Insertion de transactions pour le bureau 2 (mois actuel - juillet 2025)
INSERT INTO transactions (
  date_transaction, description_transaction, categorie_transaction, 
  montant_transaction, type_transaction, id_bureau, id_ecole
) VALUES
  -- Recettes bureau 2 (juillet 2025)
  ('2025-07-03', 'Inscription Camille Roux', 'Inscription', 1200.00, 'recette', 2, 1),
  ('2025-07-06', 'Forfait 20h Hugo Moreau', 'Forfait conduite', 800.00, 'recette', 2, 1),
  ('2025-07-09', 'Examen code Léa Girard', 'Examen', 30.00, 'recette', 2, 1),
  ('2025-07-14', 'Heures supplémentaires Julien Blanc', 'Heures supplémentaires', 120.00, 'recette', 2, 1),
  
  -- Dépenses bureau 2 (juillet 2025)
  ('2025-07-04', 'Carburant véhicule 3', 'Carburant', 75.00, 'depense', 2, 1),
  ('2025-07-08', 'Entretien véhicule 4', 'Entretien', 130.00, 'depense', 2, 1),
  ('2025-07-13', 'Fournitures de bureau', 'Fournitures', 35.00, 'depense', 2, 1),
  ('2025-07-17', 'Loyer local', 'Loyer', 800.00, 'depense', 2, 1);

-- Insertion de transactions pour le bureau 1 (mois précédent - juin 2025)
INSERT INTO transactions (
  date_transaction, description_transaction, categorie_transaction, 
  montant_transaction, type_transaction, id_bureau, id_ecole
) VALUES
  -- Recettes bureau 1 (juin 2025)
  ('2025-06-05', 'Inscription Antoine Lefebvre', 'Inscription', 1200.00, 'recette', 1, 1),
  ('2025-06-08', 'Forfait 20h Julie Mercier', 'Forfait conduite', 800.00, 'recette', 1, 1),
  ('2025-06-12', 'Examen code Nicolas Fournier', 'Examen', 30.00, 'recette', 1, 1),
  ('2025-06-18', 'Heures supplémentaires Sarah Morel', 'Heures supplémentaires', 180.00, 'recette', 1, 1),
  ('2025-06-22', 'Inscription Paul Rousseau', 'Inscription', 1200.00, 'recette', 1, 1),
  
  -- Dépenses bureau 1 (juin 2025)
  ('2025-06-03', 'Carburant véhicule 1', 'Carburant', 85.00, 'depense', 1, 1),
  ('2025-06-10', 'Entretien véhicule 2', 'Entretien', 120.00, 'depense', 1, 1),
  ('2025-06-15', 'Fournitures de bureau', 'Fournitures', 50.00, 'depense', 1, 1),
  ('2025-06-20', 'Salaire moniteur Pierre', 'Salaire', 1800.00, 'depense', 1, 1);

-- Insertion de transactions pour le bureau 2 (mois précédent - juin 2025)
INSERT INTO transactions (
  date_transaction, description_transaction, categorie_transaction, 
  montant_transaction, type_transaction, id_bureau, id_ecole
) VALUES
  -- Recettes bureau 2 (juin 2025)
  ('2025-06-04', 'Inscription Mathilde Dupuis', 'Inscription', 1200.00, 'recette', 2, 1),
  ('2025-06-09', 'Forfait 20h Alexandre Lecomte', 'Forfait conduite', 800.00, 'recette', 2, 1),
  ('2025-06-14', 'Examen code Chloé Simon', 'Examen', 30.00, 'recette', 2, 1),
  
  -- Dépenses bureau 2 (juin 2025)
  ('2025-06-06', 'Carburant véhicule 3', 'Carburant', 70.00, 'depense', 2, 1),
  ('2025-06-11', 'Entretien véhicule 4', 'Entretien', 140.00, 'depense', 2, 1),
  ('2025-06-16', 'Fournitures de bureau', 'Fournitures', 40.00, 'depense', 2, 1),
  ('2025-06-21', 'Loyer local', 'Loyer', 800.00, 'depense', 2, 1);


