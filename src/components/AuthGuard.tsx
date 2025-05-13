'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type UserRole = 'admin' | 'directeur' | 'moniteur' | 'secretaire' | 'comptable';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

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
        setUserRole(user.role as UserRole);

        // Vérifier si l'utilisateur a le rôle approprié pour accéder à cette page
        const pathSegments = pathname.split('/');
        // Le premier segment après '/' est généralement le rôle (ex: /admin/dashboard)
        const roleFromPath = pathSegments[1];

        // Si le chemin contient un rôle spécifique, vérifier que l'utilisateur a ce rôle
        if (roleFromPath && ['admin', 'directeur', 'moniteur', 'secretaire', 'comptable'].includes(roleFromPath)) {
          if (user.role !== roleFromPath && user.role !== 'admin') {
            // Rediriger vers le tableau de bord approprié pour le rôle de l'utilisateur
            const dashboardRoute = getDashboardRouteByRole(user.role);
            router.push(dashboardRoute);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('autosoft_user');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, pathname]);

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

  // Afficher un état de chargement pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Vérifier si le rôle de l'utilisateur est autorisé (si des rôles spécifiques sont requis)
  if (allowedRoles && allowedRoles.length > 0 && userRole) {
    if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
      // Rediriger vers le tableau de bord approprié pour le rôle de l'utilisateur
      const dashboardRoute = getDashboardRouteByRole(userRole);
      router.push(dashboardRoute);
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
  }

  // Afficher le contenu protégé si l'utilisateur est authentifié et a le rôle approprié
  return <>{children}</>;
}
