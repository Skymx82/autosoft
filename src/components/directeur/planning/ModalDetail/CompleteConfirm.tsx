'use client';

import React from 'react';
import { CompleteConfirmProps } from './types';

export default function CompleteConfirm({ 
  onComplete, 
  onBack, 
  isLoading 
}: CompleteConfirmProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">Voulez-vous marquer cette leçon comme réalisée ?</p>
      
      <div className="flex justify-end space-x-2">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
          onClick={onBack}
          disabled={isLoading}
        >
          Retour
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center"
          onClick={onComplete}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Validation...
            </>
          ) : 'Confirmer'}
        </button>
      </div>
    </div>
  );
}
