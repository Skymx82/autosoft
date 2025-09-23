import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Récupérer l'utilisateur par ID (UUID)
    const { data: utilisateur, error: fetchError } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('id_utilisateur', id)
      .single();
    
    if (fetchError || !utilisateur) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', fetchError);
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Utiliser Supabase Auth pour réinitialiser le mot de passe avec le client admin
    // Import du client admin
    const { supabaseAdmin } = await import('@/lib/supabase-admin');
    
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: utilisateur.email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
      }
    });
    
    if (resetError) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', resetError);
      return NextResponse.json(
        { error: 'Erreur lors de la réinitialisation du mot de passe' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Un email de réinitialisation de mot de passe a été envoyé à ${utilisateur.email}`
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  }
}
