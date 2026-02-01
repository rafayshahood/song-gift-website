'use client';

import { useState, useRef, useEffect } from 'react';
import { Review } from '@/data/reviews';

interface ReviewCardProps {
  review: Review;
  variant?: 'homepage' | 'reviews-page';
  onAudioToggle?: (reviewId: string) => void;
  isPlaying?: boolean;
}

export function ReviewCard({ 
  review, 
  variant = 'reviews-page',
  onAudioToggle,
  isPlaying = false 
}: ReviewCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle audio playback state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !review.songSrc) return;

    if (isPlaying) {
      setIsLoading(true);
      audio.play().then(() => {
        setIsLoading(false);
      }).catch((error) => {
        console.error('Audio play failed:', error);
        setIsLoading(false);
      });
    } else {
      audio.pause();
      setIsLoading(false);
    }
  }, [isPlaying, review.songSrc]);

  const handleAudioClick = () => {
    if (onAudioToggle) {
      onAudioToggle(review.id);
    }
  };

  if (variant === 'homepage') {
    // Homepage testimonial card (horizontal scroll style)
    if (review.type === "video") {
      return (
        <div className="flex-shrink-0 w-80 md:w-96 snap-start">
          <div className="bg-gradient-to-br from-white to-background-soft p-8 rounded-3xl shadow-soft-lg hover:shadow-soft border border-white/50 h-full">
            {/* Video Element */}
            <div className="aspect-video bg-gradient-to-br from-text-main/10 to-primary/20 rounded-2xl mb-6 overflow-hidden">
              {review.videoSrc ? (
                <video
                  src={review.videoSrc}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="font-body text-sm text-text-muted">Video Testimonial</p>
                  </div>
                </div>
              )}
            </div>

            {/* Rating Stars */}
            <div className="flex items-center mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-heading font-semibold mr-4">
                {review.name.charAt(0)}
              </div>
              <div>
                <div className="font-body font-semibold text-text-main">
                  {review.name}
                </div>
                <div className="font-body text-sm text-text-muted">
                  {review.relationship}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex-shrink-0 w-80 md:w-96 snap-start">
          <div className="bg-white p-8 rounded-3xl shadow-soft-lg hover:shadow-soft border border-primary/10 h-full">
            {/* Rating Stars */}
            <div className="flex items-center mb-6">
              {[...Array(review.rating)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>

            {/* Audio Play Button */}
            <div className="mb-6">
              <button
                onClick={handleAudioClick}
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 text-primary font-body font-semibold px-4 py-2 rounded-full transition-all duration-300 border border-primary/20 hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isPlaying ? "Pause song" : "Play song"}
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
                <span className="text-sm">
                  {isLoading ? 'Loading...' : isPlaying ? 'Pause Song' : 'Play Song'}
                </span>
              </button>
              
              {/* Hidden Audio Element */}
              {review.songSrc && (
                <audio
                  ref={audioRef}
                  src={review.songSrc}
                  preload="metadata"
                  onEnded={() => onAudioToggle?.(review.id)}
                />
              )}
            </div>

            {/* Testimonial Content */}
            <blockquote className="font-serif text-lg text-text-main mb-8 leading-relaxed">
              "{review.body}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-heading font-semibold mr-4">
                {review.name.charAt(0)}
              </div>
              <div>
                <div className="font-body font-semibold text-text-main text-lg">
                  {review.name}
                </div>
                <div className="font-body text-text-muted">
                  {review.relationship}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Reviews page card (grid style)
  if (review.type === "video") {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-soft-lg hover:shadow-soft border border-white/80 h-full">
        {/* Rating Stars */}
        <div className="flex items-center mb-4">
          {[...Array(review.rating)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>

        {/* Video Review */}
        <div className="mb-4">
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl overflow-hidden">
            {review.videoSrc ? (
              <video
                src={review.videoSrc}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center cursor-pointer hover:from-primary/20 hover:to-primary/30 transition-all duration-300">
                <div className="text-center text-primary">
                  <div className="w-16 h-16 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="font-body text-sm font-semibold">Video Testimonial</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Review Content */}
        <blockquote className="font-serif text-base text-text-main mb-6 leading-relaxed">
          "{review.body}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-heading font-semibold mr-3">
            {review.name.charAt(0)}
          </div>
          <div>
            <div className="font-body font-semibold text-text-main">
              {review.name}
            </div>
            <div className="font-body text-text-muted text-sm">
              {review.relationship}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-soft-lg hover:shadow-soft border border-white/80 h-full">
        {/* Rating Stars */}
        <div className="flex items-center mb-4">
          {[...Array(review.rating)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>

        {/* Text Review with Audio Button */}
        <div className="mb-4">
          <button
            onClick={handleAudioClick}
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 text-primary font-body font-semibold px-3 py-2 rounded-full transition-all duration-300 border border-primary/20 hover:border-primary/30 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isPlaying ? "Pause song" : "Play song"}
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
            <span className="text-sm">
              {isLoading ? 'Loading...' : isPlaying ? 'Pause Song' : 'Play Song'}
            </span>
          </button>
          
          {/* Hidden Audio Element */}
          {review.songSrc && (
            <audio
              ref={audioRef}
              src={review.songSrc}
              preload="metadata"
              onEnded={() => onAudioToggle?.(review.id)}
            />
          )}
        </div>

        {/* Review Content */}
        <blockquote className="font-serif text-base text-text-main mb-6 leading-relaxed">
          "{review.body}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-heading font-semibold mr-3">
            {review.name.charAt(0)}
          </div>
          <div>
            <div className="font-body font-semibold text-text-main">
              {review.name}
            </div>
            <div className="font-body text-text-muted text-sm">
              {review.relationship}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
