"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./FeaturedArtistsCarousel.module.css";

export default function FeaturedArtistsCarousel({ category }: { category?: string }) {
  const [artists, setArtists] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
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
        } else {
          setArtists([]);
        }
      } catch (err) {
        console.error('Failed to fetch artists:', err);
      }
    }
    fetchArtists();
  }, [category]);

  const scroll = useCallback((direction: 'next' | 'prev') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth; // Scroll by one full view
    
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
    if (artists.length === 0) return;
    const timer = setInterval(() => {
      scroll('next');
    }, 4000);
    return () => clearInterval(timer);
  }, [artists.length, scroll]);

  if (artists.length === 0) return null;

  return (
    <section className={styles.carouselSection}>
      <div className="container">
        <div className={styles.carouselHeader}>
          <div className={styles.carouselTagLine}>
            <div className={styles.carouselTagDash} />
            <span className={styles.carouselTag}>DISCOVER TALENT</span>
          </div>
          <h2 className={styles.carouselTitle}>Featured Artists</h2>
          <p className={styles.carouselSubtitle}>
            Bring your events to the next level with the best artists — book top musicians, live singers, DJs, comedians, motivational speakers, emcees and more.
          </p>
        </div>

        <div className={styles.carouselWrapper}>
          <button className={`${styles.navBtn} ${styles.navBtnPrev}`} onClick={() => scroll('prev')}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div className={styles.cardsContainer} ref={scrollRef}>
            {artists.map((artist, i) => (
              <div key={artist.id || i} className={styles.artistCard}>
                <div className={styles.cardGlow} />
                <div className={styles.avatarWrapper}>
                   <div className={styles.avatarOuter}>
                      <div className={styles.avatarInner}>
                         <img src={artist.imageUrl} alt={artist.name} />
                      </div>
                   </div>
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardCategory}>{artist.category}</span>
                  <h3 className={styles.cardName}>{artist.name}</h3>
                </div>
                <div className={styles.underline} />
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
