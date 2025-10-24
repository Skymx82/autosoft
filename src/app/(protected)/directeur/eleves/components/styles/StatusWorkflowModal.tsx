'use client';

import { FiX, FiArrowRight, FiCheckCircle, FiFileText, FiAlertTriangle, FiClock, FiEdit, FiArchive } from 'react-icons/fi';

interface StatusWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatusWorkflowModal({ isOpen, onClose }: StatusWorkflowModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Workflow des statuts élèves</h2>
            <p className="text-sm text-gray-600 mt-1">Comprendre les différents statuts et leurs transitions</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Workflow visuel */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              Cycle de vie d'un dossier élève
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Brouillon */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full p-4 shadow-md border-2 border-gray-300">
                  <FiEdit className="w-8 h-8 text-gray-600" />
                </div>
                <span className="mt-2 font-semibold text-gray-900">Brouillon</span>
                <span className="text-xs text-gray-600">Création</span>
              </div>

              <FiArrowRight className="hidden md:block w-6 h-6 text-gray-400" />
              <div className="md:hidden">↓</div>

              {/* En attente */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full p-4 shadow-md border-2 border-yellow-300">
                  <FiClock className="w-8 h-8 text-yellow-600" />
                </div>
                <span className="mt-2 font-semibold text-gray-900">En attente</span>
                <span className="text-xs text-gray-600">Vérification</span>
              </div>

              <FiArrowRight className="hidden md:block w-6 h-6 text-gray-400" />
              <div className="md:hidden">↓</div>

              {/* Complet/Incomplet */}
              <div className="flex flex-col items-center text-center">
                <div className="flex gap-2">
                  <div className="bg-white rounded-full p-4 shadow-md border-2 border-blue-300">
                    <FiFileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="bg-white rounded-full p-4 shadow-md border-2 border-orange-300">
                    <FiAlertTriangle className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
                <span className="mt-2 font-semibold text-gray-900">Complet / Incomplet</span>
                <span className="text-xs text-gray-600">Validation</span>
              </div>

              <FiArrowRight className="hidden md:block w-6 h-6 text-gray-400" />
              <div className="md:hidden">↓</div>

              {/* Actif */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full p-4 shadow-md border-2 border-green-300">
                  <FiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <span className="mt-2 font-semibold text-gray-900">Actif</span>
                <span className="text-xs text-gray-600">Utilisable</span>
              </div>

              <FiArrowRight className="hidden md:block w-6 h-6 text-gray-400" />
              <div className="md:hidden">↓</div>

              {/* Archivé */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full p-4 shadow-md border-2 border-gray-400">
                  <FiArchive className="w-8 h-8 text-gray-600" />
                </div>
                <span className="mt-2 font-semibold text-gray-900">Archivé</span>
                <span className="text-xs text-gray-600">Terminé</span>
              </div>
            </div>
          </div>

          {/* Détails des statuts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Détails des statuts</h3>

            {/* Brouillon */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="bg-gray-200 rounded-full p-2">
                  <FiEdit className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    📝 Brouillon
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Le dossier est en cours de création. Les informations peuvent être incomplètes.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>Actions possibles :</strong> Modifier, Finaliser → En attente, Archiver
                  </div>
                </div>
              </div>
            </div>

            {/* En attente */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-200 rounded-full p-2">
                  <FiClock className="w-5 h-5 text-yellow-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    ⏳ En attente
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Le dossier a été finalisé et attend une vérification par un administrateur.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>Actions possibles :</strong> Vérifier → Complet/Incomplet, Retour → Brouillon, Archiver
                  </div>
                </div>
              </div>
            </div>

            {/* Complet */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="bg-blue-200 rounded-full p-2">
                  <FiFileText className="w-5 h-5 text-blue-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    📋 Complet
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Tous les documents sont présents mais le dossier n'est pas encore activé. L'élève ne peut pas être utilisé dans le planning.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>Actions possibles :</strong> Activer → Actif, Retour → Incomplet, Archiver
                  </div>
                </div>
              </div>
            </div>

            {/* Incomplet */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="bg-orange-200 rounded-full p-2">
                  <FiAlertTriangle className="w-5 h-5 text-orange-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    ⚠️ Incomplet
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Des documents ou informations sont manquants. L'élève ne peut pas être utilisé dans le planning.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>Actions possibles :</strong> Compléter → En attente, Archiver
                  </div>
                </div>
              </div>
            </div>

            {/* Actif */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="bg-green-200 rounded-full p-2">
                  <FiCheckCircle className="w-5 h-5 text-green-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    ✅ Actif
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Le dossier est complet et validé. L'élève peut être utilisé dans le planning pour créer des leçons de conduite.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>Actions possibles :</strong> Archiver (fin de formation)
                  </div>
                </div>
              </div>
            </div>

            {/* Archivé */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
              <div className="flex items-start gap-3">
                <div className="bg-gray-300 rounded-full p-2">
                  <FiArchive className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    🗄️ Archivé
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    L'élève n'est plus actif (formation terminée, abandon, etc.). Le dossier est conservé pour l'historique mais n'est plus utilisable.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>Actions possibles :</strong> Aucune (statut final)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comment changer le statut */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-purple-900 flex items-center gap-2 mb-2">
              🖱️ Comment changer le statut d'un élève ?
            </h4>
            <div className="text-sm text-purple-800 space-y-2">
              <p className="font-medium">C'est très simple :</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Cliquez directement sur le badge de statut</strong> dans le tableau</li>
                <li>Une fenêtre s'ouvre avec les statuts disponibles</li>
                <li>Sélectionnez le nouveau statut souhaité</li>
                <li>Confirmez votre choix</li>
              </ol>
              <div className="mt-3 p-3 bg-white rounded border border-purple-200">
                <p className="text-xs text-purple-700">
                  <strong>💡 Astuce :</strong> Survolez le badge de statut pour voir apparaître une icône de crayon et un message "Cliquez pour modifier le statut". Le badge s'agrandit légèrement au survol pour indiquer qu'il est cliquable.
                </p>
              </div>
            </div>
          </div>

          {/* Conseils */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
              💡 Conseils d'utilisation
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Créez toujours un élève en <strong>Brouillon</strong> pour commencer</li>
              <li>Passez en <strong>En attente</strong> une fois toutes les informations renseignées</li>
              <li>Vérifiez les documents avant de passer en <strong>Complet</strong></li>
              <li>Activez le dossier uniquement quand tout est validé</li>
              <li>Archivez les élèves qui ont terminé leur formation</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
