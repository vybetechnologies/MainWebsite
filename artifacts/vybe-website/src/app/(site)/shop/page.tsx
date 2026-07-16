import type { Metadata } from 'next';
import ShopContent from './shop-content';

export const metadata: Metadata = {
  title: 'Shop | VYBE Technologies',
  description:
    'Browse VYBE Technologies products and services. Add items to your cart and check out securely with Square.',
};

export default function ShopPage() {
  return <ShopContent />;
}
