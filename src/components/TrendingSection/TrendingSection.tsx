'use client';

import { useState, useEffect } from 'react';
import styles from './TrendingSection.module.css';

interface TrendingArtist {
  id: number;
  name: string;
  imageUrl: string;
}

export default function TrendingSection() {
  const [artists, setArtists] = useState<TrendingArtist[]>([]);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/trending-artists');
        const data = await res.json();
        if (data.success) {
          setArtists(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch trending artists', err);
      }
    }
    fetchTrending();
  }, []);

  const displayArtists = artists.slice(0, 5);

  if (displayArtists.length === 0) return null;

  const positions = [
    styles.topLeft,
    styles.topRight,
    styles.center,
    styles.bottomLeft,
    styles.bottomRight,
  ];

  return (
    <section className={styles.trendingSection}>
      <div className="container">
        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            <h2 className={styles.trendingTitle}>
              Trending <span className={styles.yellowText}>EntertainmentVibes</span> Artists
            </h2>
          </div>

          <div className={styles.collageGrid}>
            {displayArtists.map((artist, index) => (
              <div key={artist.id} className={`${styles.artistFrame} ${positions[index]}`}>
                <img src={artist.imageUrl} alt={artist.name} />
                <div className={styles.neonGlow}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
