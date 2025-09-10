import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function DELETE(request: NextRequest) {
  try {
    // Récupérer les données de la requête
    const data = await request.json();
    const { id_depense, id_ecole, id_bureau } = data;

    // Validation des données
    if (!id_depense) {
      return NextResponse.json({ message: 'ID de dépense manquant' }, { status: 400 });
    }

    if (!id_ecole) {
      return NextResponse.json({ message: 'ID d\'école manquant' }, { status: 400 });
    }

    if (!id_bureau || id_bureau === '0') {
      return NextResponse.json({ message: 'Veuillez sélectionner un bureau valide avant de supprimer une dépense' }, { status: 400 });
    }

    // Créer un client Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Variables d\'environnement Supabase manquantes');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Récupérer l'ID de la transaction associée à la dépense
    const { data: depenseData, error: depenseError } = await supabase
      .from('depense')
      .select('id_transaction')
      .eq('id_depense', id_depense)
      .eq('id_ecole', id_ecole)
      .single();

    if (depenseError) {
      console.error('Erreur lors de la récupération de la dépense:', depenseError);
      return NextResponse.json({ message: 'Erreur lors de la récupération de la dépense' }, { status: 500 });
    }

    if (!depenseData) {
      return NextResponse.json({ message: 'Dépense non trouvée' }, { status: 404 });
    }

    const id_transaction = depenseData.id_transaction;

    // Commencer une transaction pour supprimer à la fois la dépense et la transaction
    const { error: deleteError } = await supabase.rpc('supprimer_depense_et_transaction', {
      p_id_depense: id_depense,
      p_id_transaction: id_transaction,
      p_id_ecole: id_ecole,
      p_id_bureau: id_bureau
    });

    if (deleteError) {
      console.error('Erreur lors de la suppression:', deleteError);
      return NextResponse.json({ message: 'Erreur lors de la suppression de la dépense' }, { status: 500 });
    }

    // Retourner une réponse de succès
    return NextResponse.json({ message: 'Dépense supprimée avec succès' });

  } catch (error) {
    console.error('Erreur lors de la suppression de la dépense:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
