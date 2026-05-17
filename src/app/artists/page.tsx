'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaStar, FaRedo, FaSlidersH } from 'react-icons/fa';
import BookingModal from '@/components/BookingModal/BookingModal';
import ArtistDetailsModal from '@/components/ArtistDetailsModal/ArtistDetailsModal';

import IntentSection from '@/components/IntentSection/IntentSection';
import TrendingSection from '@/components/TrendingSection/TrendingSection';
import ExclusiveArtists from '@/components/ExclusiveArtists/ExclusiveArtists';
import FeaturedArtistsCarousel from '@/components/FeaturedArtistsCarousel/FeaturedArtistsCarousel';
import PremiumFilterBar from '@/components/Discovery/PremiumFilterBar';

/* ── TYPES ─────────────────────────────────────────────── */
interface ArtistData {
  id: number;
  name: string;
  category: string;
  location: string;
  bio: string;
  price: string;
  imageUrl: string;
  isExclusive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  rating: number;
  eventsCount: number;
  videoUrl?: string;
}

type RowType = 'trending' | 'exclusive' | 'featured';

interface RowState {
  data: ArtistData[];
  loading: boolean;
  error: string | null;
}

const CATEGORIES = [
  'ALL', 'DJ', 'SINGER', 'DANCER', 'COMEDIAN',
  'BAND', 'ANCHOR', 'MUSICIAN', 'MAGICIAN', 'STAND-UP COMIC',
];

const ROW_CONFIG: { type: RowType; tag: string; title: string; subtitle: string }[] = [
  {
    type: 'trending',
    tag: 'TRENDING',
    title: 'Trending Artists',
    subtitle: 'The most sought-after performers making waves across India\'s live event scene.',
  },
  {
    type: 'exclusive',
    tag: 'EXCLUSIVE',
    title: 'Exclusive Elite',
    subtitle: 'Premium artists managed exclusively by EntertainmentVibes.',
  },
  {
    type: 'featured',
    tag: 'FEATURED',
    title: 'Featured Picks',
    subtitle: 'Our hand-picked selection of top-tier talent for your high-profile celebrations.',
  },
];

/* ── HELPER: Get artist initials ───────────────────────── */
function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/* ── HELPER: Format price ──────────────────────────────── */
function formatPrice(price: string | null | undefined): string {
  if (!price || price.trim() === '' || price === 'On Request') return 'On Request';
  // If it's just a number, format it
  const numericVal = parseInt(price.replace(/[^0-9]/g, ''));
  if (!isNaN(numericVal) && numericVal > 0) return `From ₹${numericVal.toLocaleString('en-IN')}`;
  return price;
}

/* ══════════════════════════════════════════════════════════
   SKELETON CARD
   ══════════════════════════════════════════════════════════ */
