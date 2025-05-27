'use client';

import React, { useState, useEffect } from 'react';
import { StudentSelectorProps, Student, LicenseCategory } from './types';

export default function StudentSelector({
  selectedStudentId,
  onStudentChange,
  licenseCategory,
  onLicenseCategoryChange
}: StudentSelectorProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Simuler le chargement des élèves depuis une API
  useEffect(() => {
    // Dans une vraie application, cela serait un appel API
    const fetchStudents = async () => {
      // Données simulées
      const mockStudents: Student[] = [
        { 
          id_eleve: 1, 
          nom: 'Dupont', 
          prenom: 'Jean', 
          tel: '0612345678',
          email: 'jean.dupont@example.com',
          licenseCategory: 'B',
          remainingHours: 15,
          progress: 65
        },
        { 
          id_eleve: 2, 
          nom: 'Martin', 
          prenom: 'Sophie', 
          tel: '0698765432',
          email: 'sophie.martin@example.com',
          licenseCategory: 'B auto',
          remainingHours: 8,
          progress: 80
        },
        { 
          id_eleve: 3, 
          nom: 'Durand', 
          prenom: 'Pierre', 
          tel: '0654321098',
          email: 'pierre.durand@example.com',
          licenseCategory: 'A2',
          remainingHours: 20,
          progress: 30
        },
        { 
          id_eleve: 4, 
          nom: 'Lefebvre', 
          prenom: 'Marie', 
          tel: '0687654321',
          email: 'marie.lefebvre@example.com',
          licenseCategory: 'B manuelle',
          remainingHours: 5,
          progress: 90
        },
        { 
          id_eleve: 5, 
          nom: 'Bernard', 
          prenom: 'Thomas', 
          tel: '0612378945',
          email: 'thomas.bernard@example.com',
          licenseCategory: 'C',
          remainingHours: 12,
          progress: 45
        }
      ];
      
      setStudents(mockStudents);
    };
    
    fetchStudents();
  }, []);
  
  // Mettre à jour l'élève sélectionné lorsque l'ID change
  useEffect(() => {
    if (selectedStudentId) {
      const student = students.find(s => s.id_eleve === selectedStudentId);
      setSelectedStudent(student || null);
      
      // Mettre à jour la catégorie de permis si l'élève en a une
      if (student?.licenseCategory && !licenseCategory) {
        onLicenseCategoryChange(student.licenseCategory);
      }
    } else {
      setSelectedStudent(null);
    }
  }, [selectedStudentId, students, licenseCategory, onLicenseCategoryChange]);
  
  // Filtrer les élèves en fonction du terme de recherche
  const filteredStudents = students.filter(student => {
    const fullName = `${student.prenom} ${student.nom}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  
  // Gérer le changement d'élève
  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = parseInt(e.target.value);
    onStudentChange(studentId);
  };
  
  // Gérer le changement de catégorie de permis
  const handleLicenseCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLicenseCategoryChange(e.target.value as LicenseCategory);
  };
  
  return (
    <div className="mb-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Élève
        </label>
        <div className="relative">
          <select
            value={selectedStudentId || ''}
            onChange={handleStudentChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 appearance-none"
            required
          >
            <option value="">Sélectionner un élève</option>
            {filteredStudents.map((student) => (
              <option key={student.id_eleve} value={student.id_eleve}>
                {student.prenom} {student.nom}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      {selectedStudent && (
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{selectedStudent.prenom} {selectedStudent.nom}</h3>
              <p className="text-sm text-gray-500">{selectedStudent.email}</p>
              <p className="text-sm text-gray-500">{selectedStudent.tel}</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {selectedStudent.licenseCategory}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-xs text-gray-500">Heures restantes</p>
              <p className="font-medium">{selectedStudent.remainingHours} h</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Progression</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${selectedStudent.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catégorie de permis
        </label>
        <select
          value={licenseCategory}
          onChange={handleLicenseCategoryChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Sélectionner une catégorie</option>
          <option value="A">A - Moto</option>
          <option value="A1">A1 - Moto légère</option>
          <option value="A2">A2 - Moto intermédiaire</option>
          <option value="B">B - Voiture</option>
          <option value="B auto">B auto - Voiture automatique</option>
          <option value="B manuelle">B manuelle - Voiture manuelle</option>
          <option value="C">C - Poids lourd</option>
          <option value="C1">C1 - Poids lourd léger</option>
          <option value="CE">CE - Poids lourd avec remorque</option>
          <option value="D">D - Bus</option>
          <option value="D1">D1 - Minibus</option>
          <option value="DE">DE - Bus avec remorque</option>
        </select>
      </div>
    </div>
  );
}
