'use client';

import React from 'react';
import { useFormContext } from '../../context/FormContext';

interface Option {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  id: string;
  label: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inline?: boolean;
  helpText?: string;
}

export default function RadioGroupField({
  id,
  label,
  options,
  required = false,
  disabled = false,
  className = '',
  inline = false,
  helpText
}: RadioGroupFieldProps) {
  const { formState, updateField } = useFormContext();
  const value = formState[id as keyof typeof formState] as string || '';
  const error = formState.errors[id];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(id, e.target.value);
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      <div className="mb-1">
        <span className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </div>
      
      <div className={`${inline ? 'flex flex-wrap gap-x-6' : 'space-y-2'}`}>
        {options.map((option) => (
          <div key={option.value} className={`flex items-center ${inline ? 'mr-4' : ''}`}>
            <input
              id={`${id}-${option.value}`}
              name={id}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
              disabled={disabled}
              className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${
                error ? 'border-red-500' : ''
              } ${disabled ? 'bg-gray-100' : ''}`}
              aria-invalid={error ? 'true' : 'false'}
            />
            <label
              htmlFor={`${id}-${option.value}`}
              className={`ml-2 block text-sm ${disabled ? 'text-gray-500' : 'text-gray-700'}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
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
