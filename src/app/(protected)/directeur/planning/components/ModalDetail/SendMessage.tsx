'use client';

import React, { useState } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';

interface SendMessageProps {
  phoneNumber: string;
  label?: string;
  className?: string;
  leconDetails?: {
    date?: string;
    heure?: string;
    moniteur?: string;
    type?: string;
  };
}

// Liste des templates de messages prédéfinis
const MESSAGE_TEMPLATES = [
  {
    id: 'changement-moniteur',
    title: 'Changement de moniteur',
    text: 'Bonjour, nous vous informons que votre leçon a subi un changement de moniteur. Votre nouveau moniteur sera [NOM_MONITEUR]. Merci de votre compréhension.'
  },
  {
    id: 'annulation',
    title: 'Annulation de leçon',
    text: 'Bonjour, nous sommes dans le regret de vous informer que votre leçon du [DATE] à [HEURE] a été annulée. Veuillez nous contacter pour la reprogrammer.'
  },
  {
    id: 'rappel-paiement',
    title: 'Rappel de paiement',
    text: 'Bonjour, nous vous rappelons que vous avez un paiement en attente pour le trimestre. Merci de régulariser votre situation dès que possible.'
  },
  {
    id: 'changement-horaire',
    title: 'Changement d\'horaire',
    text: 'Bonjour, nous vous informons que l\'horaire de votre leçon du [DATE] a été modifié. Votre leçon aura lieu à [HEURE]. Merci de votre compréhension.'
  },
  {
    id: 'changement-vehicule',
    title: 'Changement de véhicule',
    text: 'Bonjour, nous vous informons que le véhicule pour votre leçon du [DATE] a été changé. Merci de votre compréhension.'
  }
];

/**
 * Composant pour envoyer un message SMS avec des templates prédéfinis
 * 
 * @param phoneNumber - Le numéro de téléphone du destinataire
 * @param label - Le texte à afficher sur le bouton (par défaut: "Envoyer un message")
 * @param className - Classes CSS supplémentaires pour personnaliser le bouton
 * @param leconDetails - Détails de la leçon pour personnaliser les templates
 */
export default function SendMessage({ 
  phoneNumber, 
  label = "Envoyer un message", 
  className = "",
  leconDetails
}: SendMessageProps) {
  // États pour gérer la modale et le message
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [finalMessage, setFinalMessage] = useState<string>("");
  
  // Classe CSS par défaut pour le bouton
  const defaultClassName = "flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors";
  
  // Combinaison des classes par défaut et personnalisées
  const buttonClassName = className ? `${defaultClassName} ${className}` : defaultClassName;

  // Fonction pour ouvrir la modale
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Fonction pour fermer la modale
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemplate("");
    setCustomMessage("");
    setFinalMessage("");
  };

  // Fonction pour sélectionner un template
  const handleSelectTemplate = (templateId: string) => {
    const template = MESSAGE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      let messageText = template.text;
      
      // Remplacer les placeholders par les valeurs réelles si disponibles
      if (leconDetails) {
        if (leconDetails.date) messageText = messageText.replace('[DATE]', leconDetails.date);
        if (leconDetails.heure) messageText = messageText.replace('[HEURE]', leconDetails.heure);
        if (leconDetails.moniteur) messageText = messageText.replace('[NOM_MONITEUR]', leconDetails.moniteur);
      }
      
      setSelectedTemplate(templateId);
      setFinalMessage(messageText);
    }
  };

  // Fonction pour mettre à jour le message personnalisé
  const handleCustomMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomMessage(e.target.value);
    setFinalMessage(e.target.value);
  };

  // Fonction pour envoyer le message
  const handleSendMessage = async () => {
    if (!finalMessage.trim()) {
      alert("Veuillez sélectionner un template ou écrire un message personnalisé.");
      return;
    }

    try {
      // Ici, vous pourriez implémenter l'envoi réel du SMS via une API
      // Pour l'instant, nous simulons juste l'envoi
      console.log(`Envoi du message au ${phoneNumber}: ${finalMessage}`);
      
      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Message envoyé avec succès!");
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
    }
  };

  return (
    <>
      {/* Bouton pour ouvrir la modale */}
      <button 
        onClick={handleOpenModal}
        className={buttonClassName}
        title={`Envoyer un message à ${phoneNumber}`}
      >
        <FiMessageSquare className="mr-1" /> {label}
      </button>

      {/* Modale pour composer et envoyer le message */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-0 max-w-2xl w-full border border-gray-200 max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            {/* En-tête de la modale */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-semibold">Envoyer un message</h3>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                onClick={handleCloseModal}
                aria-label="Fermer"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Corps de la modale */}
            <div className="overflow-y-auto p-4 flex-grow">
              {/* Section des templates */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Messages prédéfinis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {MESSAGE_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template.id)}
                      className={`p-3 border rounded-md text-left hover:bg-gray-50 transition-colors ${selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="font-medium">{template.title}</div>
                      <div className="text-xs text-gray-500 truncate">{template.text}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section du message personnalisé */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Message personnalisé</h4>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={customMessage || (selectedTemplate ? finalMessage : '')}
                  onChange={handleCustomMessageChange}
                  placeholder="Écrivez votre message personnalisé ici..."
                />
              </div>

              {/* Aperçu du message final */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Aperçu du message</h4>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[100px] whitespace-pre-line">
                  {finalMessage || <span className="text-gray-400 italic">Aucun message sélectionné</span>}
                </div>
              </div>

              {/* Informations sur le destinataire */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Destinataire</h4>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="text-sm">
                    <span className="text-gray-500">Numéro: </span>
                    <span className="font-medium">{phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pied de la modale avec boutons d'action */}
            <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors mr-2"
              >
                Annuler
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                disabled={!finalMessage.trim()}
              >
                <FiSend className="mr-2" /> Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
