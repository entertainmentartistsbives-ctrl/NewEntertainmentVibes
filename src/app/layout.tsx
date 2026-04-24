import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import VirtualAssistantButton from '@/components/VirtualAssistant/VirtualAssistantButton';

export const metadata: Metadata = {
  title: {
    default: 'EntertainmentVibes — Premium Artist & Celebrity Management',
    template: '%s | EntertainmentVibes',
  },
  description:
    'EntertainmentVibes is a 360° artist, celebrity, and live show management company. Book singers, live bands, DJs, comedians, anchors, dancers & more for weddings, corporate events, college festivals, and ticketed concerts across India.',
  keywords: [
    'artist management india',
    'celebrity booking india',
    'live band for wedding mumbai',
    'DJ booking india',
    'singer for corporate event',
    'entertainment vibes',
    'Abhishek Pandey artist manager',
    'luxury wedding entertainment india',
    'musical phera concept',
    'destination wedding entertainment',
  ],
  authors: [{ name: 'EntertainmentVibes' }],
  creator: 'EntertainmentVibes',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'EntertainmentVibes',
    title: 'EntertainmentVibes — Premium Artist & Celebrity Management',
    description:
      "India's most trusted 360\u00b0 artist & celebrity management brand. Delivering curated talent, iconic stage moments, and luxury entertainment experiences.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EntertainmentVibes — Premium Artist & Celebrity Management',
    description: 'Book singers, live bands, DJs, comedians & celebrities for your events across India and globally.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, paddingTop: 'var(--header-height)' }}>
          {children}
        </main>
        <Footer />
        <VirtualAssistantButton />
      </body>
    </html>
  );
}
