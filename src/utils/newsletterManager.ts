'use client';

// Newsletter popup timing and persistence manager
export class NewsletterManager {
  private static readonly STORAGE_KEYS = {
    SUBSCRIBED: 'songGift_newsletter_subscribed',
    LAST_CLOSED: 'songGift_newsletter_last_closed_at',
    ACTIVE_TIME: 'songGift_newsletter_active_time',
    SESSION_START: 'songGift_newsletter_session_start'
  };

  private static readonly TIMING = {
    INITIAL_DELAY: 10000, // 10 seconds (between 8-12s range)
    REAPPEAR_DELAY: 240000, // 4 minutes (240s) after closing without subscribing
    ACTIVE_TIME_THRESHOLD: 180000 // 3 minutes of active time before reappearing
  };

  private activeTimeTracker: number = 0;
  private lastActivityTime: number = Date.now();
  private activityInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeActivityTracking();
    }
  }

  // Check if user has already subscribed
  static isSubscribed(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.STORAGE_KEYS.SUBSCRIBED) === 'true';
  }

  // Mark user as subscribed (never show popup again)
  static markAsSubscribed(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEYS.SUBSCRIBED, 'true');
    // Clear other timing data since they're no longer needed
    localStorage.removeItem(this.STORAGE_KEYS.LAST_CLOSED);
    localStorage.removeItem(this.STORAGE_KEYS.ACTIVE_TIME);
  }

  // Record when popup was closed without subscribing
  static recordClosure(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEYS.LAST_CLOSED, Date.now().toString());
  }

  // Check if popup should appear based on timing rules
  static shouldShowPopup(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Never show if already subscribed
    if (this.isSubscribed()) {
      return false;
    }

    const lastClosed = localStorage.getItem(this.STORAGE_KEYS.LAST_CLOSED);
    const sessionStart = localStorage.getItem(this.STORAGE_KEYS.SESSION_START);
    const now = Date.now();

    // If never closed before, check initial delay
    if (!lastClosed) {
      if (!sessionStart) {
        // First visit - record session start
        localStorage.setItem(this.STORAGE_KEYS.SESSION_START, now.toString());
        return false;
      }
      
      // Check if enough time has passed since session start
      const timeSinceStart = now - parseInt(sessionStart);
      return timeSinceStart >= this.TIMING.INITIAL_DELAY;
    }

    // If closed before, check reappear delay
    const timeSinceClosed = now - parseInt(lastClosed);
    return timeSinceClosed >= this.TIMING.REAPPEAR_DELAY;
  }

  // Initialize activity tracking for accurate timing
  private initializeActivityTracking(): void {
    // Track user activity (mouse, keyboard, scroll)
    const trackActivity = () => {
      this.lastActivityTime = Date.now();
    };

    document.addEventListener('mousedown', trackActivity);
    document.addEventListener('mousemove', trackActivity);
    document.addEventListener('keypress', trackActivity);
    document.addEventListener('scroll', trackActivity);
    document.addEventListener('touchstart', trackActivity);

    // Update active time every second
    this.activityInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - this.lastActivityTime;
      
      // Only count as active if user was active in last 30 seconds
      if (timeSinceActivity < 30000) {
        this.activeTimeTracker += 1000;
        
        // Store active time in localStorage
        const storedActiveTime = localStorage.getItem(NewsletterManager.STORAGE_KEYS.ACTIVE_TIME);
        const totalActiveTime = (storedActiveTime ? parseInt(storedActiveTime) : 0) + 1000;
        localStorage.setItem(NewsletterManager.STORAGE_KEYS.ACTIVE_TIME, totalActiveTime.toString());
      }
    }, 1000);
  }

  // Get total active time on site
  static getActiveTime(): number {
    if (typeof window === 'undefined') return 0;
    const storedTime = localStorage.getItem(this.STORAGE_KEYS.ACTIVE_TIME);
    return storedTime ? parseInt(storedTime) : 0;
  }

  // Check if user has been active enough for reappearance
  static hasEnoughActiveTime(): boolean {
    return this.getActiveTime() >= this.TIMING.ACTIVE_TIME_THRESHOLD;
  }

  // Clean up activity tracking
  cleanup(): void {
    if (this.activityInterval) {
      clearInterval(this.activityInterval);
      this.activityInterval = null;
    }
  }

  // Reset all newsletter data (for testing)
  static reset(): void {
    if (typeof window === 'undefined') return;
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Get debug info (for testing)
  static getDebugInfo(): any {
    if (typeof window === 'undefined') return {};
    
    return {
      isSubscribed: this.isSubscribed(),
      lastClosed: localStorage.getItem(this.STORAGE_KEYS.LAST_CLOSED),
      activeTime: this.getActiveTime(),
      sessionStart: localStorage.getItem(this.STORAGE_KEYS.SESSION_START),
      shouldShow: this.shouldShowPopup(),
      hasEnoughActiveTime: this.hasEnoughActiveTime()
    };
  }
}

export default NewsletterManager;
