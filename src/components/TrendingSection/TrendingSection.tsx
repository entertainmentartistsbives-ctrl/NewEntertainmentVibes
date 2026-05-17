'use client';

import { useState, useEffect } from 'react';
import styles from './TrendingSection.module.css';

interface TrendingArtist {
  id: number;
  name: string;
  imageUrl: string;
  category?: string;
  location?: string;
  price?: string;
  rating?: number;
}

export default function TrendingSection({ category, onView, onBook, isHome }: { category?: string; onView?: (artist: any) => void; onBook?: (artist: any) => void; isHome?: boolean }) {
  const [artists, setArtists] = useState<TrendingArtist[]>([]);
  const [offset, setOffset] = useState(0);
  const [fade, setFade] = useState(true);

  /* Grid mode: show 6 initially (2 rows × 3), expand by 3 */
  const INITIAL_VISIBLE = 6;
  const LOAD_MORE_COUNT = 3;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const catParam = category && category !== 'ALL' ? `?category=${encodeURIComponent(category)}` : '';
        const res = await fetch(`/api/trending-artists${catParam}`);
        const data = await res.json();
        if (data.success) {
          setArtists(data.data);
          setOffset(0);
          setVisibleCount(INITIAL_VISIBLE);
        }
      } catch (err) {
        console.error('Failed to fetch trending artists', err);
      }
    }
    fetchTrending();
  }, [category]);

  const isMosaic = isHome || (category && category.toUpperCase() !== 'ALL');

  // Sliding-window cycle (HOME only): shift offset by 1 every 4 seconds
  useEffect(() => {
    if (!isMosaic) return;
    if (artists.length <= 5) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setOffset((prev) => (prev + 1) % artists.length);
        setFade(true);
      }, 600);
    }, 4000);

    return () => clearInterval(interval);
  }, [artists.length, isMosaic]);

  if (artists.length === 0) {
    if (isHome) return null;
    return (
      <section className={styles.trendingSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.tagWrapper}>
            <div className={styles.tagLine} />
            <span className={styles.tagText}>TRENDING NOW</span>
            <div className={styles.tagLine} />
          </div>
          <h2 className={styles.title}>
            Trending <span className={styles.goldText}>Artists</span>
          </h2>
        </div>
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888', fontSize: '1.2rem' }}>
          No trending artists found in this category.
        </div>
      </section>
    );
  }

  /* ── HOME PAGE & SPECIFIC CATEGORY: 5-card mosaic layout ───── */
  if (isMosaic) {
    const displayedArtists: TrendingArtist[] = [];
    const count = Math.min(5, artists.length);
    for (let i = 0; i < count; i++) {
      displayedArtists.push(artists[(offset + i) % artists.length]);
    }

    const positions = [
      styles.topLeft,
      styles.bottomLeft,
      styles.center,
      styles.topRight,
      styles.bottomRight,
    ];

    return (
      <section className={styles.trendingSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.tagWrapper}>
            <div className={styles.tagLine} />
            <span className={styles.tagText}>TRENDING NOW</span>
            <div className={styles.tagLine} />
          </div>
          <h2 className={styles.title}>
            Trending <span className={styles.goldText}>Artists</span>
          </h2>
          <p className={styles.subtitle}>
            The most sought-after performers making waves<br />across India&apos;s live event scene.
          </p>
        </div>

        <div className={styles.gridContainer}>
          {displayedArtists.map((artist, i) => (
            <div 
              key={`${artist.id}-${offset}-${i}`} 
              className={`${styles.artistCard} ${positions[i]} ${fade ? styles.fadeIn : styles.fadeOut}`}
              style={{ animation: 'none', opacity: fade ? 1 : 0 }}
            >
              <img 
                src={artist.imageUrl} 
                alt={artist.name} 
                className={styles.artistImage} 
              />
              <div className={styles.categoryBadge}>{artist.category || 'ARTIST'}</div>
              <div className={styles.pageRatingBadge} style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', zIndex: 2 }}>
                <span className={styles.pageStarIcon}>★</span> {artist.rating ?? 5}.0
              </div>
              
              {!isHome && (
                <div className={styles.mosaicOverlay}>
                  <h3 className={styles.pageArtistName} style={{ fontSize: '1.2rem' }}>{artist.name}</h3>
                  <div className={styles.pageLocation} style={{ marginBottom: '1rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ff8c33" />
                    </svg>
                    {artist.location || 'Mumbai'}
                  </div>
                  
                  <div className={styles.pagePriceRow} style={{ marginBottom: '1rem' }}>
                    <span className={styles.pagePriceLabel}>FROM</span>
                    <span className={styles.pagePriceValue}>{artist.price || 'on request'}</span>
                  </div>

                  <div className={styles.pageCardActions}>
                    {onView && (
                      <button className={styles.pageViewBtn} onClick={(e) => { e.stopPropagation(); onView(artist); }}>
                        VIEW PROFILE
                      </button>
                    )}
                    {onBook && (
                      <button className={styles.pageBookBtn} onClick={(e) => { e.stopPropagation(); onBook(artist); }}>
                        BOOK NOW
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ── BOOK ARTISTS PAGE: 3-column grid with "See More" ─── */
  const visibleArtists = artists.slice(0, visibleCount);
  const hasMore = visibleCount < artists.length;

  return (
    <section className={styles.trendingSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.tagWrapper}>
          <div className={styles.tagLine} />
          <span className={styles.tagText}>TRENDING NOW</span>
          <div className={styles.tagLine} />
        </div>
        <h2 className={styles.title}>
          Trending <span className={styles.goldText}>Artists</span>
        </h2>
        <p className={styles.subtitle}>
          The most sought-after performers making waves<br />across India&apos;s live event scene.
        </p>
      </div>

      {/* 3-column grid */}
      <div className={styles.pageGrid}>
        {visibleArtists.map((artist, i) => (
          <div
            key={artist.id}
            className={styles.pageCard}
            style={{ animationDelay: `${(i % 3) * 0.1}s` }}
          >
            <div className={styles.pageImageWrapper}>
              <img src={artist.imageUrl} alt={artist.name} className={styles.pageArtistImage} />
              <div className={styles.pageImageOverlay} />
              <div className={styles.pageTopBadges}>
                <span className={styles.pageCategoryBadge}>{artist.category || 'ARTIST'}</span>
                <span className={styles.pageRatingBadge}>
                  <span className={styles.pageStarIcon}>★</span> {artist.rating ?? 5}.0
                </span>
              </div>
            </div>
            
            <div className={styles.pageCardContent}>
              <h3 className={styles.pageArtistName}>{artist.name}</h3>
              <div className={styles.pageLocation}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ff8c33" />
                </svg>
                {artist.location || 'Mumbai'}
              </div>
              
              <div className={styles.pagePriceRow}>
                <span className={styles.pagePriceLabel}>FROM</span>
                <span className={styles.pagePriceValue}>{artist.price || 'on request'}</span>
              </div>

              <div className={styles.pageCardActions}>
                <button className={styles.pageViewBtn} onClick={(e) => { e.stopPropagation(); onView && onView(artist); }}>
                  VIEW PROFILE
                </button>
                <button className={styles.pageBookBtn} onClick={(e) => { e.stopPropagation(); onBook && onBook(artist); }}>
                  BOOK NOW
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More / Show Less buttons */}
      {(hasMore || visibleCount > INITIAL_VISIBLE) && (
        <div className={styles.viewMoreWrapper}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {hasMore && (
              <button
                className={styles.viewMoreBtn}
                onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
              >
                <span>See More Artists</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            )}
            
            {visibleCount > INITIAL_VISIBLE && (
              <button
                className={styles.viewMoreBtn}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#ccc', boxShadow: 'none' }}
                onClick={() => setVisibleCount((c) => Math.max(INITIAL_VISIBLE, c - LOAD_MORE_COUNT))}
              >
                <span>Show Less</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>
            )}
          </div>
          <span className={styles.viewMoreCount}>
            Showing {Math.min(visibleCount, artists.length)} of {artists.length}
          </span>
        </div>
      )}
    </section>
  );
}
