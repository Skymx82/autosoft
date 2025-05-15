'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiLogOut, FiBell, FiBarChart2, FiCalendar, FiUsers, FiDollarSign, FiSettings } from 'react-icons/fi';
import BureauSelector from '@/components/selectors/BureauSelector';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface DirectorLayoutProps {
  children: ReactNode;
}

export default function DirectorLayout({ children }: DirectorLayoutProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  // Récupérer les données utilisateur depuis le localStorage
  useState(() => {
    const storedUser = localStorage.getItem('autosoft_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('autosoft_user');
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const navItems = [
    { name: 'Tableau de bord', href: '/directeur/dashboard', icon: <FiBarChart2 className="w-5 h-5" /> },
    { name: 'Planning', href: '/directeur/planning', icon: <FiCalendar className="w-5 h-5" /> },
    { name: 'Élèves', href: '/directeur/eleves', icon: <FiUsers className="w-5 h-5" /> },
    { name: 'Comptabilité', href: '/directeur/comptabilite', icon: <FiDollarSign className="w-5 h-5" /> },
    { name: 'Statistiques', href: '/directeur/statistiques', icon: <FiBarChart2 className="w-5 h-5" /> },
    { name: 'Mon auto-école', href: '/directeur/mon-auto-ecole', icon: <FiSettings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo et navigation principale */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 mr-6 flex items-center justify-center">
                  {/* Emplacement pour le futur logo */}
                </div>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === item.href
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Boutons de droite */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {/* Sélecteur de bureau */}
              <div className="mr-4">
                <BureauSelector />
              </div>
              
              {/* Bouton notifications */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">Voir les notifications</span>
                <FiBell className="h-6 w-6" />
              </button>

              {/* Menu profil */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Ouvrir le menu utilisateur</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                      <FiUser className="h-5 w-5" />
                    </div>
                  </button>
                </div>
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <p className="font-medium truncate">{userData?.email || 'Utilisateur'}</p>
                      <p className="text-xs text-gray-500 capitalize">{userData?.role || 'Directeur'}</p>
                    </div>
                    <Link href="/directeur/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bouton menu mobile */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Ouvrir le menu principal</span>
                {mobileMenuOpen ? <FiX className="block h-6 w-6" /> : <FiMenu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-base font-medium ${
                    pathname === item.href
                      ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                      : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <FiUser className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{userData?.email || 'Utilisateur'}</div>
                  <div className="text-sm font-medium text-gray-500 capitalize">{userData?.role || 'Directeur'}</div>
                </div>
                <button className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">Voir les notifications</span>
                  <FiBell className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/directeur/profil"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Contenu principal */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
