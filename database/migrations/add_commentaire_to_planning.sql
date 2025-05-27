-- Script pour ajouter la colonne commentaire à la table planning
-- Ce script vérifie d'abord si la colonne existe avant de l'ajouter

DO $$
BEGIN
    -- Vérifier si la colonne commentaire existe déjà
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'planning'
        AND column_name = 'commentaire'
    ) THEN
        -- Ajouter la colonne commentaire si elle n'existe pas
        ALTER TABLE planning
        ADD COLUMN commentaire VARCHAR(255);
        
        RAISE NOTICE 'La colonne commentaire a été ajoutée à la table planning.';
    ELSE
        RAISE NOTICE 'La colonne commentaire existe déjà dans la table planning.';
    END IF;
END $$;
