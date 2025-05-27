'use client';

import React from 'react';
import { CancelConfirmProps, CancelReason } from './types';

export default function CancelConfirm({ 
  onCancel, 
  onBack, 
  cancelReason, 
  onCancelReasonChange, 
  isLoading 
}: CancelConfirmProps) {
  const reasons: CancelReason[] = [
    'Absence élève',
    'Absence moniteur',
    'Problème véhicule',
    'Météo',
    'Autre'
  ];

  return (
    <div className="space-y-4">
      <p className="text-gray-700">Voulez-vous vraiment annuler cette leçon ?</p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Motif d'annulation
        </label>
        <select
          value={cancelReason}
          onChange={(e) => onCancelReasonChange(e.target.value as CancelReason)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sélectionner un motif</option>
          {reasons.map(reason => (
            <option key={reason} value={reason}>{reason}</option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
          onClick={onBack}
          disabled={isLoading}
        >
          Retour
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium flex items-center"
          onClick={onCancel}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Annulation...
            </>
          ) : 'Confirmer l\'annulation'}
        </button>
      </div>
    </div>
  );
}
