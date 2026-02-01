import { getSongByIndex } from './songs';

export type Review = {
  id: string;
  type: "video" | "text";
  name: string;
  relationship?: string;   // optional
  rating: number;          // 1-5
  title?: string;
  body: string;
  videoSrc?: string;       // for video testimonials
  songSrc?: string;        // for text testimonials play button
  songTitle?: string;      // display name derived from filename
};

// Create base reviews without songs first
const baseReviews: Omit<Review, 'songSrc' | 'songTitle'>[] = [
  {
    id: "sarah-johnson-anniversary",
    type: "video",
    name: "Sarah Johnson",
    relationship: "Anniversary Gift",
    rating: 5,
    body: "The song captured our love story perfectly. My husband cried when he heard it on our 10th anniversary. It's now our most treasured possession.",
    videoSrc: "/Musical-Content/Videos/reaction1.mp4"
  },
  {
    id: "michael-chen-wedding",
    type: "text",
    name: "Michael Chen",
    relationship: "Wedding Surprise",
    rating: 5,
    body: "I surprised my bride with a custom song during our reception. The entire room was in tears. SongGift made our special day even more magical."
  },
  {
    id: "emma-rodriguez-memorial",
    type: "video",
    name: "Emma Rodriguez",
    relationship: "Memorial Tribute",
    rating: 5,
    body: "They helped me honor my grandmother's memory with a beautiful song. It brought comfort to our whole family during a difficult time.",
    videoSrc: "/Musical-Content/Videos/reaction1.mp4"
  },
  {
    id: "david-kim-birthday",
    type: "text",
    name: "David Kim",
    relationship: "Birthday Surprise",
    rating: 5,
    body: "My daughter's face lit up when she heard her personalized birthday song. The musicians captured her personality perfectly in the melody."
  },
  {
    id: "lisa-thompson-graduation",
    type: "video",
    name: "Lisa Thompson",
    relationship: "Graduation Gift",
    rating: 5,
    body: "What an incredible way to celebrate my son's graduation! The song tells his journey and achievements beautifully.",
    videoSrc: "/Musical-Content/Videos/reaction1.mp4"
  },
  {
    id: "james-wilson-valentine",
    type: "text",
    name: "James Wilson",
    relationship: "Valentine's Day",
    rating: 5,
    body: "This was the most romantic gift I've ever given. My wife still plays our song every morning. Worth every penny!"
  },
  {
    id: "maria-garcia-memorial",
    type: "text",
    name: "Maria Garcia",
    relationship: "Memorial Song",
    rating: 5,
    body: "We created this in memory of my father. It helps us feel close to him and celebrates his life in the most beautiful way."
  },
  {
    id: "robert-kim-proposal",
    type: "text",
    name: "Robert Kim",
    relationship: "Proposal Song",
    rating: 5,
    body: "I proposed with this playing in the background. It told our whole story leading up to that moment. She said yes!"
  },
  {
    id: "jennifer-adams-christmas",
    type: "video",
    name: "Jennifer Adams",
    relationship: "Christmas Gift",
    rating: 5,
    body: "This was under the Christmas tree for my husband. 25 years of marriage captured in one beautiful song.",
    videoSrc: "/Musical-Content/Videos/reaction1.mp4"
  },
  {
    id: "carlos-martinez-newborn",
    type: "text",
    name: "Carlos Martinez",
    relationship: "New Baby",
    rating: 5,
    body: "We made this for our newborn son. It's about our hopes and dreams for him. We play it during bedtime every night."
  },
  {
    id: "amanda-foster-friendship",
    type: "text",
    name: "Amanda Foster",
    relationship: "Best Friend Gift",
    rating: 5,
    body: "20 years of friendship deserved something special. This song captures all our adventures and inside jokes perfectly."
  },
  {
    id: "thomas-lee-retirement",
    type: "video",
    name: "Thomas Lee",
    relationship: "Retirement Gift",
    rating: 5,
    body: "We surprised our boss with this for his retirement. 30 years of leadership and friendship captured beautifully.",
    videoSrc: "/Musical-Content/Videos/reaction1.mp4"
  }
];

// Assign songs to text reviews using looping logic
export const REVIEWS: Review[] = baseReviews.map((review, index) => {
  if (review.type === "text") {
    // Find the index among text reviews only for proper song assignment
    const textReviewIndex = baseReviews.slice(0, index + 1).filter(r => r.type === "text").length - 1;
    const song = getSongByIndex(textReviewIndex);
    
    return {
      ...review,
      songSrc: song.src,
      songTitle: song.title
    };
  }
  
  return review as Review;
});
