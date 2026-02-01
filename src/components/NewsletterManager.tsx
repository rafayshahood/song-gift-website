'use client';

import React, { useState, useEffect } from 'react';
import NewsletterPopup from '@/components/NewsletterPopup';
import { NewsletterManager } from '@/utils/newsletterManager';

export default function NewsletterPopupManager() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newsletterManager, setNewsletterManager] = useState<NewsletterManager | null>(null);

  useEffect(() => {
    // Initialize newsletter manager on client side only
    const manager = new NewsletterManager();
    setNewsletterManager(manager);

    // Check if popup should show initially
    const checkInitialShow = () => {
      if (NewsletterManager.shouldShowPopup()) {
        setIsPopupOpen(true);
      }
    };

    // Set up timing for initial popup appearance (10 seconds)
    const initialTimer = setTimeout(checkInitialShow, 10000);

    // Set up periodic checks for reappearance (every 30 seconds)
    const periodicTimer = setInterval(() => {
      if (!isPopupOpen && NewsletterManager.shouldShowPopup()) {
        setIsPopupOpen(true);
      }
    }, 30000);

    // Cleanup function
    return () => {
      clearTimeout(initialTimer);
      clearInterval(periodicTimer);
      manager.cleanup();
    };
  }, [isPopupOpen]);

  const handleClose = () => {
    setIsPopupOpen(false);
    NewsletterManager.recordClosure();
  };

  const handleSubscribed = () => {
    setIsPopupOpen(false);
    NewsletterManager.markAsSubscribed();
  };

  return (
    <NewsletterPopup
      isOpen={isPopupOpen}
      onClose={handleClose}
      onSubscribed={handleSubscribed}
    />
  );
}
