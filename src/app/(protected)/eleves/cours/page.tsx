'use client';

import { useState, useEffect } from 'react';
import { FiBook, FiVideo, FiFileText, FiCheckCircle, FiClock, FiSearch, FiFilter, FiBarChart2 } from 'react-icons/fi';
import EleveLayout from '@/components/layout/EleveLayout';

// Types pour les cours
type CourseType = 'theory' | 'practice' | 'exam';
type CourseStatus = 'not_started' | 'in_progress' | 'completed';

interface Course {
  id: string;
  title: string;
  description: string;
  type: CourseType;
  status: CourseStatus;
  progress: number;
  duration: number; // en minutes
  thumbnail: string;
  tags: string[];
}

export default function EleveCours() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<CourseType | 'all'>('all');
  const [courses, setCourses] = useState<Course[]>([]);

  // Récupérer les données utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('autosoft_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }

    // Simuler le chargement des cours depuis une API
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Les règles de priorité',
        description: 'Apprenez toutes les règles de priorité aux intersections, ronds-points et situations spéciales.',
        type: 'theory',
        status: 'completed',
        progress: 100,
        duration: 45,
        thumbnail: 'priority.jpg',
        tags: ['code', 'priorité', 'intersections']
      },
      {
        id: '2',
        title: 'Manœuvres de stationnement',
        description: 'Techniques pour réaliser parfaitement les différentes manœuvres de stationnement.',
        type: 'practice',
        status: 'in_progress',
        progress: 60,
        duration: 30,
        thumbnail: 'parking.jpg',
        tags: ['pratique', 'stationnement', 'manœuvres']
      },
      {
        id: '3',
        title: 'Signalisation routière',
        description: 'Tous les panneaux et marquages au sol à connaître pour l\'examen.',
        type: 'theory',
        status: 'in_progress',
        progress: 75,
        duration: 60,
        thumbnail: 'signs.jpg',
        tags: ['code', 'panneaux', 'signalisation']
      },
      {
        id: '4',
        title: 'Examen blanc du code',
        description: 'Test complet de 40 questions dans les conditions de l\'examen.',
        type: 'exam',
        status: 'not_started',
        progress: 0,
        duration: 40,
        thumbnail: 'exam.jpg',
        tags: ['examen', 'test', 'évaluation']
      },
      {
        id: '5',
        title: 'Conduite sur autoroute',
        description: 'Règles spécifiques et techniques de conduite sur voies rapides.',
        type: 'theory',
        status: 'not_started',
        progress: 0,
        duration: 35,
        thumbnail: 'highway.jpg',
        tags: ['code', 'autoroute', 'vitesse']
      },
      {
        id: '6',
        title: 'Éco-conduite',
        description: 'Apprenez à conduire de manière économique et écologique.',
        type: 'practice',
        status: 'not_started',
        progress: 0,
        duration: 25,
        thumbnail: 'eco.jpg',
        tags: ['pratique', 'économie', 'environnement']
      },
    ];

    setCourses(mockCourses);
    setLoading(false);
  }, []);

  // Filtrer les cours en fonction de la recherche et du type
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || course.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Calculer la progression globale
  const overallProgress = courses.length > 0 
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length) 
    : 0;

  // Obtenir une couleur en fonction du statut
  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'not_started': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  // Obtenir une icône en fonction du type de cours
  const getCourseIcon = (type: CourseType) => {
    switch (type) {
      case 'theory': return <FiBook className="w-5 h-5" />;
      case 'practice': return <FiVideo className="w-5 h-5" />;
      case 'exam': return <FiFileText className="w-5 h-5" />;
      default: return <FiBook className="w-5 h-5" />;
    }
  };

  // Obtenir un label en fonction du type de cours
  const getCourseTypeLabel = (type: CourseType) => {
    switch (type) {
      case 'theory': return 'Théorie';
      case 'practice': return 'Pratique';
      case 'exam': return 'Examen';
      default: return 'Cours';
    }
  };

  if (loading) {
    return (
      <EleveLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </EleveLayout>
    );
  }

  return (
    <EleveLayout>
      <div className="p-4 sm:p-6 pb-20 text-gray-800">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes cours</h1>
          <p className="text-gray-600">Accédez à vos cours théoriques et pratiques</p>
        </div>

        {/* Carte de progression */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <FiBarChart2 className="mr-2 text-blue-600" /> Progression globale
            </h2>
            <span className="text-lg font-bold text-blue-600">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un cours..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as CourseType | 'all')}
            >
              <option value="all">Tous les types</option>
              <option value="theory">Théorie</option>
              <option value="practice">Pratique</option>
              <option value="exam">Examens</option>
            </select>
          </div>
        </div>

        {/* Liste des cours */}
        <div className="space-y-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className={`rounded-full p-3 mr-4 ${course.type === 'theory' ? 'bg-blue-100 text-blue-600' : course.type === 'practice' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                      {getCourseIcon(course.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${course.type === 'theory' ? 'bg-blue-100 text-blue-800' : course.type === 'practice' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                          {getCourseTypeLabel(course.type)}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiClock className="mr-1" />
                          <span>{course.duration} min</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 mt-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                      
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            {course.status === 'completed' ? (
                              <FiCheckCircle className="text-green-500 mr-1" />
                            ) : null}
                            <span className="text-sm font-medium">
                              {course.status === 'completed' 
                                ? 'Terminé' 
                                : course.status === 'in_progress' 
                                  ? `Progression: ${course.progress}%` 
                                  : 'Non commencé'}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`${getStatusColor(course.status)} h-1.5 rounded-full`} 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          course.status === 'completed' 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}>
                          {course.status === 'completed' 
                            ? 'Revoir' 
                            : course.status === 'in_progress' 
                              ? 'Continuer' 
                              : 'Commencer'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-gray-400 flex justify-center mb-3">
                <FiBook className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun cours trouvé</h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche ou consultez tous les cours disponibles.
              </p>
            </div>
          )}
        </div>
      </div>
    </EleveLayout>
  );
}
