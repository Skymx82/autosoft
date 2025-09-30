import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Récupérer l'ID de l'école depuis les paramètres de recherche
    const { searchParams } = new URL(request.url);
    const idEcole = searchParams.get('id_ecole');
    
    if (!idEcole) {
      return NextResponse.json(
        { error: 'ID de l\'école requis' },
        { status: 400 }
      );
    }
    
    // Récupérer les bureaux de l'école spécifiée
    const { data, error } = await supabase
      .from('bureau')
      .select('id_bureau, nom')
      .eq('id_ecole', parseInt(idEcole))
      .order('nom');
    
    if (error) {
      console.error('Erreur lors de la récupération des bureaux:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des bureaux' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des bureaux:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bureaux' },
      { status: 500 }
    );
  }
}
