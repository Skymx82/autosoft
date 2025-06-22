'use client';

import React from 'react';
import { useFormContext } from '../../context/FormContext';

interface TextareaFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  helpText?: string;
}

export default function TextareaField({
  id,
  label,
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  rows = 3,
  maxLength,
  minLength,
  helpText
}: TextareaFieldProps) {
  const { formState, updateField } = useFormContext();
  const value = formState[id as keyof typeof formState] as string || '';
  const error = formState.errors[id];
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField(id, e.target.value);
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        minLength={minLength}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500'
        } ${disabled ? 'bg-gray-100 text-gray-500' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      />
      
      {maxLength && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {value.length}/{maxLength} caractères
        </div>
      )}
      
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p id={`${id}-help`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
}
