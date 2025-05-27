'use client';

import React from 'react';
import { ActionButtonsProps } from './types';

export default function ActionButtons({ 
  canCancel, 
  canComplete, 
  onCancelClick, 
  onCompleteClick, 
  onClose,
  isLoading
}: ActionButtonsProps) {
  return (
    <div className="mt-6 flex justify-between">
      <div className="space-x-2">
        {canCancel && (
          <button
            className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors font-medium"
            onClick={onCancelClick}
            disabled={isLoading}
          >
            Annuler la leçon
          </button>
        )}
        {canComplete && (
          <button
            className="px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors font-medium"
            onClick={onCompleteClick}
            disabled={isLoading}
          >
            Marquer comme réalisée
          </button>
        )}
      </div>
      <button
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
        onClick={onClose}
        disabled={isLoading}
      >
        Fermer
      </button>
    </div>
  );
}
