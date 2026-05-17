'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './PremiumFilterBar.module.css';

/* ─── Data ────────────────────────────────────────────── */
const SECTION_TABS = [
  { label: 'ALL',       icon: '👥' },
  { label: 'TRENDING',  icon: '🔥' },
  { label: 'EXCLUSIVE', icon: '👑' },
  { label: 'FEATURED',  icon: '⭐' },
];

const CATEGORIES = [
  { label: 'ALL',         icon: '🎭' },
  { label: 'DJ',          icon: '🎧' },
  { label: 'SINGER',      icon: '🎤' },
  { label: 'DANCER',      icon: '💃' },
  { label: 'COMEDIAN',    icon: '😂' },
  { label: 'BAND',        icon: '🎸' },
  { label: 'ANCHOR',      icon: '🎙️' },
  { label: 'MUSICIAN',    icon: '🎹' },
  { label: 'MAGICIAN',    icon: '🪄' },
  { label: 'STAND-UP',    icon: '🎭' },
];

/* ─── Props ───────────────────────────────────────────── */
interface PremiumFilterBarProps {
  activeSection: string;
  onSectionChange: (s: string) => void;
  activeCategory: string;
  onCategoryChange: (c: string) => void;
}

export default function PremiumFilterBar({
  activeSection,
  onSectionChange,
  activeCategory,
  onCategoryChange,
}: PremiumFilterBarProps) {
  /* Sliding indicator state */
  const trackRef  = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLSpanElement>(null);
  const glowRef   = useRef<HTMLSpanElement>(null);
  const pillRefs  = useRef<(HTMLButtonElement | null)[]>([]);

  const updateSlider = useCallback(() => {
    const track  = trackRef.current;
    const slider = sliderRef.current;
    const glow   = glowRef.current;
    if (!track || !slider || !glow) return;

    const idx = CATEGORIES.findIndex((c) => c.label === activeCategory);
    const pill = pillRefs.current[idx];
    if (!pill) return;

    const trackRect = track.getBoundingClientRect();
    const pillRect  = pill.getBoundingClientRect();
    const left  = pillRect.left - trackRect.left + track.scrollLeft;
    const width = pillRect.width;

    slider.style.left    = `${left}px`;
    slider.style.width   = `${width}px`;
    slider.style.opacity = '1';
    glow.style.left      = `${left + width / 2}px`;
    glow.style.opacity   = '1';
  }, [activeCategory]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setTimeout(updateSlider, 60));
    return () => cancelAnimationFrame(frame);
  }, [updateSlider]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(updateSlider);
    ro.observe(track);
    return () => ro.disconnect();
  }, [updateSlider]);

  /* Ripple on pill click */
  const handlePillClick = (e: React.MouseEvent<HTMLButtonElement>, label: string) => {
    onCategoryChange(label);

    const btn  = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = styles.ripple;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top  = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  };

  return (
    <div className={styles.wrapper}>

      {/* ═══ ROW 1 — Section Tab Bar ═══ */}
      <div className={styles.sectionTabBar} role="tablist" aria-label="Artist sections">
        {SECTION_TABS.map((tab) => {
          const isActive = activeSection === tab.label;
          return (
            <button
              key={tab.label}
              role="tab"
              aria-selected={isActive}
              data-tab={tab.label}
              className={`${styles.sectionTab} ${isActive ? styles.sectionTabActive : ''}`}
              onClick={() => onSectionChange(tab.label)}
            >
              <span className={styles.sectionTabIcon}>{tab.icon}</span>
              {tab.label === 'ALL' ? 'All Artists' : tab.label.charAt(0) + tab.label.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* ═══ ROW 2 — Category Filter Bar ═══ */}
      <div className={styles.filterBar} aria-label="Filter by category">
        <div className={styles.filterTrack} ref={trackRef} role="group">

          {/* Sliding indicator */}
          <span className={styles.slider}    ref={sliderRef} aria-hidden="true" />
          <span className={styles.sliderGlow} ref={glowRef}  aria-hidden="true" />

          {/* "Filter By" label */}
          <span className={styles.filterLabel} aria-hidden="true">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className={styles.filterLabelIcon}>
              <path d="M1 3h14v1.5L9.5 9.5V15l-3-1.5V9.5L1 4.5V3z"/>
            </svg>
            Filter By
          </span>

          {/* Pills */}
          {CATEGORIES.map((cat, i) => {
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                ref={(el) => { pillRefs.current[i] = el; }}
                aria-pressed={isActive}
                className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
                onClick={(e) => handlePillClick(e, cat.label)}
              >
                <span className={styles.pillIcon}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Edge fades */}
        <div className={styles.edgeFadeLeft}  aria-hidden="true" />
        <div className={styles.edgeFadeRight} aria-hidden="true" />
      </div>

    </div>
  );
}
