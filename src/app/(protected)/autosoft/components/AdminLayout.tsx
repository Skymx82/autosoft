'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiBarChart2, 
  FiDatabase, 
  FiHelpCircle,
  FiMenu,
  FiX,
  FiLogOut,
  FiBell
} from 'react-icons/fi';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Dashboard', href: '/autosoft/dashboard', icon: FiHome, current: pathname === '/autosoft/dashboard' },
    { name: 'Auto-écoles', href: '/autosoft/dashboard', icon: FiDatabase, current: pathname === '/autosoft/dashboard' },
    { name: 'Utilisateurs', href: '/autosoft/users', icon: FiUsers, current: pathname === '/autosoft/users' },
    { name: 'Statistiques', href: '/autosoft/statistics', icon: FiBarChart2, current: pathname === '/autosoft/statistics' },
    { name: 'Paramètres', href: '/autosoft/settings', icon: FiSettings, current: pathname === '/autosoft/settings' },
    { name: 'Support', href: '/autosoft/support', icon: FiHelpCircle, current: pathname === '/autosoft/support' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar pour mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Autosoft"
              />
              <span className="ml-2 text-xl font-semibold text-gray-800">Autosoft</span>
            </div>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600"
              onClick={toggleSidebar}
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
              <FiLogOut className="mr-3 h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar pour desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <img
            className="h-8 w-auto"
            src="/logo.png"
            alt="Autosoft"
          />
          <span className="ml-2 text-xl font-semibold text-gray-800">Autosoft</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
            <FiLogOut className="mr-3 h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="text-gray-500 lg:hidden"
              onClick={toggleSidebar}
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <FiBell className="h-6 w-6" />
              </button>
              <div className="ml-4 flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">A</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
