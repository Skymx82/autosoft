-- Insertion de données de test pour la table competences_eleve
-- Ce script insère des évaluations de compétences pour le mois actuel et le mois précédent

-- Supprimer les données existantes pour éviter les doublons
DELETE FROM competences_eleve WHERE id_ecole = 1;

-- Mois précédent - Élèves prêts à passer le permis (avril 2025) - Total: 7 élèves

-- Bureau 1 - Élèves avec toutes les compétences à 100%
INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (1, 100, 100, 100, 100, '2025-04-10', 'Élève prêt pour l''examen', 1, 1, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (2, 100, 100, 100, 100, '2025-04-15', 'Élève prêt pour l''examen', 1, 1, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (3, 100, 100, 100, 100, '2025-04-20', 'Élève prêt pour l''examen', 2, 1, 1);

-- Bureau 2 - Élèves avec toutes les compétences à 100%
INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (6, 100, 100, 100, 100, '2025-04-05', 'Élève prêt pour l''examen', 3, 2, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (7, 100, 100, 100, 100, '2025-04-12', 'Élève prêt pour l''examen', 3, 2, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (8, 100, 100, 100, 100, '2025-04-18', 'Élève prêt pour l''examen', 4, 2, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (9, 100, 100, 100, 100, '2025-04-25', 'Élève prêt pour l''examen', 4, 2, 1);

-- Bureau 1 - Élèves avec compétences incomplètes
INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (4, 100, 90, 85, 80, '2025-04-08', 'Progrès satisfaisants, mais encore des points à améliorer', 2, 1, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (5, 95, 100, 90, 85, '2025-04-22', 'Bon niveau général, mais manque encore de pratique', 1, 1, 1);

-- Bureau 2 - Élèves avec compétences incomplètes
INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (10, 90, 85, 80, 75, '2025-04-14', 'En progression, besoin de plus de pratique', 3, 2, 1);

-- Mois actuel - Élèves prêts à passer le permis (mai 2025) - Total: 9 élèves (+28.6%)

-- Bureau 1 - Élèves avec toutes les compétences à 100%
INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (1, 100, 100, 100, 100, '2025-05-05', 'Élève prêt pour l''examen', 1, 1, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (2, 100, 100, 100, 100, '2025-05-10', 'Élève prêt pour l''examen', 1, 1, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (3, 100, 100, 100, 100, '2025-05-12', 'Élève prêt pour l''examen', 2, 1, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (4, 100, 100, 100, 100, '2025-05-08', 'Élève a atteint tous les objectifs', 2, 1, 1);

-- Bureau 2 - Élèves avec toutes les compétences à 100%
INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (6, 100, 100, 100, 100, '2025-05-03', 'Élève prêt pour l''examen', 3, 2, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (7, 100, 100, 100, 100, '2025-05-07', 'Élève prêt pour l''examen', 3, 2, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (8, 100, 100, 100, 100, '2025-05-11', 'Élève prêt pour l''examen', 4, 2, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (9, 100, 100, 100, 100, '2025-05-14', 'Élève prêt pour l''examen', 4, 2, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (5, 100, 100, 100, 100, '2025-05-09', 'Élève a atteint tous les objectifs', 1, 1, 1);

-- Bureau 1 - Élèves avec compétences incomplètes (mois actuel - mai 2025)
INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (11, 95, 90, 85, 80, '2025-05-06', 'Progrès satisfaisants, mais encore des points à améliorer', 2, 1, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (13, 80, 75, 70, 65, '2025-05-02', 'Besoin de renforcer les bases', 1, 1, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (14, 85, 80, 75, 70, '2025-05-05', 'Progresse lentement mais sûrement', 2, 1, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (15, 90, 85, 80, 75, '2025-05-08', 'Bonne progression, mais manque encore de pratique', 1, 1, 1);

-- Bureau 2 - Élèves avec compétences incomplètes (mois actuel - mai 2025)
INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (10, 95, 90, 85, 90, '2025-05-04', 'En progression, besoin de plus de pratique', 3, 2, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (12, 85, 80, 75, 70, '2025-05-13', 'Début de formation, beaucoup de progrès à faire', 4, 2, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (16, 70, 65, 60, 55, '2025-05-03', 'Débutant, besoin de beaucoup de pratique', 3, 2, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (17, 75, 70, 65, 60, '2025-05-07', 'Progresse lentement', 4, 2, 1);

INSERT INTO competences_eleve (id_eleve, c1_maitriser, c2_apprehender, c3_circuler, c4_pratiquer, date_evaluation, commentaire, id_moniteur, id_bureau, id_ecole)
VALUES (18, 60, 55, 50, 45, '2025-05-10', 'Difficultés importantes, besoin d\'un suivi personnalisé', 3, 2, 1);
