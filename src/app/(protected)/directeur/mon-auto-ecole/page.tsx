'use client';

import { useState } from 'react';
import { FiInfo, FiMapPin, FiPackage, FiUsers, FiSettings, FiArrowLeft, FiTruck, FiUserPlus, FiHome } from 'react-icons/fi';
import DirectorLayout from '@/components/layout/DirectorLayout';
import AutoEcoleInfoGenerales from '@/app/(protected)/directeur/mon-auto-ecole/components/InfoGenerales';
import AutoEcoleBureaux from '@/app/(protected)/directeur/mon-auto-ecole/components/Bureaux';
import AutoEcoleForfaits from '@/app/(protected)/directeur/mon-auto-ecole/components/Forfaits';
import AutoEcolePersonnel from '@/app/(protected)/directeur/mon-auto-ecole/components/User/Personnel';
import AutoEcoleParametres from '@/app/(protected)/directeur/mon-auto-ecole/components/Parametres';
import AutoEcoleVehicules from '@/app/(protected)/directeur/mon-auto-ecole/components/Vehicules';

export default function MonAutoEcolePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Définition des sections
  const sections = [
    { 
      id: 'personnel', 
      name: 'Gestion du Personnel', 
      icon: <FiUsers className="w-12 h-12" />,
      description: 'Créez et gérez vos moniteurs, secrétaires et autres membres du personnel.',
      highlight: true,
      actions: [
        { name: 'Ajouter un moniteur', icon: <FiUserPlus />, description: 'Créer un nouveau compte moniteur' },
        { name: 'Gérer les utilisateurs', icon: <FiUsers />, description: 'Voir tous les membres du personnel' }
      ]
    },
    { 
      id: 'bureaux', 
      name: 'Bureaux et Agences', 
      icon: <FiHome className="w-12 h-12" />,
      description: 'Ajoutez et gérez les différents bureaux et succursales de votre auto-école.',
      actions: [
        { name: 'Ajouter un bureau', icon: <FiMapPin />, description: 'Créer une nouvelle agence' }
      ]
    },
    { 
      id: 'forfaits', 
      name: 'Forfaits et Tarifs', 
      icon: <FiPackage className="w-12 h-12" />,
      description: 'Configurez les différentes formules et tarifs proposés à vos élèves.',
      actions: [
        { name: 'Créer un forfait', icon: <FiPackage />, description: 'Ajouter une nouvelle offre' }
      ]
    },
    { 
      id: 'vehicules', 
      name: 'Parc Automobile', 
      icon: <FiTruck className="w-12 h-12" />,
      description: 'Gérez votre parc automobile : voitures, motos et autres véhicules.',
      actions: [
        { name: 'Ajouter un véhicule', icon: <FiTruck />, description: 'Enregistrer un nouveau véhicule' }
      ]
    },
    { 
      id: 'info', 
      name: 'Informations générales', 
      icon: <FiInfo className="w-12 h-12" />,
      description: 'Gérez les informations de base de votre auto-école : nom, adresse, contacts et logo.'
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
      case 'vehicules':
        return <AutoEcoleVehicules />;
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
      <div className="flex flex-col h-full relative p-6 text-gray-800 bg-gray-50">
        {activeSection ? (
          // Affichage du composant sélectionné avec bouton de retour
          <div className="space-y-4">
            <button 
              onClick={() => setActiveSection(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" /> Retour au tableau de bord
            </button>
            <h2 className="text-3xl font-bold text-gray-900">
              {sections.find(s => s.id === activeSection)?.name}
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              {renderActiveSection()}
            </div>
          </div>
        ) : (
          // Affichage des sections sous forme de cartes améliorées
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion de mon auto-école</h1>
              <p className="text-gray-600">Configurez et gérez tous les aspects de votre auto-école depuis ce tableau de bord.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Section Personnel mise en évidence */}
              <div 
                onClick={() => setActiveSection('personnel')}
                className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden text-white relative group"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-white/20 p-4 mr-4">
                      <FiUsers className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold">Gestion du Personnel</h3>
                  </div>
                  
                  <p className="mb-6 text-white/90 text-lg">
                    Créez et gérez vos moniteurs, secrétaires et autres membres du personnel.
                    <span className="block mt-2 font-semibold">C'est ici que vous pouvez ajouter de nouveaux moniteurs à votre auto-école.</span>
                  </p>
                  
                  <div className="mt-auto">
                    <button className="bg-white text-blue-700 hover:bg-blue-50 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center">
                      <FiUserPlus className="mr-2" /> Accéder à la gestion du personnel
                    </button>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
                  Important
                </div>
              </div>
              
              {/* Autres sections en grille */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {sections.filter(s => s.id !== 'personnel').slice(0, 4).map((section) => (
                  <div 
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 h-full group"
                  >
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex items-center mb-3">
                        <div className="rounded-full bg-blue-50 p-3 mr-3">
                          <span className="text-blue-600">{section.icon}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {section.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                      <div className="mt-auto text-blue-600 font-medium text-sm flex items-center">
                        Configurer <FiArrowLeft className="ml-2 transform rotate-180" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Deuxième rangée de cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {sections.filter(s => s.id !== 'personnel').slice(4).map((section) => (
                <div 
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 group"
                >
                  <div className="p-5 flex items-center">
                    <div className="rounded-full bg-blue-50 p-3 mr-4">
                      <span className="text-blue-600">{section.icon}</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {section.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{section.description}</p>
                    </div>
                    <div className="text-blue-600">
                      <FiArrowLeft className="transform rotate-180" />
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
