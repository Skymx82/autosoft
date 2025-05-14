'use client';

import { useState, useEffect } from 'react';
import { BiBuildings } from 'react-icons/bi';
import { supabase } from '@/lib/supabase';

interface Bureau {
  id_bureau: number;
  nom: string;
  id_ecole: number;
}

export default function BureauSelector() {
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [selectedBureau, setSelectedBureau] = useState<Bureau | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchBureaux = async () => {
      try {
        // Récupérer l'utilisateur actuel
        const userData = localStorage.getItem('autosoft_user');
        if (!userData) return;
        
        const user = JSON.parse(userData);
        
        // Récupérer les bureaux associés à l'utilisateur
        const { data, error } = await supabase
          .from('bureau')
          .select('id_bureau, nom, id_ecole')
          .eq('id_ecole', user.id_ecole);
          console.log(data);
        
        if (error) throw error;
        
        if (data) {
          // Ajouter l'option "Tout" au début de la liste
          const allBureaux = [
            { id_bureau: 0, nom: 'Tout', id_ecole: user.id_ecole },
            ...data
          ];
          
          setBureaux(allBureaux);
          
          // Sélectionner le bureau actuel de l'utilisateur par défaut
          if (user.id_bureau === 0) {
            setSelectedBureau(allBureaux[0]);
          } else {
            const userBureau = data.find(bureau => bureau.id_bureau === user.id_bureau);
            if (userBureau) {
              setSelectedBureau(userBureau);
            } else {
              // Sinon, sélectionner l'option "Tout"
              setSelectedBureau(allBureaux[0]);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des bureaux:', error);
      }
    };

    fetchBureaux();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectBureau = (bureau: Bureau) => {
    setSelectedBureau(bureau);
    setIsOpen(false);
    
    // Mettre à jour le bureau sélectionné dans le localStorage
    const userData = localStorage.getItem('autosoft_user');
    if (userData) {
      const user = JSON.parse(userData);
      user.id_bureau = bureau.id_bureau;
      localStorage.setItem('autosoft_user', JSON.stringify(user));
      
      // Effectuer un rechargement complet de la page
      window.location.reload();
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center text-gray-400 hover:text-gray-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <BiBuildings className="h-6 w-6" />
      </button>
      
      {isOpen && bureaux.length > 0 && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">
              Sélectionner un bureau
            </div>
            {bureaux.map((bureau) => (
              <button
                key={bureau.id_bureau}
                onClick={() => selectBureau(bureau)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedBureau?.id_bureau === bureau.id_bureau
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="menuitem"
              >
                {bureau.nom}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
