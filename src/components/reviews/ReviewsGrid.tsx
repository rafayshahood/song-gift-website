'use client';

import { useState } from 'react';
import { Review } from '@/data/reviews';
import { ReviewCard } from './ReviewCard';

interface ReviewsGridProps {
  reviews: Review[];
  variant?: 'homepage' | 'reviews-page';
  maxItems?: number;
}

export function ReviewsGrid({ 
  reviews, 
  variant = 'reviews-page',
  maxItems 
}: ReviewsGridProps) {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const handleAudioToggle = (reviewId: string) => {
    if (playingAudio === reviewId) {
      // Pause current audio
      setPlayingAudio(null);
    } else {
      // Stop any currently playing audio and start new one
      setPlayingAudio(reviewId);
    }
  };

  const displayReviews = maxItems ? reviews.slice(0, maxItems) : reviews;

  if (variant === 'homepage') {
    // Homepage horizontal scroll layout
    return (
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
          {displayReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              variant="homepage"
              onAudioToggle={handleAudioToggle}
              isPlaying={playingAudio === review.id}
            />
          ))}
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {displayReviews.map((review) => (
            <div key={review.id} className="w-2 h-2 rounded-full bg-primary/30"></div>
          ))}
        </div>
      </div>
    );
  }

  // Reviews page grid layout
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayReviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          variant="reviews-page"
          onAudioToggle={handleAudioToggle}
          isPlaying={playingAudio === review.id}
        />
      ))}
    </div>
  );
}
