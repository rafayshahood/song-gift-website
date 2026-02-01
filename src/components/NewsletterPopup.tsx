'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed: () => void;
}

export default function NewsletterPopup({ isOpen, onClose, onSubscribed }: NewsletterPopupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Email validation (same as Step 6)
  const validateEmail = (email: string): string => {
    const trimmed = email.trim();
    if (!trimmed) return 'Email address is required';
    
    // RFC-style practical email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return 'Please enter a valid email address';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          page_path: window.location.pathname,
          user_agent: navigator.userAgent,
          session_id: sessionStorage.getItem('sessionId') || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        // Show success message briefly, then close
        setTimeout(() => {
          onSubscribed();
          onClose();
        }, 2000);
      } else {
        if (response.status === 409) {
          // Duplicate email - treat as success
          setError('You\'re already subscribed! Thank you.');
          setTimeout(() => {
            onSubscribed();
            onClose();
          }, 2000);
        } else {
          setError(data.error || 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error on change
    if (error) {
      setError('');
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setError('');
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-text-main mb-3">
            Stay in the Loop! 🎵
          </h2>
          <p className="text-text-muted font-body">
            Get exclusive updates on new features, special offers, and heartwarming stories from our SongGift community.
          </p>
        </div>

        {/* Success State */}
        {isSuccess && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-heading font-semibold text-text-main mb-2">
              Welcome aboard! 🎉
            </h3>
            <p className="text-text-muted font-body">
              You'll receive our newsletter with the latest updates and special offers.
            </p>
          </div>
        )}

        {/* Form */}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newsletter-email" className="block font-body font-semibold text-text-main mb-3">
                Email Address <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                id="newsletter-email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 text-base border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-soft ${
                  error ? 'border-red-500' : 'border-primary/20'
                }`}
                disabled={isSubmitting}
                required
              />
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="flex-1"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </span>
                ) : (
                  'Subscribe Now'
                )}
              </Button>
              
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-text-muted hover:text-text-main transition-colors font-body font-medium"
                disabled={isSubmitting}
              >
                Maybe Later
              </button>
            </div>

            <p className="text-xs text-text-muted text-center font-body">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </Modal>
  );
}
