-- Insertion de données de test pour la table examen_resultats
-- Ce script insère des résultats d'examens pour le mois actuel et le mois précédent

-- Supprimer les données existantes pour éviter les doublons
DELETE FROM examen_resultats WHERE id_ecole = 1;

-- Mois précédent - Examens réussis (15 examens)

-- Bureau 1 - Code
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (1, 'Code', '2025-04-05', 'Réussi', 1, 'Examen réussi avec 3 fautes.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (2, 'Code', '2025-04-07', 'Réussi', 2, 'Examen réussi avec 1 faute.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (3, 'Code', '2025-04-12', 'Réussi', 1, 'Examen réussi avec 2 fautes.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (4, 'Code', '2025-04-18', 'Réussi', 1, 'Examen réussi avec 0 faute.', 1, 1);

-- Bureau 1 - Conduite
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (5, 'Conduite', '2025-04-10', 'Réussi', 2, 'Examen réussi avec quelques hésitations.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (6, 'Conduite', '2025-04-15', 'Réussi', 1, 'Examen réussi avec brio.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (7, 'Conduite', '2025-04-22', 'Réussi', 3, 'Examen réussi après plusieurs tentatives.', 1, 1);

-- Bureau 2 - Code
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (8, 'Code', '2025-04-03', 'Réussi', 1, 'Examen réussi avec 4 fautes.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (9, 'Code', '2025-04-08', 'Réussi', 2, 'Examen réussi avec 2 fautes.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (10, 'Code', '2025-04-14', 'Réussi', 1, 'Examen réussi avec 1 faute.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (11, 'Code', '2025-04-19', 'Réussi', 1, 'Examen réussi avec 3 fautes.', 2, 1);

-- Bureau 2 - Conduite
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (12, 'Conduite', '2025-04-06', 'Réussi', 2, 'Examen réussi avec quelques difficultés.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (13, 'Conduite', '2025-04-13', 'Réussi', 1, 'Examen réussi parfaitement.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (14, 'Conduite', '2025-04-20', 'Réussi', 1, 'Examen réussi avec de bonnes manœuvres.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (15, 'Conduite', '2025-04-25', 'Réussi', 2, 'Examen réussi après correction des erreurs.', 2, 1);

-- Mois précédent - Examens échoués (5 examens)

-- Bureau 1
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (16, 'Code', '2025-04-11', 'Échoué', 1, 'Examen échoué avec 15 fautes.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (17, 'Conduite', '2025-04-17', 'Échoué', 1, 'Examen échoué pour non-respect des priorités.', 1, 1);

-- Bureau 2
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (18, 'Code', '2025-04-09', 'Échoué', 1, 'Examen échoué avec 18 fautes.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (19, 'Conduite', '2025-04-16', 'Échoué', 2, 'Examen échoué pour manque de maîtrise du véhicule.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (20, 'Conduite', '2025-04-24', 'Échoué', 1, 'Examen échoué pour non-respect des signalisations.', 2, 1);

-- Mois actuel - Examens réussis (18 examens - environ 20% de plus que le mois précédent)

-- Bureau 1 - Code
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (1, 'Code', '2025-05-02', 'Réussi', 1, 'Examen réussi avec 2 fautes.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (2, 'Code', '2025-05-03', 'Réussi', 1, 'Examen réussi avec 1 faute.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (3, 'Code', '2025-05-05', 'Réussi', 2, 'Examen réussi avec 3 fautes.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (4, 'Code', '2025-05-07', 'Réussi', 1, 'Examen réussi avec 0 faute.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (5, 'Code', '2025-05-09', 'Réussi', 1, 'Examen réussi avec 2 fautes.', 1, 1);

-- Bureau 1 - Conduite
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (1, 'Conduite', '2025-05-04', 'Réussi', 2, 'Examen réussi après correction des erreurs précédentes.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (2, 'Conduite', '2025-05-06', 'Réussi', 2, 'Examen réussi avec une bonne maîtrise.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (3, 'Conduite', '2025-05-08', 'Réussi', 1, 'Examen réussi avec excellence.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (4, 'Conduite', '2025-05-10', 'Réussi', 1, 'Examen réussi avec de bonnes manœuvres.', 1, 1);

-- Bureau 2 - Code
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (6, 'Code', '2025-05-01', 'Réussi', 2, 'Examen réussi avec 4 fautes.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (7, 'Code', '2025-05-03', 'Réussi', 1, 'Examen réussi avec 1 faute.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (8, 'Code', '2025-05-05', 'Réussi', 1, 'Examen réussi avec 2 fautes.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (9, 'Code', '2025-05-08', 'Réussi', 1, 'Examen réussi avec 3 fautes.', 2, 1);

-- Bureau 2 - Conduite
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (6, 'Conduite', '2025-05-02', 'Réussi', 3, 'Examen réussi après plusieurs tentatives.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (7, 'Conduite', '2025-05-04', 'Réussi', 2, 'Examen réussi avec une meilleure attention.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (8, 'Conduite', '2025-05-07', 'Réussi', 1, 'Examen réussi parfaitement.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (9, 'Conduite', '2025-05-09', 'Réussi', 1, 'Examen réussi avec de bonnes compétences.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (10, 'Conduite', '2025-05-11', 'Réussi', 1, 'Examen réussi avec excellence.', 2, 1);

-- Mois actuel - Examens échoués (7 examens)

-- Bureau 1
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (11, 'Code', '2025-05-03', 'Échoué', 1, 'Examen échoué avec 12 fautes.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (12, 'Code', '2025-05-06', 'Échoué', 1, 'Examen échoué avec 15 fautes.', 1, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (13, 'Conduite', '2025-05-08', 'Échoué', 1, 'Examen échoué pour non-respect des priorités.', 1, 1);

-- Bureau 2
INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (14, 'Code', '2025-05-02', 'Échoué', 1, 'Examen échoué avec 14 fautes.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (15, 'Code', '2025-05-05', 'Échoué', 2, 'Examen échoué avec 10 fautes.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (16, 'Conduite', '2025-05-03', 'Échoué', 1, 'Examen échoué pour manque de maîtrise du véhicule.', 2, 1);

INSERT INTO examen_resultats (id_eleve, type_examen, date_examen, resultat, nb_tentative, commentaire, id_bureau, id_ecole)
VALUES (17, 'Conduite', '2025-05-07', 'Échoué', 1, 'Examen échoué pour non-respect des signalisations.', 2, 1);
