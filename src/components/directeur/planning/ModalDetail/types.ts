// Types partagés pour les composants du modal de détails de leçon
import { Lecon } from '../PlanningGrid';

// Type d'action pour la mise à jour d'une leçon
export type UpdateAction = 'cancel' | 'complete' | 'edit';

// Type d'onglet dans le modal de détails
export type DetailTab = 'details' | 'comments' | 'history';

// Motifs d'annulation de leçon
export type CancelReason = 'Absence élève' | 'Absence moniteur' | 'Problème véhicule' | 'Météo' | 'Autre' | '';

// Interface pour les props du modal de détails
export interface LeconDetailsModalProps {
  lecon: Lecon;
  onClose: () => void;
  onUpdate?: (lecon: Lecon, action: UpdateAction) => Promise<void>;
  showModal: boolean;
}

// Props pour le sélecteur d'onglets
export interface TabSelectorProps {
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
}

// Props pour le composant de détails
export interface DetailsViewProps {
  lecon: Lecon;
}

// Props pour le composant de commentaires
export interface CommentsEditorProps {
  commentaire: string;
  onChange: (commentaire: string) => void;
  onSave: () => Promise<void>;
  isLoading: boolean;
}

// Props pour le composant d'annulation
export interface CancelConfirmProps {
  onCancel: () => Promise<void>;
  onBack: () => void;
  cancelReason: CancelReason;
  onCancelReasonChange: (reason: CancelReason) => void;
  isLoading: boolean;
}

// Props pour le composant de confirmation de réalisation
export interface CompleteConfirmProps {
  onComplete: () => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

// Props pour les boutons d'action
export interface ActionButtonsProps {
  canCancel: boolean;
  canComplete: boolean;
  onCancelClick: () => void;
  onCompleteClick: () => void;
  onClose: () => void;
  isLoading: boolean;
}
