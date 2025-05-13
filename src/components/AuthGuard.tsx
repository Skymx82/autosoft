'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('autosoft_user');
        if (!userData) {
          // Rediriger vers la page de connexion si aucune donnée utilisateur n'est trouvée
          router.push('/login');
          return;
        }

        // Vérifier si les données utilisateur sont valides
        const user = JSON.parse(userData);
        if (!user || !user.id || !user.role) {
          localStorage.removeItem('autosoft_user');
          router.push('/login');
          return;
        }

        // L'utilisateur est authentifié
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('autosoft_user');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Afficher un état de chargement pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Afficher le contenu protégé si l'utilisateur est authentifié
  return <>{children}</>;
}
