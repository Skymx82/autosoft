'use client';

import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiHome, 
  FiCalendar, 
  FiPlusCircle, 
  FiUser, 
  FiBook, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiClock,
  FiAward
} from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

interface EleveLayoutProps {
  children: ReactNode;
}

export default function EleveLayout({ children }: EleveLayoutProps) {
  const [userData, setUserData] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Récupérer les données utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('autosoft_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      router.push('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('autosoft_user');
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Définition des éléments de navigation pour le menu latéral et le menu mobile
  const navItems = [
    { 
      name: 'Accueil', 
      href: '/eleves/dashboard', 
      icon: <FiHome className="w-6 h-6" />,
      description: 'Tableau de bord et aperçu'
    },
    { 
      name: 'Cours', 
      href: '/eleves/cours', 
      icon: <FiBook className="w-6 h-6" />,
      description: 'Mes cours et formations'
    },
    { 
      name: 'Réserver', 
      href: '/eleves/reserver', 
      icon: <FiPlusCircle className="w-8 h-8" />,
      description: 'Réserver une leçon',
      primary: true
    },
    { 
      name: 'Leçons', 
      href: '/eleves/lecons', 
      icon: <FiCalendar className="w-6 h-6" />,
      description: 'Historique des leçons'
    },
    { 
      name: 'Profil', 
      href: '/eleves/profil', 
      icon: <FiUser className="w-6 h-6" />,
      description: 'Mon compte et paramètres'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16 relative">
      {/* Header mobile simplifié */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              {/* Logo */}
            </div>
            <span className="ml-2 font-bold text-gray-800">AutoSoft</span>
          </div>
          
          <div className="text-sm font-medium text-blue-600">
            {userData?.prenom} {userData?.nom}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="w-full">
        {children}
      </main>

      {/* Navigation en bas (mobile) avec design de vague */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        {/* Forme de vague pour le bouton central */}
        <div className="absolute -top-5 left-0 right-0 flex justify-center pointer-events-none">
          <div className="w-20 h-20 bg-white rounded-full border-t border-gray-200"></div>
        </div>
        
        <div className="grid grid-cols-5 h-16 relative">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center relative ${
                pathname === item.href 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {item.primary ? (
                <div className="absolute -top-3 bg-blue-600 rounded-full p-3 shadow-md z-10 text-white">
                  {item.icon}
                </div>
              ) : (
                <div className={pathname === item.href ? 'text-blue-600' : 'text-gray-500'}>
                  {item.icon}
                </div>
              )}
              {!item.primary && (
                <span className="text-xs mt-1">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
