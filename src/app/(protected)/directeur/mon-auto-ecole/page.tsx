'use client';

import { useState } from 'react';
import { FiInfo, FiMapPin, FiPackage, FiUsers, FiSettings, FiArrowLeft } from 'react-icons/fi';
import DirectorLayout from '@/components/directeur/layout/DirectorLayout';
import AutoEcoleInfoGenerales from '@/components/directeur/mon-auto-ecole/InfoGenerales';
import AutoEcoleBureaux from '@/components/directeur/mon-auto-ecole/Bureaux';
import AutoEcoleForfaits from '@/components/directeur/mon-auto-ecole/Forfaits';
import AutoEcolePersonnel from '@/components/directeur/mon-auto-ecole/Personnel';
import AutoEcoleParametres from '@/components/directeur/mon-auto-ecole/Parametres';

export default function MonAutoEcolePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Définition des sections
  const sections = [
    { 
      id: 'info', 
      name: 'Informations générales', 
      icon: <FiInfo className="w-12 h-12" />,
      description: 'Gérez les informations de base de votre auto-école : nom, adresse, contacts et logo.'
    },
    { 
      id: 'bureaux', 
      name: 'Bureaux', 
      icon: <FiMapPin className="w-12 h-12" />,
      description: 'Ajoutez et gérez les différents bureaux et succursales de votre auto-école.'
    },
    { 
      id: 'forfaits', 
      name: 'Forfaits', 
      icon: <FiPackage className="w-12 h-12" />,
      description: 'Configurez les différentes formules et tarifs proposés à vos élèves.'
    },
    { 
      id: 'personnel', 
      name: 'Personnel', 
      icon: <FiUsers className="w-12 h-12" />,
      description: 'Gérez les moniteurs, secrétaires et autres membres du personnel.'
    },
    { 
      id: 'parametres', 
      name: 'Paramètres', 
      icon: <FiSettings className="w-12 h-12" />,
      description: 'Configurez les paramètres généraux de votre auto-école.'
    },
  ];

  // Fonction pour afficher le composant correspondant à la section active
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'info':
        return <AutoEcoleInfoGenerales />;
      case 'bureaux':
        return <AutoEcoleBureaux />;
      case 'forfaits':
        return <AutoEcoleForfaits />;
      case 'personnel':
        return <AutoEcolePersonnel />;
      case 'parametres':
        return <AutoEcoleParametres />;
      default:
        return null;
    }
  };

  return (
    <DirectorLayout>
      <div className="flex flex-col h-full relative p-6 text-gray-800">
        {activeSection ? (
          // Affichage du composant sélectionné avec bouton de retour
          <div className="space-y-4">
            <button 
              onClick={() => setActiveSection(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <FiArrowLeft className="mr-2" /> Retour aux paramètres
            </button>
            <h2 className="text-2xl font-bold">
              {sections.find(s => s.id === activeSection)?.name}
            </h2>
            <div className="bg-white rounded-lg shadow p-6">
              {renderActiveSection()}
            </div>
          </div>
        ) : (
          // Affichage des sections sous forme de cartes
          <>
            <h1 className="text-2xl font-bold mb-6">Paramètres de mon auto-école</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <div 
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden h-28"
                >
                  <div className="p-5 flex items-center h-full">
                    <div className="rounded-full bg-blue-50 p-4 mr-6 flex-shrink-0">
                      <span className="text-blue-600">{section.icon}</span>
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <h3 className="text-lg font-semibold mb-1 truncate">{section.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{section.description}</p>
                    </div>
                    <div className="ml-2 text-blue-600 flex-shrink-0">
                      <span className="text-sm font-medium">Configurer</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DirectorLayout>
  );
}
