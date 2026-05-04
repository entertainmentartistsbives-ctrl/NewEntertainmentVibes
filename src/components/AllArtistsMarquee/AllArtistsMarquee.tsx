'use client';

import { useState, useEffect } from 'react';
import styles from './AllArtistsMarquee.module.css';

export default function AllArtistsMarquee() {
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const res = await fetch('/api/artists');
        const data = await res.json();
        if (data.success && data.data) {
          setArtists(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch artists:', err);
      }
    }
    fetchArtists();
  }, []);

  if (artists.length === 0) return null;

  // Triple the artists for a very long seamless marquee
  const marqueeArtists = [...artists, ...artists, ...artists];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.tagLine}>
            <div className={styles.tagDash} />
            <span className={styles.tag}>Full Roster</span>
          </div>
          <h2 className={styles.title}>All Artists</h2>
          <p className={styles.subtitle}>
            Explore our complete collection of world-class performers for every occasion.
          </p>
        </div>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {marqueeArtists.map((artist, i) => (
            <div key={`${artist.id}-${i}`} className={styles.marqueeItem}>
              <ArtistCard artist={artist} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArtistCard({ artist }: { artist: any }) {
  let imageUrl = artist.imageUrl || artist.image || '';
  if (imageUrl.startsWith('/images/')) {
    if (artist.category === 'DJ') imageUrl = 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=500&auto=format&fit=crop';
    else if (artist.category === 'Singer') imageUrl = 'https://images.unsplash.com/photo-1516280440502-12f8650f9689?q=80&w=500&auto=format&fit=crop';
    else if (artist.category === 'Band') imageUrl = 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=500&auto=format&fit=crop';
    else if (artist.category === 'Comedian') imageUrl = 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=500&auto=format&fit=crop';
    else imageUrl = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=500&auto=format&fit=crop';
  }

  return (
    <div className={styles.artistCard}>
      <div className={styles.artistCardGlow} />
      <div className={styles.artistAvatar}>
        <div className={styles.artistAvatarRing}>
          <div className={styles.artistAvatarInner}>
            <img src={imageUrl} alt={artist.name} />
          </div>
        </div>
      </div>
      <span className={styles.artistCategory}>{artist.category}</span>
      <span className={styles.artistName}>{artist.name}</span>
      <div className={styles.artistUnderline} />
    </div>
  );
}
