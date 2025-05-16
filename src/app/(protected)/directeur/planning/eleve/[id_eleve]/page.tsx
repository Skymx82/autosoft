import EleveLeconsSummary from '@/components/directeur/planning/EleveLeconsSummary';
import { notFound } from 'next/navigation';

// Cette fonction est nécessaire pour Next.js 15
export const dynamic = 'force-dynamic';

// Définition de la fonction pour générer les métadonnées
export async function generateMetadata({ params }: { params: { id_eleve: string } }) {
  return {
    title: `Détails de l'élève ${params.id_eleve}`,
  };
}

// Composant principal de la page
export default function ElevePlanningPage({ params }: { params: { id_eleve: string } }) {
  // Vérifier que id_eleve est un nombre valide
  const eleveId = parseInt(params.id_eleve);
  
  if (isNaN(eleveId) || eleveId <= 0) {
    return notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <EleveLeconsSummary id_eleve={eleveId} />
    </div>
  );
}
