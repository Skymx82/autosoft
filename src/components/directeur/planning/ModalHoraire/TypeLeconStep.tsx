'use client';

import { FiFileText } from 'react-icons/fi';

// Types pour les catégories et options
interface LeconCategory {
  id: string;
  label: string;
  color: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

interface TypeLeconStepProps {
  typeLecon: string;
  setTypeLecon: (type: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  commentaire: string;
  setCommentaire: (commentaire: string) => void;
}

export default function TypeLeconStep({
  typeLecon,
  setTypeLecon,
  selectedCategory,
  setSelectedCategory,
  commentaire,
  setCommentaire
}: TypeLeconStepProps) {
  // Catégories de leçons disponibles
  const leconCategories: LeconCategory[] = [
    { id: "B", label: "Permis B", color: "blue" },
    { id: "A", label: "Moto", color: "green" },
    { id: "autre", label: "Autres permis", color: "purple" },
    { id: "code", label: "Code/Théorie", color: "yellow" },
    { id: "examen", label: "Examens", color: "red" },
    { id: "dispo", label: "Disponibilités", color: "gray" },
  ];
  
  // Options pour chaque catégorie
  const categoryOptions: {[key: string]: CategoryOption[]} = {
    "B": [
      { value: "B_manuelle", label: "Boîte manuelle" },
      { value: "B_auto", label: "Boîte automatique" },
      { value: "B_manuelle_accompagnee", label: "Conduite accompagnée (manuelle)" },
      { value: "B_auto_accompagnee", label: "Conduite accompagnée (auto)" },
      { value: "B_supervision", label: "Supervision" },
    ],
    "A": [
      { value: "A1", label: "A1 - 125cm³" },
      { value: "A2", label: "A2 - Moto limitée" },
      { value: "A", label: "A - Toutes cylindrées" },
    ],
    "autre": [
      { value: "AM", label: "AM - Cyclomoteur" },
      { value: "C", label: "C - Poids lourd" },
      { value: "D", label: "D - Transport en commun" },
      { value: "BE", label: "BE - Voiture + remorque" },
    ],
    "code": [
      { value: "code", label: "Leçon de code" },
      { value: "theorique_specifique", label: "Théorie spécifique" },
    ],
    "examen": [
      { value: "examen_code", label: "Examen du code" },
      { value: "examen_pratique", label: "Examen pratique" },
    ],
    "dispo": [
      { value: "disponible", label: "Disponible" },
      { value: "indisponible", label: "Indisponible" },
      { value: "maintenance", label: "Maintenance véhicule" },
    ],
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-blue-600 mb-2">
        <FiFileText className="w-5 h-5" />
        <h3 className="font-medium">Type de leçon et commentaires</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de leçon</label>
          
          {/* Sélection de catégorie par boutons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {leconCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedCategory === category.id
                    ? `bg-${category.color}-100 text-${category.color}-700 border border-${category.color}-300`
                    : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  if (typeLecon && !categoryOptions[category.id].some(opt => opt.value === typeLecon)) {
                    setTypeLecon('');
                  }
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          {/* Options pour la catégorie sélectionnée */}
          {selectedCategory && (
            <select
              id="typeLecon"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
              value={typeLecon}
              onChange={(e) => setTypeLecon(e.target.value)}
            >
              <option value="">Sélectionner une option</option>
              {categoryOptions[selectedCategory].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          
          {!selectedCategory && (
            <div className="text-sm text-gray-500 italic">
              Veuillez d'abord sélectionner une catégorie ci-dessus
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="commentaire" className="block text-sm font-medium text-gray-700 mb-1">Commentaires</label>
          <textarea
            id="commentaire"
            className="w-full p-2 border border-gray-300 rounded-md h-24"
            placeholder="Ajouter des commentaires ou instructions spécifiques..."
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
