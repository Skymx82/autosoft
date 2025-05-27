// Types partagés pour les composants de la modale
import { SelectionCell } from '../selection/Selecteur';

// Type d'événement dans le planning
export type EventType = 'lesson' | 'unavailability' | 'exam';

// Catégories de permis
export type LicenseCategory = 'A' | 'A1' | 'A2' | 'B' | 'B auto' | 'B manuelle' | 'C' | 'C1' | 'CE' | 'D' | 'D1' | 'DE';

// Interface pour le véhicule
export interface Vehicle {
  id: number;
  name: string;
  type: string;
  licenseCategories: LicenseCategory[];
  isAvailable: boolean;
}

// Interface pour l'élève
export interface Student {
  id_eleve: number;
  nom: string;
  prenom: string;
  tel?: string;
  email?: string;
  licenseCategory?: LicenseCategory;
  remainingHours?: number;
  progress?: number; // Pourcentage de progression
}

// Interface pour le moniteur
export interface Instructor {
  id_moniteur: number;
  nom: string;
  prenom: string;
  specialties?: LicenseCategory[];
  vehicles?: number[]; // IDs des véhicules qu'il peut utiliser
}

// Interface pour un créneau horaire personnalisé
export interface CustomTimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

// Interface pour les options de récurrence
export interface RecurrencePattern {
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  endDate: string;
  daysOfWeek?: number[]; // 0 = dimanche, 1 = lundi, etc.
  customTimeSlots?: CustomTimeSlot[]; // Créneaux horaires personnalisés
}

// Interface pour l'état du formulaire
export interface FormState {
  type: EventType;
  date: string;
  startTime: string;
  endTime: string;
  studentId: number | null;
  instructorId: number;
  lessonType: string;
  licenseCategory: LicenseCategory | '';
  vehicleId: number | null;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  comments: string;
  // Propriétés pour la gestion des enregistrements multiples
  isMultipleSubmit?: boolean; // Indique s'il s'agit d'un enregistrement multiple
  isLastRecurringSlot?: boolean; // Indique s'il s'agit du dernier créneau d'un enregistrement multiple
}

// Props pour le composant ModalSelect
export interface ModalSelectProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (formData: FormState) => Promise<void>;
  selectionStart?: SelectionCell | null;
  selectionEnd?: SelectionCell | null;
  moniteurId?: number;
  moniteurNom?: string;
  moniteurPrenom?: string;
  date?: string;
  heureDebut: string;
  heureFin: string;
}

// Props pour TabSelector
export interface TabSelectorProps {
  activeTab: EventType;
  onTabChange: (tab: EventType) => void;
}

// Props pour TimeRangeSelector
export interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  date: string;
}

// Props pour StudentSelector
export interface StudentSelectorProps {
  selectedStudentId: number | null;
  onStudentChange: (studentId: number) => void;
  licenseCategory: LicenseCategory | '';
  onLicenseCategoryChange: (category: LicenseCategory) => void;
}

// Props pour VehicleSelector
export interface VehicleSelectorProps {
  selectedVehicleId: number | null;
  onVehicleChange: (vehicleId: number) => void;
  licenseCategory: LicenseCategory | '';
  instructorId: number;
}

// Props pour RecurrenceOptions
export interface RecurrenceOptionsProps {
  isRecurring: boolean;
  onIsRecurringChange: (isRecurring: boolean) => void;
  recurrencePattern: RecurrencePattern | undefined;
  onRecurrencePatternChange: (pattern: RecurrencePattern) => void;
  startDate: string;
}
