import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Questions & Answers",
  description: "Everything you need to know about custom song gifts. Pricing, delivery, process, and more — all your questions answered.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
