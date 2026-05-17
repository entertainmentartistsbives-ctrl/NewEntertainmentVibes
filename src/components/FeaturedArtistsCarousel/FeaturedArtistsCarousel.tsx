"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./FeaturedArtistsCarousel.module.css";

export default function FeaturedArtistsCarousel({ category, onView, onBook, isHome }: { category?: string; onView?: (artist: any) => void; onBook?: (artist: any) => void; isHome?: boolean }) {
  const [artists, setArtists] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  /* Grid mode: show 6 initially (2 rows × 3), expand by 3 */
  const INITIAL_VISIBLE = 6;
  const LOAD_MORE_COUNT = 3;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const catParam = category && category !== 'ALL' ? `&category=${encodeURIComponent(category)}` : '';
        const res = await fetch(`/api/artists?featured=true${catParam}`);
        const data = await res.json();
        if (data.success && data.data) {
          setArtists(data.data);
          setCurrent(0);
          setVisibleCount(INITIAL_VISIBLE);
        } else {
          setArtists([]);
        }
      } catch (err) {
        console.error('Failed to fetch artists:', err);
      }
    }
    fetchArtists();
  }, [category]);

  /* ── Carousel logic (home page only) ──────────────────── */
  const scroll = useCallback((direction: 'next' | 'prev') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth;
    
    if (direction === 'next') {
      if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        setCurrent(0);
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        setCurrent((c) => c + 1);
      }
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setCurrent((c) => Math.max(0, c - 1));
    }
  }, [artists.length]);

  useEffect(() => {
    if (isHome && artists.length > 0) {
      const timer = setInterval(() => {
        scroll('next');
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isHome, artists.length, scroll]);

  if (artists.length === 0) {
    if (isHome) return null;
    return (
      <section className={styles.carouselSection}>
        <div className="container">
          <div className={styles.carouselHeader}>
            <div className={styles.tagWrapper}>
              <div className={styles.tagLine} />
              <span className={styles.tagText}>DISCOVER TALENT</span>
              <div className={styles.tagLine} />
            </div>
            <h2 className={styles.carouselTitle}>
              Featured <span className={styles.titleAccent}>Artists</span>
            </h2>
          </div>
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888', fontSize: '1.2rem' }}>
            No featured artists found in this category.
          </div>
        </div>
      </section>
    );
  }

  const visibleArtists = isHome ? artists : artists.slice(0, visibleCount);
  const hasMore = !isHome && visibleCount < artists.length;

  /* ── HOME PAGE: Carousel layout ───────────────────────── */
  if (isHome) {
    return (
      <section className={styles.carouselSection}>
        <div className="container">
          <div className={styles.carouselHeader}>
            <div className={styles.tagWrapper}>
              <div className={styles.tagLine} />
              <span className={styles.tagText}>DISCOVER TALENT</span>
              <div className={styles.tagLine} />
            </div>
            <h2 className={styles.carouselTitle}>
              Featured <span className={styles.titleAccent}>Artists</span>
            </h2>
            <p className={styles.subtitle}>
              Bring your events to the next level with the best artists<br />— book top musicians, live singers, DJs, comedians,<br />motivational speakers, emcees and more.
            </p>
          </div>

          <div className={styles.carouselWrapper}>
            <button className={`${styles.navBtn} ${styles.navBtnPrev}`} onClick={() => scroll('prev')}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            <div className={styles.cardsContainer} ref={scrollRef}>
              {artists.map((artist, i) => (
                <div key={artist.id || i} className={styles.homeArtistCard}>
                  <div className={styles.homeAvatar}>
                    <img src={artist.imageUrl} alt={artist.name} />
                  </div>
                  <span className={styles.homeCategory}>{artist.category}</span>
                  <h3 className={styles.homeArtistName}>{artist.name}</h3>
                </div>
              ))}
            </div>

            <button className={`${styles.navBtn} ${styles.navBtnNext}`} onClick={() => scroll('next')}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          <div className={styles.dots}>
            {artists.slice(0, Math.ceil(artists.length / 2)).map((_, i) => (
              <button 
                key={i} 
                className={`${styles.dot} ${i === Math.floor(current / 2) ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── ARTISTS PAGE: Grid layout with "View More" ────────── */
  return (
    <section className={styles.carouselSection}>
      <div className="container">
        <div className={styles.carouselHeader}>
          <div className={styles.tagWrapper}>
            <div className={styles.tagLine} />
            <span className={styles.tagText}>DISCOVER TALENT</span>
            <div className={styles.tagLine} />
          </div>
          <h2 className={styles.carouselTitle}>
            Featured <span className={styles.titleAccent}>Artists</span>
          </h2>
          <p className={styles.subtitle}>
            Bring your events to the next level with the best artists<br />— book top musicians, live singers, DJs, comedians,<br />motivational speakers, emcees and more.
          </p>
        </div>

        {/* 3-column grid */}
        <div className={styles.gridContainer}>
          {visibleArtists.map((artist, i) => (
            <div
              key={artist.id || i}
              className={styles.artistCard}
              style={{ animationDelay: `${(i % 3) * 0.1}s` }}
            >
              <div className={styles.imageWrapper}>
                <img src={artist.imageUrl} alt={artist.name} className={styles.artistImage} />
                <div className={styles.imageOverlay} />
                <div className={styles.topBadges}>
                  <span className={styles.categoryBadge}>{artist.category}</span>
                  <span className={styles.ratingBadge}>
                    <span className={styles.starIcon}>★</span> {artist.rating}.0
                  </span>
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <h3 className={styles.artistName}>{artist.name}</h3>
                <div className={styles.location}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ff8c33" />
                  </svg>
                  {artist.location}
                </div>
                
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>FROM</span>
                  <span className={styles.priceValue}>{artist.price || 'On Request'}</span>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.viewBtn} onClick={(e) => { e.stopPropagation(); onView && onView(artist); }}>
                    VIEW PROFILE
                  </button>
                  <button className={styles.bookBtn} onClick={(e) => { e.stopPropagation(); onBook && onBook(artist); }}>
                    BOOK NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More / Show Less buttons */}
        {(hasMore || (!isHome && visibleCount > INITIAL_VISIBLE)) && (
          <div className={styles.viewMoreWrapper}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {hasMore && (
                <button
                  className={styles.viewMoreBtn}
                  onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
                >
                  <span>View More Artists</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              )}
              
              {!isHome && visibleCount > INITIAL_VISIBLE && (
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
      </div>
    </section>
  );
}
