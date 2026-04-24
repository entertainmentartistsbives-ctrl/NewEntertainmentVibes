import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | EntertainmentVibes',
  robots: 'noindex, nofollow', // Prevent search engines from indexing the admin panel
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {children}
    </div>
  );
}
