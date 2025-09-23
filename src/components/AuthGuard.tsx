'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type UserRole = 'admin' | 'directeur' | 'moniteur' | 'secretaire' | 'comptable'| 'autosoft';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean | null;
    userRole: UserRole | null;
    isLoading: boolean;
  }>({ isAuthenticated: null, userRole: null, isLoading: true });

  useEffect(() => {
    let isMounted = true;
    
    // Vérifier si l'utilisateur est connecté
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('autosoft_user');
        
        if (!userData) {
          if (isMounted) {
            // Rediriger vers la page de connexion si aucune donnée utilisateur n'est trouvée
            router.push('/login');
          }
          return;
        }

        // Vérifier si les données utilisateur sont valides
        const user = JSON.parse(userData);
        if (!user || !user.id || !user.role) {
          localStorage.removeItem('autosoft_user');
          if (isMounted) {
            router.push('/login');
          }
          return;
        }

        const userRole = user.role as UserRole;
        
        // Vérifier si l'utilisateur a le rôle approprié pour accéder à cette page
        if (allowedRoles && allowedRoles.length > 0) {
          if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
            // Rediriger vers le tableau de bord approprié pour le rôle de l'utilisateur
            const dashboardRoute = getDashboardRouteByRole(userRole);
            if (isMounted) {
              router.push(dashboardRoute);
            }
            return;
          }
        }

        // Mettre à jour l'état d'authentification
        if (isMounted) {
          setAuthState({
            isAuthenticated: true,
            userRole,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('autosoft_user');
        if (isMounted) {
          router.push('/login');
        }
      }
    };

    checkAuth();
    
    // Nettoyage pour éviter les mises à jour sur un composant démonté
    return () => {
      isMounted = false;
    };
  }, [router, pathname, allowedRoles]);

  // Fonction pour déterminer la route du tableau de bord en fonction du rôle
  const getDashboardRouteByRole = (role: string): string => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'directeur':
        return '/directeur/dashboard';
      case 'moniteur':
        return '/moniteur/dashboard';
      case 'secretaire':
        return '/secretaire/dashboard';
      case 'comptable':
        return '/comptable/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Afficher un état de chargement
  if (authState.isLoading || authState.isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Afficher le contenu protégé si l'utilisateur est authentifié et a le rôle approprié
  return <>{children}</>;
}
