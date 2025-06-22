'use client';

import React from 'react';
import { useFormContext } from '../../context/FormContext';

interface CheckboxFieldProps {
  id: string;
  label: string;
  disabled?: boolean;
  className?: string;
  helpText?: string;
}

export default function CheckboxField({
  id,
  label,
  disabled = false,
  className = '',
  helpText
}: CheckboxFieldProps) {
  const { formState, updateField } = useFormContext();
  const checked = Boolean(formState[id as keyof typeof formState]);
  const error = formState.errors[id];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(id, e.target.checked);
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
              error ? 'border-red-500' : ''
            } ${disabled ? 'bg-gray-100' : ''}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
          />
        </div>
        <div className="ml-3 text-sm">
          <label 
            htmlFor={id} 
            className={`font-medium ${disabled ? 'text-gray-500' : 'text-gray-700'}`}
          >
            {label}
          </label>
          
          {helpText && !error && (
            <p id={`${id}-help`} className="text-gray-500">
              {helpText}
            </p>
          )}
        </div>
      </div>
      
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
