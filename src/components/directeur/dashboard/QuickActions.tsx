'use client';

import { FiUserPlus, FiClock, FiFileText, FiDollarSign } from 'react-icons/fi';
import Link from 'next/link';

export default function QuickActions() {
  const actions = [
    {
      id: 1,
      title: 'Ajouter un élève',
      icon: <FiUserPlus className="h-5 w-5 text-blue-600" />,
      href: '/directeur/eleves/ajouter',
    },
    {
      id: 2,
      title: 'Ajouter un horaire',
      icon: <FiClock className="h-5 w-5 text-blue-600" />,
      href: '/directeur/planning',
    },
    {
      id: 3,
      title: 'Créer un devis',
      icon: <FiFileText className="h-5 w-5 text-blue-600" />,
      href: '/directeur/devis/creer',
    },
    {
      id: 4,
      title: 'Enregistrer un paiement',
      icon: <FiDollarSign className="h-5 w-5 text-blue-600" />,
      href: '/directeur/comptabilite/paiement',
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-3">Actions rapides</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link 
            href={action.href} 
            key={action.id} 
            className="flex items-center px-3 py-3 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <span className="mr-2">{action.icon}</span>
            <span className="text-sm font-medium text-gray-500">{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
