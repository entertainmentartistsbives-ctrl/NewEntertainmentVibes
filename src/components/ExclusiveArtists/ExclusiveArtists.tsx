'use client';

import { useState, useEffect, useCallback } from 'react';
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

export default function ExclusiveArtists({ category }: { category?: string }) {
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

  if (artists.length === 0) return null;

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

          <div className={`${styles.card} ${flipping ? styles.cardFlipping : ''}`}>
            <div className={styles.cardImage}>
              <img src={artist.imageUrl} alt={artist.name} />
              <div className={styles.pageIndicator}>
                {String(current + 1).padStart(2, '0')}<span>/ {String(artists.length).padStart(2, '0')}</span>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <span className={styles.artistCategoryBadge}>{artist.category}</span>
              <h3 className={styles.artistName}>{artist.name}</h3>
              
              <div className={styles.artistMeta}>
                <span className={styles.metaItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {artist.location}
                </span>
                <span className={styles.metaItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {artist.rating}.0 Rating
                </span>
              </div>

              <div className={styles.bioWrapper}>
                <p className={styles.artistBio}>{artist.bio || 'Professional artist delivering exceptional performances for premium events.'}</p>
              </div>

              <div className={styles.priceSection}>
                <span className={styles.priceLabel}>STARTING FROM</span>
                <span className={styles.priceValue}>{artist.price || 'On Request'}</span>
              </div>

              <button className={styles.bookBtn}>
                Book This Artist <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
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
