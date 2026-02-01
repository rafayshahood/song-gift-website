'use client';

import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';
import { REVIEWS } from '@/data/reviews';
import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';

export default function Testimonials() {

  return (
    <SectionWrapper background="soft" spacing="sm" className="py-8 md:py-12">
      <div className="text-center mb-16">
        <SectionHeading level={2}>
          What Our Customers Say
        </SectionHeading>
        <SectionDescription>
          Real stories from real people who turned their memories into music.
        </SectionDescription>
      </div>

      <ReviewsGrid 
        reviews={REVIEWS} 
        variant="homepage"
      />
    </SectionWrapper>
  );
}
