'use client';

import React from 'react';
import { useFormContext } from '../../context/FormContext';

interface InputFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'password';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  helpText?: string;
}

export default function InputField({
  id,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  autoComplete,
  maxLength,
  minLength,
  pattern,
  helpText
}: InputFieldProps) {
  const { formState, updateField } = useFormContext();
  const value = formState[id as keyof typeof formState] as string || '';
  const error = formState.errors[id];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500'
        } ${disabled ? 'bg-gray-100 text-gray-500' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
      />
      
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
