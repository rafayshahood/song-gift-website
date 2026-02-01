export type Song = {
  file: string;
  title: string;
  src: string;
};

export const SONGS: Song[] = [
  {
    file: "Eighteen Years of You.mp3",
    title: "Eighteen Years of You",
    src: "/Musical-Content/Songs/Eighteen Years of You.mp3"
  },
  {
    file: "Front Porch Promise.mp3", 
    title: "Front Porch Promise",
    src: "/Musical-Content/Songs/Front Porch Promise.mp3"
  },
  {
    file: "Thank God for Funnel Cake.mp3",
    title: "Thank God for Funnel Cake", 
    src: "/Musical-Content/Songs/Thank God for Funnel Cake.mp3"
  },
  {
    file: "The First Time I Knew.mp3",
    title: "The First Time I Knew",
    src: "/Musical-Content/Songs/The First Time I Knew.mp3"
  }
];

// Helper function to get song by index with looping
export function getSongByIndex(index: number): Song {
  return SONGS[index % SONGS.length];
}
