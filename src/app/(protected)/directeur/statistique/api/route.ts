import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabase';

// Initialiser le client Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Début de l\'API AI Insights');
    
    const body = await request.json();
    const { id_ecole, id_bureau } = body;
    console.log('📊 Paramètres reçus:', { id_ecole, id_bureau });

    if (!id_ecole) {
      console.error('❌ ID école manquant');
      return NextResponse.json(
        { error: 'ID école requis' },
        { status: 400 }
      );
    }

    // Vérifier que la clé API Groq est configurée
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ Clé API Groq non configurée');
      return NextResponse.json(
        { error: 'Clé API Groq non configurée' },
        { status: 500 }
      );
    }
    console.log('✅ Clé API Groq configurée');

    // 1. Récupérer les données de la base de données
    console.log('📥 Récupération des données de Supabase...');

    // Récupération de TOUTES les données pertinentes
    const { data: eleves, error: elevesError } = await supabase
      .from('eleves')
      .select('*')
      .eq('id_ecole', id_ecole);

    const { data: planning, error: planningError } = await supabase
      .from('planning')
      .select('*')
      .eq('id_ecole', id_ecole);

    const { data: enseignants, error: enseignantsError } = await supabase
      .from('enseignants')
      .select('*')
      .eq('id_ecole', id_ecole);

    const { data: vehicules, error: vehiculesError } = await supabase
      .from('vehicule')
      .select('*')
      .eq('id_ecole', id_ecole);

    const { data: recettes, error: recettesError } = await supabase
      .from('recette')
      .select('*')
      .eq('id_ecole', id_ecole);

    const { data: depenses, error: depensesError } = await supabase
      .from('depense')
      .select('*')
      .eq('id_ecole', id_ecole);

    const { data: examens, error: examensError } = await supabase
      .from('examen_resultats')
      .select('*')
      .eq('id_ecole', id_ecole);

    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select('*')
      .eq('id_ecole', id_ecole);

    if (elevesError || planningError || enseignantsError || vehiculesError) {
      console.error('❌ Erreur Supabase:', { 
        elevesError, 
        planningError, 
        enseignantsError, 
        vehiculesError,
        recettesError,
        depensesError,
        examensError,
        documentsError
      });
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des données' },
        { status: 500 }
      );
    }
    
    console.log('✅ Données récupérées:', {
      eleves: eleves?.length || 0,
      planning: planning?.length || 0,
      enseignants: enseignants?.length || 0,
      vehicules: vehicules?.length || 0,
      recettes: recettes?.length || 0,
      depenses: depenses?.length || 0,
      examens: examens?.length || 0,
      documents: documents?.length || 0
    });

    // 2. Préparer un résumé COMPLET des données pour l'IA
    const now = new Date();
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
    const finMois = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const dataSummary = {
      // Élèves
      total_eleves: eleves?.length || 0,
      eleves_actifs: eleves?.filter(e => e.statut_dossier === 'Actif').length || 0,
      eleves_archives: eleves?.filter(e => e.date_archivage).length || 0,
      
      // Enseignants
      total_enseignants: enseignants?.length || 0,
      
      // Véhicules
      total_vehicules: vehicules?.length || 0,
      vehicules_actifs: vehicules?.filter(v => v.statut === 'Actif').length || 0,
      
      // Planning
      total_lecons: planning?.length || 0,
      lecons_ce_mois: planning?.filter(p => {
        const date = new Date(p.date);
        return date >= debutMois && date <= finMois;
      }).length || 0,
      lecons_prevues: planning?.filter(p => p.statut_lecon === 'Prévue').length || 0,
      lecons_effectuees: planning?.filter(p => p.statut_lecon === 'Effectuée').length || 0,
      lecons_annulees: planning?.filter(p => p.statut_lecon === 'Annulée').length || 0,
      
      // Finances
      total_recettes: recettes?.reduce((sum, r) => sum + (parseFloat(r.montant_recette) || 0), 0) || 0,
      recettes_ce_mois: recettes?.filter(r => {
        const date = new Date(r.date_recette);
        return date >= debutMois && date <= finMois;
      }).reduce((sum, r) => sum + (parseFloat(r.montant_recette) || 0), 0) || 0,
      
      total_depenses: depenses?.reduce((sum, d) => sum + (parseFloat(d.montant_depense) || 0), 0) || 0,
      depenses_ce_mois: depenses?.filter(d => {
        const date = new Date(d.date_depense);
        return date >= debutMois && date <= finMois;
      }).reduce((sum, d) => sum + (parseFloat(d.montant_depense) || 0), 0) || 0,
      
      // Examens
      total_examens: examens?.length || 0,
      examens_reussis: examens?.filter(e => e.resultat === 'Réussi').length || 0,
      examens_echoues: examens?.filter(e => e.resultat === 'Échoué').length || 0,
      taux_reussite: (examens && examens.length > 0)
        ? Math.round((examens.filter(e => e.resultat === 'Réussi').length / examens.length) * 100) 
        : 0,
      
      // Documents
      total_documents: documents?.length || 0,
      documents_valides: documents?.filter(d => d.etat === 'Validé').length || 0,
      documents_en_attente: documents?.filter(d => d.etat === 'En attente').length || 0,
    };

    // 3. Créer le prompt pour l'IA avec TOUTES les données
    const prompt = `Tu es un analyste expert en gestion d'auto-école. Voici les données COMPLÈTES d'une auto-école :

**📊 Élèves**
- Total : ${dataSummary.total_eleves}
- Actifs : ${dataSummary.eleves_actifs}
- Archivés : ${dataSummary.eleves_archives}

**👨‍🏫 Enseignants**
- Total : ${dataSummary.total_enseignants}

**🚗 Véhicules**
- Total : ${dataSummary.total_vehicules}
- Actifs : ${dataSummary.vehicules_actifs}

**📅 Planning**
- Leçons totales : ${dataSummary.total_lecons}
- Leçons ce mois : ${dataSummary.lecons_ce_mois}
- Prévues : ${dataSummary.lecons_prevues}
- Effectuées : ${dataSummary.lecons_effectuees}
- Annulées : ${dataSummary.lecons_annulees}

**💰 Finances**
- Recettes totales : ${dataSummary.total_recettes.toFixed(2)}€
- Recettes ce mois : ${dataSummary.recettes_ce_mois.toFixed(2)}€
- Dépenses totales : ${dataSummary.total_depenses.toFixed(2)}€
- Dépenses ce mois : ${dataSummary.depenses_ce_mois.toFixed(2)}€
- Bénéfice ce mois : ${(dataSummary.recettes_ce_mois - dataSummary.depenses_ce_mois).toFixed(2)}€

**🎓 Examens**
- Total : ${dataSummary.total_examens}
- Réussis : ${dataSummary.examens_reussis}
- Échoués : ${dataSummary.examens_echoues}
- Taux de réussite : ${dataSummary.taux_reussite}%

**📄 Documents**
- Total : ${dataSummary.total_documents}
- Validés : ${dataSummary.documents_valides}
- En attente : ${dataSummary.documents_en_attente}

**Ta mission :**
Génère EXACTEMENT 5 insights pertinents et actionnables pour cette auto-école.

**Format de réponse (STRICT) :**
Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après. Chaque insight doit avoir ce format :

[
  {
    "type": "success" | "warning" | "info",
    "title": "Titre court (max 5 mots)",
    "description": "Description claire et actionnable (max 15 mots)",
    "value": "Valeur chiffrée (ex: +12%, 87%, 5)"
  }
]

**Règles importantes :**
- Utilise "success" pour les bonnes nouvelles
- Utilise "warning" pour les alertes
- Utilise "info" pour les informations neutres
- Les valeurs doivent être des chiffres réels basés sur les données
- Sois précis et actionnable
- Pas de texte en dehors du JSON

Génère maintenant les 5 insights :`;

    // 4. Appeler l'IA Groq
    console.log('🤖 Appel à l\'IA Groq...');
    console.log('📝 Résumé des données envoyées:', dataSummary);
    
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Tu es un analyste expert en auto-école. Tu réponds UNIQUEMENT en JSON valide, sans texte supplémentaire.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_completion_tokens: 1000,
      top_p: 1,
      stream: false,
    });

    const aiResponse = completion.choices[0]?.message?.content || '[]';
    console.log('✅ Réponse IA reçue:', aiResponse);

    // 5. Parser la réponse JSON
    let insights;
    try {
      console.log('🔄 Nettoyage de la réponse IA...');
      // Nettoyer la réponse (enlever les backticks markdown si présents)
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      console.log('📄 Réponse nettoyée:', cleanedResponse);
      insights = JSON.parse(cleanedResponse);
      console.log('✅ JSON parsé avec succès:', insights);
    } catch (parseError) {
      console.error('❌ Erreur de parsing JSON:', parseError);
      console.error('📄 Réponse brute:', aiResponse);
      // Fallback : insights par défaut
      insights = [
        {
          type: 'info',
          title: 'Analyse en cours',
          description: 'Les données sont en cours d\'analyse.',
          value: `${dataSummary.total_eleves}`
        },
        {
          type: 'success',
          title: 'Auto-école active',
          description: `${dataSummary.total_moniteurs} moniteurs et ${dataSummary.total_vehicules} véhicules disponibles.`,
          value: `${dataSummary.lecons_ce_mois}`
        }
      ];
    }

    // 6. Ajouter des IDs aux insights
    const insightsWithIds = insights.map((insight: any, index: number) => ({
      id: index + 1,
      ...insight
    }));

    console.log('🎉 Insights finaux:', insightsWithIds);
    console.log('✅ API terminée avec succès');

    return NextResponse.json({
      insights: insightsWithIds,
      success: true
    });

  } catch (error: any) {
    console.error('❌❌❌ ERREUR CRITIQUE:', error);
    console.error('Stack trace:', error?.stack);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération des insights',
        details: error?.message || 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
