'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './TrendingSection.module.css';

interface TrendingArtist {
  id: number;
  name: string;
  imageUrl: string;
}

export default function TrendingSection({ category }: { category?: string }) {
  const [artists, setArtists] = useState<TrendingArtist[]>([]);
  const [displayIndices, setDisplayIndices] = useState<number[]>([0, 1, 2, 3, 4]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const catParam = category && category !== 'ALL' ? `?category=${encodeURIComponent(category)}` : '';
        const res = await fetch(`/api/trending-artists${catParam}`);
        const data = await res.json();
        if (data.success) {
          setArtists(data.data);
          // Initial indices: first 5 or fewer
          const initial = data.data.slice(0, 5).map((_: any, i: number) => i);
          setDisplayIndices(initial);
        }
      } catch (err) {
        console.error('Failed to fetch trending artists', err);
      }
    }
    fetchTrending();
  }, [category]);

  const nextArtistRef = useRef(5);

  // Shuffle/Cycle logic: Shift artists through frames
  useEffect(() => {
    if (artists.length <= 5) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setDisplayIndices((prev) => {
          const nextIdx = nextArtistRef.current % artists.length;
          nextArtistRef.current++;
          // Shift indices: [1, 2, 3, 4, next]
          return [...prev.slice(1), nextIdx];
        });
        setFade(true);
      }, 800);
    }, 4000);

    return () => clearInterval(interval);
  }, [artists]);

  if (artists.length === 0) return null;

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
          The most sought-after performers making waves<br />across India's live event scene.
        </p>
      </div>

      <div className={styles.collageContainer}>
        <div className={styles.collageInner}>
          {positions.map((posClass, i) => {
            const artist = artists[displayIndices[i]];
            if (!artist) return null;
            
            return (
              <div 
                key={i} 
                className={`${styles.artistCard} ${posClass} ${fade ? styles.fadeIn : styles.fadeOut}`}
              >
                <div className={styles.cardInner}>
                  <img src={artist.imageUrl} alt={artist.name} className={styles.artistImage} />
                  <div className={styles.glow} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
