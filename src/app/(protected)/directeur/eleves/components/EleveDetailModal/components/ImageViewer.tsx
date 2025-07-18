'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';

interface ImageViewerProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImageViewer({ imageUrl, onClose }: ImageViewerProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
        <button 
          className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white"
          onClick={onClose}
        >
          <FiX size={24} />
        </button>
        
        <img 
          src={imageUrl} 
          alt="Document" 
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-xl" 
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
