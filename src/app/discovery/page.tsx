import DiscoveryClient from '@/components/Discovery/DiscoveryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artist Discovery | EntertainmentVibes',
  description: 'Explore trending, exclusive, and featured artists for your events. Filter by category to find the perfect talent.',
};

export default function DiscoveryPage() {
  return (
    <main>
      <DiscoveryClient />
    </main>
  );
}
