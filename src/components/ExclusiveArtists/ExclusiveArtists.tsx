'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './ExclusiveArtists.module.css';

interface Artist {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  bio: string;
  location: string;
  price: string;
  rating: number;
}

export default function ExclusiveArtists({ category, onView, onBook, isHome }: { category?: string; onView?: (artist: any) => void; onBook?: (artist: any) => void; isHome?: boolean }) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    async function fetchExclusive() {
      try {
        const catParam = category && category !== 'ALL' ? `?category=${encodeURIComponent(category)}` : '';
        const res = await fetch(`/api/exclusive-artists${catParam}`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setArtists(data.data);
          setCurrent(0); // Reset to first artist on category change
        } else {
          setArtists([]);
        }
      } catch (err) {
        console.error('Failed to fetch exclusive artists:', err);
      }
    }
    fetchExclusive();
  }, [category]);

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (flipping) return;
    setFlipping(true);
    setTimeout(() => {
      setCurrent((c) =>
        direction === 'next' ? (c + 1) % artists.length : (c - 1 + artists.length) % artists.length
      );
      setFlipping(false);
    }, 400);
  }, [flipping, artists.length]);

  useEffect(() => {
    if (artists.length <= 1 || flipping) return;
    const timer = setInterval(() => {
      navigate('next');
    }, 5000);
    return () => clearInterval(timer);
  }, [artists.length, flipping, navigate]);

  if (artists.length === 0) {
    if (isHome) return null;
    return (
      <section className={styles.section}>
        <div className="container">
          <div className={styles.header}>
            <div className={styles.tagLine}>
              <div className={styles.tagDash} />
              <span className={styles.tag}>PREMIUM TALENT</span>
              <div className={styles.tagDash} />
            </div>
            <h2 className={styles.title}>
              Exclusive <span className={styles.highlight}>Artists</span>
            </h2>
          </div>
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888', fontSize: '1.2rem' }}>
            No exclusive artists found in this category.
          </div>
        </div>
      </section>
    );
  }

  const artist = artists[current];

  return (
    <section className={styles.section}>
      <div className={styles.ambientGlow} />
      <div className="container">
        <div className={styles.header}>
          <div className={styles.tagLine}>
            <div className={styles.tagDash} />
            <span className={styles.tag}>PREMIUM TALENT</span>
            <div className={styles.tagDash} />
          </div>
          <h2 className={styles.title}>
            Exclusive <span className={styles.highlight}>Artists</span>
          </h2>
          <p className={styles.subtitle}>
            Our most sought-after artists — handpicked for the grandest occasions.
          </p>
        </div>

        <div className={styles.viewerContainer}>
          <button 
            className={`${styles.navBtn} ${styles.navBtnLeft}`}
            onClick={() => navigate('prev')}
            aria-label="Previous artist"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div className={`${styles.page} ${flipping ? styles.cardFlipping : ''}`}>
            {/* Left page: Image */}
            <div className={styles.leftPage}>
              <div className={styles.imageFrame}>
                <img src={artist.imageUrl} alt={artist.name} />
                <div className={styles.imageOverlay} />
                <div className={styles.pageIndicator}>
                  {String(current + 1).padStart(2, '0')}<span>/ {String(artists.length).padStart(2, '0')}</span>
                </div>
              </div>
              {/* Page spine crease */}
              <div className={styles.spineCrease} />
            </div>

            {/* Right page: Info */}
            <div className={styles.rightPage}>
              <div className={styles.pageContent}>
                <span className={styles.artistCategory}>{artist.category}</span>
                <h3 className={styles.artistName}>{artist.name}</h3>

                <div className={styles.artistMeta}>
                  <span className={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" />
                    </svg>
                    {artist.location}
                  </span>
                  <span className={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {artist.rating}.0 Rating
                  </span>
                </div>

                <p className={styles.artistBio}>{artist.bio || 'Professional artist delivering exceptional performances for premium events.'}</p>

                <div className={styles.priceBadge}>
                  <span className={styles.priceLabel}>Starting from</span>
                  <span className={styles.priceValue}>{artist.price || 'On Request'}</span>
                </div>

                <div className={styles.actionBtns}>
                  {!isHome && (
                    <button 
                      onClick={() => onView && onView(artist)} 
                      className={styles.viewBtn}
                    >
                      View Profile
                    </button>
                  )}
                  {isHome ? (
                    <Link href={`/artists`} className={styles.bookBtn}>
                      Book This Artist
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  ) : (
                    <button className={styles.bookBtn} onClick={(e) => { e.stopPropagation(); onBook && onBook(artist); }}>
                      Book This Artist
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Page texture lines */}
                <div className={styles.pageLines} />
              </div>
            </div>
          </div>

          <button 
            className={`${styles.navBtn} ${styles.navBtnRight}`}
            onClick={() => navigate('next')}
            aria-label="Next artist"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div className={styles.indicators}>
          {artists.map((_, i) => (
            <button 
              key={i} 
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => {
                if(!flipping && i !== current) {
                  setFlipping(true);
                  setTimeout(() => { setCurrent(i); setFlipping(false); }, 400);
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
