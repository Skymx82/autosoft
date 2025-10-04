import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Extraire les paramètres de la requête (id_ecole, id_bureau)
    const { searchParams } = new URL(request.url);
    const id_ecole = searchParams.get('id_ecole');
    const id_bureau = searchParams.get('id_bureau') || '0'; // 0 = Tous les bureaux
    const search = searchParams.get('search') || ''; // Terme de recherche pour filtrer les élèves
    
    // Vérifier que les paramètres nécessaires sont présents
    if (!id_ecole) {
      return NextResponse.json({ error: 'id_ecole est requis' }, { status: 400 });
    }
    
    // S'assurer que id_ecole est un nombre valide
    const id_ecole_num = parseInt(id_ecole);
    if (isNaN(id_ecole_num)) {
      return NextResponse.json({ error: 'id_ecole doit être un nombre valide' }, { status: 400 });
    }
    
    let elevesQuery = supabase
      .from('eleves')
      .select(`
        id_eleve,
        nom,
        prenom,
        tel,
        mail,
        categorie,
        statut_dossier,
        id_forfait,
        forfait (
          id_forfait,
          nom,
          type_permis
        )
      `)
      .eq('id_ecole', id_ecole_num)
      .eq('statut_dossier', 'Actif') // Filtrer uniquement les élèves avec statut "Actif"
      .order('nom');
    
    // Filtrer par bureau si ce n'est pas "Tout" (id_bureau = 0)
    if (id_bureau !== '0') {
      // Convertir id_bureau en nombre
      const id_bureau_num = parseInt(id_bureau);
      if (!isNaN(id_bureau_num)) {
        elevesQuery = elevesQuery.eq('id_bureau', id_bureau_num);
      }
    }
    
    // Filtrer par terme de recherche si fourni
    if (search) {
      elevesQuery = elevesQuery.or(`nom.ilike.%${search}%,prenom.ilike.%${search}%`);
    }
    
    const { data: eleves, error: elevesError } = await elevesQuery;
    
    if (elevesError) {
      console.error('Erreur lors de la récupération des élèves:', elevesError);
      return NextResponse.json({ error: 'Erreur lors de la récupération des élèves' }, { status: 500 });
    }
    
    // Transformer les données pour correspondre au format attendu par le composant StudentSelector
    const formattedEleves = eleves.map(eleve => {
      // Utiliser uniquement la catégorie de permis du forfait
      // Si le forfait n'existe pas, on met "Non défini"
      let categoriePermis = "Non défini";
      
      // Vérifier si le forfait existe et contient type_permis
      if (eleve.forfait && typeof eleve.forfait === 'object') {
        // Utiliser une assertion de type pour éviter les erreurs TypeScript
        const forfait = eleve.forfait as { type_permis?: string };
        if (forfait.type_permis) {
          categoriePermis = forfait.type_permis;
        }
      }
      
      return {
        id_eleve: eleve.id_eleve,
        nom: eleve.nom,
        prenom: eleve.prenom,
        tel: eleve.tel,
        email: eleve.mail,
        licenseCategory: categoriePermis, // Utiliser la catégorie du forfait au lieu de eleve.categorie
        remainingHours: 15, // Valeur statique pour les heures restantes
        progress: 50 // Valeur statique pour la progression (50%)
      };
    });
    
    return NextResponse.json({ eleves: formattedEleves });
    
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}