'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiUser, FiMapPin, FiStar, FiMessageCircle, FiChevronDown, FiChevronUp, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import EleveLayout from '@/components/layout/EleveLayout';

// Types pour les leçons
type LessonStatus = 'completed' | 'upcoming' | 'cancelled';
type FeelingType = 'très_bien' | 'bien' | 'moyen' | 'difficile' | 'très_difficile';

interface Lesson {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // en minutes
  type: string;
  moniteur: {
    id: string;
    nom: string;
    prenom: string;
    photo?: string;
  };
  lieu: string;
  status: LessonStatus;
  vehicule?: string;
  competences?: string[];
  feedback?: {
    stressLevel?: number;
    feeling?: FeelingType;
    selectedTags?: string[];
  };
}

export default function EleveLecons() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'upcoming'>('all');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<{
    lessonId: string;
    stressLevel: number;
    feeling: FeelingType | null;
    selectedTags: string[];
  }>({
    lessonId: '',
    stressLevel: 5,
    feeling: null,
    selectedTags: []
  });

  // Tags prédéfinis pour les commentaires
  const feedbackTags = {
    positifs: [
      'Bonne maîtrise', 'Progrès visible', 'À l\'aise', 'Bonne anticipation',
      'Respect du code', 'Attentif', 'Bonne concentration', 'Calme'
    ],
    negatifs: [
      'Manque d\'attention', 'Difficultés au volant', 'Stress important',
      'Problème de placement', 'Vitesse inadaptée', 'Hésitations', 'Manque de confiance'
    ]
  };

  // Récupérer les données utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('autosoft_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }

    // Simuler le chargement des leçons depuis une API
    const mockLessons: Lesson[] = [
      {
        id: '1',
        date: '2025-09-30',
        startTime: '14:00',
        endTime: '15:30',
        duration: 90,
        type: 'Conduite en ville',
        moniteur: {
          id: 'm1',
          nom: 'Dupont',
          prenom: 'Jean',
        },
        lieu: 'Auto-école Centre',
        status: 'completed',
        vehicule: 'Renault Clio',
        competences: ['Démarrage en côte', 'Créneau', 'Priorités à droite'],
        feedback: {
          stressLevel: 7,
          feeling: 'moyen',
          selectedTags: ['Stress important', 'Progrès visible', 'Hésitations']
        }
      },
      {
        id: '2',
        date: '2025-10-02',
        startTime: '10:00',
        endTime: '11:30',
        duration: 90,
        type: 'Manœuvres',
        moniteur: {
          id: 'm2',
          nom: 'Martin',
          prenom: 'Sophie',
        },
        lieu: 'Parking du centre commercial',
        status: 'completed',
        vehicule: 'Renault Clio',
        competences: ['Créneau', 'Stationnement en bataille', 'Demi-tour'],
        feedback: {
          stressLevel: 4,
          feeling: 'bien',
          selectedTags: ['À l\'aise', 'Bonne maîtrise', 'Calme']
        }
      },
      {
        id: '3',
        date: '2025-10-07',
        startTime: '16:00',
        endTime: '17:30',
        duration: 90,
        type: 'Conduite sur voie rapide',
        moniteur: {
          id: 'm1',
          nom: 'Dupont',
          prenom: 'Jean',
        },
        lieu: 'Auto-école Centre',
        status: 'upcoming',
        vehicule: 'Peugeot 208',
        competences: ['Insertion', 'Dépassement', 'Sortie']
      },
      {
        id: '4',
        date: '2025-10-10',
        startTime: '09:00',
        endTime: '10:30',
        duration: 90,
        type: 'Conduite en ville',
        moniteur: {
          id: 'm2',
          nom: 'Martin',
          prenom: 'Sophie',
        },
        lieu: 'Auto-école Centre',
        status: 'upcoming',
        vehicule: 'Renault Clio'
      },
      {
        id: '5',
        date: '2025-09-25',
        startTime: '11:00',
        endTime: '12:30',
        duration: 90,
        type: 'Conduite en ville',
        moniteur: {
          id: 'm1',
          nom: 'Dupont',
          prenom: 'Jean',
        },
        lieu: 'Auto-école Centre',
        status: 'completed',
        vehicule: 'Peugeot 208',
        competences: ['Rond-point', 'Feux de circulation', 'Changement de voie']
      }
    ];

    // Trier les leçons par date (les plus récentes d'abord)
    mockLessons.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setLessons(mockLessons);
    setLoading(false);
  }, []);

  // Filtrer les leçons en fonction de l'onglet actif
  const filteredLessons = lessons.filter(lesson => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return lesson.status === 'completed';
    if (activeTab === 'upcoming') return lesson.status === 'upcoming';
    return true;
  });

  // Formater la date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Gérer la soumission du feedback
  const handleSubmitFeedback = () => {
    // Dans une application réelle, on enverrait ces données à l'API
    console.log('Feedback soumis:', currentFeedback);
    
    // Mettre à jour la leçon avec le feedback
    const updatedLessons = lessons.map(lesson => {
      if (lesson.id === currentFeedback.lessonId) {
        return {
          ...lesson,
          feedback: {
            stressLevel: currentFeedback.stressLevel,
            feeling: currentFeedback.feeling,
            selectedTags: currentFeedback.selectedTags
          }
        };
      }
      return lesson;
    });
    
    setLessons(updatedLessons);
    setShowFeedbackModal(false);
  };

  // Ouvrir le modal de feedback pour une leçon spécifique
  const openFeedbackModal = (lesson: Lesson) => {
    setCurrentFeedback({
      lessonId: lesson.id,
      stressLevel: lesson.feedback?.stressLevel || 5,
      feeling: lesson.feedback?.feeling || null,
      selectedTags: lesson.feedback?.selectedTags || []
    });
    setShowFeedbackModal(true);
  };

  // Gérer la sélection/déselection des tags
  const toggleTag = (tag: string) => {
    if (currentFeedback.selectedTags.includes(tag)) {
      setCurrentFeedback({
        ...currentFeedback,
        selectedTags: currentFeedback.selectedTags.filter(t => t !== tag)
      });
    } else {
      // Limiter à 5 tags maximum
      if (currentFeedback.selectedTags.length < 5) {
        setCurrentFeedback({
          ...currentFeedback,
          selectedTags: [...currentFeedback.selectedTags, tag]
        });
      }
    }
  };

  // Obtenir la couleur en fonction du statut
  const getStatusColor = (status: LessonStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir le texte du statut
  const getStatusText = (status: LessonStatus) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'upcoming': return 'À venir';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnu';
    }
  };

  // Obtenir la couleur en fonction du niveau de stress
  const getStressLevelColor = (level: number) => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Obtenir la couleur en fonction du ressenti
  const getFeelingColor = (feeling: FeelingType | null) => {
    switch (feeling) {
      case 'très_bien': return 'bg-green-500 text-white';
      case 'bien': return 'bg-green-400 text-white';
      case 'moyen': return 'bg-yellow-400 text-white';
      case 'difficile': return 'bg-orange-400 text-white';
      case 'très_difficile': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  // Obtenir le texte du ressenti
  const getFeelingText = (feeling: FeelingType | null) => {
    switch (feeling) {
      case 'très_bien': return 'Très bien passé';
      case 'bien': return 'Bien passé';
      case 'moyen': return 'Moyennement passé';
      case 'difficile': return 'Difficile';
      case 'très_difficile': return 'Très difficile';
      default: return 'Non évalué';
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes leçons</h1>
          <p className="text-gray-600">Historique et planification de vos leçons de conduite</p>
        </div>

        {/* Onglets de filtrage */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            Toutes
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            À venir
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('completed')}
          >
            Terminées
          </button>
        </div>

        {/* Liste des leçons */}
        <div className="space-y-4">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(lesson.status)}`}>
                          {getStatusText(lesson.status)}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiClock className="mr-1" />
                          <span>{lesson.duration} min</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900">{lesson.type}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <FiCalendar className="mr-1" />
                        <span>{formatDate(lesson.date)} • {lesson.startTime} - {lesson.endTime}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <FiUser className="mr-1" />
                        <span>Moniteur: {lesson.moniteur.prenom} {lesson.moniteur.nom}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <FiMapPin className="mr-1" />
                        <span>{lesson.lieu}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {selectedLesson === lesson.id ? (
                        <FiChevronUp className="text-gray-400" />
                      ) : (
                        <FiChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Détails de la leçon */}
                {selectedLesson === lesson.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    {lesson.vehicule && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">Véhicule</p>
                        <p className="text-sm text-gray-600">{lesson.vehicule}</p>
                      </div>
                    )}

                    {lesson.competences && lesson.competences.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">Compétences travaillées</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {lesson.competences.map((competence, index) => (
                            <span 
                              key={index} 
                              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                            >
                              {competence}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {lesson.status === 'completed' && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium text-gray-700">Votre ressenti</p>
                          <button 
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={() => openFeedbackModal(lesson)}
                          >
                            {lesson.feedback ? 'Modifier' : 'Ajouter'}
                          </button>
                        </div>

                        {lesson.feedback ? (
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Niveau de stress</p>
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                                  <div 
                                    className={`${getStressLevelColor(lesson.feedback.stressLevel)} h-1.5 rounded-full`}
                                    style={{ width: `${(lesson.feedback.stressLevel / 10) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium">{lesson.feedback.stressLevel}/10</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 mb-1">Ressenti global</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${getFeelingColor(lesson.feedback.feeling)}`}>
                                {getFeelingText(lesson.feedback.feeling)}
                              </span>
                            </div>

                            {lesson.feedback.selectedTags && lesson.feedback.selectedTags.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Points notables</p>
                                <div className="flex flex-wrap gap-2">
                                  {lesson.feedback.selectedTags.map((tag, index) => (
                                    <span 
                                      key={index} 
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        feedbackTags.positifs.includes(tag) 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-orange-100 text-orange-800'
                                      }`}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Vous n'avez pas encore donné votre ressenti sur cette leçon.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-gray-400 flex justify-center mb-3">
                <FiCalendar className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune leçon trouvée</h3>
              <p className="text-gray-600">
                Vous n'avez pas encore de leçons {activeTab === 'completed' ? 'terminées' : activeTab === 'upcoming' ? 'à venir' : ''}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de feedback */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Votre ressenti sur la leçon</h3>
              
              {/* Niveau de stress */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau de stress (1-10)
                </label>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Détendu</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentFeedback.stressLevel}
                    onChange={(e) => setCurrentFeedback({
                      ...currentFeedback,
                      stressLevel: parseInt(e.target.value)
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 ml-2">Très stressé</span>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm font-medium">{currentFeedback.stressLevel}/10</span>
                </div>
              </div>
              
              {/* Ressenti global */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment s'est passée votre leçon ?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(['très_bien', 'bien', 'moyen', 'difficile', 'très_difficile'] as FeelingType[]).map((feeling) => (
                    <button
                      key={feeling}
                      className={`p-2 rounded-lg text-center text-xs ${
                        currentFeedback.feeling === feeling 
                          ? getFeelingColor(feeling)
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setCurrentFeedback({
                        ...currentFeedback,
                        feeling
                      })}
                    >
                      {getFeelingText(feeling)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tags positifs */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points positifs (max 5 au total)
                </label>
                <div className="flex flex-wrap gap-2">
                  {feedbackTags.positifs.map((tag) => (
                    <button
                      key={tag}
                      className={`text-xs px-3 py-1.5 rounded-full ${
                        currentFeedback.selectedTags.includes(tag)
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                      onClick={() => toggleTag(tag)}
                      disabled={!currentFeedback.selectedTags.includes(tag) && currentFeedback.selectedTags.length >= 5}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tags négatifs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points à améliorer (max 5 au total)
                </label>
                <div className="flex flex-wrap gap-2">
                  {feedbackTags.negatifs.map((tag) => (
                    <button
                      key={tag}
                      className={`text-xs px-3 py-1.5 rounded-full ${
                        currentFeedback.selectedTags.includes(tag)
                          ? 'bg-orange-500 text-white'
                          : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                      }`}
                      onClick={() => toggleTag(tag)}
                      disabled={!currentFeedback.selectedTags.includes(tag) && currentFeedback.selectedTags.length >= 5}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  onClick={handleSubmitFeedback}
                  disabled={!currentFeedback.feeling}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </EleveLayout>
  );
}
