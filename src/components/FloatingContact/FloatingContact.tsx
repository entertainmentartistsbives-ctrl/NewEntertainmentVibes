'use client';

import { useState } from 'react';
import { FaWhatsapp, FaPhoneAlt, FaTimes, FaCommentDots } from 'react-icons/fa';
import styles from './FloatingContact.module.css';

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      {/* Options panel */}
      {open && (
        <div className={styles.panel}>
          <a
            href="https://wa.me/917204468429?text=Hi!%20I%20want%20to%20book%20an%20artist."
            target="_blank"
            rel="noreferrer"
            className={`${styles.option} ${styles.whatsapp}`}
            onClick={() => setOpen(false)}
          >
            <FaWhatsapp className={styles.optionIcon} />
            <div>
              <div className={styles.optionTitle}>WhatsApp Us</div>
              <div className={styles.optionSub}>Quick reply guaranteed</div>
            </div>
          </a>
          <a
            href="tel:+917204468429"
            className={`${styles.option} ${styles.call}`}
            onClick={() => setOpen(false)}
          >
            <FaPhoneAlt className={styles.optionIcon} />
            <div>
              <div className={styles.optionTitle}>Call Us Now</div>
              <div className={styles.optionSub}>+91 72044 68429</div>
            </div>
          </a>
        </div>
      )}

      {/* Main FAB */}
      <button
        suppressHydrationWarning
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={() => setOpen((p) => !p)}
        aria-label="Contact Us"
      >
        {open ? <FaTimes /> : <FaCommentDots />}
        {!open && <span className={styles.fabPulse} />}
      </button>
    </div>
  );
}
