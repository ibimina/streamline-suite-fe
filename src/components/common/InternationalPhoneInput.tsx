import React, { useEffect, useState } from 'react'
import PhoneInput, { Country } from 'react-phone-number-input'
import { Controller, UseFormReturn } from 'react-hook-form'
// @ts-ignore - CSS module type declarations are not present in this project
import 'react-phone-number-input/style.css'

interface InternationalPhoneInputProps {
  formMethods: UseFormReturn<any>
  fieldName: string
  label: string
  placeholder?: string
  required?: boolean
  className?: string
  autoDetectCountry?: boolean
}

// Country mapping for common country names to ISO codes
const countryMapping: Record<string, Country> = {
  'united states': 'US',
  canada: 'CA',
  'united kingdom': 'GB',
  australia: 'AU',
  germany: 'DE',
  france: 'FR',
  netherlands: 'NL',
  nigeria: 'NG',
  'south africa': 'ZA',
  india: 'IN',
  singapore: 'SG',
}

const InternationalPhoneInput: React.FC<InternationalPhoneInputProps> = ({
  formMethods,
  fieldName,
  label,
  placeholder = 'Enter phone number',
  required = false,
  className = '',
  autoDetectCountry = true,
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = formMethods

  // Normalize the current field's error message to a ReactNode to satisfy JSX typing
  const errorMessage: React.ReactNode = (errors as any)[fieldName]?.message ?? null

  // Watch for changes in country field (from address autocomplete)
  const selectedCountry = watch('country')

  return (
    <div className={className}>
      <label
        htmlFor={fieldName}
        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
      >
        {label} {required && '*'}
      </label>
      <div className='relative'>
        <Controller
          name={fieldName}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className='phone-input-wrapper'>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                country={selectedCountry}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className='react-phone-number-input'
              />
              {autoDetectCountry && selectedCountry && (
                <p className='mt-1 text-xs text-blue-600 dark:text-blue-400'>
                  {errors[fieldName] && (
                    <p className='mt-1 text-sm text-red-600' role='alert'>
                      {errorMessage}
                    </p>
                  )}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <style jsx>{`
        .phone-input-wrapper :global(.react-phone-number-input) {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid rgb(209 213 219);
          border-radius: 0.5rem;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          background-color: white;
          transition: all 0.15s ease-in-out;
        }

        .phone-input-wrapper :global(.dark .react-phone-number-input) {
          border-color: rgb(75 85 99);
          background-color: rgb(55 65 81);
        }

        .phone-input-wrapper :global(.react-phone-number-input:focus-within) {
          outline: 2px solid rgb(20 184 166);
          outline-offset: 2px;
          border-color: rgb(20 184 166);
        }

        .phone-input-wrapper :global(.PhoneInputCountrySelect) {
          margin-right: 0.5rem;
          border: none;
          background: transparent;
          color: rgb(75 85 99);
          font-size: 0.875rem;
          cursor: pointer;
        }

        .phone-input-wrapper :global(.dark .PhoneInputCountrySelect) {
          color: rgb(156 163 175);
        }

        .phone-input-wrapper :global(.PhoneInputCountrySelect:focus) {
          outline: none;
        }

        .phone-input-wrapper :global(.PhoneInputCountrySelectArrow) {
          color: rgb(107 114 128);
          margin-left: 0.25rem;
        }

        .phone-input-wrapper :global(.dark .PhoneInputCountrySelectArrow) {
          color: rgb(156 163 175);
        }

        .phone-input-wrapper :global(.PhoneInputInput) {
          flex: 1;
          border: none;
          background: transparent;
          color: rgb(17 24 39);
          font-size: 0.875rem;
          outline: none;
          min-width: 0;
        }

        .phone-input-wrapper :global(.dark .PhoneInputInput) {
          color: white;
        }

        .phone-input-wrapper :global(.PhoneInputInput::placeholder) {
          color: rgb(156 163 175);
        }

        .phone-input-wrapper :global(.PhoneInputCountryIcon) {
          width: 1.25rem;
          height: 0.875rem;
          margin-right: 0.25rem;
        }
      `}</style>
    </div>
  )
}

export default InternationalPhoneInput
