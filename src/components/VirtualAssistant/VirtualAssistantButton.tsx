'use client';

import { useState } from 'react';
import { FaWhatsapp, FaPhoneAlt, FaRobot, FaTimes } from 'react-icons/fa';
import VirtualAssistant from './VirtualAssistant';
import styles from './VirtualAssistantButton.module.css';

const VirtualAssistantButton = () => {
  const [assistantActive, setAssistantActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const launchAssistant = () => {
    setAssistantActive(true);
    setMenuOpen(false);
  };

  return (
    <>
      {/* HeyGen Virtual Assistant */}
      {assistantActive && (
        <VirtualAssistant onClose={() => setAssistantActive(false)} />
      )}

      {/* Floating Menu */}
      {menuOpen && (
        <div className={styles.menu}>
          <a href="https://wa.me/917204468429" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
            <FaWhatsapp className={styles.icon} style={{ color: '#25D366' }} />
            <span>WhatsApp Us</span>
          </a>
          <a href="tel:+917204468429" className={styles.menuItem}>
            <FaPhoneAlt className={styles.icon} style={{ color: '#34b7f1' }} />
            <span>Call Now</span>
          </a>
          <button onClick={launchAssistant} className={styles.menuItem}>

            <span>Chat with AI Stylist</span>
          </button>
        </div>
      )}

      {/* Floating Avatar Button */}
      {!assistantActive && (
        <button
          suppressHydrationWarning
          className={`${styles.avatarFab} ${menuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Open contact options"
        >
          {menuOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '24px', color: '#fff' }}>
              <FaTimes />
            </div>
          ) : (
            <img src="/avatar.png" alt="AI Assistant" />
          )}
        </button>
      )}
    </>
  );
};

export default VirtualAssistantButton;
