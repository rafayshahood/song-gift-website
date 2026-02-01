import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create a Custom Song Gift",
  description: "Share your story and we'll craft a one-of-a-kind song gift. Choose your style, add personal details, and surprise someone special.",
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
