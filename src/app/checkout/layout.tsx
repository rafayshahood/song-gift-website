import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Complete Your Order",
  description: "You're moments away from gifting something truly magical. Secure checkout for your personalized song creation.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
