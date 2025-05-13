'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Authentification avec Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Aucun utilisateur trouvé');
      }

      // 2. Récupération de l'UUID de l'utilisateur
      const userId = authData.user.id;
      console.log('UUID de l\'utilisateur:', userId);

      // 3. Récupération des informations de l'utilisateur depuis la table utilisateur
      const { data: userData, error: userError } = await supabase
        .from('utilisateur')
        .select('*')
        .eq('id_utilisateur', userId)
        .single();

      if (userError) {
        console.error('Erreur lors de la récupération des données utilisateur:', userError);
        throw new Error('Impossible de récupérer les informations de l\'utilisateur');
      }

      if (!userData) {
        throw new Error('Aucune information utilisateur trouvée');
      }

      console.log('Données utilisateur:', userData);

      // 4. Stockage des informations utilisateur dans le localStorage pour y accéder facilement
      localStorage.setItem('autosoft_user', JSON.stringify({
        id: userId,
        email: authData.user.email,
        role: userData.role,
        id_ecole: userData.id_ecole,
        id_bureau: userData.id_bureau
      }));

      // 5. Redirection vers le tableau de bord approprié en fonction du rôle
      const dashboardRoute = getDashboardRouteByRole(userData.role);
      router.push(dashboardRoute);
      router.refresh();
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError(error.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-600 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <h1 className="text-4xl font-bold mb-6">AutoSoft</h1>
          <p className="text-xl max-w-md text-center mb-8">
            La solution complète pour la gestion de votre auto-école
          </p>
          <div className="w-64 h-64 bg-white/10 rounded-full backdrop-blur-sm"></div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-600">AutoSoft</h1>
            <p className="text-gray-500 mt-2">La solution pour votre auto-école</p>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Connexion
          </h2>
          
          {error && (
            <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                    Oublié ?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Contactez votre administrateur pour obtenir un accès
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}