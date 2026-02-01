'use client';

import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber, isValidPhoneNumber, getCountryCallingCode } from 'libphonenumber-js';
// CSS is imported in globals.css to avoid @import issues

interface PhoneInputComponentProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean, e164?: string, display?: string, country?: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  onBlur?: () => void;
}

export default function PhoneInputComponent({
  value,
  onChange,
  onValidationChange,
  placeholder = "Enter your phone number",
  className = "",
  error,
  onBlur
}: PhoneInputComponentProps) {
  const [defaultCountry, setDefaultCountry] = useState<string>('PK');

  // Detect user's country from browser locale
  useEffect(() => {
    try {
      const locale = navigator.language || 'en-PK';
      const countryCode = locale.split('-')[1];
      
      // Map common country codes
      const countryMap: { [key: string]: string } = {
        'US': 'US',
        'PK': 'PK',
        'GB': 'GB',
        'CA': 'CA',
        'AU': 'AU',
        'IN': 'IN',
        'AE': 'AE',
        'SA': 'SA'
      };
      
      setDefaultCountry(countryMap[countryCode] || 'PK');
    } catch (error) {
      console.log('Could not detect country, defaulting to PK');
      setDefaultCountry('PK');
    }
  }, []);

  const handlePhoneChange = (phoneValue: string | undefined) => {
    const phone = phoneValue || '';
    onChange(phone);

    if (phone) {
      try {
        const isValid = isValidPhoneNumber(phone);
        
        if (isValid) {
          const phoneNumber = parsePhoneNumber(phone);
          const e164 = phoneNumber.format('E.164');
          const display = phoneNumber.formatInternational();
          const country = phoneNumber.country;
          
          onValidationChange(true, e164, display, country);
        } else {
          onValidationChange(false);
        }
      } catch (error) {
        onValidationChange(false);
      }
    } else {
      onValidationChange(false);
    }
  };

  return (
    <div className="relative">
      <PhoneInput
        international
        defaultCountry={defaultCountry as any}
        value={value}
        onChange={handlePhoneChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`phone-input ${className} ${error ? 'phone-input-error' : ''}`}
        numberInputProps={{
          className: "w-full px-4 py-3 text-base border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft pl-16"
        }}
      />
      
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
      
      <style jsx global>{`
        .phone-input {
          position: relative;
        }
        
        .phone-input .PhoneInputCountrySelect {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          border: none;
          background: transparent;
          padding: 4px;
          border-radius: 4px;
        }
        
        .phone-input .PhoneInputCountrySelect:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.2);
        }
        
        .phone-input .PhoneInputCountrySelectArrow {
          display: none;
        }
        
        .phone-input-error input {
          border-color: #ef4444 !important;
        }
        
        .phone-input-error .PhoneInputCountrySelect {
          border-color: #ef4444;
        }
      `}</style>
    </div>
  );
}
