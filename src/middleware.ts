import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Récupérer le chemin de la requête
  const path = request.nextUrl.pathname;
  
  // Définir les chemins publics qui ne nécessitent pas d'authentification
  const isPublicPath = path === '/' || path === '/login' || path.startsWith('/_next') || path.startsWith('/api/auth');
  
  // Si c'est un chemin public, on laisse passer sans vérification
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Pour les chemins protégés, on laisse la vérification se faire côté client
  // Nous allons créer un composant d'authentification qui vérifiera le localStorage
  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  // Appliquer ce middleware à toutes les routes sauf les ressources statiques
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth routes (authentification)
     * 2. /_next (Next.js internals)
     * 3. /fonts, /images (ressources statiques)
     * 4. /favicon.ico, /robots.txt (fichiers spéciaux)
     */
    '/((?!api/auth|_next|fonts|images|favicon.ico|robots.txt).*)',
  ],
};
