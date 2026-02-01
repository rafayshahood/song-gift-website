import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Track Your Song",
  description: "Follow your custom song's journey from creation to delivery. Get real-time updates on your personalized gift's progress.",
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
