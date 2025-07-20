'use client';

import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  FiCalendar, 
  FiUsers, 
  FiClock, 
  FiHome, 
  FiUser, 
  FiLogOut, 
  FiBell, 
  FiSettings,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';

interface MoniteurLayoutProps {
  children: ReactNode;
}

export default function MoniteurLayout({ children }: MoniteurLayoutProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  // Récupérer les données utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('autosoft_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('autosoft_user');
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Navigation principale pour les moniteurs - optimisée pour mobile
  const navItems = [
    { 
      name: 'Aujourd\'hui', 
      href: '/moniteur/dashboard', 
      icon: <FiHome className="w-6 h-6" />,
      activeColor: 'text-blue-500'
    },
    { 
      name: 'Planning', 
      href: '/moniteur/planning', 
      icon: <FiCalendar className="w-6 h-6" />,
      activeColor: 'text-green-500'
    },
    { 
      name: 'Élèves', 
      href: '/moniteur/eleves', 
      icon: <FiUsers className="w-6 h-6" />,
      activeColor: 'text-purple-500'
    },
    { 
      name: 'Leçon', 
      href: '/moniteur/lecon', 
      icon: <MdDirectionsCar className="w-6 h-6" />,
      activeColor: 'text-red-500'
    },
    { 
      name: 'Profil', 
      href: '/moniteur/profil', 
      icon: <FiUser className="w-6 h-6" />,
      activeColor: 'text-gray-500'
    },
  ];

  // Notifications factices pour la démo
  const notifications = [
    { id: 1, title: 'Nouvelle leçon', message: 'Leçon ajoutée avec Jean Dupont à 14h00', time: '10 min' },
    { id: 2, title: 'Annulation', message: 'Leçon de 16h00 avec Marie Martin annulée', time: '1 heure' },
    { id: 3, title: 'Rappel', message: 'Pensez à valider vos heures de la semaine', time: '3 heures' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header simplifié pour mobile */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo et titre */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                {/* Logo placeholder */}
              </div>
              <h1 className="ml-2 text-lg font-semibold text-gray-800">AutoSoft</h1>
            </div>
            
            {/* Actions rapides */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button 
                className="relative p-1 rounded-full text-gray-400 hover:text-gray-500"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <FiBell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
              
              {/* Espace pour d'autres éléments si nécessaire */}
            </div>
          </div>
        </div>
        
        {/* Panneau de notifications */}
        {notificationsOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg py-1 z-20 max-h-96 overflow-y-auto">
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
            </div>
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <p>Aucune notification</p>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Contenu principal avec padding pour le header et la navigation */}
      <main className="pt-14 pb-2 w-full">
        {children}
      </main>

      {/* Navigation par onglets en bas (style app mobile) */}
      <nav className="bg-white shadow-lg fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 w-full ${
                  isActive ? `${item.activeColor}` : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`p-1 ${isActive ? 'animate-pulse' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Menu utilisateur - accessible depuis le profil */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-80 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Menu</h3>
              <button 
                onClick={() => setUserMenuOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <FiUser className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-800">{userData?.email || 'Utilisateur'}</p>
                  <p className="text-sm text-gray-500 capitalize">{userData?.role || 'Moniteur'}</p>
                </div>
              </div>
            </div>
            <div className="py-1">
              <Link
                href="/moniteur/parametres"
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setUserMenuOpen(false)}
              >
                <FiSettings className="mr-3 h-5 w-5 text-gray-400" />
                Paramètres
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setUserMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
