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
        <h3 className="discovery-card__name group-hover:text-[#d4a843] transition-colors">{artist.name}</h3>
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
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#d4a843]/5 blur-[80px] rounded-full pointer-events-none"></div>
      
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
      <section className="relative pt-[220px] pb-16 md:pt-[240px] md:pb-20 overflow-hidden bg-[#000000]">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-[#d4a843]/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-[#ff4d4d]/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-[#d4a843] animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[4px] text-white/70">Premium Talent Roster</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-8 leading-[1] animate-slideUp">
            Browse &amp;&nbsp;<span className="text-gradient">Book Artists</span>
          </h1>

          <div className="flex justify-center gap-4 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent to-[#d4a843] rounded-full" />
            <div className="w-24 h-1 bg-gradient-to-l from-transparent to-[#d4a843] rounded-full" />
          </div>
        </div>
      </section>

      {/* ═══ FILTER & INTENT SECTION ═══ */}
      <section className="bg-[#050505] border-y border-white/5">
        <div className="container py-12">
          <IntentSection />
        </div>
      </section>

      {/* ═══ CATEGORY FILTER BAR ═══ */}
      <section className="discovery-filter shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="container">
          <div className="discovery-filter__inner">
            {/* Filter icon */}
            <span className="discovery-filter__icon" aria-hidden="true">
              <FaSlidersH />
            </span>
            {/* Divider */}
            <span className="discovery-filter__divider" />
            {/* Pills */}
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`discovery-filter__pill ${activeCategory === cat ? 'discovery-filter__pill--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PREMIUM SECTIONS ═══ */}
      <section className="discovery-section">
        <TrendingSection category={activeCategory} />
        <ExclusiveArtists category={activeCategory} />
        <FeaturedArtistsCarousel category={activeCategory} />
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