function SkeletonCard() {
  return (
    <div className="discovery-card discovery-card--skeleton">
      <div className="discovery-card__image-skeleton" />
      <div className="discovery-card__body-skeleton">
        <div className="skeleton-line skeleton-line--sm" />
        <div className="skeleton-line skeleton-line--md" />
        <div className="skeleton-line skeleton-line--xs" />
        <div className="skeleton-line skeleton-line--lg" />
        <div className="skeleton-btns">
          <div className="skeleton-btn" />
          <div className="skeleton-btn" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ARTIST CARD (180×280)
   ══════════════════════════════════════════════════════════ */
function ArtistCard({
  artist,
  onView,
  onBook,
}: {
  artist: ArtistData;
  onView: () => void;
  onBook: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const hasValidImage = artist.imageUrl && !artist.imageUrl.startsWith('/images/') && !imgError;

  return (
    <div className="discovery-card group">
      {/* Image Area — top 55% */}
      <div className="discovery-card__image">
        {hasValidImage ? (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="discovery-card__placeholder">
            <span>{getInitials(artist.name)}</span>
          </div>
        )}
        {/* Category Badge */}
        <span className="discovery-card__badge">{artist.category.toUpperCase()}</span>
      </div>

      {/* Info Area — flex:1 */}
      <div className="discovery-card__body">
        <div className="discovery-card__category">{artist.category.toUpperCase()}</div>
        <h3 className="discovery-card__name group-hover:text-[#fbbf24] transition-colors">{artist.name}</h3>
        <div className="discovery-card__meta">
          <span className="discovery-card__rating">
            <FaStar /> {artist.rating}
          </span>
          <span className="discovery-card__dot">•</span>
          <span className="discovery-card__location">{artist.location}</span>
        </div>
        <div className="discovery-card__price">{formatPrice(artist.price)}</div>
        <div className="discovery-card__actions">
          <button className="discovery-btn discovery-btn--outline" onClick={onView}>View</button>
          <button className="discovery-btn discovery-btn--gold" onClick={onBook}>Book Now</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ARTIST ROW (independently scrollable)
   ══════════════════════════════════════════════════════════ */
function ArtistRow({
  config,
  state,
  onRetry,
  onView,
  onBook,
}: {
  config: typeof ROW_CONFIG[0];
  state: RowState;
  onRetry: () => void;
  onView: (artist: ArtistData) => void;
  onBook: (artist: ArtistData) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="discovery-row relative">
      {/* Decorative gradient behind row header */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#fbbf24]/5 blur-[80px] rounded-full pointer-events-none"></div>
      
      {/* Row Header */}
      <div className="discovery-row__header relative z-10">
        <div className="discovery-row__header-left">
          <span className="discovery-row__tag shadow-[0_0_10px_rgba(212,168,67,0.1)]">{config.tag}</span>
          <h2 className="discovery-row__title">{config.title}</h2>
        </div>
        <a href="/artists" className="discovery-row__see-all">See All →</a>
      </div>

      {/* Loading State */}
      {state.loading && (
        <div className="discovery-row__scroll hide-scrollbar relative z-10">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!state.loading && state.error && (
        <div className="discovery-row__error relative z-10">
          <p>⚠️ {state.error}</p>
          <button className="discovery-btn discovery-btn--retry" onClick={onRetry}>
            <FaRedo /> Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!state.loading && !state.error && state.data.length === 0 && (
        <div className="discovery-row__empty relative z-10">
          No artists available
        </div>
      )}

      {/* Data */}
      {!state.loading && !state.error && state.data.length > 0 && (
        <div ref={scrollRef} className="discovery-row__scroll hide-scrollbar relative z-10 pt-2 pb-6">
          {state.data.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onView={() => onView(artist)}
              onBook={() => onBook(artist)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN CONTENT
   ══════════════════════════════════════════════════════════ */
function ArtistsDiscoveryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategory = searchParams.get('category')?.toUpperCase() || 'ALL';

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [activeSection, setActiveSection] = useState<'ALL' | 'TRENDING' | 'EXCLUSIVE' | 'FEATURED'>('ALL');
  const [rows, setRows] = useState<Record<RowType, RowState>>({
    trending: { data: [], loading: true, error: null },
    exclusive: { data: [], loading: true, error: null },
    featured: { data: [], loading: true, error: null },
  });

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<{ id?: number; name?: string } | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewArtist, setViewArtist] = useState<any>(null);

  /* ── Fetch a single row ─────────────────────────────── */
  const fetchRow = useCallback(async (type: RowType, category: string) => {
    setRows((prev) => ({
      ...prev,
      [type]: { ...prev[type], loading: true, error: null },
    }));

    try {
      const catParam = category !== 'ALL' ? `?category=${encodeURIComponent(category)}` : '';
      const res = await fetch(`/api/discovery/${type}${catParam}`);
      if (!res.ok) throw new Error(`Failed to load ${type} artists`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || `Failed to load ${type} artists`);

      setRows((prev) => ({
        ...prev,
        [type]: { data: json.data, loading: false, error: null },
      }));
    } catch (err: any) {
      setRows((prev) => ({
        ...prev,
        [type]: { data: [], loading: false, error: err.message || 'Something went wrong' },
      }));
    }
  }, []);

  /* ── Fetch all 3 rows in parallel ───────────────────── */
  const fetchAllRows = useCallback(
    (category: string) => {
      fetchRow('trending', category);
      fetchRow('exclusive', category);
      fetchRow('featured', category);
    },
    [fetchRow]
  );

  useEffect(() => {
    fetchAllRows(activeCategory);
  }, [activeCategory, fetchAllRows]);

  /* ── Category handler ───────────────────────────────── */
  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    router.push(cat === 'ALL' ? '/artists' : `/artists?category=${encodeURIComponent(cat)}`);
  };

  /* ── Modal handlers ─────────────────────────────────── */
  const openBooking = (artist: ArtistData) => {
    setSelectedArtist({ id: artist.id, name: artist.name });
    setModalOpen(true);
  };

  const openView = (artist: ArtistData) => {
    setViewArtist(artist);
    setViewModalOpen(true);
  };

  return (
    <>
      {/* ═══ HERO SECTION ═══ */}
      <section style={{
        position: 'relative',
        paddingTop: '100px',
        paddingBottom: '80px',
        overflow: 'hidden',
        background: '#000000',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '80%',
            opacity: 0.2,
            filter: 'blur(150px)',
            borderRadius: '50%',
            background: 'var(--vibrant-magenta)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '50%',
            height: '70%',
            opacity: 0.1,
            filter: 'blur(120px)',
            borderRadius: '50%',
            background: 'var(--vibrant-blue)',
          }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 24px',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            marginBottom: '32px',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--vibrant-magenta)',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: '10px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '4px',
              color: 'rgba(255,255,255,0.7)',
            }}>Premium Talent Roster</span>
          </div>
          
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            marginBottom: '32px',
            lineHeight: 1,
          }}>
            Browse &amp; <span style={{ 
              background: 'var(--sunset-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Book Artists</span>
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <div style={{ width: '96px', height: '4px', borderRadius: '9999px', background: 'linear-gradient(to right, transparent, var(--vibrant-magenta))' }} />
            <div style={{ width: '96px', height: '4px', borderRadius: '9999px', background: 'linear-gradient(to left, transparent, var(--vibrant-magenta))' }} />
          </div>
        </div>
      </section>

      {/* ═══ FILTER & INTENT SECTION ═══ */}
      <section className="bg-[#050505] border-y border-white/5">
        <div className="container py-12">
          <IntentSection />
        </div>
      </section>

      {/* ═══ PREMIUM FILTER BAR ═══ */}
      <PremiumFilterBar
        activeSection={activeSection}
        onSectionChange={(s) => setActiveSection(s as any)}
        activeCategory={activeCategory}
        onCategoryChange={handleCategory}
      />

      {/* ═══ PREMIUM SECTIONS ═══ */}
      <section className="discovery-section">
        {(activeSection === 'ALL' || activeSection === 'TRENDING') && (
          <TrendingSection category={activeCategory} onView={openView} onBook={openBooking} />
        )}
        {(activeSection === 'ALL' || activeSection === 'EXCLUSIVE') && (
          <ExclusiveArtists category={activeCategory} onView={openView} onBook={openBooking} />
        )}
        {(activeSection === 'ALL' || activeSection === 'FEATURED') && (
          <FeaturedArtistsCarousel category={activeCategory} onView={openView} onBook={openBooking} />
        )}
      </section>

      {/* ═══ MODALS ═══ */}
      {viewModalOpen && viewArtist && (
        <ArtistDetailsModal
          artist={viewArtist}
          onClose={() => setViewModalOpen(false)}
          onBook={() => {
            setViewModalOpen(false);
            openBooking(viewArtist);
          }}
        />
      )}

      {modalOpen && (
        <BookingModal
          onClose={() => setModalOpen(false)}
          artistName={selectedArtist?.name}
          artistId={selectedArtist?.id}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE EXPORT
   ══════════════════════════════════════════════════════════ */
export default function ArtistsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000] flex items-center justify-center">
          <div className="text-[#d4a843] animate-pulse text-lg tracking-widest uppercase">Loading...</div>
        </div>
      }
    >
      <ArtistsDiscoveryContent />
    </Suspense>
  );
}
