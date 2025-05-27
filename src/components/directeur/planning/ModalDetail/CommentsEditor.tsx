'use client';

import React from 'react';
import { CommentsEditorProps } from './types';

export default function CommentsEditor({ 
  commentaire, 
  onChange, 
  onSave, 
  isLoading 
}: CommentsEditorProps) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Commentaires
        </label>
        <textarea
          value={commentaire}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ajouter des notes ou commentaires..."
        />
      </div>
      
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </>
          ) : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
